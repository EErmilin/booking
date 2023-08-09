import React, { useEffect, useMemo, useState } from 'react'
import classes from "./Register.module.scss";
import { useTranslation } from "react-i18next";
import Input from "../../../../components/UI/areas/Input/Input";
import Button from "../../../../components/UI/btns/Button/Button";
import { NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import CustomRadio from "../../../../components/UI/areas/CustomRadio/CustomRadio";
import useToggleVisibility from "../../../../hooks/useToggleVisibility";
import EmptyModal from "../../../../components/UI/modals/EmptyModal/EmptyModal";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { object, string, number, ref, boolean } from "yup";
import { ClearFieldError, registerPartner, registerPartnerBySms, setFieldError } from "../../../../store/actions/authActions";
import Checkbox from "../../../../components/UI/areas/Checkbox/Checkbox";
import { clearErrors, createTravelLine } from "../../../../store/actions/partnerHotelsActions";
import Preloader from "../../../../components/Preloader/Preloader";
import ModalConfirmSmsCode from '../../../../components/UI/modals/ModalConfirmSmsCode/ModalConfirmSmsCode';
import { Helmet } from "react-helmet"
import HotelRequisites from '../../../Auth/PersonalArea/Requisites/HotelRequisites/HotelRequisites';

function Register({

}) {
    const { t } = useTranslation()
    const errors = useSelector(state => state.auth.errors)
    const navigate = useNavigate()
    const dispatcher = useDispatch()
    const [errorTravel, setErrorTravel] = useState()
    const [isShowRequisites, setIsShowRequisites] = useState(false)
    const [hotelId, setHotelId] = useState(false)
    const [isShowModalCode, setIsShowModalCode, closeModalCode] = useToggleVisibility()
    const [searchParams, setSearchParams] = useSearchParams();
    const isTrevelline = searchParams.get("fromTravelLine") === '1';
    /** Получием гет параметры для TravelLine */
    const location = useLocation()
    let query = location.search.slice(1)
        .split('&')
        .map((elem) => ({ [elem.split('=')[0]]: elem.split('=')[1] }))
        .reduce((result, item) => {
            let key = Object.keys(item)[0]; //first property: a, b, c
            result[key] = item[key];
            return result;
        }, {})
    useEffect(() => {
        dispatcher(clearErrors())
    }, [])

    const [errorCode, setErrorCode] = useState(null)
    const [timerCount, setTimerCount] = useState(120)

    /** Модалка успешной регистрации */
    const [isShowModal, setIsShowModal, closeModal] = useToggleVisibility(false)
    /** Модалка тревел лайна */
    const [isShowModalTravel, setIsShowModalTravel, closeModalTravel] = useToggleVisibility(false)
    /** Модалка тревел лайна error */
    const [isShowModalTravelError, setIsShowModalTravelError, closeModalTravelError] = useToggleVisibility(false)

    /** Модалка об успешной регистрации партнера */
    const templateModalSuccessPassword = isShowModal && (
        <EmptyModal
            id={'popup_partner_b2b_registration'}
            className={"popup_partner_b2b_registration"}
            background="blue"
            closeModal={(event) => {
                navigate("/")
                closeModal(event)
            }}
            btnCancelClick={() => setIsShowModal(false)}
            width={296}
            typeModal="withoutBack"
            close={() => setIsShowModal(false)}
        >
            <div className={classes.success_modal}>
                <h2 className={classes.success_modal_title}>{t("auth.login.perfect")}</h2>
                <p className={classes.success_modal_txt}>{t("auth.register.successRegister")}</p>
            </div>
        </EmptyModal>
    )

    /** Модалка востановления два поля пороля */
    const templateModalTravel = isShowModalTravel && (
        <EmptyModal
            background="blue"
            closeModal={(event) => {
                closeModalTravel(event)
            }}
            btnCancelClick={() => setIsShowModalTravel(false)}
            width={296}
            typeModal="withoutBack"
        >
            <div className={classes.success_modal}>
                <h2 className={classes.success_modal_title2}>Подождите</h2>
                <p className={classes.success_modal_txt2}>Идет регистрация в TravelLine</p>
                <Preloader></Preloader>
            </div>
        </EmptyModal>
    )
    /** Модалка востановления два поля пороля */
    const templateModalTravelError = isShowModalTravelError && (
        <EmptyModal
            background="blue"
            closeModal={(event) => {
                navigate("/")
                closeModalTravelError(event)
            }}
            btnCancelClick={() => setIsShowModalTravelError(false)}
            width={296}
            typeModal="withoutBack"
        >
            <div className={classes.success_modal}>
                <p className={classes.success_modal_txt2}>Возникла ошибка при добавлении объекта из Travelline. Пожалуйста, добавьте объект позднее из личного кабинета.</p>
            </div>
        </EmptyModal>
    )

    /** Начальные значения */
    const initialValues = {
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        company_type: "",
        company_name: "",
        inn: "",
        kpp: "",
        password: "",
        passwordConfirm: "",
        agreeToTermOfUse: false,
        ...query
    };
    /** Схема валидации */
    const validationSchema = useMemo(
        () =>
            object().shape({
                first_name: string().required(),
                last_name: string().required(),
                phone: string().required(),
                company_type: string().required(),
                company_name: string().required(),
                inn: number().required(),
                kpp: number().required(),
                password: string().required(),
                passwordConfirm: string().required(),
                email: string().required(),
                agreeToTermOfUse: boolean().required(),
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
        if (values.password !== values.passwordConfirm) {
            dispatcher(setFieldError({ field: "passwordConfirm", message: t("validation.confirmPassword") }))
            dispatcher(setFieldError({ field: "password", message: t("validation.confirmPassword") }))
        } else {
            dispatcher(ClearFieldError("passwordConfirm"))
            dispatcher(ClearFieldError("password"))
        }
    }, [values.passwordConfirm])

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
            phone: phone ? `+${phone.join('')}` : '',
            company_name: [1, 2].includes(value.company_type) ? value.company_name : ''
        }
    }
    const registerTravelLine = async (isAuth) => {
        setIsShowModalTravel(true)
        let response = await dispatcher(createTravelLine({ ...query, propertyId: values.propertyId, token: isAuth.token, uuid: isAuth.uuid, fromAccount: 0 }))
        setIsShowModalTravel(false)
        if (!response.status) {
            setIsShowModalTravelError(true)
        } else {
            setHotelId(response.data.id)
            setIsShowRequisites(true)
        }

    }
    async function register() {
        if (!isPhoneValid) return;
        if (query.fromTravelLine) if (!values.propertyId) return setErrorTravel('Введите ID объекта из TravelLine')
        let response = await dispatcher(registerPartner(formatData(values)))
        if (response) {
            if (response.errorCode === 'shortBan') {
                setErrorCode(response)
            }
            const time = new Date(new Date().getTime() / 1000 - response.nextAttemptAt).getTime()
            setTimerCount(time)
            setIsShowModalCode(true)
        }
    }

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
        const response = await dispatcher(registerPartner(formatData(values)))
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
                    let isAuth = await dispatcher(registerPartnerBySms(formatData(values)))
                    if (isAuth) {
                        setIsShowModalCode(false)
                        if (query && isTrevelline) await registerTravelLine(isAuth)
                        // dispatcher(createTravelLine({...query,propertyId:values.propertyId,token:isAuth.token,uuid:isAuth.uuid}))
                        else setIsShowModal(true)
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
                <title>Check in: Регистрация партнера</title>
            </Helmet>
        )
    }

    const save = () => {
        setIsShowRequisites(false)
        setIsShowModal(true)
    }


    if (isShowRequisites) {
        return <div className={classes.register_form}>
            <div>
                <div className={classes.register_form_step_wrp}>
                    <h2 className={classes.register_form_title}>Регистрация объекта ID {hotelId}</h2>
                    <div className={classes.register_form_step}>Шаг: 2 из 2</div>
                </div>
                <HotelRequisites isTl={true} isRegister={true} save={save} hotelId={hotelId}/>
            </div>
        </div>
    }

    return (
        <div className={classes.register_form}>
            {getMetaTags()}
            <form>
                <h2 className={classes.register_form_title}>{t("auth.register.title")}</h2>
                {query.fromTravelLine ?
                    <h2 className={classes.register_form_title_travelLine}>Вы перешли из TravelLine. Введите ID объекта из системы TravelLine.</h2> :
                    ""
                }
                {query.fromTravelLine ?
                    <>
                        <div className={classes.register_form_step_wrp}>
                            <div className={classes.register_form_step}>Шаг: 1 из 2</div>
                        </div>

                        <div className={classes.register_form_field_flex}>
                            <Input
                                label={"ID объекта из системы TravelLine"}
                                typeClsInput="field"
                                name="propertyId"
                                shouldValidate
                                isSearchable={true}
                                type={"number"}
                                touched={true}
                                valid={false}
                                errorMessage={errorTravel}
                                required
                                value={values.propertyId}
                                onChange={(e) => {
                                    return ClearErrorAndChange("propertyId", e.target.value)
                                }}
                            ></Input>
                        </div> </> : ""}
                <div className={classes.register_form_field_flex}>
                    <Input
                        label={t("auth.register.name")}
                        typeClsInput="field"
                        name="first_name"
                        shouldValidate
                        isSearchable={true}
                        touched={!touched.first_name}
                        valid={!errors.first_name}
                        errorMessage={errors.first_name}
                        required
                        value={values.first_name}
                        onChange={(e) => {
                            return ClearErrorAndChange("first_name", e.target.value)
                        }}
                    ></Input>
                    <Input
                        typeClsInput="field"
                        label={t("auth.register.pastName")}
                        name="last_name"
                        shouldValidate
                        touched={!touched.last_name}
                        valid={!errors.last_name}
                        errorMessage={errors.last_name}
                        required
                        value={values.last_name}
                        onChange={(e) => {
                            return ClearErrorAndChange("last_name", e.target.value)
                        }}
                    ></Input>
                </div>
                <div className={classes.register_form_field_flex}>
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
                <div className={classes.register_form_field_flex}>
                    <Input
                        label={t("auth.register.password")}
                        typeClsInput="field"
                        type="password"
                        name="password"
                        shouldValidate
                        touched={!touched.password}
                        valid={!errors.password}
                        errorMessage={errors.password}
                        required
                        value={values.password}
                        onChange={(e) => {
                            return ClearErrorAndChange("password", e.target.value)
                        }}
                    ></Input>
                    <Input
                        typeClsInput="field"
                        type="password"
                        label={t("auth.register.passwordConfirm")}
                        name="passwordConfirm"
                        shouldValidate
                        touched={!touched.passwordConfirm}
                        valid={!errors.password || !errors.passwordConfirm}
                        errorMessage={errors.passwordConfirm}
                        required
                        value={values.passwordConfirm}
                        onChange={(e) => {
                            return ClearErrorAndChange("passwordConfirm", e.target.value)
                        }}
                    ></Input>
                </div>
                <div className={classes.register_form_trouble}>
                    <h4 className={classes.register_form_trouble_title}>
                        {t("auth.register.trouble.title")}
                    </h4>
                    <p className={classes.register_form_trouble_subtitle}>
                        {t("auth.register.trouble.subTitle")}
                    </p>
                    <p className={classes.register_form_trouble_email}>{t("auth.register.trouble.writeOnEmail")}</p>
                    <a className={classes.register_form_trouble_email_link} href="mailto:support@checkin.ru">support@checkin.ru</a>
                </div>
                <Checkbox
                    className={classes.register_form_checkbox}
                    shouldValidate
                    name="agreeToTermOfUse"
                    touched={!touched.agreeToTermOfUse}
                    valid={!errors.agreeToTermOfUse}
                    required
                    checked={values.agreeToTermOfUse}
                    text={(
                        <>
                            <span className={classes.register_form_text}>Я принимаю условия
                                <a href={'http://cdn.checkin.uno/oferta.pdf'} className={classes.register_form_link} target="_blank">Договора оферты</a> и соглашаюсь с<a href={'/policy'} className={classes.register_form_link} target="_blank">Политикой конфиденциальности</a></span>
                        </>
                    )}
                    onChange={(e) => {
                        return ClearErrorAndChange("agreeToTermOfUse", e.target.checked)
                    }}
                ></Checkbox>
                <Button
                    id={"button_partner_b2b_registration"}
                    className={[classes.register_form_btn, "button_partner_b2b_registration"].join(" ")}
                    btnColor="ButtonGreen"
                    typeButton={2}
                    type="button"
                    onClick={register}
                >{t("auth.register.register")}</Button>
                <div className={classes.register_form_processing}>
                    <p>Нажимая кнопку «Зарегистрироваться», я даю свое согласие на сбор и обработку моих </p>
                    <p>персональных данных в соответствии с
                        <NavLink
                            className={classes.register_form_sign_in_link}
                            to="/policy"
                            target="_blank"
                        >{'Политикой конфиденциальности'}</NavLink>
                        {' и принимаю условия'}</p>
                    <NavLink
                        target="_blank"
                        className={classes.register_form_sign_in_link}
                        to="/user-term-of-use"
                    >{'Пользовательского соглашения'}</NavLink>
                </div>
                <p className={classes.register_form_sign_in}>
                    {t("auth.register.alreadyHaveAcc")}
                    <NavLink
                        className={classes.register_form_sign_in_link}
                        to="/auth/partner/login"
                    >{t("auth.register.signIn")}</NavLink>
                </p>
            </form>
            {templateModalSuccessPassword}
            {templateModalTravel}
            {templateModalTravelError}
            {templateModalConfirmCode}
        </div>
    )
}

export default Register