import React, { useEffect, useMemo, useState } from "react"
import classes from "./FirstStep.module.scss";
import "./FirstStep.scss"
import { useTranslation } from "react-i18next";
import Input from "../../../../../components/UI/areas/Input/Input";
import CustomSelect from "../../../../../components/UI/areas/CustomeSelect/CustomSelect";
import StarRating from "../../../../../components/StarRating/StarRating";
import CustomRadio from "../../../../../components/UI/areas/CustomRadio/CustomRadio";
import CustomTextArea from "../../../../../components/UI/areas/CustomTextArea/CustomTextArea";
import Button from "../../../../../components/UI/btns/Button/Button";
import { useNavigate, useParams } from "react-router-dom";
import { number, object, string } from "yup";
import { useFormik } from "formik";
import CustomAsyncInput from "../../../../../components/UI/areas/CustomAsyncInput/CustomAsyncInput";
import {
    clearAllHotelError,
    clearHotelError,
    createHotel,
    editHotel,
    getCity, getGeoData,
    getHotelInfo, getTypeHotels
} from "../../../../../store/actions/partnerHotelsActions";
import { useDispatch, useSelector } from "react-redux";
import ErrorMessage from "../../../../../components/UI/message/ErrorMessage";




function FirstStep({ edit }) {
    const dispatcher = useDispatch()
    const errors = useSelector(state => state.objects.errors)
    const hotelInfo = useSelector(state => state.objects.hotelInfo)
    const typeHotels = useSelector(state => state.catalog.typeHotels)
    const [optionsCity, setOptionsCity] = useState([])
    const [disabled,setDisabled] = useState(false)
    const { id } = useParams()
    const { t } = useTranslation()
    const navigate = useNavigate()
    const optionsRating = [
        {
            value: 0,
            label: 'Без звёзд'
        },
        {
            value: 1,
            label: <StarRating width={13} height={13} starRating={1} maxRating={5}></StarRating>
        },
        {
            value: 2,
            label: <StarRating width={13} height={13} starRating={2} maxRating={5}></StarRating>
        },
        {
            value: 3,
            label: <StarRating width={13} height={13} starRating={3} maxRating={5}></StarRating>
        },
        {
            value: 4,
            label: <StarRating width={13} height={13} starRating={4} maxRating={5}></StarRating>
        },
        {
            value: 5,
            label: <StarRating width={13} height={13} starRating={5} maxRating={5}></StarRating>
        },
    ]

    const optionsTypeHotel = useMemo(() => {
        return typeHotels.map(elem => ({
            value: elem.id,
            label: elem.name
        }))
    }, [typeHotels])

    const radioTemplate = [
        { text: t("addNewObjects.firstStep.form.radio1"), value: 1 }, { text: t("addNewObjects.firstStep.form.radio2"), value: 2 },
    ]

    async function save() {
        setDisabled(true)
        let geoCode = '';
        if (hotelInfo.region_id !== values.region_id || hotelInfo.address !== values.address || !hotelInfo.lat || !hotelInfo.lon) {

            geoCode = await dispatcher(getGeoData(`${values.country} ${values.cityName} ${values.address}`))
            geoCode = geoCode && geoCode.split(' ')
        }
        const formatValue = (value) => {
            const values = {
                ...value,
                description: {
                    ru: value.description
                },
                name: {
                    ru: value.name
                },
            }
            if (geoCode) {
                Object.assign(values, { lat: geoCode[1], lon: geoCode[0] })
            }
            return values
        }
        let hotelId = ''
        if (edit) {
            hotelId = await dispatcher(editHotel(formatValue(values), id))
            if(!hotelId){
                setDisabled(false)
            }
        } else {
            hotelId = await dispatcher(createHotel(formatValue(values)))
            if(!hotelId){
                setDisabled(false)
            }
        }
        if (hotelId) {
            navigate(`/edit-object/${hotelId}/second-step`)
        }
    }

    /** Начальные значения */
    const initialValues = useMemo(() => {
        if (Object.keys(hotelInfo).length && edit) {
            return {
                country: "Россия",
                contact_name: hotelInfo.contact_name,
                contact_phone: hotelInfo.contact_phone,
                contact_email: hotelInfo.contact_email,
                contact_phone_additional: hotelInfo.contact_phone_additional,
                post_code: hotelInfo.post_code,
                region_id: hotelInfo.region_id,
                cityName: hotelInfo.region && hotelInfo.region.name.ru,
                address: hotelInfo.address,
                star_rating: hotelInfo.star_rating,
                name: hotelInfo.name.ru,
                description: hotelInfo.description.ru,
                owner_type_id: hotelInfo.owner_type_id,
                slug: "Россия/",
                type_id: hotelInfo.type_id,
                lon: hotelInfo.lon,
                lat: hotelInfo.lat
            }
        } else {
            return {
                country: "Россия",
                contact_name: "",
                contact_phone: "",
                contact_email: "",
                contact_phone_additional: "",
                post_code: "",
                region_id: "",
                cityName: '',
                address: "",
                star_rating: 0,
                name: "",
                description: "",
                owner_type_id: "",
                slug: "Россия/",
                type_id: "",
                lon: null,
                lat: null
            }
        }
    }, [hotelInfo])

    /** Схема валидации */
    const validationSchema = useMemo(
        () =>
            object().shape({
                name: string().required(),
                contact_name: string().required(),
                contact_phone: string().required(),
                post_code: string().required(),
                region_id: string().required(),
                address: string().required(),
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

    /** Метод получения подсказок по городам */
    const loadOptions = async function (value) {
        let city = await dispatcher(getCity(value))
        setOptionsCity(city.map(elem => {
            return {
                label: elem.name.ru + `${elem.region ? `, ${elem.region.name.ru}` : ""}`,
                value: elem.id,
                id: elem.id
            }
        }))
        return optionsCity
    }
    /** Очищаем ошибки и изменяем состояние */
    function ClearErrorAndChange(field, value) {
        if (errors[field]) {
            dispatcher(clearHotelError(field))
        }
        handleChange({ target: { name: field, value: value } })
    }


    /** Если редактирование подтягиваем информацию для редактирования */
    useEffect(() => {
        dispatcher(clearAllHotelError())
        dispatcher(getTypeHotels())
        //dispatcher(clearAllHotelError())
        if (edit) {
            dispatcher(getHotelInfo(id))
        }
    }, [])
    useEffect(() => {
        if (edit) {
            loadOptions(`&id=${hotelInfo.region_id}`)
        }
    }, [hotelInfo])

    const defaultType = optionsTypeHotel.find(elem => elem.value == values.type_id) ?? optionsTypeHotel[0]

    if (defaultType) {
        return (
            <div className={classes.first_step}>
                <h2 className={classes.first_step_title} >{t("addNewObjects.firstStep.title")}</h2>
                <p className={classes.first_step_subtitle}>{t("addNewObjects.firstStep.subTitle")}</p>
                <form className={classes.first_step_form}>
                    <div className={classes.first_step_form_block}>
                        <div className={classes.first_step_form_field_title_wrap}>
                            <h2 className={classes.first_step_form_field_title}>{t("addNewObjects.firstStep.form.name")}*</h2>
                            <div className={classes.first_step_form_field_id}>{t("addNewObjects.firstStep.hotelId")}: <span>{id}</span></div>
                        </div>
                        <div className={classes.first_step_form_field_main}>
                            <Input
                                name="name"
                                typeClsInput="field"
                                shouldValidate
                                required
                                touched={!touched.name}
                                valid={!errors.name}
                                errorMessage={errors.name}
                                value={values.name}
                                onChange={(e) => {
                                    return ClearErrorAndChange("name", e.target.value)
                                }}
                            ></Input>
                            <p className={classes.first_step_form_field_main_help}>{t("addNewObjects.firstStep.form.nameHelp")}</p>
                        </div>
                        <div className={classes.first_step_form_field}>
                            <CustomSelect
                                label={t("addNewObjects.firstStep.form.rating")}
                                options={optionsRating}
                                name="star_rating"
                                value={optionsRating.find(elem => elem.value == values.star_rating)}
                                onChange={(value) => {
                                    handleChange({ target: { name: "star_rating", value: value.value } })
                                }}
                            ></CustomSelect>
                        </div>
                        <div className={classes.first_step_form_field}>
                            <CustomSelect
                                label={t("addNewObjects.firstStep.form.typeHotel")}
                                options={optionsTypeHotel}
                                name="type_id"
                                required
                                touched={!touched.type_id}
                                errorMessage={errors.type_id}
                                valid={!errors.type_id}
                                shouldValidate
                                value={optionsTypeHotel.find(elem => elem.value == values.type_id)}
                                placeholder={t("addNewObjects.firstStep.form.typeHotelPlaceholder")}
                                // defaultValue={optionsTypeHotel[0]}
                                onChange={(value) => {
                                    handleChange({ target: { name: "type_id", value: value.value } })
                                }}
                            ></CustomSelect>
                        </div>
                        <div className={classes.first_step_form_field}>
                            <CustomTextArea
                                className={classes.first_step_form_field_textarea}
                                label={t("addNewObjects.firstStep.form.description")}
                                options={optionsRating}
                                value={values.description}
                                onChange={(e) => handleChange({ target: { name: "description", value: e.target.value } })}
                                name="description"
                                shouldValidate
                                required
                                touched={!touched.description}
                                valid={!errors.description}
                                errorMessage={errors.description}
                            ></CustomTextArea>
                        </div>
                    </div>
                    <div className={classes.first_step_form_block}>
                        <h2 className={classes.first_step_form_field_title}>{t("addNewObjects.firstStep.form.contactTitle")}</h2>
                        <div className={classes.first_step_form_field}>
                            <Input
                                label={t("addNewObjects.firstStep.form.contactFace")}
                                typeClsInput="field"
                                shouldValidate
                                required
                                name="contact_name"
                                touched={!touched.contact_name}
                                valid={!errors.contact_name}
                                errorMessage={errors.contact_name}
                                value={values.contact_name}
                                onChange={(e) => {
                                    return ClearErrorAndChange("contact_name", e.target.value)
                                }}
                            ></Input>
                            <Input
                                typeClsInput="field"
                                label={t("addNewObjects.firstStep.form.contactEmail")}
                                shouldValidate
                                required
                                name="contact_email"
                                touched={!touched.contact_email}
                                valid={!errors.contact_email}
                                errorMessage={errors.contact_email}
                                value={values.contact_email}
                                onChange={(e) => {
                                    return ClearErrorAndChange("contact_email", e.target.value)
                                }}
                            ></Input>
                        </div>
                        <div className={classes.first_step_form_field}>
                            <Input
                                typeClsInput="field"
                                mask="+7 (999) 999-99-99"
                                label={t("addNewObjects.firstStep.form.contactNumber")}
                                shouldValidate
                                required
                                name="contact_phone"
                                touched={!touched.contact_phone}
                                valid={!errors.contact_phone}
                                errorMessage={errors.contact_phone}
                                value={values.contact_phone}
                                onChange={(e) => {
                                    return ClearErrorAndChange("contact_phone", e.target.value)
                                }}
                            ></Input>
                            <Input
                                typeClsInput="field"
                                mask="+7 (999) 999-99-99"
                                label={t("addNewObjects.firstStep.form.additionalNumber")}
                                name="contact_phone_additional"
                                value={values.contact_phone_additional}
                                onChange={(e) => handleChange({ target: { name: "contact_phone_additional", value: e.target.value } })}
                            ></Input>
                        </div>
                        <h4 className={classes.first_step_form_field_subtitle}></h4>
                        <div className={classes.first_step_form_field}>
                            <CustomRadio
                                name={"owner_type_id"}
                                listRadio={radioTemplate}
                                checked={true}
                                touched={!touched.owner_type_id}
                                shouldValidate
                                value={values.owner_type_id}
                                valid={!errors.owner_type_id}
                                errorMessage={errors.owner_type_id}
                                onChange={(value) => handleChange({ target: { name: "owner_type_id", value: value } })}
                            ></CustomRadio>
                        </div>
                    </div>
                    <div className={classes.first_step_form_block}>
                        <h2 className={classes.first_step_form_field_title}>{t("addNewObjects.firstStep.form.location.title")}</h2>
                        <div className={classes.first_step_form_field}>
                            <Input
                                name="country"
                                typeClsInput="field"
                                required
                                label={t("addNewObjects.firstStep.form.location.country")}
                                shouldValidate
                                touched={!touched.country}
                                valid={!errors.country}
                                errorMessage={errors.country}
                                value={values.country}
                                onChange={(e) => {
                                    return ClearErrorAndChange("address", e.target.value)
                                }}
                            ></Input>
                        </div>
                        <div className={classes.first_step_form_field}>
                            <CustomAsyncInput
                                name="region_id"
                                placeholder={values.region_id}
                                typeClsInput="field"
                                required
                                className="FirstStep"
                                classNamePrefix="async_city_input"
                                label={t("addNewObjects.firstStep.form.location.city")}
                                shouldValidate
                                defaultValue={optionsCity.find(elem => elem.id == values.region_id)}
                                touched={!touched.region_id}
                                valid={!errors.region_id}
                                errorMessage={errors.region_id}
                                onChange={(value, action) => {
                                    if (action.action !== "select-option") return false
                                    handleChange({ target: { name: "region_id", value: value.value } })
                                    handleChange({ target: { name: "cityName", value: value.label } })
                                }}
                                cacheOptions
                                getOptionValue={(value) => value.id}
                                loadOptions={loadOptions}
                            ></CustomAsyncInput>
                        </div>
                        <div className={classes.first_step_form_field}>
                            <Input
                                name="address"
                                typeClsInput="field"
                                label={t("addNewObjects.firstStep.form.location.location")}
                                shouldValidate
                                touched={!touched.address}
                                valid={!errors.address}
                                errorMessage={errors.address}
                                required
                                value={values.address}
                                onChange={(e) => {
                                    return ClearErrorAndChange("address", e.target.value)
                                }}
                            ></Input>
                        </div>
                        <div className={classes.first_step_form_field}>
                            <Input
                                name="post_code"
                                typeClsInput="field"
                                label={t("addNewObjects.firstStep.form.location.index")}
                                shouldValidate
                                touched={!touched.post_code}
                                valid={!errors.post_code}
                                errorMessage={errors.post_code}
                                required
                                value={values.post_code}
                                onChange={(e) => {
                                    return ClearErrorAndChange("post_code", e.target.value)
                                }}
                            ></Input>
                        </div>
                    </div>
                </form>
                {Object.keys(errors).length ? <ErrorMessage error={"Есть незаполненные обязательные поля"} className={classes.error} /> : null}
                <div className={classes.first_step_buttons}>
                    <Button
                        typeButton={1}
                        btnColor="outline_blue"
                        onClick={() => { navigate("/personal-area/objects/1") }}
                    >{t("addNewObjects.firstStep.btnCancel")}</Button>
                    <Button
                        typeButton={1}
                        type="button"
                        btnColor="green"
                        className={classes.first_step_buttons_save}
                        onClick={save}
                        disabled={disabled}
                    >{t("addNewObjects.firstStep.btnSave")}</Button>
                </div>

            </div>
        )
    }
}

export default FirstStep