import React, { useState } from "react"
import classes from "./EmaliInput.module.scss"
import { useTranslation } from "react-i18next";
import Button from "../../btns/Button/Button";
import Input from "../Input/Input";
import { useDispatch } from "react-redux";
import { clearSubscribeError, subscribe } from "../../../../store/actions/subscribeActions";

function EmailInput({
    className,
    classNameButton,
    error
}) {
    /**Формируем стили*/
    const cls = [classes.email_input]
    if (className) cls.push(className)

    const dispatcher = useDispatch()

    const clsButton = [classes.subscribe_btn, "button_mainpage_guest_b2c_sign_up_to_newsletter"]
    if (className) clsButton.push(classNameButton)

    const { t } = useTranslation()
    const [email, setEmail] = useState('')

    function handleClick() {
        dispatcher(subscribe(email))

        window.rrApiOnReady.push(function () {
            try {
                console.log('rrApi.setEmail', email)
                window.rrApi.setEmail(email);
            } catch (e) { }
        })
    }

    const onChangeInput = (event) => {
        dispatcher(clearSubscribeError())
        setEmail(event.target.value)
    }

    return (
        <div className={cls.join(' ')}>
            <Input
                className={error ? classes.error : classes.input}
                value={email}
                onChange={(event) => onChangeInput(event)}
                placeholder={t("footerMain.emailPlaceholder")}
            />
            <Button
                id="button_mainpage_guest_b2c_sign_up_to_newsletter"
                className={clsButton.join(' ')}
                onClick={handleClick}
                btnColor="ButtonBlue"
            >{t('footerMain.subscribe')}</Button>
        </div>
    )
}

export default EmailInput