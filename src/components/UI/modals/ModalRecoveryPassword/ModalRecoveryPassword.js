import React, { useMemo } from "react"
import classes from "./ModalRecoveryPassword.module.scss"
import { useTranslation } from "react-i18next";
import TransitionContainer from "../../other/TransitionContainer/TransitionContainer";
import Input from "../../areas/Input/Input";
import Button from "../../btns/Button/Button";
import useValidateForm from "../../../../hooks/useValidateForm";
import { useDispatch, useSelector } from "react-redux";
import {sendEmailPartner, sendSmsPartner} from "../../../../store/actions/authActions";
import { clearErrors } from "../../../../store/actions/partnerHotelsActions";
import useToggleVisibility from "../../../../hooks/useToggleVisibility";


function ModalRecoveryPassword({
    openNextModal,
    closeModal,
    setTimerCount
}) {
    const { t } = useTranslation()
    const dispatcher = useDispatch()
    const erorrs = useSelector(state => state.auth.errors)

    /** Поля и правила почты */
    const areasEmail = [
        { name: 'email', rules: { required: true } },
    ];
    /** Поля и правила телефона */
    const areasPhone = [
        { name: 'phone', rules: { required: true } },
    ];

    /** Состояние полей почты */
    const [localStateEmail, isFormValidEmail, onChangeHandlerEmail] = useValidateForm(
        areasEmail,
    );
    /** Состояние полей телефона */
    const [localStatePhone, isFormValidPhone, onChangeHandlerPhone] = useValidateForm(
        areasPhone,
    );

    async function submitEmail() {
        if (localStateEmail.value) localStateEmail.email.touched = true
        let isSend = await dispatcher(sendEmailPartner({ email: localStateEmail.email.value ? localStateEmail.email.value : '' }))
        if (isSend) {
            dispatcher(clearErrors())
            closeModal()
            openNextModal("email")
        }

    }


    async function submitPhone() {
        if (localStatePhone.value) localStatePhone.phone.touched = true
        const phone = localStatePhone.phone.value.match(/\d/g)
        const response = await dispatcher(sendSmsPartner({ phone: phone ? `+${phone.join('')}` : '' }))
        if (response) {
            const time = new Date(new Date().getTime() / 1000 - response.nextAttemptAt).getTime()
            setTimerCount && setTimerCount(time)
            closeModal()
            openNextModal("phone", `+${phone.join('')}`)
        }
    }

    /** Очищаем ошибки и изменяем состояние */
    function clearErrorAndChange(event, field) {
        if (erorrs) {
            dispatcher(clearErrors())
        }
        if(field === 'email'){
         return onChangeHandlerEmail(event, field)
        }
        onChangeHandlerPhone(event, field)
    }

    const templateEmailRecovery = (
        <div className={classes.email_recovery}>
            <div className={classes.email_recovery_txt}>
                {t("auth.login.recoveryСondition")}
            </div>
            <Input
                typeClsInput="field"
                label={t("auth.login.email")}
                name="email"
                id="email"
                required
                shouldValidate
                valid={!localStateEmail.email.valid}
                touched={localStateEmail.email.touched}
                errorMessage={
                    erorrs.email
                }
                value={localStateEmail.value}
                onChange={(event) => clearErrorAndChange(event, 'email')}
                className={classes.recovery_password_mg20}
            ></Input>
            <Button
                btnColor="ButtonGreen"
                typeButton={2}
                className={classes.email_recovery_btn}
                onClick={submitEmail}
                disabled={!isFormValidEmail}
            >{t("auth.login.recoveryPasswordBtn")}</Button>
        </div>
    )

    const templatePhoneRecovery = useMemo(() => {
        return <div className={classes.email_recovery}>
            <div className={classes.email_recovery_txt}>
                {t("auth.login.recoveryСonditionPhone")}
            </div>
            <Input
                typeClsInput="field"
                label={t("auth.login.phone")}
                mask={"+7(999) 999-99-99"}
                name="phone"
                id="phone"
                required
                shouldValidate
                valid={!localStatePhone.phone.valid}
                touched={localStatePhone.phone.touched}
                errorMessage={
                    erorrs.phone || (erorrs.uuid ? t(`auth.login.${erorrs.uuid}`) : '')
                }
                value={localStatePhone.phone.value}
                onChange={(event) => clearErrorAndChange(event, 'phone')}
                className={classes.recovery_password_mg20}
                inputmode={"numeric"}
            ></Input>
            <Button
                btnColor="green"
                typeButton={1}
                className={classes.email_recovery_btn}
                onClick={submitPhone}
                disabled={!isFormValidPhone || localStatePhone.phone.value.length < 17}
            >{t("auth.login.recoveryPasswordBtn")}</Button>
        </div>
    }, [localStatePhone, erorrs])


    const blocks = [
        {
            title:t("auth.login.recoveryForEmail"),
            block:templateEmailRecovery
        },
        {
            title: t("auth.login.recoveryForPhone"),
            block: templatePhoneRecovery
        },
    ]


    return (
        <div className={classes.recovery_password}>
            <h2 className={classes.recovery_password_title}>{t("auth.login.recoveryPassword")}</h2>
            <TransitionContainer
                withTitleBorder={true}
                classNameTitle={classes.recovery_password_section}
                className={classes.recovery_password_mg}
                classNameTitlesWrap={classes.recovery_password_wrap}
                blocks={blocks}
            ></TransitionContainer>
        </div>
    )
}


export default ModalRecoveryPassword