import React, {useEffect} from "react"
import classes from "./ModalBookingPayment.module.scss"
import EmptyModal from "../../../../../components/UI/modals/EmptyModal/EmptyModal";
import Payments from "../../../../NotAuth/Payments/Payments";
import {useDispatch, useSelector} from "react-redux";
import {getPaymentInfo} from "../../../../../store/actions/generalInfoAction";
import InfoPageUnit from "../../../../../components/InfoPageUnit/InfoPageUnit";


function ModalBookingPayment({
    closeModal,
    setModal,
}){
    const payments = useSelector(state => state.general.payments)
    const dispatcher = useDispatch()


    /** Подтягиваем инфу */
    useEffect(()=>{
        dispatcher(getPaymentInfo())
    },[])

    return (
        <EmptyModal
            close={true}
            background="blue"
            closeModal={closeModal}
            btnCancelClick={() => setModal(false)}
            width={1020}
            typeModal="withoutBack"
            className={classes.modal_payments}
        >
            <InfoPageUnit className={classes.modal_payments_item}  title={payments.name?.ru}>
                <div dangerouslySetInnerHTML={{ __html: payments.text?.ru }}></div>
            </InfoPageUnit>
            <InfoPageUnit className={classes.modal_payments_item} title={payments.name_1?.ru}>
                <div dangerouslySetInnerHTML={{ __html: payments.text_1?.ru }}></div>
            </InfoPageUnit>
        </EmptyModal>
)
}


export default ModalBookingPayment