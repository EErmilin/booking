import React, {useEffect, useMemo, useState} from "react"
import classes from "./ModalPaymentType.module.scss"
import EmptyModal from "../../../../../../components/UI/modals/EmptyModal/EmptyModal";
import {useTranslation} from "react-i18next";
import Checkbox from "../../../../../../components/UI/areas/Checkbox/Checkbox";
import useToggleVisibility from "../../../../../../hooks/useToggleVisibility";
import Button from "../../../../../../components/UI/btns/Button/Button";
import {useDispatch} from "react-redux";
import {setPaymentType} from "../../../../../../store/actions/partnerHotelsActions";
import ErrorMessage from "../../../../../../components/UI/message/ErrorMessage";



function ModalPaymentType ({
    closeModal,
    id,
    setModal,
    modal,
    payment_type
}){
    const {t} = useTranslation()
    const [selectedPayment,setSelectedPayment] = useState(payment_type?[...payment_type]:[])
    const [modalSuccess,setModalSuccess,closeModalSuccess] = useToggleVisibility()
    const [error,setError] = useState({})
    const [requisiteLink,setRequisiteLink] = useState()
    useEffect(()=>{
        setError({})
        setRequisiteLink(false)
        setSelectedPayment(payment_type?[...payment_type]:[])
    },[modal])
    const dispatcher = useDispatch()
    /** Массив типов оплаты */
    const arrTypePayment = [
        {text:t("addNewObjects.secondStep.cash"),value:1},
        {text:t("addNewObjects.secondStep.card"),value:2},
        {text:t("addNewObjects.secondStep.check"),value:3},
        {text:t("addNewObjects.secondStep.online"),value:4},
    ]

    useEffect(()=>{
        setSelectedPayment(payment_type?[...payment_type]:[])
    },[payment_type])

    async function save(){
        setError({})
        setRequisiteLink(false)
        const isSave = await dispatcher(setPaymentType({id:id,payment_type_id:selectedPayment}))

        if(isSave.status == 200){
            setModal(false)
            setModalSuccess(true)
        }else if(isSave.status == 422){
            let errorObj = {}
            isSave.data.errors.length ? isSave.data.errors.forEach((elem) => {
                errorObj[elem.field] = elem.message
            }) : errorObj = { phone:isSave.data.message }
            if(isSave.data.showRequisitesLink){
                setRequisiteLink(true)
            }
            setError(errorObj)
        }

    }

    /** Типы оплаты */
    const templatePayment = useMemo(()=>arrTypePayment.map((elem,id)=>{
        return (
            <Checkbox
                key={id}
                text={elem.text}
                classNameCheckBox={classes.modal_checkbox}
                classNameLabel={classes.modal_text}
                className={classes.modal_checkboxes}
                checked={selectedPayment.find(e=>e==elem.value)}
                value={selectedPayment.find(e=>e==elem.value)}
                onChange={(event)=>{
                    if(event.target.checked){
                        selectedPayment.push(elem.value)
                        setSelectedPayment(selectedPayment)
                    }else{
                        let arr = selectedPayment.filter(e=>e!==elem.value)
                        setSelectedPayment(arr)
                    }
                }}
                valid={!error.payment_type_id}
                shouldValidate
            ></Checkbox>
        )
    }),[selectedPayment,error])

    /** Успешное сохранение */
    const revokeTravelLineModal = modalSuccess &&
        <EmptyModal
            close={true}
            className={classes.modal_success}
            btnCancelClick={() => setModalSuccess(false)}
            closeModal={closeModalSuccess}
            background="blue"
            width={333}
            typeModal="withoutBack">
            <p className={classes.modal_success_title}>{t("objects.paymentModal.successTitle")}</p>
            <p className={classes.modal_success_subtitle}>{t("objects.paymentModal.successSubtitle")}</p>
        </EmptyModal>


    return (
        <>
            {revokeTravelLineModal}
            {modal &&<EmptyModal
                close={true}
                className={classes.modal}
                btnCancelClick={() => setModal(false)}
                closeModal={closeModal}
                background="blue"
                width={331}
                typeModal="withoutBack"
            >
                <h2 className={classes.modal_title}>{t("objects.paymentModal.title")}</h2>
                <div className={classes.modal_wrap}>
                    <p className={classes.modal_subtitle}>{t("objects.paymentModal.availablePayment")}</p>
                    {templatePayment}
                </div>
                {Object.keys(error).length ? <ErrorMessage
                    error={error.payment_type_id}
                    linkText={requisiteLink?"Перейти к реквизитам":""}
                    linkUrl={`/personal-area/requisites/hotel/${id}`}
                /> : null}
                <Button
                    btnColor="green"
                    className={classes.modal_button}
                    onClick={save}
                    typeButton={1}
                >
                    {t("objects.paymentModal.save")}
                </Button>
            </EmptyModal>}
        </>

    )
}

export default ModalPaymentType