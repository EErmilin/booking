import React, { useEffect, useMemo, useState } from 'react'
import classes from "./RegisterClient.module.scss";
import { useTranslation } from "react-i18next";
import Input from "../../../../components/UI/areas/Input/Input";
import Button from "../../../../components/UI/btns/Button/Button";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import useToggleVisibility from "../../../../hooks/useToggleVisibility";
import EmptyModal from "../../../../components/UI/modals/EmptyModal/EmptyModal";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { object, string, number, ref } from "yup";
import { ClearFieldError, registerClient, registerClientBySms, setFieldError } from "../../../../store/actions/authActions";
import ReactGA from "react-ga4"
import ModalConfirmSmsCode from '../../../../components/UI/modals/ModalConfirmSmsCode/ModalConfirmSmsCode';
import Checkbox from "../../../../components/UI/areas/Checkbox/Checkbox";
import { clearErrors } from '../../../../store/actions/partnerHotelsActions';
import { Helmet } from "react-helmet"

function RegisterClient({

}) {
    const { t } = useTranslation()
    const errors = useSelector(state => state.auth.errors)
    const navigate = useNavigate()
    const location = useLocation()
    const dispatcher = useDispatch()
    const [isShowModalCode, setIsShowModalCode, closeModalCode] = useToggleVisibility()

    const [errorCode, setErrorCode] = useState(null)
    const [timerCount, setTimerCount] = useState(120)
    /** Модалка успешной регистрации */
    const [isShowModal, setIsShowModal, closeModal] = useToggleVisibility(false)
    /** Модалка востановления два поля пороля */
    const templateModalSuccessPassword = isShowModal && (
        <EmptyModal
            background="blue"
            closeModal={(event) => {
                navigate(location.state ? location.state : "/personal-area/profile")
                closeModal(event)
            }}
            btnCancelClick={() => setIsShowModal(false)}
            width={296}
            typeModal="withoutBack"
            close={() => setIsShowModal(false)}
            className={"popup_guest_b2c_registration"}
            id={"popup_guest_b2c_registration"}
        >
            <div className={classes.success_modal}>
                <h2 className={classes.success_modal_title}>{t("auth.login.perfect")}</h2>
                <p className={classes.success_modal_txt}>{t("auth.register.successRegisterClient")}</p>
            </div>
        </EmptyModal>
    )

    /** Начальные значения */
    const initialValues = {
        first_name: "",
        phone: "",
        email: "",
    };
    /** Схема валидации */
    const validationSchema = useMemo(
        () =>
            object().shape({
                first_name: string().required(),
                phone: string().required(),
                email: string().required(),
            }),
        []
    );

    /** Стейт полей и правила */
    const {
        values,
        handleChange,
        handleSubmit,
        touched,
    } = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            return register(values)
        },
    });
    /** Проверяем совпадают ли пароли */
    useEffect(() => {
        if (values.password !== values.confirm_password) {
            dispatcher(setFieldError({ field: "confirm_password", message: t("validation.confirmPassword") }))
            dispatcher(setFieldError({ field: "password", message: t("validation.confirmPassword") }))
        } else {
            dispatcher(ClearFieldError("confirm_password"))
            dispatcher(ClearFieldError("password"))
        }
    }, [values.confirm_password])

    /** Очищаем ошибки и изменяем состояние */
    function ClearErrorAndChange(field, value) {
        if (errors[field]) {
            dispatcher(ClearFieldError(field))
        }
        handleChange({ target: { name: field, value: value } })
    }

    const formatData = function (value) {
        let phone = values.phone.match(/\d/g)
        return {
            ...value,
            phone: phone ? `+${phone.join('')}` : ''
        }
    }

    async function register() {
        if (!isPhoneValid) return;
        let response = await dispatcher(registerClient(formatData(values)))
        if (response) {
            if (response.errorCode === 'shortBan') {
                setErrorCode(response)
            }
            const time = new Date(new Date().getTime() / 1000 - response.nextAttemptAt).getTime()
            setTimerCount(time)
            setIsShowModalCode(true)
        }
    }
    useEffect(() => {
        dispatcher(clearErrors())
    }, [])

    const authOnEnterHandler = (event)=>{
        if (event.key === "Enter") {
            event.preventDefault()
            return register()
        }
    }
    useEffect(() => {
        window.addEventListener("keydown", authOnEnterHandler)
        return ()=> {
            window.removeEventListener("keydown", authOnEnterHandler)
        }
    })

    const reSendFunction = async () => {
        const response = await dispatcher(registerClient(formatData(values)))
        let time;
        if (response) {
            time = new Date(new Date().getTime() / 1000 - response.nextAttemptAt).getTime()
        }
        return time 
    }

    const templateModalConfirmCode = isShowModalCode && (
        <EmptyModal
            background="blue"
            close={true}
            btnCancelClick={() => setIsShowModalCode(false)}
            width={420}
            typeModal="withoutBack"
        >
            <ModalConfirmSmsCode
                btnNextClick={async (code) => {
                    Object.assign(values, { recoveryCode: code })
                    let isAuth = await dispatcher(registerClientBySms(formatData(values)))
                    if (isAuth) {
                        setIsShowModalCode(false)
                        setIsShowModal(true)
                        const { email } = formatData(values)
                        window.rrApiOnReady.push(function () {
                            try {
                                console.log('rrApi.setEmail', email)
                                try { window.rrApi.setEmail(email); } catch (e) { }
                            } catch (e) { }
                        })
                    }
                }}
                timerCount={timerCount}
                setTimerCount={setTimerCount}
                errorCode={errorCode} setErrorCode={setErrorCode}
                onChange={() => { }}
                reSendFunction={() => reSendFunction()}
            />
        </EmptyModal>
    )

    const isPhoneValid = values.phone[4] === '9' || !values.phone[4]

    function getMetaTags() {
        return (
            <Helmet>
                <title>Check in: Регистрация пользователя</title>
            </Helmet>
        )
    }

    return (
        <div className={classes.register_form}>
            {getMetaTags()}
            <form>
                <h2 className={classes.register_form_title}>{t("auth.register.titleClient")}</h2>
                <div className={classes.register_form_subtitle}>
                    Для регистрации <strong>объектов размещения</strong>, перейдите, пожалуйста, по <NavLink to={'/auth/partner/register'}>ссылке</NavLink>
                </div>
                <div className={classes.register_form_field}>
                    <Input
                        label={t("auth.register.phone")}
                        typeClsInput="field"
                        mask="+7 (999) 999-99-99"
                        name="phone"
                        shouldValidate
                        touched={!touched.phone}
                        valid={isPhoneValid && !errors.phone}
                        errorMessage={errors.phone ?? t("auth.register.noValidPhone")}
                        required
                        value={values.phone}
                        onChange={(e) => {
                            return ClearErrorAndChange("phone", e.target.value)
                        }}
                        inputmode={"numeric"}
                    ></Input>
                </div>
                <div className={classes.register_form_field}>
                    <Input
                        typeClsInput="field"
                        type="email"
                        label={t("auth.register.email")}
                        name="email"
                        shouldValidate
                        touched={!touched.email}
                        valid={!errors.email}
                        errorMessage={errors.email}
                        required
                        value={values.email}
                        onChange={(e) => {
                            return ClearErrorAndChange("email", e.target.value)
                        }}
                    ></Input>
                </div>
                <div className={classes.register_form_field}>
                    <Input
                        label={t("auth.register.name")}
                        typeClsInput="field"
                        name="first_name"
                        shouldValidate
                        required
                        isSearchable={true}
                        touched={!touched.first_name}
                        valid={!errors.first_name}
                        errorMessage={errors.first_name}
                        value={values.first_name}
                        onChange={(e) => {
                            return ClearErrorAndChange("first_name", e.target.value)
                        }}
                    ></Input>
                </div>
                <div className={classes.register_form_field}>
                    <div className={classes.register_form_note}>
                        * обязательные поля для заполнения
                    </div>
                </div>
                <Checkbox
                    className={classes.register_form_checkbox}
                    shouldValidate
                    name="agreeToTermOfUse"
                    touched={!touched.agreeToTermOfUse}
                    valid={!errors.agreeToTermOfUse}
                    required
                    onChange={(e) => {
                        return ClearErrorAndChange("agreeToTermOfUse", e.target.checked)
                    }}
                    text={
                        <span>
                            <span className={classes.register_form_text}>
                                Я принимаю условия
                                <a href="/user-term-of-use" className={classes.register_form_link} target="_blank">Пользовательского соглашения</a>,
                                <a href="/service-rules" className={classes.register_form_link} target="_blank">Правила пользования</a> и соглашаюсь с<a href="/policy" className={classes.register_form_link} target="_blank">Политикой конфиденциальности</a></span>
                        </span>
                    }
                ></Checkbox>
                <Button
                    className={[classes.register_form_btn, "button_guest_b2c_registration"].join(" ")}
                    id={"button_guest_b2c_registration"}
                    btnColor="ButtonGreen"
                    typeButton={2}
                    type="button"
                    onClick={register}
                >{t("auth.register.register")}</Button>
                {/*<p className={classes.register_form_sign_in}>
                    {t('auth.login.problems')}
                    <NavLink
                        className={classes.register_form_sign_in_link}
                        to="/terms"
                    >FAQ</NavLink>
                </p>*/}
            </form>
            {templateModalSuccessPassword}
            {templateModalConfirmCode}
        </div>
    )
}

export default RegisterClient