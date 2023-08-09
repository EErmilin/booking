import React, { useMemo } from 'react'
import classes from './RevokeObjectModal.module.scss'
import CustomTextArea from "../../areas/CustomTextArea/CustomTextArea"
import { clearErrors, revokeHotel } from "../../../../store/actions/partnerHotelsActions"
import TwoButtonModal from "../TwoButtonModal/TwoButtonModal"
import { useDispatch, useSelector } from "react-redux"
import { object, string } from "yup"
import { useFormik } from "formik"

export default function RevokeObjectModal({objectId, setModal,setErrorModal,closeModal,setModalSuccess,setModalFatalError}) {

  const dispatcher = useDispatch()
  const errors = useSelector(state => state.objects.errors)

  const initialValues = {
    id: objectId,
    revoke_reason_by_partner: ''
  }

  const validationSchema = useMemo(
    () =>
      object().shape({
        revoke_reason_by_partner: string().required()
      }),
    []
  );

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

  const onRevokeSend = async () => {
    const revokedObjectId = await dispatcher(revokeHotel(values))
    if (!revokedObjectId.revokeError && revokedObjectId.status==200) {
      dispatcher(clearErrors())
      setModal(false)
      setModalSuccess(true)
    }else if(revokedObjectId.validation){
      return
    }else if(revokedObjectId.revokeError && revokedObjectId.status==422){
      setModal(false)
      setErrorModal(true)
    }else{
      setModal(false)
      setModalFatalError(true)
    }
  }

  const onReasonTextChange = (e) => {
    handleChange({target: {name: "revoke_reason_by_partner", value: e.target.value}})
    dispatcher(clearErrors())
  }

  return(
    <TwoButtonModal
      className={classes.wrap}
      classNameTitle={classes.title}
      title={'Отзыв объекта'}
      btnCancelClick={() => setModal(false)}
      btnCancelText={'Отмена'}
      btnNextClick={onRevokeSend}
      closeModal={closeModal}
      btnNextText={'Отправить'}
      width={980}
      background={"blue"}
      typeModal="withoutBack"
    >
      <CustomTextArea
        className={classes.textarea}
        label={'Укажите причину отзыва'}
        name="revoke_reason_by_partner"
        value={values.revoke_reason_by_partner}
        onChange={onReasonTextChange}
        touched={!touched.revoke_reason_by_partner}
        valid={!errors.revoke_reason_by_partner}
        errorMessage={errors.revoke_reason_by_partner}
        required
        shouldValidate
      />
    </TwoButtonModal>
  )
}