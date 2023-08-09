import React, {useEffect, useState} from "react"
import classes from "./Reservations.module.scss";
import { useTranslation } from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import Hotel from "./Partner/components/Hotel/Hotel";
import Button from "../../../../components/UI/btns/Button/Button";
import CancelReservationModal from "../../../../components/UI/modals/CancelReservationModal/CancelReservationModal";
import TransitionContainer from "../../../../components/UI/other/TransitionContainer/TransitionContainer";
import {CLIENT_ROLE, PARTNER_ROLE} from "../../../../roles/roles";
import AllClientReservations from "./Client/Components/AllClientReservations/AllClientReservations";
import CanceledClientReservations from "./Client/Components/CanceledClientReservations/CanceledClientReservations";
import ListClientReservations from "./Client/ListClientReservations";
import {getPartnerReservations} from "../../../../store/actions/bookingActions";
import ListPartnerReservations from "./Partner/ListPartnerReservations";



function ListReservations() {
    const { t } = useTranslation()
    const userType = useSelector(state => state.auth.userInfo.user_type);
    const title = userType === PARTNER_ROLE ? t('personalArea.navBar.reservations') : t('reservations.client.title')

    return (
        <div className={classes.reservations}>
            <h2 className={classes.reservations_title}>{title}</h2>
            {userType === CLIENT_ROLE ?
                <ListClientReservations/>:
                <ListPartnerReservations/>
            }
        </div>
    )
}

export default ListReservations



