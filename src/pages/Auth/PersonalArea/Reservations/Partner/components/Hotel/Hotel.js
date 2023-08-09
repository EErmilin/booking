import React from "react"
import classes from "../../../Reservations.module.scss";
import { useTranslation } from "react-i18next";
import Button from "../../../../../../../components/UI/btns/Button/Button";
import { useDispatch } from "react-redux";
import { selectReservation } from "../../../../../../../store/actions/reservationsActions";
import { NavLink, useNavigate } from "react-router-dom";

function Hotel({ reservation, price, isBook }) {
    const { t } = useTranslation()
    return (
        <div
            className={[classes.reservation, price ? classes.reservation_arrow : ''].join(' ')}
        >
            <NavLink to={price ? `/personal-area/prices/hotel/${reservation.id}` : `/personal-area/reservations/hotel/${reservation.id}/1`} className={classes.clickable}></NavLink>
            <div className={classes.reservation_title}>
                <div className={classes.title}>{t('reservations.hotel')}</div>
                <h3>{reservation.name.ru}</h3>
            </div>
            {price ? "" : (
                <>
                    {/**<div className={classes.reservation_props}>
                        <div className={classes.title}>{t('reservations.requests')}</div>
                        <h3>{reservation.new}</h3>
                    </div>**/}
                    <div className={classes.reservation_props}>
                        <div className={classes.title}>{t('reservations.reservations')}</div>
                        <h3>{reservation.approved}</h3>
                    </div>
                    {isBook ? '' : <div className={classes.reservation_props}>
                        <div className={classes.title}>{t('reservations.availableRooms')}</div>
                        <h3>{reservation.freeRooms}</h3>
                    </div>}
                </>
            )}
        </div>

    )
}

export default Hotel