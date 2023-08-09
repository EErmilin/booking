import React from "react"
import classes from "../StatusHotel/StatusHotel.module.scss"
import { useTranslation } from "react-i18next";


/**
 * Блок отображения статуса объекта
 * название параметра статуса:
 * @param status
 * @constructor
 */


function StatusReview({
                         status, text
                     }) {
    const { t } = useTranslation()
    let textStatus = ''
    const clsStatus = [classes.status_hotel]
    switch (status) {
        case 1:
            clsStatus.push(classes.status_moderation);
            textStatus = t("comment.status.onModeration")
            break;
        case 4:
            clsStatus.push(classes.status_withdrawn);
            textStatus = t("statusHotel.withdraw")
            break;
        case 2:
            clsStatus.push(classes.status_canceled)
            textStatus = t("comment.status.cancelPublication")
            break;
        case 5:
            clsStatus.push(classes.status_placed);
            textStatus = t("statusHotel.placed")
            break;
        default:
            clsStatus.push(classes.status_draft);
            break;
    }


    return (
        <div className={clsStatus.join(' ')}>
            {text ? text : textStatus}
        </div>
    )
}


export default StatusReview