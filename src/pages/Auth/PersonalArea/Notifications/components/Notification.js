import React from "react";
import classes from "./Notification.module.scss";
import { useTranslation } from "react-i18next";
import StatusHotel from "../../../../../components/StatusHotel/StatusHotel";
import Button from "../../../../../components/UI/btns/Button/Button";
import { useNavigate } from "react-router-dom";
import useToggleVisibility from "../../../../../hooks/useToggleVisibility";
import NotificationModal from "../../../../../components/UI/modals/NotificationModal/NotificationModal";
import moment from "moment";
import StatusNotification from "../../../../../components/StatusNotification/StatusNotification";
import { useDispatch, useSelector } from "react-redux";
import {
    deleteUnreadNotificationClient,
    deleteUnreadNotificationPartner
} from "../../../../../store/actions/notificationActions";


function Notification({ notification, isShowDetails, userType, noBtn = false }) {
    const { t } = useTranslation()
    const [showDetails, setShowDetails, closeDetails] = useToggleVisibility()
    const dispatcher = useDispatch()
    const roles = useSelector(state => state.auth.userInfo.user_type)

    const renderMessage = (messages) => {
        return <div className={classes.message}>{messages}</div>
    };
    const renderCancelReason = () => {
        if(notification.body.type==='requisites') return
        if (notification.body.cancel_sub_reason_id) {
            return <div className={classes.cancel}>
                <p className={classes.cancel_subtitle}>{t("reservations.partner.reasonsCancel")}</p>
                {notification.body.cancel_sub_reason_id == 5 ?
                    <div className={classes.cancel_text_wrap}>
                        <p
                            className={classes.cancel_text}>{notification.body.reject_reason || notification.body.cancel_reason}
                        </p>
                    </div>:
                    <div className={classes.cancel_text_wrap}>
                        <p className={classes.cancel_text}>
                            {notification.body.status_id == 4 ? notification.body.reject_reason : notification.body.cancel_sub_reason_text}
                        </p>
                    </div>
                }
            </div>
        } else {
            if(notification.body.reject_reason){
                return (<>
                    <p className={classes.cancel_subtitle}>{t("reservations.partner.reasonsCancel")}</p>
                    <div className={classes.cancel_text_wrap}>
                        <p className={classes.cancel_text}>
                            {notification.body.reject_reason}
                        </p>
                    </div>

                </>)
            }
        }
    }

    const navigate = useNavigate()
    let navigateLink;

    const linkText = (type) => {
        switch (type) {
            case 4:
            case 5:
                if (roles == 2) {
                    navigateLink = `/personal-area/reservations/hotel/${notification.body.hotel_id}/1`;
                    return t('personalArea.navBar.reservations').toLowerCase();
                } else {
                    navigateLink = `/personal-area/my-reservations/1`;
                    return t('personalArea.navBar.reservations').toLowerCase();
                }
            case 11: {
                return `/personal-area/comments?hotelId=${notification.body.hotel_id}&currentBlock=1`;
            }
            case 8:
                navigateLink = '/personal-area/comments';
                return t('personalArea.navBar.comments').toLowerCase();
            case 9:
                return "Бесплатный период"
            case 2:
                navigateLink = '/personal-area/support';
                return t('notifications.toSupport')
            case 6:
                navigateLink = '/personal-area/comments';
                return t('notifications.toModeration')
            case 7:
                navigateLink = '/personal-area/comments';
                return t('notifications.toModeration')
            case 1:
                return t('notifications.toRegistration')
            default:
                break;
        }
    }
    const templateDetails = showDetails && <NotificationModal
        closeModal={closeDetails}
        btnCancelClick={setShowDetails}
        notification={notification}
    />

    const renderModerationAnswer = () => {
        if (notification.type == 13) {
            return (
                <div className={classes.moderation}>
                    <div className={classes.moderation_canceled}>
                        <div className={classes.moderation_canceled_text}>Модератор не подтвердил отмену бронирования</div>
                    </div>
                    <div className={classes.moderation_subtext}>Причины отмены заявки:</div>
                    <div className={classes.moderation_reason}>{notification.body.cancel_moderation_comment}</div>
                </div>
            )
        } else if (notification.type == 12) {
            return (
                <div className={classes.moderation}>
                    <div className={classes.moderation_success}>
                        <div className={classes.moderation_success_text}>Модератор подтвердил отмену бронирования</div>
                    </div>
                    <div className={classes.moderation_subtext}>Комментарий модератора:</div>
                    <div className={classes.moderation_reason}>{notification.body.cancel_moderation_comment}</div>
                </div>
            )
        }
    }
    const notificationButton = isShowDetails ? '' :
        (!noBtn && <Button
            typeButton={1}
            className={classes.detailButton}
            onClick={() => {
                if (userType === "partner") {
                    dispatcher(deleteUnreadNotificationPartner(notification.id))
                } else {
                    dispatcher(deleteUnreadNotificationClient(notification.id))
                }
                setShowDetails(!showDetails)
            }}
            btnColor="outline_blue"
        >{t('notifications.detail')}</Button>)

    const renderNotification = ({ title, type, text, time, sender, is_read }) => {
        return <div className={classes.wrap}>
            <div className={classes.header}>
                <div className={classes.sender}>
                    {(notification.body && notification.body.type) ? t(`notifications.sender.${notification.body.type}`) : t(`notifications.sender.client`)} {' ∙ '} {moment.unix(notification.created_at).format("DD.MM.YY, HH:mm")}
                </div>
                <StatusNotification status={type}
                    text={t("notifications.types." + type)} />
                {!is_read && !isShowDetails && <div className={classes.bluePoint} />}
            </div>
            <div className={classes.title}>
                {
                    type === 6 &&
                    <div className={isShowDetails ? classes.modal_info : classes.info} />
                }
                <div>
                    {notification.text}
                </div>
            </div>
            {
                (type === 6 || type === 16) && !!notification.body.moderation_answer &&
                <div className={classes.message}>
                    {notification.body.moderation_answer}
                </div>
            }
            {notification.body && !!notification.body.text &&
                <div className={classes.message}>
                    {notification.body.text}
                </div>
            }
            {(notification.body && notification.body.hotel_name) && <div className={classes.hotel}>
                <div className={classes.hotel_titles}>
                    <div className={classes.hotel_name}>
                        {`${t("notifications.hotel")} «${notification.body.hotel_name.ru}»`}
                    </div>
                    <div className={classes.hotel_room}>{notification.body.room_name.ru}</div>
                </div>
                <div className={classes.hotel_props}>
                    <span className={classes.hotel_date}>
                        {moment(notification.body.arrival_date).format("dd, DD.MM.YY")}
                    </span>
                    <span className={classes.hotel_date}>
                        {moment(notification.body.departure_date).format("dd, DD.MM.YY")}
                    </span>
                    <span className={classes.hotel_date}>
                        {moment(notification.body.departure_date).diff(moment(notification.body.arrival_date), "days")} ночи
                    </span>
                    {notification.body?.adult_count && <span className={classes.hotel_date}>
                        {notification.body.adult_count} взр.
                    </span>}

                </div>
            </div>}
            {(notification.type == 5 || notification.type == 12 || notification.type == 13) ? renderCancelReason() : ''}
            {notificationButton}
            {(notification.type == 11 && roles !== 2) &&
                <Button btnColor="ButtonGreen"
                    className={classes.send_review}
                    typeButton={1}
                    onClick={() => { navigate(`/personal-area/comments?hotelId=${notification.body.hotel_id}&currentBlock=1`) }}
                >
                    Оставить отзыв
                </Button>
            }
            {isShowDetails && renderModerationAnswer()}
            {isShowDetails && notification.body?.review_failed ? <p className={classes.reason_text}>{notification.body.review_failed}</p> :""}
            {templateDetails}
        </div>
    };


    return renderNotification(notification)

}

export default Notification