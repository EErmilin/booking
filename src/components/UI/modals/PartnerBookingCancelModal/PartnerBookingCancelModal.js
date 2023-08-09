import React, { useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { object, string } from "yup"
import { useFormik } from "formik"
import { cancelBookingPartner, clearBookingFormError } from "../../../../store/actions/bookingActions"
import classes from "./PartnerBookingCancelModal.module.scss"
import CustomRadio from "../../areas/CustomRadio/CustomRadio"
import CustomTextArea from "../../areas/CustomTextArea/CustomTextArea"
import TwoButtonModal from "../TwoButtonModal/TwoButtonModal"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"

export default function PartnerBookingCancelModal({bookInfo, closeModal, btnCancelClick, modalSuccess, otherParams}) {
  const { t } = useTranslation()
  const dispatcher = useDispatch()
  const { page } = useParams()

  const errors = useSelector(state => state.book.errorsForm)
  const rejectReasons = useSelector(state => state.book.partnerRejectReasons)

  const rejectReasonsList = useMemo(() => {
    return rejectReasons.map((elem) => {
      return {
        text: elem.name,
        value: elem.id
      }
    })
  },[rejectReasons])

  /** Начальные значения */
  const initialValues = {
    id:bookInfo.id,
    reject_reason_id: '',
    reject_reason: ''
  };

  /** Схема валидации */
  const validationSchema = useMemo(
    () =>
      object().shape({
        reject_reason: string().required(),
        reject_reason_id: string().required()
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

  const onRejectSend = async () => {
    let isCanceled = await dispatcher(cancelBookingPartner(values, bookInfo.hotel_id, { ...otherParams, page: page }))
    if (isCanceled) {
      dispatcher(clearBookingFormError())
      btnCancelClick(false)
      modalSuccess(true)
    }
  }

  return(
    <>
      <TwoButtonModal
        close={true}
        closeModal={closeModal}
        btnCancelClick={() => {
          btnCancelClick(false)
            handleChange({target: {name: "reject_reason_id", value: ''}})
          }
        }
        btnCancelText={t("reservations.cancel")}
        btnNextText={t("reservations.send")}
        btnNextClick={onRejectSend}
        width={980}
        background={"blue"}
        typeModal="withoutBack"
        classNameButtonWrap={classes.buttons}
      >
        <h2 >{t("reservations.cancelReservations")}</h2>
        <CustomRadio
          className={classes.reasons}
          listRadio={rejectReasonsList}
          name="reject_reason_id"
          value={values.reject_reason_id}
          onChange={e => handleChange({target: {name: "reject_reason_id", value: e}})}
          isColumn={true}
          touched={!touched.reject_reason_id}
          valid={!errors.reject_reason_id}
          errorMessage={errors.reject_reason_id}
          required
          shouldValidate
        />
        {errors.room_id?<div className={classes.valid}>{errors.room_id}</div>:""}
        {values.reject_reason_id === 7 &&
          <CustomTextArea
            className={classes.textarea}
            label={t("reservations.cancelReason")}
            name={'reject_reason'}
            value={values.reject_reason}
            onChange={event => handleChange({target: {name: "reject_reason", value: event.target.value}})}
            touched={!touched.reject_reason}
            valid={!errors.reject_reason}
            errorMessage={errors.reject_reason}
            required
            shouldValidate
          />
        }
      </TwoButtonModal>
    </>
  )
}