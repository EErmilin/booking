import React, { useEffect, useMemo, useState } from 'react'
import classes from "./RegisterEasy.module.scss";
import { useTranslation } from "react-i18next";
import Input from "../../../../components/UI/areas/Input/Input";
import Button from "../../../../components/UI/btns/Button/Button";
import { NavLink, useNavigate } from "react-router-dom";
import CustomRadio from "../../../../components/UI/areas/CustomRadio/CustomRadio";
import useToggleVisibility from "../../../../hooks/useToggleVisibility";
import EmptyModal from "../../../../components/UI/modals/EmptyModal/EmptyModal";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { object, string, number, ref } from "yup";
import {
    checkEmail,
    ClearFieldError,
    registerPartner,
    setFieldError,
    simpleRegister
} from "../../../../store/actions/authActions";
import InputWithSelect from "../../../../components/UI/areas/InputWithSelect/InputWithSelect";
import Checkbox from "../../../../components/UI/areas/Checkbox/Checkbox";


function RegisterEasy({

}) {
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

    const { t } = useTranslation()
    const errors = useSelector(state => state.auth.errors)
    const isCheckEmail = useSelector(state => state.auth.isCheckEmail)
    const userInfo = useSelector(state => state.auth.userInfo)
    const [email, setEmail] = useState('')
    const [agreeToTermOfUse, setAgreeToTermOfUse] = useState(0)
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const dispatcher = useDispatch()
    const navigate = useNavigate()

    const register = () => {
        if (isCheckEmail) {
            dispatcher(simpleRegister(Object.assign(email, password, passwordConfirm, { agreeToTermOfUse: !!Number(agreeToTermOfUse) })))
        } else {
            dispatcher(checkEmail(email))
        }
    }
    const formEmail = <div className={classes.register_form}>
        <h2 className={classes.register_form_title}>{t("auth.register.title")}</h2>
        <Input
            name="email"
            shouldValidate
            touched={!touched.client_phone}
            label={'Адрес электронной почты'}
            valid={!errors.email}
            errorMessage={errors.email}
            placeholder={'Введите ваш e-mail'}
            onChange={(e) => {
                setEmail({ email: e.target.value })
            }}
        ></Input>
        <Button
            className={classes.btn}
            btnColor="ButtonGreen"
            typeButton={2}
            onClick={register}
        >Продолжить регистрацию</Button>
    </div>

    const formPassword = <div className={classes.register_form}>
        <h2 className={classes.register_form_title}>{t("auth.register.title")}</h2>
        <Input
            isShow={false}
        ></Input>
        <Input
            shouldValidate
            touched={!touched.password}
            valid={!errors.password}
            errorMessage={errors.password}
            label={'Придумайте пароль'}
            className={classes.register_form_password}
            onChange={(e) => {
                setPassword({ password: e.target.value })
            }}
            name="password"
            type="password"
        ></Input>
        <Input
            name="passwordConfirm"
            shouldValidate
            touched={!touched.passwordConfirm}
            valid={!errors.password}
            errorMessage={errors.passwordConfirm}
            label={'Повторите пароль'}
            onChange={(e) => {
                setPasswordConfirm({ passwordConfirm: e.target.value })
            }}
            type="password"
        ></Input>


        <div className={classes.checkbox_laout}>
            <Checkbox
                classNameLabel={classes.checkbox}
                shouldValidate
                name="agreeToTermOfUse"
                touched={!touched.agreeToTermOfUse}
                valid={!errors.agreeToTermOfUse}
                required
                checked={values.agreeToTermOfUse}
                text={(
                    <>
                        <span className={classes.checkbox_text}>Я принимаю условия
                            <a href={'http://cdn.checkin.uno/oferta.pdf'} className={classes.checkbox_link} target="_blank">Договора оферты</a> и соглашаюсь с<a href={'/policy'} className={classes.checkbox_link} target="_blank">Политикой конфиденциальности</a></span>
                    </>
                )}
                onChange={(e) => {
                    return setAgreeToTermOfUse(!agreeToTermOfUse)
                }}
            ></Checkbox>
        </div>
        {errors.agreeToPrivacyTerms && <p className={classes.error}>{errors.agreeToPrivacyTerms}</p>}
        <p className={classes.registerText}>Нажимая кнопку «Зарегистрироваться», я даю свое согласие на сбор и обработку моих персональных данных</p>
        <Button
            btnColor="ButtonGreen"
            typeButton={2}
            onClick={register}
        >Зарегистрироваться</Button>

    </div>
    let form = formPassword;
    useEffect(() => {
        userInfo.email && navigate('/personal-area/objects/1')
    }, [userInfo])

    useEffect(() => {
        if (isCheckEmail) {
            form = formPassword
        } else {
            form = formEmail
        }
    }, [isCheckEmail])

    return false ? formPassword : formEmail
}

export default RegisterEasy