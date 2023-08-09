import React from "react"
import classes from "../StatusHotel/StatusHotel.module.scss"
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { PARTNER_ROLE } from "../../roles/roles";


/**
 * Блок отображения статуса объекта
 * название параметра статуса:
 * @param status
 * @constructor
 */


function StatusNotification({
    status, text, bookingStatus
}) {
    const { t } = useTranslation()
    const roles = useSelector(state => state.auth.userInfo.user_type)
    let textStatus = ''
    const clsStatus = [classes.status_hotel]
    switch (status) {
        case 2:
        case 4:
            clsStatus.push(classes.status_moderation);
            textStatus = t("comment.status.onModeration")
            break;
        case 6:
            clsStatus.push(classes.status_withdrawn);
            textStatus = t("statusHotel.withdraw")
            break;
        case 10:
        case 5:
        case 13:
        case 14:
            clsStatus.push(classes.status_canceled);
            textStatus = t("statusHotel.placed")
            break;
        case 9:
        case 8:
        case 7:
        case 3:
        case 1:
        case 11:
        case 12:
        case 15:
            clsStatus.push(classes.status_placed);
            textStatus = t("statusHotel.placed")
            break;
        case 16:
        case 18:
        case 17:
            clsStatus.push(classes.status_canceled);
            break;
        default:
            clsStatus.push(classes.status_draft);
            break;
    }


    return (
        <div className={clsStatus.join(' ')}>
            {roles === PARTNER_ROLE && status === 18 ? "Вы отменили бронирование номера" : text ? text : textStatus}
        </div>
    )
}


export default StatusNotification