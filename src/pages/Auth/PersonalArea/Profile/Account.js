import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import classes from "./Profile.module.scss";
import Button from "../../../../components/UI/btns/Button/Button";
import Input from "../../../../components/UI/areas/Input/Input";
import useToggleVisibility from "../../../../hooks/useToggleVisibility";
import EmptyModal from "../../../../components/UI/modals/EmptyModal/EmptyModal";
import TwoButtonModal from "../../../../components/UI/modals/TwoButtonModal/TwoButtonModal";
import ModalResetPassword from "../../../../components/UI/modals/ModalResetPassword/ModalResetPassword";
import ModalChangePassword from "../../../../components/UI/modals/ModalChangePassword/ModalChangePassword";
import ModalRecoveryPassword from "../../../../components/UI/modals/ModalRecoveryPassword/ModalRecoveryPassword";
import ModalConfirmSmsCode from "../../../../components/UI/modals/ModalConfirmSmsCode/ModalConfirmSmsCode";
import { useDispatch, useSelector } from "react-redux";
import { changeEmailPartnerSend, ClearFieldError, loginByCodePartner, logOutPartner, resetPasswordPartner } from "../../../../store/actions/authActions";
import { useLocation, useNavigate } from "react-router-dom";
import CustomTextArea from "../../../../components/UI/areas/CustomTextArea/CustomTextArea";
import { object, string } from "yup";
import { useFormik } from "formik";


