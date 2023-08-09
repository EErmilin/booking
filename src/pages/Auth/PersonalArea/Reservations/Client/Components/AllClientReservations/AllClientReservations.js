import React, {useMemo} from "react";
import classes from "../../Pages/CurrentReservationClient/ReservationClientItem.module.scss";
import ReservationClient from "../ReservationClient/ReservationClient";
import {useSelector} from "react-redux";
import EmptyModal from "../../../../../../../components/UI/modals/EmptyModal/EmptyModal";
import useToggleVisibility from "../../../../../../../hooks/useToggleVisibility";
import {useTranslation} from "react-i18next";


function AllClientReservations({filters}){
    const {t} = useTranslation()
    const reservations = useSelector(state => state.book.reservation)
    const [modal,setModal,closeModal] = useToggleVisibility()
    const [showCancelSuccessModal, setShowCancelSuccessModal,closeModalSuccess] = useToggleVisibility();
    const templateModal = modal && <EmptyModal
        close={true}
        background="blue"
        closeModal={closeModal}
        btnCancelClick={() => setModal(false)}
        width={336}
        typeModal="withoutBack"
        className={classes.noComments_auth}
    >
        <h2 className={classes.noComments_auth_title}>Отлично!</h2>
        <div className={classes.noComments_auth_text}>Ваш отзыв отправлен на модерацию</div>
    </EmptyModal>

    const templateModalSuccess = showCancelSuccessModal && (
        <EmptyModal
            close={true}
            btnCancelClick={()=>setShowCancelSuccessModal(false)}
            closeModal={closeModalSuccess}
            background="blue"
            width={308}
            typeModal="withoutBack">
            <h2>{t("support.excellent")}!</h2>
            <p className={classes.cancelReservation_modalText}>{t("reservations.cancelReservation.canceled")}</p>
        </EmptyModal>
    )

    const renderReservations = useMemo(()=>{
        return reservations.length && reservations.map((elem,id)=>{
            return (
                <ReservationClient filters={filters} setShowCancelSuccessModal={setShowCancelSuccessModal} setModal={setModal} bookInfo={elem} key={id}></ReservationClient>
            )
        })
    },[reservations,filters])

    return (
        <div>
            <div className={classes.section}>
                {renderReservations}
                {templateModal}
                {templateModalSuccess}
            </div>
        </div>
    )
}

export default AllClientReservations