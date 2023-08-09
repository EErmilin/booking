import React, { useMemo, useEffect } from "react"
import classes from "./RecoveryPartnerPassword.module.scss"
import {useTranslation} from "react-i18next";
import Input from "../../../../components/UI/areas/Input/Input";
import Button from "../../../../components/UI/btns/Button/Button";
import {object, string} from "yup";
import {useFormik} from "formik";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {logOutPartner, resetPasswordPartner} from "../../../../store/actions/authActions";
import {clearErrors} from "../../../../store/actions/partnerHotelsActions";
import EmptyModal from "../../../../components/UI/modals/EmptyModal/EmptyModal";
import useToggleVisibility from "../../../../hooks/useToggleVisibility";


function RecoveryPartnerPassword(){
    const {t} = useTranslation()
    const errors = useSelector(state => state.auth.errors)
    const dispatcher = useDispatch()
    const [searchParams,setSearchParams] = useSearchParams()
    const [modalRecoveryTokenError,setModalRecoveryTokenError,closeModalRecoveryTokenError] = useToggleVisibility()
    const navigate = useNavigate()
    /** Начальные значения */
    const initialValues = {
            newPassword: '',
            confirmNewPassword: "",
            uuid:searchParams.get("uuid"),
            recoveryToken:searchParams.get("recoveryToken")
        };
    /** Схема валидации */
    const validationSchema = useMemo(
        () =>
            object().shape({
                newPassword: string().required(),
                confirmNewPassword: string().required(),
            }),
        []
    );

    useEffect(() => {
        dispatcher(logOutPartner())
        dispatcher(clearErrors())
    }, [])

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

    async function resetPassword(){
        const isAuth = await dispatcher(resetPasswordPartner(values))

        if (!isAuth) {
            dispatcher(clearErrors())
            navigate("/auth/partner/login")
        }
    }

    /** Модалка протухшего токена */
    const templateTokenError = modalRecoveryTokenError && (
        <EmptyModal
            background="blue"
            close={true}
            closeModal={(event)=>{
                closeModalRecoveryTokenError(event)
                navigate(`/auth/partner/login`)
            }}
            btnCancelClick={() => {
                setModalRecoveryTokenError(false)
                navigate(`/auth/partner/login`)
            }}
            width={400}
            typeModal="withoutBack"
        >
            <h2 className={classes.success_modal_title}>Данная ссылка устарела или недействительна</h2>
        </EmptyModal>
    )

    useEffect(()=>{
        if(errors.recoveryToken){
            setModalRecoveryTokenError(true)
        }
    },[errors])
    return (
        <div className={classes.wrap}>
            <div className={classes.reset_password}>
                <h2 className={classes.reset_password_title}>
                    {t("auth.login.resetPasswordTitle")}
                </h2>
                <div className={classes.reset_password_wrp}>
                    <Input
                        name="newPassword"
                        typeClsInput="field"
                        className={classes.reset_password_input}
                        label={t("auth.login.newPassword")}
                        type="password"
                        value={values.newPassword}
                        onChange={(event)=>handleChange({ target: { name: "newPassword", value: event.target.value } })}
                        errorMessage={errors.newPassword}
                        touched={!touched.newPassword}
                        valid={!errors.newPassword}
                        required
                        shouldValidate
                    ></Input>
                    <Input
                        typeClsInput="field"
                        className={classes.reset_password_input}
                        label={t("auth.login.newPassword")}
                        type="password"
                        name="confirmNewPassword"
                        value={values.confirmNewPassword}
                        onChange={(event)=>handleChange({ target: { name: "confirmNewPassword", value: event.target.value } })}
                        errorMessage={errors.confirmNewPassword}
                        touched={!touched.confirmNewPassword}
                        valid={!errors.confirmNewPassword}
                        required
                        shouldValidate
                    ></Input>
                </div>
                <Button
                    name="passwordConfirm"
                    btnColor="ButtonGreen"
                    typeButton={2}
                    className={classes.reset_password_btn}
                    onClick={resetPassword}
                >{t("auth.login.changePassword")}</Button>
            </div>
            {templateTokenError}
        </div>
    )
}

export default RecoveryPartnerPassword