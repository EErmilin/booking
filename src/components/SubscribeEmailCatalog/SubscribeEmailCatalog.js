import React, { useEffect } from "react"
import classes from "./SubscribeEmailCatalog.module.scss";
import { useTranslation } from "react-i18next";
import EmailInput from "../UI/areas/EmailInput/EmailInput";
import { useDispatch, useSelector } from "react-redux";
import { clearSubscribeError } from "../../store/actions/subscribeActions";
import { useLocation } from "react-router-dom";
import EmptyModal from "../UI/modals/EmptyModal/EmptyModal";
import { setSubscribeSeccess } from "../../store/actions/subscribeActions"



function SubscribeEmailCatalog() {
    const { t } = useTranslation()
    const error = useSelector(state => state.subscribe.error);
    const success = useSelector(state => state.subscribe.success);

    const location = useLocation()

    const dispatcher = useDispatch()
    useEffect(() => {
        dispatcher(clearSubscribeError())
    }, [location.pathname])

    const successModal = <EmptyModal
        close={true}
        btnCancelClick={() => dispatcher(setSubscribeSeccess(false))}
        typeModal={"withoutBack"}
        background="blue"
        width={328}
    >
        <p>Подписка успешно оформлена</p>
    </EmptyModal>

    return (
        <div className={classes.place}>
            {success && successModal}
            <div className={classes.wrap}>
                <div className={classes.content}>
                    <div className={classes.info}>
                        <h2 className={classes.title}>{t('footerMain.footerTitle')}</h2>
                        <p className={classes.description}>
                            Подпишитесь на рассылку и получайте уведомления о&nbsp;скидках и&nbsp;спецпредложениях
                        </p>
                    </div>
                    <div className={classes.form}>
                        <EmailInput
                            error={error}
                            className={classes.input}
                            classNameButton={classes.subscribe_email_btn}
                        ></EmailInput>
                        {error && <p className={classes.error}>{error}</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SubscribeEmailCatalog