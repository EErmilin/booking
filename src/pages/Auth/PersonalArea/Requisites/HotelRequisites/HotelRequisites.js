import React, { useCallback, useEffect, useMemo, useState } from "react";
import classes from "./HotelRequisites.module.scss";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import Button from "../../../../../components/UI/btns/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { bindRequisites, clearErrors, clearHotelError, createRequisites, getHotelInfo, getRequisites, updateRequisites } from "../../../../../store/actions/partnerHotelsActions";
import Preloader from "../../../../../components/Preloader/Preloader";
import Input from "../../../../../components/UI/areas/Input/Input";
import { useFormik } from "formik";
import CustomRadio from "../../../../../components/UI/areas/CustomRadio/CustomRadio";
import CustomSelect from "../../../../../components/UI/areas/CustomeSelect/CustomSelect";
import useToggleVisibility from "../../../../../hooks/useToggleVisibility";
import EmptyModal from "../../../../../components/UI/modals/EmptyModal/EmptyModal";
import ErrorMessage from "../../../../../components/UI/message/ErrorMessage";
import moment from "moment";
import CustomDatePicker from "../../../../../components/UI/areas/CustomDatePicker/CustomDatePicker";
import RequisitesStatus from "../components/RequisitesStatus/RequisitesStatus";
import Documents from "./components/Documents/Documents";
import { formatData } from "./functions/formatData";
import ModalApplySupport from "./components/ModalApplySupport/ModalApplySupport";
import { configDocumentsField } from "./constants/configDocumentsField";



