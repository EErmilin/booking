import React, { useEffect, useMemo } from "react"
import classes from "./CancelReservationModal.module.scss";
import TwoButtonModal from "../TwoButtonModal/TwoButtonModal";
import { useTranslation } from "react-i18next";
import CustomTextArea from "../../areas/CustomTextArea/CustomTextArea";
import CustomRadio from "../../areas/CustomRadio/CustomRadio";
import CustomSelect from "../../areas/CustomeSelect/CustomSelect";
import EmptyModal from "../EmptyModal/EmptyModal";
import useToggleVisibility from "../../../../hooks/useToggleVisibility";
import { useDispatch, useSelector } from "react-redux";
import {
    cancelBooking,
    cancelBookingNoAuth,
    clearBookingFormError,
    getClientCalcPenalty,
    getClientCalcPenaltyNoAuth,
    getClientCancelReason,
    getClientCancelSubReason
} from "../../../../store/actions/bookingActions";
import { object, string } from "yup";
import { useFormik } from "formik";
import FormHelp from "../../../FormHelp/FormHelp";
import moment from "moment";
import ReactGA from "react-ga4"
import { useSearchParams } from "react-router-dom";

function CancelReservationModal({
    btnCancelClick,
    bookInfo,
    closeModal,
    btnNextClick,
    setShowCancelSuccessModal,
    filters
}) {
    const { t } = useTranslation()
    const dispatcher = useDispatch()
    const reasons = useSelector(state => state.book.reasons)
    const subReasons = useSelector(state => state.book.subReasons)
    const calcPenalty = useSelector(state => state.book.calcPenalty)
    const errors = useSelector(state => state.book.errorsForm)
    const [searchParams, setSearchParams] = useSearchParams();
    

    useEffect(() => {
        dispatcher(getClientCancelReason())
        dispatcher(getClientCancelSubReason())
        const token = searchParams.get("token_view")
        if(token){
            dispatcher(getClientCalcPenaltyNoAuth(token, bookInfo.id))
        }else{
            dispatcher(getClientCalcPenalty(bookInfo.id))
        }
        
    }, [])



    const optionReasons = useMemo(() => {
        return reasons.map((elem) => {
            return {
                label: elem.name,
                value: elem.id
            }
        })
    }, [reasons])

    const listSubReasons = useMemo(() => {
        return subReasons.filter(i=>i.id!==6).map(elem => {
            return {
                text: elem.name,
                value: elem.id
            }
        })
    }, [subReasons])


    /** Начальные значения */
    const initialValues = {
        id: bookInfo.id,
        cancel_reason: '',
        cancel_reason_id: "",
        cancel_sub_reason_id: ""
    };
    /** Схема валидации */
    const validationSchema = useMemo(
        () =>
            object().shape({
                cancel_reason: string().required(),
                cancel_reason_id: string().required(),
                cancel_sub_reason_id: string().required()
            }),
        []
    );

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

        },
    });

    const gaCancelReserveEvent = () => ReactGA.event('cancel_reserve', {
        id: bookInfo.id,
        hotel_id: bookInfo.hotel_id,
        room_id: bookInfo.room_id
    })

    const onSend = async () => {
        const token = searchParams.get("token_view")
        let isCanceled
        if(token){
            isCanceled = await dispatcher(cancelBookingNoAuth({...values, token_view:token},filters))
        }else{
            isCanceled = await dispatcher(cancelBooking(values,filters))
        }
        if (isCanceled) {
            setShowCancelSuccessModal(true)
            btnCancelClick(false)
            gaCancelReserveEvent()
        }
    }
    
    useEffect(() => {
        dispatcher(clearBookingFormError())
    }, [values.cancel_reason])

    return (
        <>
            <TwoButtonModal
                close={closeModal}
                btnCancelClick={() => btnCancelClick(false)}
                btnCancelText={t("reservations.cancel")}
                btnNextText={t("reservations.send")}
                closeModal={(event) => closeModal(event)}
                btnNextClick={onSend}
                width={980}
                background="blue"
                typeModal="withoutBack"
                classNameButtonWrap={classes.cancelReservation_buttons}
            >
                <h2 className={classes.cancelReservation_title}>{t("reservations.cancelReservation.title")}</h2>
                {/*{bookInfo.integration_data && bookInfo.integration_data.cancellationPolicy.freeCancellationPossible?<FormHelp*/}
                {/*    text={*/}
                {/*    <span>*/}
                {/*        Бесплатная отмена бронирования доступна до {moment(new Date(bookInfo.integration_data.cancellationPolicy.freeCancellationDeadlineUtc)).format('DD.MM.YYYY')}*/}
                {/*        <br />*/}
                {/*        /!*После этой даты штраф будет составлять {calcPenalty?calcPenalty:bookInfo.integration_data.cancellationPolicy.penaltyAmount} рублей*!/*/}
                {/*    </span>*/}
                {/*}*/}
                {/*    className={classes.cancelReservation_form}*/}
                {/*></FormHelp>:""}*/}
                {/*{bookInfo.integration_data && !bookInfo.integration_data.cancellationPolicy.freeCancellationPossible?<FormHelp*/}
                {/*    text={*/}
                {/*        <span>*/}
                {/*            Штраф за отмену брони будет составлять {bookInfo.integration_data.cancellationPolicy.penaltyAmount} рублей*/}
                {/*        </span>*/}
                {/*    }*/}
                {/*    className={classes.cancelReservation_form}*/}
                {/*></FormHelp>:""}*/}
                {/*<CustomSelect*/}
                {/*    className={classes.cancelReservation_select}*/}
                {/*    label={t("reservations.cancelReservation.reason")}*/}
                {/*    name="cancel_reason_id"*/}
                {/*    value={optionReasons.find(elem=>elem.value==values.cancel_reason_id)}*/}
                {/*    onChange={(event)=>handleChange({target:{name:"cancel_reason_id",value:event.value}})}*/}
                {/*    options={optionReasons}*/}
                {/*></CustomSelect>*/}
                <CustomRadio
                    listRadio={listSubReasons}
                    name="cancel_sub_reason_id"
                    value={values.cancel_sub_reason_id}
                    onChange={(event) => {
                        if (event !== 5) handleChange({ target: { name: "cancel_reason", value: "" } })
                        return handleChange({ target: { name: "cancel_sub_reason_id", value: event } })
                    }}
                    isColumn={true}
                    touched={!touched.cancel_sub_reason_id}
                    valid={!errors.cancel_sub_reason_id}
                    errorMessage={errors.cancel_sub_reason_id}
                    required
                    shouldValidate
                ></CustomRadio>
                {errors.room_id?<div className={classes.valid}>{errors.room_id}</div>:""}
                {values.cancel_sub_reason_id == 5 ? <CustomTextArea
                    className={classes.cancelReservation_textarea}
                    label={t("reservations.cancelReservation.tell")}
                    name="cancel_reason"
                    value={values.cancel_reason}
                    onChange={(event) => handleChange({ target: { name: "cancel_reason", value: event.target.value } })}
                    disabled={values.cancel_sub_reason_id !== 5}
                    touched={!touched.cancel_reason}
                    valid={!errors.cancel_reason}
                    errorMessage={errors.cancel_reason}
                    required
                    shouldValidate
                /> : ''}
            </TwoButtonModal>
        </>
    )
}

export default CancelReservationModal


