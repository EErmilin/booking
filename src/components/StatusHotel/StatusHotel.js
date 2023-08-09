import React from "react"
import classes from "./StatusHotel.module.scss"
import { useTranslation } from "react-i18next";


/**
 * Блок отображения статуса объекта
 * название параметра статуса:
 * @param status
 * @constructor
 */


function StatusHotel({
    status, text
}) {
    const { t } = useTranslation()
    let textStatus = ''
    const clsStatus = [classes.status_hotel]
    switch (status) {

        //Реквизиты 
        case 'requestRequest':
            clsStatus.push(classes.status_withdrawn)
            textStatus = 'Отправлено на проверку'
            break;
        case 'requisiteChecking':
            clsStatus.push(classes.status_withdrawn)
            textStatus = 'Выполняется проверка'
            break;
        case 'requisiteNotConfirmed':
            clsStatus.push(classes.status_canceled)
            textStatus =  'Реквизиты не подтверждены'
            break;
        case 'requisiteСonfirmed':
            clsStatus.push(classes.status_placed);
            textStatus = 'Реквизиты подтверждены'
            break;
        case 'noRequisite':
            clsStatus.push(classes.status_draft)
            textStatus = 'Реквизиты не Добавлены'
            break;

        case 'send':
        case 'requestInWork':
        case 'waiting':
            clsStatus.push(classes.status_sent);
            break;
        case 'placed':
        case 'approved':
        case 'requestClosed':
            clsStatus.push(classes.status_placed);
            break;
        case 'moderation':
        case 'completed':
        case 'onModeration':
        case 'requestOnReview':
            clsStatus.push(classes.status_moderation);
            break;
        case 2:
            clsStatus.push(classes.status_moderation)
            textStatus = t("statusHotel.onModeration")
            break;
        case 'canceled':
        case 'canceledHotel':
        case 'canseledClient':
        case 'cancelPublication':
            clsStatus.push(classes.status_canceled);
            break;
        case 'withdraw':
            clsStatus.push(classes.status_withdrawn);
            break;
        case 1:
            clsStatus.push(classes.status_draft);
            textStatus = t("statusHotel.draft")
            break;
        case 4:
            clsStatus.push(classes.status_withdrawn);
            textStatus = t("statusHotel.withdraw")
            break;
        case 3:
            clsStatus.push(classes.status_canceled)
            textStatus = t("statusHotel.notConfirmed")
            break;
        case 5:
            clsStatus.push(classes.status_placed);
            textStatus = t("statusHotel.placed")
            break;
        case 6:
            clsStatus.push(classes.status_canceled)
            textStatus = t("statusHotel.mainGuest")
            break;
        case 8:
            clsStatus.push(classes.status_draft);
            textStatus = t("statusHotel.archive")
            break;
        case 'confirmReport':
            clsStatus.push(classes.status_placed);
            textStatus = t("personalArea.reports.confirm")
            break;
        case 'noConfirmReport':
            clsStatus.push(classes.status_withdrawn);
            textStatus = t("personalArea.reports.noConfirm")
            break;
        case 'mainGuest':
            clsStatus.push(classes.status_mainGuest)
            textStatus = t("statusHotel.mainGuest")
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


export default StatusHotel