function HotelRequisites({ isAddObject, save, back, isTl, isRegister, setIsConnect, setHotelId, hotelId }) {
    const { t } = useTranslation()
    const requisites = useSelector(state => state.objects.requisites)
    const hotelInfo = useSelector(state => state.objects.hotelInfo)
    const [modalSuccess, setModalSuccess, closeModalSuccess] = useToggleVisibility()
    const [modalApplySupports, setModalApplySupports, closeModalApplySupports] = useToggleVisibility()
    const dispatcher = useDispatch()
    const navigate = useNavigate()
    const errors = useSelector(state => state.objects.errors)
    const { id } = useParams()
    /** Начальные значения */
    const emptyRequisites = {
        company_type: '1',
        hotel_id: id,
        legal_entity_sms: '',
        legal_entity_full: '',
        legal_entity_short: '',
        legal_zip_code: '',
        legal_country_code: 'RUS',
        legal_city: '',
        legal_address: '',
        name: '',
        surname: '',
        middle_name: '',
        birthday: moment(new Date(), "YYYY.MM.DD"),
        nationality: '',
        bank: '',
        kpp: '',
        bik: '',
        rs: '',
        ks: '',
        inn: '',
        bank_inn: '',
        ogrn: '',
        recipient_name: '',
        recipient_surname: '',
        recipient_middle_name: '',
        phone: '',
        email: '',
        site_url: '',
        label: 'Добавить новые реквизиты',
        value: 0,
        nds: '',
        taxation: '',
        doc_shipment_method_id: 2,
        doc_shipment_description: '',
        shipping_organization: '',
        shipping_country: 'Российская Федерация',
        shipping_zip: '',
        shipping_region: '',
        shipping_city: '',
        shipping_street: '',
        shipping_house: '',
        shipping_office: '',
        shipping_second_name: '',
        shipping_first_name: '',
        shipping_mid_name: '',
        shipping_phone: '',
    }

    const [initialValues, setRequisitesValues] = useState(emptyRequisites)
    const [shouldRenderForm, setShouldRenderForm] = useState(isAddObject && !isTl ? false : true)
    const disabled = initialValues && initialValues.requisites_partner_status_id && initialValues.requisites_partner_status_id !== 3
    const isShowStatus = hotelInfo.requisites && initialValues && initialValues.id === hotelInfo.requisites.id

    const clsBody = [classes.requisites_form_body]
    if (isAddObject) clsBody.push(classes.requisites_form_body_create)
    if (isTl) clsBody.push(classes.requisites_form_body_tl)

    useEffect(() => {
        dispatcher(clearErrors())
        if (id) {
            dispatcher(getHotelInfo(id))
        }
        dispatcher(getRequisites())
    }, [])

    const requisitesOptions = useMemo(() => {
        return [
            emptyRequisites,
            ...requisites.map((requisite) => { return Object.assign(requisite, { value: requisite.id, label: 'ИНН: ' + requisite.inn + ' Расчётный счёт: ' + requisite.rs }) })
        ]
    }, [hotelInfo, requisites])

    useEffect(() => {
        const currentRequisites = hotelInfo.requisites ? requisitesOptions.find((req) => req.id === hotelInfo.requisites.id) : emptyRequisites

        if (currentRequisites !== emptyRequisites) setShouldRenderForm(true)
        setRequisitesValues(currentRequisites)
    }, [hotelInfo, requisites, requisitesOptions])

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

    const onChangeRequisites = () => {
        setModalSuccess(false)
        navigate("/personal-area/requisites/1")
    }
    /** Модалка обращения к поддержке */
    const templateModalApplySupports = modalApplySupports && <ModalApplySupport
        setModal={setModalApplySupports}
        closeModal={closeModalApplySupports}
    ></ModalApplySupport>

    /** Модалка успешной отправки */
    const templateModalSuccess = modalSuccess && <EmptyModal
        close={true}
        closeModal={() => onChangeRequisites()}
        btnCancelClick={() => onChangeRequisites()}
        width={400}
        background="blue"
        typeModal={"withoutBack"}
    >
        <h2>Отлично!</h2>
        Реквизиты и способ доставки отправлены на проверку
    </EmptyModal>


    /** Стейт полей и правила */
    const {
        values,
        handleChange,
        handleSubmit,
        touched,
    } = useFormik({
        initialValues,
        onSubmit: (values) => { },
        enableReinitialize: true
    });

    /** Очищаем ошибки и изменяем состояние */
    function clearErrorAndChange(field, value) {
        if (errors[field]) {
            dispatcher(clearHotelError(field))
        }
        handleChange({ target: { name: field, value: value } })
    }

    const isDisabledUpdate =
        initialValues && ((isShowStatus && initialValues.requisites_partner_status_id !== 3) ||
            initialValues.requisites_partner_status_id === 2 ||
            initialValues.requisites_partner_status_id === 1 ||
            initialValues.requisites_partner_status_id === 4)

    const sendRequisites = async () => {
        let documentData = formatData(values)

        let data = {
            ...values,
            ...documentData,
            phone: values.phone ? values.phone.replace(/[^0-9]/g, "") : '',
            birthday: values.birthday ? moment(values.birthday, "YYYY.MM.DD").format("YYYY-MM-DD") : ''

        }
        let isSendSeccses = false
        // Добавление тл объекта из раздела "Объекты"
        if (isTl && !isRegister) {
            isSendSeccses = await save()
            if (!isSendSeccses || isSendSeccses.status === 201 || isSendSeccses === 400) {
                isSendSeccses && setHotelId(isSendSeccses.data.id)
                data = {
                    ...data,
                    hotel_id: isSendSeccses ? isSendSeccses.data.id : hotelId
                }
                if (!values.value) {
                    isSendSeccses = await dispatcher(createRequisites(data))
                } else {
                    isSendSeccses = await dispatcher(bindRequisites(data.hotel_id, data.id))
                }
                if (isSendSeccses) {
                    setIsConnect(true)
                    setHotelId(null)
                }
            }
        } else {
            if (isDisabledUpdate) {
                isSendSeccses = await dispatcher(updateRequisites(documentData))

                if (isSendSeccses) {
                    isSendSeccses = await dispatcher(bindRequisites(hotelId ?? id, values.id))
                    if (isSendSeccses && save) return save()
                    if (isSendSeccses) return setModalSuccess(true)

                    else return
                } else {
                    return
                }
            }
            if (initialValues.requisites_partner_status_id === 3) {
                data.hotel_id = id
                isSendSeccses = await dispatcher(updateRequisites(data))
                if (isSendSeccses) {
                    isSendSeccses = await dispatcher(bindRequisites(hotelId ?? id, values.id))
                }
            } else if (values.value) {

                isSendSeccses = await dispatcher(bindRequisites(hotelId ?? id, values.id))
            } else {
                if (hotelId) {
                    data.hotel_id = hotelId
                }
                isSendSeccses = await dispatcher(createRequisites(data))
            }
            if (isSendSeccses && save) return save()
            if (isSendSeccses) setModalSuccess(true)
        }
    }


    useEffect(() => {
        if (isDisabledUpdate) {
            let keys = Object.keys(errors)
            if (keys.find(elem => !configDocumentsField.includes(elem) && !isAddObject)) {
                setModalApplySupports(true)
            }
        }
    }, [errors, isDisabledUpdate, configDocumentsField])

    const optionsNds = [
        {
            label: "Без НДС",
            value: 1
        },
        {
            label: "0%",
            value: 2
        },
        {
            label: "10%",
            value: 3
        },
        {
            label: "20%",
            value: 4
        },
    ]
    const optionsTax = [
        {
            label: "Общая",
            value: 1
        },
        {
            label: "Упрощенная (доходы)",
            value: 2
        },
        {
            label: "Упрощенная (доходы минус расходы)",
            value: 3
        },
        {
            label: "Патентная",
            value: 4
        },
        {
            label: "Единый налог на вмененный доход",
            value: 5
        },
        {
            label: "Eдиный сельскохозяйственный налог",
            value: 6
        },
    ]

    if (values && values.company_type !== 1) {
        optionsTax.push({
            label: "Налог на профессиональный доход (НПД)",
            value: 7
        })
    }


    const renderForm = useCallback(() => {

        const isSelfEmployer = values.company_type === 3

        const inputsEntity = [
            { label: 'Название организации в СМС', name: 'legal_entity_sms', value: values.legal_entity_sms, hint: 'Название организации в СМС уведомлении об оплате и на странице проверки 3DS (название указывается на латинице. Например: Otel Rivera)' },
            { label: 'Полное наименование организации', name: 'legal_entity_full', value: values.legal_entity_full },
            { label: 'Сокращенное наименование организации', name: 'legal_entity_short', value: values.legal_entity_short },
            { label: 'E-mail', name: 'email', value: values.email },
            {},
            {},
            { label: 'ИНН', name: 'inn', value: values.inn },
            { label: 'КПП', name: 'kpp', value: values.kpp },
            { label: 'ОГРН', name: 'ogrn', value: values.ogrn },
            {},
            { label: 'Расчетный счет', name: 'rs', value: values.rs },
            { label: 'Наименование банка', name: 'bank', value: values.bank },
            { label: 'БИК', name: 'bik', value: values.bik },
            { label: 'Корреспондентский счет', name: 'ks', value: values.ks },
            { label: 'Ставка НДС', name: 'nds', value: values.nds },
            { label: 'Система налогообложения', name: 'taxation', value: values.taxation },
            { title: 'Юридический адрес' },
            {},
            { label: 'Почтовый индекс', name: 'legal_zip_code', value: values.legal_zip_code },
            { label: 'Трехбуквенный код страны по ISO', name: 'legal_country_code', value: values.legal_country_code, disabled: true },
            { label: 'Город или населенный пункт', name: 'legal_city', value: values.legal_city },
            { label: 'Улица, дом, корпус, квартира, офис', name: 'legal_address', value: values.legal_address },
            { title: 'Информация о руководителе' },
            {},
            { label: 'Имя', name: 'name', value: values.name },
            { label: 'Фамилия', name: 'surname', value: values.surname },
            { label: 'Отчество', name: 'middle_name', value: values.middle_name },
            { label: 'Дата рождения', name: 'birthday', value: values.birthday, hint: 'Формат: ДД.ММ.ГГГГ', type: "date" },
            { label: 'Контактный телефон', name: 'phone', value: values.phone, mask: "+7 (999) 999-99-99" },
        ]
        const inputsIp = [
            { label: 'Название организации в СМС', name: 'legal_entity_sms', value: values.legal_entity_sms, hint: 'Название организации в СМС уведомлении об оплате и на странице проверки 3DS (название указывается на латинице. Например: Otel Rivera)' },
            { label: 'Фамилия', name: 'surname', value: values.surname },
            { label: 'Имя', name: 'name', value: values.name },
            { label: 'Отчество', name: 'middle_name', value: values.middle_name },
            { label: 'Полное наименование ИП ', name: 'legal_entity_full', value: values.legal_entity_full, hint: "Пример: ИП Иванов Иван Иванович" },
            { label: 'Сокращенное наименование ИП ', name: 'legal_entity_short', value: values.legal_entity_short, hint: "Пример: ИП Иванов И.И." },
            { label: 'ИНН ИП', name: 'inn', value: values.inn },
            { label: 'ОГРНИП', name: 'ogrn', value: values.ogrn },
            { label: 'Расчетный счет', name: 'rs', value: values.rs },
            { label: 'Наименование банка', name: 'bank', value: values.bank },
            { label: 'БИК', name: 'bik', value: values.bik },
            { label: 'Корреспондентский счет', name: 'ks', value: values.ks },
            { label: 'Ставка НДС', name: 'nds', value: values.nds },
            { label: 'Система налогообложения', name: 'taxation', value: values.taxation },

            { title: 'Адрес местонахождения ИП' },
            {},
            { label: 'Почтовый индекс', name: 'legal_zip_code', value: values.legal_zip_code },
            { label: 'Трехбуквенный код страны по ISO', name: 'legal_country_code', value: values.legal_country_code, disabled: true, hint: "3 символа по справочнику ISO 3166-1" },
            { label: 'Город или населенный пункт', name: 'legal_city', value: values.legal_city },
            { label: 'Улица, дом, корпус, квартира, офис', name: 'legal_address', value: values.legal_address },
            { label: 'Телефон', name: 'phone', value: values.phone, mask: "+7 (999) 999-99-99" },
            { label: 'E-mail', name: 'email', value: values.email },
            {},
            {},
            { title: 'Информация о руководителе' },
            {},
            { label: 'Имя', name: 'name', value: values.name },
            { label: 'Фамилия', name: 'surname', value: values.surname },
            { label: 'Отчество', name: 'middle_name', value: values.middle_name },
            { label: 'Дата рождения', name: 'birthday', value: values.birthday, hint: 'Формат: ДД.ММ.ГГГГ', type: "date" },
            { label: 'Контактный телефон', name: 'phone', value: values.phone, mask: "+7 (999) 999-99-99" },
        ]
        const inputsSelfEmployed = [
            { label: 'Название организации в СМС', name: 'legal_entity_sms', value: values.legal_entity_sms, hint: 'Название организации в СМС уведомлении об оплате и на странице проверки 3DS (название указывается на латинице. Например: Otel Rivera)' },
            { label: 'Фамилия', name: 'surname', value: values.surname },
            { label: 'Имя', name: 'name', value: values.name },
            { label: 'Отчество', name: 'middle_name', value: values.middle_name },
            { label: `Полное наименование самозанятого`, name: 'legal_entity_full', value: values.legal_entity_full, hint: `Пример: Иванов Иван Иванович` },
            { label: `Сокращенное наименование самозанятого`, name: 'legal_entity_short', value: values.legal_entity_short, hint: `Пример: Иванов И.И.` },
            { label: `ИНН Самозанятого`, name: 'inn', value: values.inn },
            { label: 'Наименование банка', name: 'bank', value: values.bank },
            { label: 'Расчетный счет', name: 'rs', value: values.rs },


            { label: 'Корреспондентский счет', name: 'ks', value: values.ks },
            { label: 'БИК', name: 'bik', value: values.bik },
            { label: 'ИНН Банка', name: 'bank_inn', value: values.bank_inn },
            { label: 'Ставка НДС', name: 'nds', value: optionsNds[0], disabled: true },
            { label: 'Система налогообложения', name: 'taxation', value: optionsTax[6], disabled: true },
            { label: 'Имя получателя', name: 'recipient_name', value: values.recipient_name },
            { label: 'Фамилия получателя', name: 'recipient_surname', value: values.recipient_surname },
            { label: 'Отчество получателя', name: 'recipient_middle_name', value: values.recipient_middle_name },
            {},
            { title: `Адрес местонахождения ${isSelfEmployer ? 'самозанятого' : 'ИП'}` },
            {},
            { label: 'Почтовый индекс', name: 'legal_zip_code', value: values.legal_zip_code },
            { label: 'Трехбуквенный код страны по ISO', name: 'legal_country_code', value: values.legal_country_code, disabled: true, hint: "3 символа по справочнику ISO 3166-1" },
            { label: 'Город или населенный пункт', name: 'legal_city', value: values.legal_city },
            { label: 'Улица, дом, корпус, квартира, офис', name: 'legal_address', value: values.legal_address },
            { label: 'Телефон', name: 'phone', value: values.phone, mask: "+7 (999) 999-99-99" },
            { label: 'E-mail', name: 'email', value: values.email },
            {},
            {},
            { title: 'Информация о руководителе' },
            {},
            { label: 'Имя', name: 'name', value: values.name },
            { label: 'Фамилия', name: 'surname', value: values.surname },
            { label: 'Отчество', name: 'middle_name', value: values.middle_name },
            { label: 'Дата рождения', name: 'birthday', value: values.birthday, hint: 'Формат: ДД.ММ.ГГГГ', type: "date" },
            { label: 'Контактный телефон', name: 'phone', value: values.phone, mask: "+7 (999) 999-99-99" },
        ]
        const arrayToRender = values.company_type === 2 ? inputsIp : values.company_type === 3 ? inputsSelfEmployed : inputsEntity
        return arrayToRender.map((input) => {
            if (input.title) return <p className={classes.requisites_form_title}>{input.title}</p>
            if (!input.name) return <div />
            if (input.name === "legal_country_code") {
                return <Input
                    mask={input.mask}
                    disabled={input.disabled}
                    label={input.label}
                    typeClsInput="field"
                    name={input.name}
                    shouldValidate
                    isSearchable={true}
                    valid={!errors[input.name]}
                    errorMessage={errors[input.name]}
                    type={input.type}
                    required
                    hint={input.hint}
                    readonly={input.readonly}
                    classNameHintText={classes.requisites_hint_text}
                    value={input.value}
                    onChange={(event) => clearErrorAndChange(input.name, event.target.value)}
                    classNameHintWrap={classes.requisites_hint_wrap}
                ></Input >
            }
            if (input.name === "birthday") {
                return <CustomDatePicker
                    className={classes.dataPicker}
                    classNameLabel={classes.dataPickerLabel}
                    disabled={input.disabled || disabled}
                    shouldValidate
                    valid={!errors[input.name]}
                    errorMessage={errors[input.name]}
                    touched
                    required
                    name={input.name}
                    value={values.birthday ? new Date(values.birthday) : ''}
                    onChange={(value) => {
                        clearErrorAndChange(input.name, moment(value, "YYYY.MM.DD"))
                    }}
                    mask={[/\d/, /\d/, ".", /\d/, /\d/, ".", /\d/, /\d/, /\d/, /\d/]}
                    blurInputOnSelect
                    label={input.label}
                ></CustomDatePicker>
            }
            if (input.name === "nds") {
                return <CustomSelect
                    label={input.label}
                    placeholder={''}
                    shouldValidate
                    valid={!errors[input.name]}
                    errorMessage={errors[input.name]}
                    required
                    touched
                    name={input.name}
                    disabled={input.disabled || disabled}
                    options={optionsNds}
                    value={optionsNds.find(option => option.value === input.value) ?? input.value}
                    onChange={(event) => clearErrorAndChange(input.name, event.value)
                    }
                ></CustomSelect>
            }
            if (input.name === "taxation") {
                return <CustomSelect
                    label={input.label}
                    placeholder={''}
                    shouldValidate
                    valid={!errors[input.name]}
                    errorMessage={errors[input.name]}
                    required
                    touched
                    name={input.name}
                    disabled={input.disabled || disabled}
                    options={optionsTax}
                    value={optionsTax.find(option => option.value === input.value) ?? input.value}
                    onChange={(event) => clearErrorAndChange(input.name, event.value)
                    }
                ></CustomSelect>
            }
            return <Input
                mask={input.mask}
                disabled={disabled}
                label={input.label}
                typeClsInput="field"
                name={input.name}
                shouldValidate
                isSearchable={true}
                touched
                valid={!errors[input.name]}
                errorMessage={errors[input.name]}
                type={input.type}
                required
                hint={input.hint}
                classNameHintText={classes.requisites_hint_text}
                classNameHintWrap={classes.requisites_hint_wrap}
                value={input.value}
                onChange={(event) => clearErrorAndChange(input.name, event.target.value)}

            ></Input >
        })
    }, [requisites, initialValues, values, errors])

    const changeRequisites = (option) => {
        setShouldRenderForm(true)
        dispatcher(clearErrors())
        if (option.value) {
            return setRequisitesValues(option)
        }
        setRequisitesValues(emptyRequisites)
    }

    if ((!initialValues || !Object.keys(hotelInfo).length || !values) && !isTl) return <Preloader></Preloader>



    return (
        <div className={classes.requisites} >
            {templateModalSuccess}
            {templateModalApplySupports}
            {!isAddObject && !isRegister && <div className={classes.header}>
                <h2 className={classes.requisites_title}>Реквизиты</h2>
                <NavLink
                    className={classes.requisites_link}
                    to="/personal-area/requisites/1">{t("addNewObjects.secondStep.buttons.back")}
                </NavLink></div>}
            <div className={clsBody.join(' ')}>
                {!isTl && (isAddObject ?
                    <h4 className={classes.requisites_hotel_title_create}>Реквизиты объекта</h4> :
                    <h4 className={classes.requisites_hotel_title}>{t("rooms.hotel")} «{hotelInfo.name && hotelInfo.name.ru}»</h4>)}
                <form className={classes.requisites_form}>
                    {!isRegister &&                   <CustomSelect
                        placeholder={"Укажите реквизиты объекта"}
                        options={requisitesOptions}
                        value={shouldRenderForm ? initialValues : null}
                        onChange={(option) => changeRequisites(option)}
                        errorMessage={ Object.keys(errors).length &&  "Необходимо заполнить реквизиты"}
                        shouldValidate={!shouldRenderForm}
                        valid={!initialValues}
                        touched={Object.keys(errors).length}
                    ></CustomSelect>}
                    <RequisitesStatus status={isShowStatus && hotelInfo.requisites_status} statusRequisites={initialValues.requisites_partner_status_id} />
                    {shouldRenderForm && <><div className={classes.requisites_form_type_org_radios_wrap}>
                        <CustomRadio
                            disabled={disabled}
                            label={"Организационно-правовая форма*"}
                            listRadio={radioTemplate}
                            name="company_type"
                            labelClassName={classes.requisites_form_type_org_radios_label}
                            className={classes.requisites_form_type_org_radios}
                            shouldValidate
                            touched={!touched.company_type}
                            valid={!errors.company_type}
                            errorMessage={errors.company_type}
                            required
                            checked={true}
                            value={values.company_type}
                            onChange={(event) => {
                                dispatcher(clearErrors())
                                clearErrorAndChange("company_type", event)
                            }}
                        ></CustomRadio>
                    </div >
                        <div className={classes.requisites_field}>
                            {renderForm()}
                        </div>
                        <div className={classes.requisites_form}>
                            <Documents values={values} clearErrorAndChange={clearErrorAndChange} touched={touched} isAddObject={isAddObject} />
                        </div></>}
                    {(!isAddObject || isTl) && <Button
                        type="button"
                        btnColor="green"
                        typeButton={1}
                        onClick={() => sendRequisites()}
                        className={isTl ? classes.requisites_btn_tl : classes.requisites_btn}
                    >{isTl ? 'Готово' : 'Отправить на проверку'}</Button>}
                    {errors.error && <ErrorMessage className={classes.modal_error_message} error={errors.error} />}
                </form>
            </div >
            {isAddObject && !isTl &&
                <div className={classes.buttons_wrp}>
                    <Button
                        typeButton={1}
                        btnColor="outline_blue back"
                        onClick={back}
                        className={classes.sixth_step_buttons_cancel}
                    >{t("addNewObjects.secondStep.buttons.back")}</Button>
                    <Button
                        type="button"
                        typeButton={1}
                        btnColor="green"
                        className={classes.sixth_step_buttons_save}
                        onClick={() => sendRequisites()}
                    >{t("addNewObjects.secondStep.buttons.save")}</Button>
                </div>}
        </div>

    )
}

export default HotelRequisites