import React, { useMemo } from "react";
import classes from "../../Pages/CurrentReservationClient/ReservationClientItem.module.scss";
import ReservationClient from "../ReservationClient/ReservationClient";
import { useTranslation } from "react-i18next";

import { useSelector } from "react-redux";
import Preloader from "../../../../../../../components/Preloader/Preloader";



function CanceledClientReservations() {
    const { t } = useTranslation()
    const reservations = useSelector(state => state.book.reservation)

    /** Темплейт отменных клиентом бронирований */
    const canceledClientReservations = useMemo(() => {
        return reservations.length && reservations.filter((elem) => (elem.status_id == 3)).map((elem, id) => {
            return (
                <ReservationClient bookInfo={elem} key={id}></ReservationClient>
            )
        })
    }, [reservations])

    /** Темплейт отменных отеолем бронирований */
    const canceledHotelReservations = useMemo(() => {
        return reservations.length && reservations.filter((elem) => (elem.status_id == 4 || elem.status_id == 6)).map((elem, id) => {
            return (
                <ReservationClient bookInfo={elem} key={id}></ReservationClient>
            )
        })
    }, [reservations])

    if (reservations.length) {
        return (
            <div>
                <h2 className={classes.block_title}>{t('reservations.client.canceled') + ' '
                    + t('reservations.client.whoCancel.you')}
                </h2>
                <div className={classes.section}>
                    {canceledClientReservations}
                </div>
                <h2 className={classes.block_title}>{t('reservations.client.canceled') + ' '
                    + t('reservations.client.whoCancel.hotel')}
                </h2>
                <div className={classes.section}>
                    {canceledHotelReservations}
                </div>
            </div>
        )
    }
}


export default CanceledClientReservations