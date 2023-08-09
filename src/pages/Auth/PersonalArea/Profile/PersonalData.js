import React, { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import classes from "./Profile.module.scss";
import ChangeAvatar from "../../../../components/ChangeAvatar/ChangeAvatar";
import Input from "../../../../components/UI/areas/Input/Input";
import CustomRadio from "../../../../components/UI/areas/CustomRadio/CustomRadio";
import CustomDatePicker from "../../../../components/UI/areas/CustomDatePicker/CustomDatePicker";
import CustomSelect from "../../../../components/UI/areas/CustomeSelect/CustomSelect";
import Button from "../../../../components/UI/btns/Button/Button";
import { number, object, string } from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { changeClientInfo, changeEmailPartnerConfirm, changeUserInfo, ClearFieldError, authSuccess, getInfo } from "../../../../store/actions/authActions";
import moment from "moment";
import useToggleVisibility from "../../../../hooks/useToggleVisibility";
import EmptyModal from "../../../../components/UI/modals/EmptyModal/EmptyModal";
import Checkbox from "../../../../components/UI/areas/Checkbox/Checkbox";
import { useNavigate, useSearchParams } from "react-router-dom";
import {getCountUnreadNotifications} from "../../../../store/actions/notificationActions";

export default function PersonalData({ }) {
    const userRoles = useSelector(state => state.auth.userInfo.user_type)
    const userInfo = useSelector(state => state.auth.userInfo)
    const errors = useSelector(state => state.auth.errors)
    const [modalSuccess, setModal, closeModal] = useToggleVisibility()
    const [isChangeEmailSeccsessModal, setIsChangeEmailSeccsessModal] = useToggleVisibility(false)
    const dispatcher = useDispatch()
    const [searchParams, setSearchParams] = useSearchParams();


    const { t } = useTranslation()
    const navigate = useNavigate()
    /** Массив для радио пола */
    const listRadio = [
        {
            text: t("profile.sex.man"),
            value: 1
        },
        {
            text: t("profile.sex.woman"),
            value: 2
        }
    ]
    /** Массив для правового типа организации */
    const radioTemplate = [
        {
            text: t("auth.register.typeOrg.entity"),
            value: 1
        },
        {
            text: t("auth.register.typeOrg.individualEntrepreneur"),
            value: 2
        },
        {
            text: t("auth.register.typeOrg.selfEmployed"),
            value: 3
        }
    ]

    const optionNationality = [
        {
            label: "Россия",
            value: "RU"
        },
    ]
    const initialValues = useMemo(() => ({
        ...userInfo,
        isSubscribe: userInfo.sailplay?.subscriptions?.find(elem => elem === "email_all")
    }), [userInfo])


    const changeEmailSeccsessModal = isChangeEmailSeccsessModal &&
        <EmptyModal
            className={classes.modal_success}
            close={true}
            btnCancelClick={() => {
                navigate('/personal-area/profile');
                setIsChangeEmailSeccsessModal(false)
            }}
            typeModal={"withoutBack"}
            background="blue"
            width={375}>
            <h1>Отлично!</h1>
            <p>Ваша e-mail успешно изменен</p>
        </EmptyModal>

    /** Запрос на смену почты */
    async function changeEmail() {
        const userData = {
            email: searchParams.get("email"),
            uuid: searchParams.get("uuid"),
            token: searchParams.get("token"),
        }
        const isChanged = await dispatcher(changeEmailPartnerConfirm(userData))
        if (isChanged) {
            setIsChangeEmailSeccsessModal(true)
            dispatcher(authSuccess(isChanged))
            dispatcher(getInfo())
            dispatcher(getCountUnreadNotifications())
        }
    }

    useEffect(() => {
        if (searchParams.get("email")) {
            changeEmail()
        }
    }, [])

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

        },
        enableReinitialize: true
    });
    /** Очищаем ошибки и изменяем состояние */
    function ClearErrorAndChange(field, value) {
        if (errors[field]) {
            dispatcher(ClearFieldError(field))
        }
        handleChange({ target: { name: field, value: value } })
    }
    const formatData = function (value) {
        let phone = value.phone ? value.phone.match(/\d/g) : null
        return {
            ...value,
            phone: phone ? `+${phone.join('')}` : '',
            sailplay: (values.isSubscribe === "email_all" || values.isSubscribe === true) ? { subscriptions: ["email_all"] } : { unsubscriptions: ["email_all"] }
        }
    }

    async function changeUserData() {
        if (!values.country) {
            values.country = "Не указано"
        }
        if (userRoles == 2) {
            let isAuth = await dispatcher(changeUserInfo(formatData(values)))
            if (isAuth) {
                setModal(true)
            }
        } else {
            let isAuth = await dispatcher(changeClientInfo(formatData(values)))
            if (isAuth) {
                setModal(true)
            }
        }

    }

    const successModal = modalSuccess && <EmptyModal
        close={true}
        closeModal={closeModal}
        background="blue"
        btnCancelClick={() => setModal(false)}
        width={420}
        typeModal="withoutBack"
    >
        <h3>{t("support.excellent")}!</h3>
        {t("auth.changeSuccess")}
    </EmptyModal>

    /** Max Date of birth - 15 years ago and earlier */
    const currentDate = new Date();
    const maxBirthDate = currentDate.setDate(currentDate.getDate() - (15 * 365));

    return (
        <div className={classes.personal_data}>
            <ChangeAvatar
                avatar={userInfo.avatar ? userInfo.avatar : ""}
                userRole={userRoles}
            ></ChangeAvatar>
            <form className={classes.personal_data_form}>
                <div className={classes.personal_data_field}>
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
                </div>
                <div className={classes.personal_data_field}>
                    <Input
                        label={t("auth.register.pastName")}
                        typeClsInput="field"
                        name="last_name"
                        shouldValidate
                        isSearchable={true}
                        touched={!touched.last_name}
                        valid={!errors.last_name}
                        errorMessage={errors.last_name}
                        value={values.last_name}
                        onChange={(e) => {
                            return ClearErrorAndChange("last_name", e.target.value)
                        }}
                    ></Input>
                </div>
                {userRoles == 2 && (<div className={classes.personal_data_field}>
                    <Input
                        label={t("auth.register.middleName")}
                        typeClsInput="field"
                        name="middle_name"
                        shouldValidate
                        value={values.middle_name}
                        onChange={(e) => {
                            return ClearErrorAndChange("middle_name", e.target.value)
                        }}
                    ></Input>
                </div>)}
                {userRoles == 2 && (<div className={classes.personal_data_field}>
                    <Input
                        label={t("auth.register.email")}
                        typeClsInput="field"
                        name="email"
                        shouldValidate
                        isSearchable={true}
                        touched={!touched.email}
                        valid={!errors.email}
                        errorMessage={errors.email}
                        required
                        value={values.email}
                        onChange={(e) => {
                            // return ClearErrorAndChange("first_name",e.target.value)
                        }}
                        disabled={true}
                    ></Input>
                </div>)}
                <div className={classes.personal_data_field}>
                    <Input
                        label={t("auth.register.phone")}
                        typeClsInput="field"
                        name="phone"
                        disabled={userRoles == 3 ? true : false}
                        shouldValidate
                        isSearchable={true}
                        touched={!touched.phone}
                        valid={!errors.phone}
                        errorMessage={errors.phone}
                        required
                        value={values.phone}
                        onChange={(e) => {
                            return ClearErrorAndChange("phone", e.target.value)
                        }}
                        mask="+7 (999) 999-99-99"
                    ></Input>
                </div>
                <div className={classes.personal_data_field}>
                    <CustomDatePicker
                        required
                        name={"dob"}
                        value={values.dob ? new Date(values.dob) : values.dob}
                        onChange={(value) => {
                            handleChange({
                                target: { name: "dob", value: (moment(value).format("yyyy-MM-DD")) }
                            })
                        }}
                        // onFocus={e => e.target.blur()}
                        // onClick={(e) => e.preventDefault()}
                        mask={[/\d/, /\d/, ".", /\d/, /\d/, ".", /\d/, /\d/, /\d/, /\d/]}
                        blurInputOnSelect
                        label={t("profile.birthday")}
                        maxDate={maxBirthDate}
                    ></CustomDatePicker>
                </div>
                <div className={classes.personal_data_field}>
                    <CustomSelect
                        options={optionNationality}
                        label={t("profile.nationality")}
                        name="country"
                        touched={!touched.country}
                        errorMessage={errors.country}
                        valid={!errors.country}
                        shouldValidate
                        defaultValue={{
                            label: "Не указано",
                            value: "Не указано"
                        }}
                        value={optionNationality.find(elem => elem.value === values.country)}
                        onChange={(value) => {
                            ClearErrorAndChange('country', value.value)
                        }}
                    ></CustomSelect>
                </div>
                <div className={classes.personal_data_field}>
                    <CustomRadio
                        listRadio={listRadio}
                        name={"gender"}
                        value={values.gender}
                        checked
                        onChange={(value) => {
                            handleChange({ target: { name: "gender", value: value } })
                        }}
                    ></CustomRadio>
                </div>
                <div className={classes.personal_data_field}>
                    <Checkbox
                        text="Подписка на Email рассылку."
                        classNameLabel={classes.personal_data_label}
                        classNameCheckBox={classes.personal_data_checkbox}
                        className={classes.personal_data_checkbox_wrp}
                        checked={values.isSubscribe === "email_all" || values.isSubscribe === true}
                        name="isSubscribe"
                        onChange={(event) => handleChange({ target: { name: "isSubscribe", value: event.target.checked } })}
                    >
                    </Checkbox>
                </div>
                <Button
                    type="button"
                    btnColor="green"
                    typeButton={1}
                    onClick={changeUserData}
                    className={classes.personal_data_btn}
                >{t("profile.save")}</Button>
            </form>
            {successModal}
            {changeEmailSeccsessModal}
        </div>
    )
}