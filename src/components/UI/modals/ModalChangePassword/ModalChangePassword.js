import React, { useEffect, useMemo } from "react"
import classes from "./ModalChangePassword.module.scss";
import TwoButtonModal from "../TwoButtonModal/TwoButtonModal";
import { useTranslation } from "react-i18next";
import Input from "../../areas/Input/Input";
import { object, string } from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { changeUserPassword, ClearFieldError, setFieldError } from "../../../../store/actions/authActions";
import { clearErrors } from "../../../../store/actions/partnerHotelsActions";


function ModalChangePassword({
    closeModal,
    close,
    setIsShow,
    forgotPassword,
    btnNextClick
}) {
    const { t } = useTranslation()
    const errors = useSelector(state => state.auth.errors)
    const dispatcher = useDispatch()

    useEffect(() => {
        dispatcher(clearErrors())
    }, [])



    /** Начальные значения */
    const initialValues = {
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    };
    /** Схема валидации */
    const validationSchema = useMemo(
        () =>
            object().shape({
                oldPassword: string().required(),
                newPassword: string().required(),
                confirmNewPassword: string().required(),
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
    });



    // /** Проверяем совпадают ли пароли */
    // useEffect(()=>{
    //     if(values.newPassword !== values.confirmNewPassword){
    //         dispatcher(setFieldError({field:"confirmNewPassword",message:t("validation.confirmPassword")}))
    //         dispatcher(setFieldError({field:"newPassword",message:t("validation.confirmPassword")}))
    //     }else{
    //         dispatcher(ClearFieldError("confirmNewPassword"))
    //         dispatcher(ClearFieldError("newPassword"))
    //     }
    // },[values.confirmNewPassword])

    /** Очищаем ошибки и изменяем состояние */
    function ClearErrorAndChange(field, value) {
        if (errors[field]) {
            dispatcher(ClearFieldError(field))
        }
        handleChange({ target: { name: field, value: value } })
    }

    async function submitNewPassword() {
        let changePassword = await dispatcher(changeUserPassword(values))
        if (changePassword) {
            setIsShow(false)
            btnNextClick()
        }
    }
    return (

        <TwoButtonModal
            closeModal={closeModal}
            close={close}
            btnCancelClick={() => setIsShow(false)}
            btnCancelText={t("profile.cancel")}
            btnNextText={t("profile.save")}
            btnNextClick={submitNewPassword}
            width={300}
            background="blue"
            typeModal="withoutBack"
            classNameButtonWrap={classes.change_password_buttons}
        >
            <h2 className={classes.change_password_title}>{t("auth.login.resetPasswordTitle")}</h2>
            <Input
                name="oldPassword"
                typeClsInput="field"
                className={classes.change_password_input}
                label={t("profile.changePassword.oldPassword")}
                type="password"
                shouldValidate
                touched={!touched.oldPassword}
                valid={!errors.oldPassword}
                errorMessage={errors.oldPassword}
                required
                value={values.oldPassword}
                onChange={(e) => {
                    return ClearErrorAndChange("oldPassword", e.target.value)
                }}
            ></Input>
            <Input
                name="newPassword"
                typeClsInput="field"
                className={classes.change_password_input}
                label={t("profile.changePassword.newPassword")}
                type="password"
                shouldValidate
                touched={!touched.newPassword}
                valid={!errors.newPassword}
                errorMessage={errors.newPassword}
                required
                value={values.newPassword}
                onChange={(e) => {
                    return ClearErrorAndChange("newPassword", e.target.value)
                }}
            ></Input>
            <Input
                name="confirmNewPassword"
                typeClsInput="field"
                className={classes.change_password_input}
                label={t("profile.changePassword.confirmNewPassword")}
                type="password"
                shouldValidate
                touched={!touched.confirmNewPassword}
                valid={!errors.confirmNewPassword}
                errorMessage={errors.confirmNewPassword}
                required
                value={values.confirmNewPassword}
                onChange={(e) => {
                    return ClearErrorAndChange("confirmNewPassword", e.target.value)
                }}
            ></Input>
            <p
                className={classes.change_password_forgot_password}
                onClick={() => {
                    forgotPassword(true)
                    setIsShow(false)
                }}
            >{t("auth.login.forgotPassword")}</p>
        </TwoButtonModal>
    )
}


export default ModalChangePassword