export default function Account({ userInfo }) {
    const { t } = useTranslation()
    const [phone, setPhone] = useState('')
    const resetPassword = useSelector((state) => state.auth)
    const [isEmailDisable, setDisableEmail] = useState(true)
    const navigate = useNavigate()
    const location = useLocation()
    const [userEmail, setUserEmail] = useState(userInfo.email)
    const errors = useSelector(state => state.auth.errors)
    const [isShowDeleteModal, setIsShowDeleteModal, showDeleteModal] = useToggleVisibility(false)
    const [isShowDeleteSuccessModal, setIsShowDeleteSuccessModal, showDeleteSuccessModal] = useToggleVisibility(false)
    const userType = useSelector(state => state.auth.userInfo.user_type)
    const dispatcher = useDispatch()

    /** Схема валидации */
    const validationSchema = useMemo(
        () =>
            object().shape({
                email: string().required(),
            }),
        []
    );

    /** Стейт полей и правила */
    const {
        touched,
    } = useFormik({
        userEmail,
        validationSchema,
        enableReinitialize: true
    });

    /** Выход из всех учеток */
    const logOut = function () {
        dispatcher(logOutPartner())
        if (userType === 2) {
            navigate('/auth/partner/login', { state: `${location.pathname}${location.search}` })
        } else {
            navigate("/auth/login", { state: `${location.pathname}${location.search}` })
        }
    }

    const onDeleteAccount = function () {
        setIsShowDeleteModal(true)
    }

    const deleteAccount = function () {
        setIsShowDeleteModal(false)
        setIsShowDeleteSuccessModal(true)
    }

    useEffect(() => {
        if (resetPassword.recoveryToken) {
            setIsShowModalReset(true)
        }
    }, [])

    /** Модалка востановления пороля */
    const [isShowModal, setIsShowModal, closeModal] = useToggleVisibility(false)
    /** Модалка подтверждения кода */
    const [isShowModalCode, setIsShowModalCode, closeModalCode] = useToggleVisibility(false)
    /** Модалка подтверждения пароля */
    const [isShowModalReset, setIsShowModalReset, closeModalReset] = useToggleVisibility(false)
    /** Модалка успешного изменения пароля */
    const [isShowModalSuccessChange, setIsShowModalSuccessChange, closeModalSuccessSuccessChange] = useToggleVisibility()
    /** Модалка успешной отправки письма на почту */
    const [successSendMail,setSuccessSendMail,closeSuccessSendMail] = useToggleVisibility()
    const [timerCount, setTimerCount] = useState(120)

    /** Модалка успешного изменения пароля */
    const templateModalSuccessChange = isShowModalSuccessChange && (
        <EmptyModal
            background="blue"
            typeModal="withoutBack"
            close={() => setIsShowModalSuccessChange(false)}
            closeModal={closeModalSuccessSuccessChange}
            btnCancelClick={() => setIsShowModalSuccessChange(false)}
        >
            <h2 className={classes.account_modal_title}>{t("auth.login.perfect")}</h2>
            <p className={classes.account_modal_txt}>{t("auth.login.successPassword")}</p>
        </EmptyModal>
    )
    /** Модалка востановления пороля */
    const templateModal = isShowModal && (
        <EmptyModal
            background="blue"
            closeModal={closeModal}
            btnCancelClick={() => setIsShowModal(false)}
            width={420}
            typeModal="withoutBack"
            className={classes.modal}
        >
            <ModalRecoveryPassword
                setTimerCount={setTimerCount}
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
                btnNextClick={async (code) => {
                    const isAuth = await dispatcher(loginByCodePartner({ phone: phone, code: code }))
                    if (isAuth) {
                        setIsShowModalCode(false)
                        setIsShowModalReset(true)
                    }
                }}
            />
        </EmptyModal>
    )
    /** Модалка ввода нового пароля */
    const templateModalReset = isShowModalReset && (
        <EmptyModal
            background="blue"
            closeModal={closeModalReset}
            btnCancelClick={() => setIsShowModalReset(false)}
            width={300}
            typeModal="withoutBack"
            close={() => setIsShowModalReset(false)}
        >
            <ModalResetPassword btnNextClick={async (passwords) => {
                const isReset = dispatcher(resetPasswordPartner({
                    uuid: resetPassword.uuid,
                    recoveryToken: resetPassword.recoveryToken,
                    newPassword: passwords.password
                }))

                if (isReset) {
                    setIsShowModalReset(false)
                    setIsShowModalSuccessChange(true)
                }
            }} />
        </EmptyModal>
    )


    /** Модалка успешного изменения почты */
    const [isShowModalEmail, setShowModalEmail, closeModalEmail] = useToggleVisibility()
    const templateModalEmail = isShowModalEmail && (
        <EmptyModal
            background="blue"
            typeModal="withoutBack"
            width={346}
            close={() => setShowModalEmail(false)}
            closeModal={closeModalEmail}
            btnCancelClick={() => setShowModalEmail(false)}
        >
            <h2 className={classes.account_modal_title}>{t("auth.login.perfect")}</h2>
            <p className={classes.account_modal_txt}>{t("profile.successChangeEmail")}</p>
        </EmptyModal>
    )
    /** Функция смены почты */
    async function changeEmail() {
        const isChangeSeccsess = await dispatcher(changeEmailPartnerSend(userEmail))
        if (isChangeSeccsess) {
            setShowModalEmail(true)
        }
    }

    /** Модалка смены пороля */
    const [isShowModalPassword, setShowModalPassword, closeModalPassword] = useToggleVisibility()
    const templateModalPassword = isShowModalPassword &&
        <ModalChangePassword
            close={() => setShowModalPassword(false)}
            closeModal={closeModalPassword}
            setIsShow={(value) => setShowModalPassword(value)}
            forgotPassword={setIsShowModal}
            btnNextClick={() => setIsShowModalSuccessChange(true)}
        ></ModalChangePassword>

    const isUser = userType === 3
    const deletAccountModal = isShowDeleteModal && <TwoButtonModal
        title={'Удаление аккаунта'}
        btnCancelClick={() => setIsShowDeleteModal(false)}
        btnCancelText={t("profile.cancel")}
        btnNextClick={() => deleteAccount()}
        btnNextText={t(isUser ? "profile.delete" : 'profile.send')}
        width={isUser ? 948 : 504}
        background="blue"
        typeModal="withoutBack"
        isRedBtn={isUser}
        classNameButtonWrap={classes.delete_wrap}
    >

        {isUser ? <CustomTextArea
            className={classes.delete_textarea}
            classNameInputWrap={classes.delete_text}
            label={'Укажите причину удаления профиля'}
        /> : <p className={classes.delete_text}>Запрос на деактивацию аккаунта будет направлен администратору сервиса. С Вами свяжется менеджер CHECK in в ближайшее время для подтверждения.</p>}
    </TwoButtonModal>




    const deletAccountSuccessModal = isShowDeleteSuccessModal && <EmptyModal
        close={true}
        width={353}
        closeModal={showDeleteSuccessModal}
        btnCancelClick={() => setIsShowDeleteSuccessModal(false)}
        background="blue"
        typeModal="withoutBack"
    >
        {isUser ? <><h2 >Вы удалили аккаунт!</h2>
            <p className={classes.delete_text}>Нам очень жаль что Вы покинули нас, но если передумаете, мы будем Вас ждать.</p></>
            : <>
                <h2 >Запрос отправлен!</h2>
                <p className={classes.delete_text}>Наш менеджер свяжется с Вами в ближайшее время</p>
            </>}
    </EmptyModal>

    return (
        <div className={classes.account}>
            {deletAccountModal}
            {deletAccountSuccessModal}
            <div className={classes.account_top}>
                {userInfo.user_type == 2 ? <Button
                    btnColor="outline_blue"
                    typeButton={1}
                    onClick={() => setShowModalPassword(true)}
                    className={classes.account_buttons}
                >{t("auth.login.changePassword")}</Button> : <div></div>}
                <div className={classes.account_buttons_wrp}>
                    <Button
                        btnColor="outline_blue"
                        typeButton={1}
                        className={classes.account_buttons}
                        onClick={logOut}
                    >{t("profile.closeAllSessions")}</Button>
                    {/*<Button
                        btnColor="outline_red"
                        typeButton={1}
                        className={classes.account_buttons_red}
                        onClick={() => onDeleteAccount()}
                >{t("profile.deleteAccount")}</Button>*/}
                </div>
            </div>
            <div className={classes.account_email}>
                <Input
                    label={t("auth.register.email")}
                    typeClsInput="field"
                    className={classes.account_email_input}
                    disabled={isEmailDisable}
                    name="email"
                    value={userEmail}
                    shouldValidate={!isShowModal}
                    isSearchable={true}
                    touched={!touched.email}
                    valid={!errors.email}
                    errorMessage={errors.email}
                    required
                    onChange={(e) => {
                        setUserEmail(e.target.value)
                        dispatcher(ClearFieldError("email"))
                    }}
                >
                </Input>
                {userInfo.user_type == 2 && <div
                    onClick={() => { setDisableEmail(!isEmailDisable) }}
                    className={classes.account_email_change}
                >{t("profile.change")}
                </div>}
            </div>
            {userInfo.user_type == 2 && <div className={classes.account_bottom}>
                <Button
                    btnColor="green"
                    typeButton={1}
                    className={classes.account_save}
                    onClick={changeEmail}
                >{t("profile.save")}</Button>
            </div>}
            {templateModalEmail}
            {templateModalPassword}
            {templateModalReset}
            {templateModal}
            {templateModalConfirmCode}
            {templateModalSuccessChange}
            {templateSuccessModal}
        </div>
    )
}