import React, { useEffect, useMemo, useState } from "react";
import classes from "./Notifications.module.scss";
import { useTranslation } from "react-i18next";
import CustomSelect from "../../../../components/UI/areas/CustomeSelect/CustomSelect";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../../../components/UI/btns/Button/Button";
import Notification from "./components/Notification";
import NotificationModal from "../../../../components/UI/modals/NotificationModal/NotificationModal";
import Preloader from "../../../../components/Preloader/Preloader";
import { getClientNotification, getPartnerNotification } from "../../../../store/actions/notificationActions";


function Notifications({ userType }) {

    const optionsFilter = [
        {
            label: 'Показывать все',
            value: "all",
        },
        {
            label: 'Непрочитанные',
            value: "noReaded",
        },
    ]

    const { t } = useTranslation()
    const [params, setParams] = useState({ pageSize: 7, page: 1 })
    const [filter, setFilter] = useState(optionsFilter[0])
    const total = useSelector(state => state.notifications.total)
    const notifications = useSelector(state => state.notifications.notifications)
    const dispatcher = useDispatch()
    
    useEffect(() => {
        if (userType === "partner") {
            dispatcher(getPartnerNotification(params, filter))
        } else {
            dispatcher(getClientNotification(params, filter))
        }
    }, [params, filter])

    const showMoreButton = <Button btnColor="outline_blue"
        typeButton={1}
        className={classes.showMoreButton}
        onClick={() => { setParams(prevState => ({ pageSize: prevState.pageSize + 7, page: 1 })) }}>
        {t('notifications.showMore')}
    </Button>

    const templateNotifications = useMemo(() => {
        return notifications && notifications.map((notification, id) => {
            return <Notification userType={userType} notification={notification} key={id} />
        })
    }, [notifications])

    return (
        <div>
            <h2 className={classes.title}>{t("personalArea.navBar.notifications")}</h2>
            <div className={classes.body}>
                <CustomSelect
                    defaultValue={filter}
                    options={optionsFilter}
                    className={classes.filter}
                    onChange={(value) => {
                        setFilter(value)
                    }} />
                {notifications && !notifications.length ? <div className={classes.empty}>
                    <h1>Новых уведомлений</h1>
                    <h1>пока не поступало</h1>
                </div> :
                    notifications ? <div className={classes.list}>
                        {templateNotifications}
                    </div> :
                        <Preloader></Preloader>}
                <div className={classes.bottom}>
                    {(total > (notifications && notifications.length)) && showMoreButton}
                </div>
            </div>
        </div>
    )
}

export default Notifications