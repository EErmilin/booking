import React, { useEffect, useMemo } from "react"
import classes from "../../../Reservations.module.scss";
import Reservation from "../Reservation/Reservation";
import {useTranslation} from "react-i18next";
import Preloader from "../../../../../../../components/Preloader/Preloader";
import EmptyModal from "../../../../../../../components/UI/modals/EmptyModal/EmptyModal";
import useToggleVisibility from "../../../../../../../hooks/useToggleVisibility";
import { useDispatch } from "react-redux"
import { getPartnerBookingRejectReasons } from "../../../../../../../store/actions/bookingActions"
import {useParams} from "react-router-dom";


function CurrentHotelReservationList({reservations,otherParams}){
    const {t} = useTranslation()
    const [showCancelSuccessModal, setShowCancelSuccessModal,closeModalSuccess] = useToggleVisibility()
    const dispatcher = useDispatch()
    const {page} = useParams()
    useEffect(() => {
        dispatcher(getPartnerBookingRejectReasons())
    }, [])

    /** Список новых броней */
    const templateReservations = useMemo(()=>{
        if(!reservations)return []
        return reservations.map((reservation, id) => {
            return <Reservation
                setModal={setShowCancelSuccessModal}
                bookInfo={reservation}
                otherParams={otherParams}
                key={id}
                page={page}
            />
        })
    },[reservations,otherParams])

    const templateModalSuccess = showCancelSuccessModal && (
        <EmptyModal
            close={true}
            btnCancelClick={()=>setShowCancelSuccessModal(false)}
            closeModal={closeModalSuccess}
            background="blue"
            width={308}
            typeModal="withoutBack">
            Составлена заявка на отмену бронирования. С Вами свяжется менеджер, ожидайте ответа
        </EmptyModal>
    )

    return (
        <div>
            <div className={classes.selected_title_area}>
                <div className={[classes.selected_title_type, classes.selected_title].join(" ")}>
                    {t('reservations.type')}
                    <div className={classes.selected_sort} />
                </div>
                <div className={classes.selected_title}>
                    {t('reservations.checkIn')}
                    <div className={classes.selected_sort} />
                </div>
                <div className={classes.selected_title}>
                    {t('reservations.leaving')}
                    <div className={classes.selected_sort} />
                </div>
                <div className={classes.selected_title}>
                    {t('reservations.guests')}
                    <div className={classes.selected_sort} />
                </div>
                <div className={classes.selected_title}>
                    {t('reservations.status')}
                    <div className={classes.selected_sort} />
                </div>
                <div className={classes.selected_title_buttonsArea} />
            </div>
        {!reservations?<Preloader></Preloader>:<div>
            {templateModalSuccess}
            {templateReservations}
        </div>}
    </div>
    )
}

export default CurrentHotelReservationList