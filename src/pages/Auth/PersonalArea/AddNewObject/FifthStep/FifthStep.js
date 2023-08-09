import React, { useEffect, useState } from "react"
import classes from "./FifthStep.module.scss";
import { useTranslation } from "react-i18next";
import AddPhotos from "../../../../../components/AddPhotos/AddPhotos";
import Button from "../../../../../components/UI/btns/Button/Button";
import { useNavigate, useParams } from "react-router-dom";
import {
    deleteHotelImage,
    editHotel,
    getHotelInfo, setMainImageHotel,
    uploadHotelImage
} from "../../../../../store/actions/partnerHotelsActions";
import { useDispatch, useSelector } from "react-redux";


function FifthStep({ edit }) {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const dispatcher = useDispatch()
    const hotelInfo = useSelector(state => state.objects.hotelInfo)
    const { id } = useParams()
    const [images, setImages] = useState([])
    const [mainImage, setMainImage] = useState({})




    useEffect(() => {
        if (hotelInfo.images) {
            setImages(hotelInfo.images.map(elem => {
                return {
                    urlToDelete: elem,
                    url: elem,
                    id: Math.random(),
                }
            }))
        }
    }, [hotelInfo, hotelInfo.main_image])

    useEffect(() => {
        if (images.length) {
            setMainImage(images.find((elem) => elem.url == hotelInfo.main_image) ? images.find((elem) => elem.url == hotelInfo.main_image) : {})
        }

    }, [hotelInfo.main_image, images])

    /** Подтягиваем инфу о услугах */
    /** Если редактирование подтягиваем информацию для редактирования */
    useEffect(() => {
        if (edit) {
            dispatcher(getHotelInfo(id))
        }
    }, [])

    /** Сохраняем информацию */
    async function save() {
        navigate(`/edit-object/${id}/sixth-step`)
    }

    function back() {
        navigate(`/edit-object/${id}/fourth-step`)
    }

    async function handleChange(image) {
        if (!image.errors && image.formData instanceof FormData) {
            let uploadedImage = await dispatcher(uploadHotelImage(image, id))
            setImages(prevState => [...prevState, uploadedImage])
        }
    }


    async function setImageMain(active, image) {
        if (!active) {
            const mainImage = await dispatcher(setMainImageHotel({ main_image: image.url }, id))
        } else {
            const mainImage = await dispatcher(setMainImageHotel({ main_image: '' }, id))
        }

    }


    return (
        <div className={classes.forth_step}>
            <h2 className={classes.forth_step_title} >{t("addNewObjects.fifthStep.title")}</h2>
            <p className={classes.forth_step_subtitle}>{t("addNewObjects.fifthStep.subtitle")}</p>
            <form className={classes.forth_step_form}>
                <div className={classes.forth_step_form_block}>
                    <h2 className={classes.forth_step_form_title}>{t("addNewObjects.fifthStep.galleryTitle")}</h2>
                    <AddPhotos
                        mainImage={mainImage}
                        photos={images}
                        nameField={"hotel_id"}
                        id={id}
                        mainClick={setImageMain}
                        onChange={(image) => handleChange(image)}
                        onDeleteImage={(array) => { setImages(array) }}
                        onDelete={(urlToDelete) => dispatcher(deleteHotelImage(urlToDelete, id))}
                        typeImage="default"
                    ></AddPhotos>
                </div>
            </form>
            <div className={classes.forth_step_buttons}>
                <Button
                    typeButton={1}
                    btnColor="outline_blue back"
                    onClick={back}
                    className={classes.forth_step_buttons_cancel}
                >{t("addNewObjects.secondStep.buttons.back")}</Button>
                <Button
                    typeButton={1}
                    btnColor="green"
                    className={classes.forth_step_buttons_save}
                    onClick={save}
                >{t("addNewObjects.firstStep.btnSave")}</Button>
            </div>
        </div>
    )
}

export default FifthStep