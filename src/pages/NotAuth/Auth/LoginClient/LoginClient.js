import React, { useEffect, useMemo, useState } from "react";
import classes from "./LoginClient.module.scss";
import { useTranslation } from "react-i18next";
import Input from "../../../../components/UI/areas/Input/Input";
import Button from "../../../../components/UI/btns/Button/Button";
import { useFormik } from "formik";
import { object, string } from "yup";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import useToggleVisibility from "../../../../hooks/useToggleVisibility";
import EmptyModal from "../../../../components/UI/modals/EmptyModal/EmptyModal";
import ModalRecoveryPassword from "../../../../components/UI/modals/ModalRecoveryPassword/ModalRecoveryPassword";
import ModalConfirmSmsCode from "../../../../components/UI/modals/ModalConfirmSmsCode/ModalConfirmSmsCode";
import ModalResetPassword from "../../../../components/UI/modals/ModalResetPassword/ModalResetPassword";
import { useDispatch, useSelector } from "react-redux";
import { authClient, sendSmsClient } from "../../../../store/actions/authActions";
import ReactGA from "react-ga4"
import { clearErrors } from "../../../../store/actions/partnerHotelsActions";

function LoginClient({ }) {
    const navigate = useNavigate()
    const location = useLocation()
    const { t } = useTranslation()
    const errors = useSelector(state => state.auth.errors)
    const dispatcher = useDispatch()
    /** Модалка востановления пороля */
    const [isShowModal, setIsShowModal, closeModal] = useToggleVisibility(false)
    /** Модалка подтверждения кода */
    const [isShowModalCode, setIsShowModalCode, closeModalCode] = useToggleVisibility(false)
    /** Модалка подтверждения пароля */
    const [isShowModalReset, setIsShowModalReset, closeModalReset] = useToggleVisibility(false)

    const [errorCode, setErrorCode] = useState(null)
    const [timerCount, setTimerCount] = useState(120)

    /** Начальные значения */
    const initialValues = {
        phone: '',
        code: "",
    };
    /** Схема валидации */
    const validationSchema = useMemo(
        () =>
            object().shape({
                phone: string().required(),
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
        validateOnMount: true,
        validationSchema,
        onSubmit: (values) => {
            console.log(values)
        },
    });

    /** Модалка востановления пороля */
    const templateModal = isShowModal && (
        <EmptyModal
            background="blue"
            closeModal={closeModal}
            btnCancelClick={() => setIsShowModal(false)}
            width={420}
            typeModal="withoutBack"
        >
            <ModalRecoveryPassword
                phone={values.phone}
                closeModal={() => setIsShowModal(false)}
                openNextModal={(type) => {
                    if (type === "phone") {
                        setIsShowModalCode(true)
                    } else {

                    }
                }}
            ></ModalRecoveryPassword>
        </EmptyModal>
    )

    /** Модалка востановления два поля пороля */
    const templateModalReset = isShowModalReset && (
        <EmptyModal
            background="blue"
            closeModal={closeModalReset}
            btnCancelClick={() => setIsShowModalReset(false)}
            width={300}
            typeModal="withoutBack"
            close={() => setIsShowModalReset(false)}
        >
            <ModalResetPassword />
        </EmptyModal>
    )
    /** Модалка востановления два поля пороля */
    const templateModalSuccessPassword = isShowModalReset && (
        <EmptyModal
            background="blue"
            closeModal={closeModalReset}
            btnCancelClick={() => setIsShowModalReset(false)}
            width={296}
            typeModal="withoutBack"
            close={() => setIsShowModalReset(false)}
        >
            <div className={classes.success_modal}>
                <h2 className={classes.success_modal_title}>{t("auth.login.perfect")}</h2>
                <p className={classes.success_modal_txt}>{t("auth.login.successPassword")}</p>
            </div>
        </EmptyModal>
    )

    const formatData = function (value) {
        let phone = values.phone.match(/\d/g)
        return {
            ...value,
            phone: phone ? `+${phone.join('')}` : ''
        }
    }

    /** Модалка отправки кода */
    const templateModalConfirmCode = isShowModalCode && (
        <EmptyModal
            background="blue"
            close={true}
            btnCancelClick={() => setIsShowModalCode(false)}
            width={420}
            typeModal="withoutBack"
        >

            <ModalConfirmSmsCode
                btnNextClick={sendCode}
                value={values}
                onChange={handleChange}
                timerCount={timerCount}
                setTimerCount={setTimerCount}
                phone={formatData(values).phone}
                errorCode={errorCode} setErrorCode={setErrorCode} />
        </EmptyModal>
    )


    async function Login() {
        let response;
        if (!isShowModalCode) {
            response = await dispatcher(sendSmsClient({ phone: formatData(values).phone }))
        }

        if (response) {
            if (response.errorCode === 'shortBan') {
                setErrorCode(response)
            }

            const time = new Date(new Date().getTime() / 1000 - response.nextAttemptAt).getTime()
            setTimerCount(time)
            setIsShowModalCode(true)
        }
    }

    async function sendCode(code) {
        const isAuth = await dispatcher(authClient(formatData({ phone: values.phone, code: code })))

        if (isAuth) {
            if (location.state) {
                navigate(location.state)
            } else {
                navigate("/personal-area/profile")
            }
        }
    }

    useEffect(() => {
        dispatcher(clearErrors())
    }, [])


    const authOnEnterHandler = (event)=>{
        if (event.key === "Enter") {
            event.preventDefault()
            Login()
        }
    }
    useEffect(() => {
        window.addEventListener("keydown", authOnEnterHandler)
        return ()=> {
            window.removeEventListener("keydown", authOnEnterHandler)
        }
    })

    const onChangePhone = (event) => {
        dispatcher(clearErrors())
        handleChange({ target: { name: "phone", value: event.target.value } })
    }

    return (
        <div className={classes.login_form}>
            <form>
                <h2 className={classes.login_form_title}>{t("auth.login.titleClient")}</h2>
                <div className={classes.login_form_subtitle}>
                    Для входа в кабинет <strong>партнера</strong>, перейдите, пожалуйста, по <NavLink to={'/auth/partner/login'}>ссылке</NavLink>
                </div>
                <Input
                    name="phone"
                    id="phone"
                    mask={"+7 (999) 999-99-99"}
                    className={classes.login_form_field}
                    value={values.phone}
                    onChange={(event) => onChangePhone(event)}
                    touched={!touched.phone}
                    valid={!errors.phone}
                    errorMessage={errors.phone}
                    required
                    shouldValidate
                    label={t("auth.login.phoneLabel")}
                    inputmode={`numeric`}
                ></Input>
                <p className={classes.login_form_register_txt}>
                    {t('auth.login.noAccount')}
                    <NavLink className={classes.login_form_register}
                        to="/auth/register"
                        state={location.state}
                    >{t("auth.login.signUp")}</NavLink>
                </p>
                <Button
                    className={[classes.button, "button_guest_b2c_authorization"].join(" ")}
                    id={"button_guest_b2c_authorization"}
                    btnColor="ButtonGreen"
                    typeButton={2}
                    type="button"
                    onClick={Login}
                >{t("auth.login.getCode")}</Button>
                {/*<p className={classes.login_form_register_txt}>*/}
                {/*    {t('auth.login.problems')}*/}
                {/*    <NavLink className={classes.login_form_register}*/}
                {/*             to="/terms"*/}
                {/*    >FAQ</NavLink>*/}
                {/*</p>*/}
            </form>
            {templateModal}
            {templateModalConfirmCode}
            {templateModalReset}
            {templateModalSuccessPassword}
        </div>
    )
}

export default LoginClient