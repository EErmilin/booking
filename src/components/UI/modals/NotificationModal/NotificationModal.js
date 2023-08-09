import React from "react"
import classes from "./NotificationModal.module.scss";
import { useTranslation } from "react-i18next";
import EmptyModal from "../EmptyModal/EmptyModal";
import Notification from "../../../../pages/Auth/PersonalArea/Notifications/components/Notification";



function NotificationModal({
    notification,
    closeModal,
    btnCancelClick
}) {
    const { t } = useTranslation()


    return (

        <EmptyModal
            close={true}
            closeModal={closeModal}
            btnCancelClick={() => btnCancelClick(null)}
            btnCancelText={t("profile.cancel")}
            btnNextText={t("profile.save")}
            btnNextClick={()=>{}}
            width={980}
            background="blue"
            typeModal="withoutBack"
            className={classes.notificationModal}
        >
            <Notification notification={notification} noBtn={true} isShowDetails={true}/>
        </EmptyModal>
    )
}


export default NotificationModal


