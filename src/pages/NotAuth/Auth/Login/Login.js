import React, {useCallback, useEffect, useMemo, useState} from "react";
import classes from "./Login.module.scss";
import { useTranslation } from "react-i18next";
import Input from "../../../../components/UI/areas/Input/Input";
import Button from "../../../../components/UI/btns/Button/Button";
import { useFormik } from "formik";
import { object, string } from "yup";
import { NavLink, useNavigate } from "react-router-dom";
import useToggleVisibility from "../../../../hooks/useToggleVisibility";
import EmptyModal from "../../../../components/UI/modals/EmptyModal/EmptyModal";
import ModalRecoveryPassword from "../../../../components/UI/modals/ModalRecoveryPassword/ModalRecoveryPassword";
import ModalConfirmSmsCode from "../../../../components/UI/modals/ModalConfirmSmsCode/ModalConfirmSmsCode";
import ModalResetPassword from "../../../../components/UI/modals/ModalResetPassword/ModalResetPassword";
import { useDispatch, useSelector } from "react-redux";
import { authClient, authPartner, loginByCodePartner, logOutPartner } from "../../../../store/actions/authActions";
import { clearErrors } from "../../../../store/actions/partnerHotelsActions";


function Login({ }) {
    const [phone, setPhone] = useState('')
    const navigate = useNavigate()

    const { t } = useTranslation()
    const errors = useSelector(state => state.auth.errors)
    const dispatcher = useDispatch()
    const isAuth = useSelector(state => state.auth.isAuth)
    /** Модалка востановления пороля */
    const [isShowModal, setIsShowModal, closeModal] = useToggleVisibility()
    /** Модалка подтверждения кода */
    const [isShowModalCode, setIsShowModalCode, closeModalCode] = useToggleVisibility()
    /** Модалка подтверждения пароля */
    const [isShowModalReset, setIsShowModalReset, closeModalReset] = useToggleVisibility()
    /** Модалка успешной отправки письма на почту */
    const [successSendMail,setSuccessSendMail,closeSuccessSendMail] = useToggleVisibility()


    /** Начальные значения */
    const initialValues = {
        email: '',
        password: "",
    };
    /** Схема валидации */
    const validationSchema = useMemo(
        () =>
            object().shape({
                email: string().required(),
                password: string().required(),
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

    const [errorCode, setErrorCode] = useState(null)
    const [timerCount, setTimerCount] = useState(120)

    /** Модалка востановления пороля */
    const templateModal = isShowModal && (
        <EmptyModal
            background="blue"
            closeModal={closeModal}
            btnCancelClick={() => setIsShowModal(false)}
            width={420}
            typeModal="withoutBack"
            className={classes.login_form_modal}
        >
            <ModalRecoveryPassword
                setErrorCode={setErrorCode}
                closeModal={() => setIsShowModal(false)}
                openNextModal={(type, value) => {
                    if (type === "phone") {
                        setPhone(value)
                        setIsShowModalCode(true)
                    } else {
                        setSuccessSendMail(true)
                    }
                }}
            ></ModalRecoveryPassword>
        </EmptyModal>
    )
    /** Модалка успешной отправки письма */
    const templateSuccessModal = successSendMail && (
        <EmptyModal
            background="blue"
            close={true}
            closeModal={closeSuccessSendMail}
            btnCancelClick={() => setSuccessSendMail(false)}
            width={296}
            typeModal="withoutBack"
        >
            <h2 className={classes.success_modal_title}>Отлично!</h2>
            <p className={classes.success_modal_txt}>Вам на почту отправлено письмо с ссылкой для восстановления пароля</p>
        </EmptyModal>
    )
    /** Модалка востановления пороля */
    const templateModalConfirmCode = isShowModalCode && (
        <EmptyModal
            background="blue"
            close={true}
            btnCancelClick={() => setIsShowModalCode(false)}
            width={420}
            typeModal="withoutBack"
        >
            <ModalConfirmSmsCode
                phone={phone}
                timerCount={timerCount}
                setTimerCount={setTimerCount}
                errorCode={errorCode} setErrorCode={setErrorCode}
                btnNextClick={async (code) => {
                    const isAuth = await dispatcher(loginByCodePartner({ phone: phone, code: code }))
                    if (isAuth) {
                        navigate('/personal-area/profile')
                    }
                }}
            />
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

    useEffect(() => {
        dispatcher(clearErrors())
    }, [])

    useEffect(() => {
        dispatcher(clearErrors())
    }, [isShowModal])

    const Login = async ()=>{
        dispatcher(logOutPartner())
        const isAuth = await dispatcher(authPartner(values))
        if (isAuth) {
            navigate("/personal-area/objects/1")
        }
    }

    const authOnEnterHandler = (event)=>{
        if (event.key === "Enter" && !isAuth) {
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
    return (
        <div className={classes.login_form}>
            <form>
                <h2 className={classes.login_form_title}>{t("auth.login.title")}</h2>
                <Input
                    name="email"
                    id="email"
                    className={classes.login_form_field}
                    value={values.email}
                    onChange={(event) => handleChange({ target: { name: "email", value: event.target.value } })}
                    touched={!touched.email}
                    valid={!errors.email}
                    errorMessage={errors.email}
                    required
                    shouldValidate={!isShowModal}
                    label={t("auth.login.email")}
                ></Input>
                <Input
                    name="password"
                    id="password"
                    className={classes.login_form_field}
                    value={values.password}
                    onChange={(event) => handleChange({ target: { name: "password", value: event.target.value } })}
                    touched={!touched.password}
                    valid={!errors.password}
                    errorMessage={errors.password}
                    required
                    shouldValidate
                    label={t("auth.login.password")}
                    type="password"
                ></Input>
                <p
                    className={[classes.login_form_recovery, classes.login_form_register].join(' ')}
                    onClick={() => setIsShowModal(true)}
                >{t("auth.login.forgotPassword")}</p>
                <Button
                    className={classes.button}
                    btnColor="ButtonGreen"
                    typeButton={2}
                    type="button"
                    onClick={Login}
                >{t("auth.login.signIn")}</Button>
                <p className={classes.login_form_register_txt}>
                    {t('auth.login.noAccount')}
                    <NavLink className={classes.login_form_register}
                        to="/auth/partner/register"
                    >{t("auth.login.signUp")}</NavLink>
                </p>
            </form>
            {templateModal}
            {templateModalConfirmCode}
            {templateModalReset}
            {templateSuccessModal}
        </div>
    )
}

export default Login