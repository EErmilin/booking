import React, { useMemo, useState } from "react"
import classes from "./ReviewModal.module.scss";
import TwoButtonModal from "../TwoButtonModal/TwoButtonModal";
import { useTranslation } from "react-i18next";
import CustomTextArea from "../../areas/CustomTextArea/CustomTextArea";
import RatingInput from "../../areas/RatingInput/RatingInput";
import { object, string } from "yup";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import {
    createReview,
    uploadReviewImage,
    editReview,
    deleteReviewImage,
    getReviewsClient
} from "../../../../store/actions/ReviewActions";
import { getClientReservations } from "../../../../store/actions/bookingActions";
import AddPhotos from "../../../AddPhotos/AddPhotos";
import se from "react-datepicker";




function ReviewModal({
    onClose,
    btnClose,
    btnNextClick,
    isNoAuth,
    bookingInfo,
    reviewInfo,
    setModal,
    hotelId
}) {
    const { t } = useTranslation()
    const dispatcher = useDispatch()
    const [errors, setErrors] = useState({})
    const [images, setImages] = useState(
        (reviewInfo && reviewInfo.images) ? reviewInfo.images.map(elem => {
            return {
                urlToDelete: new URL(elem).search.split('=')[1],
                url: elem,
                id: Math.random(),
            }
        }) : [])
    /** Начальные значения */
    const initialValues = reviewInfo ? {
        ...reviewInfo,
        files: [],
    } : {
        text: '',
        rating: 1,
        files: [],
        booking_id: bookingInfo.id,
        hotel_id: bookingInfo.hotel_id,
        room_id: bookingInfo.room_id,
    };

    /** Схема валидации */
    const validationSchema = useMemo(
        () =>
            object().shape({
                text: string().required(),
                rating: string().required(),
            }),
        []
    );
    function handleChangeImage(image) {
        setImages(prevState => [...prevState, image])
    }
    /** Стейт полей и правила */
    const {
        values,
        handleChange,
        handleSubmit,
        touched,
    } = useFormik({
        initialValues,
        validateOnMount: true,
        validationSchema,
        onSubmit: (values) => {
            console.log(values)
        },
        enableReinitialize: true
    });

    const submitReview = async () => {
        if (reviewInfo) {
            const response = await dispatcher(editReview(values, reviewInfo.id))
            if (response.isSend) {
                if (images.length) {
                    for (let image of images) {
                        if (!image.errors && image.formData instanceof FormData) {
                            image.formData.append("review_id", reviewInfo.id)
                            image.formData.set("hotel_id", response.data.hotel_id)
                            let imageUrl = await dispatcher(uploadReviewImage(image.formData, response.data.hotel_id))
                        }
                    }
                }
                dispatcher(getReviewsClient())
                btnClose(false)
                return btnNextClick(true)
            } else {
                let errorObj = {}
                response.data.length ? response.data.forEach((elem) => {
                    errorObj[elem.field] = elem.message
                }) : errorObj = { phone: response.data.message }
                setErrors(errorObj)
            }
        } else {
            const response = await dispatcher(createReview(values))
            if (response.isSend) {
                if (images.length) {
                    for (let image of images) {
                        if (!image.errors && image.formData instanceof FormData) {
                            image.formData.append("review_id", response.data.id)
                            let imageUrl = await dispatcher(uploadReviewImage(image.formData, response.data.id))
                        }
                    }
                }
                setModal(true)
                let clientParams = {}

                if (hotelId) {
                    clientParams = { hotel_id: hotelId };
                }
                clientParams = Object.assign(clientParams, { status_id: 5, expand: "region,reviews", sort: "-id" })
                dispatcher(getClientReservations(clientParams))
                dispatcher(getReviewsClient())
                btnClose(false)
            } else {
                let errorObj = {}
                response.data.length ? response.data.forEach((elem) => {
                    errorObj[elem.field] = elem.message
                }) : errorObj = { phone: response.data.message }
                setErrors(errorObj)
                // const formData = new FormData();
                // formData.append('image', blob, files.name);
                // formData.append(nameField,id)
            }
        }

        if (btnNextClick) btnNextClick()
    }
    const onChangeTextArea = (e) => { handleChange({ target: { name: "text", value: e.target.value } }); setErrors({}) }

    return (
        <TwoButtonModal
            close={true}
            title={t("comment.modal.titleClient")}
            btnCancelClick={() => btnClose(false)}
            closeModal={onClose}
            btnCancelText={t("support.cancel")}
            btnNextText={t("support.send")}
            btnNextClick={() => submitReview()}
            width={980}
            background="blue"
            typeModal="withoutBack"
            classNameButtonWrap={classes.support_buttons}
        >
            <div className={classes.support_booking}>
                <h2 className={classes.support_booking_title}>{bookingInfo.hotel_name.ru}</h2>
                <div className={classes.support_booking_room}>{bookingInfo.room_name.ru}</div>
                <div className={classes.support_booking_guest}>{bookingInfo.arrival_date} — {bookingInfo.departure_date} {bookingInfo.additional_guests.length + 1}взр.</div>
            </div>
            <RatingInput
                value={values.rating}
                onChange={(rating) => handleChange({ target: { name: "rating", value: rating } })}
                label={t("comment.modal.rating")}
                starLength={10}
            ></RatingInput>
            <CustomTextArea
                className={classes.support_textarea}
                label={t("comment.modal.yourComment")}
                value={values.text}
                onChange={(e) => onChangeTextArea(e)}
                touched={!touched.text}
                valid={!errors.text}
                errorMessage={errors.text}
                required
                shouldValidate
            />
            <AddPhotos
                photos={images}
                nameField={"hotel_id"}
                onChange={(image) => handleChangeImage(image)}
                onDeleteImage={(array) => { setImages(array) }}
                onDelete={(urlToDelete) => dispatcher(deleteReviewImage(urlToDelete, reviewInfo.id))}
                typeImage={"hotel"}
                typeInput="clip"
                imageType={'review'}
            ></AddPhotos>
            {isNoAuth && <p className={classes.support_textGray}>*обязательные поля для ввода</p>}
        </TwoButtonModal>
    )
}

export default ReviewModal


