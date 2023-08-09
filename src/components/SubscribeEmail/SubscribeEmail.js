import React, { useEffect } from "react"
import classes from "./SubscribeEmail.module.scss"
import { useTranslation } from "react-i18next";
import EmailInput from "../UI/areas/EmailInput/EmailInput";
import { useDispatch, useSelector } from "react-redux";
import { clearSubscribeError, setSubscribeSeccess } from "../../store/actions/subscribeActions";
import { useLocation } from "react-router-dom";
import EmptyModal from "../UI/modals/EmptyModal/EmptyModal";

function SubscribeEmail() {
    const { t } = useTranslation()
    const error = useSelector(state => state.subscribe.error);
    const location = useLocation()
    const success = useSelector(state => state.subscribe.success);

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
        <div className={classes.wrap}>
            {success && successModal}
            <div className={classes.gradient}></div>
            <div className={classes.bar}>
                <h2 className={classes.title}>{t('footerMain.footerTitle')}</h2>
                <p className={classes.text}>
                    Подпишитесь на рассылку и получайте уведомления о&nbsp;скидках и&nbsp;спецпредложениях
                </p>
                <EmailInput error={error}/>
                {error && <p className={classes.error}>{error}</p>}
            </div>
        </div>
    )
}

export default SubscribeEmail