import React, {useEffect, useMemo, useState} from "react"
import classes from "./ForthStep.module.scss";
import { useTranslation } from "react-i18next";
import CustomSelect from "../../../../../components/UI/areas/CustomeSelect/CustomSelect";
import CustomRadio from "../../../../../components/UI/areas/CustomRadio/CustomRadio";
import CustomTextArea from "../../../../../components/UI/areas/CustomTextArea/CustomTextArea";
import Button from "../../../../../components/UI/btns/Button/Button";
import {NavLink, useNavigate, useParams} from "react-router-dom";
import Checkbox from "../../../../../components/UI/areas/Checkbox/Checkbox";
import DropdownList from "../../../../../components/Dropdown/DropdownList/DropdownList";
import InputWithSelect from "../../../../../components/UI/areas/InputWithSelect/InputWithSelect";
import {
    fakeArrBreakfastType, fakeArrHasBreakfast,
    fakeArrParkingAppoint,
    fakeArrParkingPlacement,
    fakeArrParkingTerritory,
    fakeArrParkingType
} from "./fakeArrays";
import {object, string} from "yup";
import {useFormik} from "formik";
import {useDispatch, useSelector} from "react-redux";
import {
    clearAllHotelError,
    clearHotelError,
    clearServices,
    editHotel,
    getHotelInfo,
    getServices
} from "../../../../../store/actions/partnerHotelsActions";

function LanguageSelect({
    value,
    onDelete
}) {
    let option = [[{ label: 'Русский',value:"ru"},{ label: 'Русский',value:"en"}]]
    return (
        <div className={classes.third_step_form_languageArea}>
            <CustomSelect
                className={classes.third_step_form_languageSelect}
                options={option}>
                value={option.find(elem=>elem.value==value)}
                defaultValue={{ label: 'Русский',value:"ru"}}
            </CustomSelect>
            <Button
                type={'button'}
                className={classes.third_step_form_deleteImage}
                onClick={onDelete} />
        </div>
    )
}

function ForthStep({edit}) {
    const errors = useSelector(state => state.objects.errors)
    const hotelInfo = useSelector(state=>state.objects.hotelInfo)
    const amenity = useSelector(state=>state.objects.amenity)

    const {id} = useParams()
    const {t} = useTranslation()
    const navigate= useNavigate()
    const dispatcher =useDispatch()


    /** Массив с груп id услуг */
    const groupsId = useMemo(()=>{
        let arrayGroups = []
        amenity.forEach(elem=>{
            if(elem.group.id==8)return
            if(!(arrayGroups.find((e)=>e.group_id==elem.group.id))){
                arrayGroups.push({group_id:elem.group.id,name:elem.group.name.ru})
            }
        })
        return arrayGroups
    },[amenity])


    const optionsCurrency = [
        {
            label: "₽",
            value: "₽"
        },
    ]

    const optionsExtraBed = [
        {
            label: 'Не выбрано',
            value:0
        },
        {
            label: '1',
            value: 1
        },
        {
            label: '2',
            value: 2
        },
        {
            label: '3',
            value: 3
        },
    ]
    const optionsChildAge= useMemo(()=>{
        let arr =[]
        for (let age = 1;age<18;age++){
            arr.push({label:age,value:age})
        }
        return arr
    },[])

    const radioTemplate = [
        {text:t("addNewObjects.thirdStep.form.thereIs"),value:1},
        {text:t("addNewObjects.thirdStep.form.no"),value:0},
    ]

    /** Подтягиваем инфу о услугах */
    /** Если редактирование подтягиваем информацию для редактирования */
    useEffect(()=>{
        dispatcher(clearAllHotelError())
        dispatcher(clearServices())
        if(edit){
            dispatcher(getHotelInfo(id))
        }
        dispatcher(getServices({'per-page':1000,expand:"group"}))
    },[])
    /** Начальные значения */
    const initialValues = useMemo(()=>{
        if(!Object.keys(hotelInfo).length){
           return {
               parking_type_id: "",
               parking_territory_id: "",
               parking_placement_id: "",
               parking_appoint_id: "",
               parking_price: "",
               parking_price_unit: "",
               has_compliment:"",
               description:"",
               has_breakfast:"",
               breakfast_type:"",
               price:"",
               languages:[],
               amenity_ids:[],
               is_beds:'',
               count:"",
               is_adult:"",
               is_children:"",
               price_night_for_little_child:"",
               is_little_children:"",
               child_age:'',
               price_night_for_child:""
           }
        }else{
            return {
                parking_type_id: hotelInfo.parking_type_id,
                parking_territory_id: hotelInfo.parking_territory_id,
                parking_placement_id: hotelInfo.parking_placement_id,
                parking_appoint_id: hotelInfo.parking_appoint_id,
                parking_price: hotelInfo.parking_price,
                parking_price_unit: hotelInfo.parking_price_unit,
                has_compliment:hotelInfo.compliment?hotelInfo.compliment.has_compliment:"",
                description:hotelInfo.compliment?hotelInfo.compliment.description:"",
                has_breakfast:hotelInfo.meal?hotelInfo.meal.breakfast.has_breakfast:"",
                breakfast_type:hotelInfo.meal?hotelInfo.meal.breakfast.breakfast_type:"",
                price:hotelInfo.meal?hotelInfo.meal.breakfast.price:"",
                languages:hotelInfo.languages?[...hotelInfo.languages]:[],
                amenity_ids:hotelInfo.amenity_ids?[...hotelInfo.amenity_ids]:[],
                is_beds:hotelInfo.additional_beds?hotelInfo.additional_beds.is_beds:'',
                count:hotelInfo.additional_beds?hotelInfo.additional_beds.count:'',
                is_adult:hotelInfo.additional_beds?hotelInfo.additional_beds.is_adult:'',
                is_children:hotelInfo.additional_beds?hotelInfo.additional_beds.is_children:'',
                price_night_for_little_child:hotelInfo.additional_beds?hotelInfo.additional_beds.price_night_for_little_child:'',
                is_little_children:hotelInfo.additional_beds?hotelInfo.additional_beds.is_little_children:'',
                child_age:hotelInfo.additional_beds?hotelInfo.additional_beds.child_age:'',
                price_night_for_child:hotelInfo.additional_beds?hotelInfo.additional_beds.price_night_for_child:''
            }
        }
    },[hotelInfo])
    /** Схема валидации */
    const validationSchema = useMemo(
        () =>
            object().shape({
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
        enableReinitialize:true
    });
    const [languages, setlanguages] = useState(values.languages);
    const addLanguageSelect = () => {
        setlanguages([...languages,"ru"])
    };

    const renderLanguage = languages.map((elem,id) => <LanguageSelect key={id} onDelete={()=>{
        let newLanguage = [...languages]
        newLanguage.splice(id,1)
        setlanguages(newLanguage)
    }}></LanguageSelect>);
    /** Формируем и отправляем данные */
    const formatData = (values) =>{
        return {
            parking_type_id: values.parking_type_id,
            parking_territory_id: values.parking_territory_id,
            parking_placement_id: values.parking_placement_id,
            parking_appoint_id: values.parking_appoint_id,
            parking_price: values.parking_price,
            parking_price_unit: values.parking_price_unit,
            compliment:{
                has_compliment:values.has_compliment,
                description:values.description
            },
            meal:{
                breakfast:{
                    has_breakfast:values.has_breakfast,
                    breakfast_type:values.breakfast_type,
                    price:values.price,
                }
            },
            languages:[...languages],
            amenity_ids:[...values.amenity_ids],
            additional_beds: {
                is_beds: values.is_beds,
                count: values.count,
                is_little_children: values.is_little_children,
                price_night_for_little_child: values.price_night_for_little_child,
                is_children: values.is_children,
                price_night_for_child:  values.price_night_for_child,
                child_age: values.child_age,
                is_adult: values.is_adult
            },
        }
    }

    /** Сохраняем инфу */
    async function save() {
        const hotelId = await dispatcher(editHotel(formatData(values),id))
        if(hotelId){
                navigate(`/edit-object/${hotelId}/fifth-step`)
        }
    }

    /** Рендерим услуги */
    const renderServices = (group_id) => {
        const arrAmenity = amenity.filter(elem=>elem.group.id==group_id)
        return arrAmenity.map((elem,id) => {
            return <div className={classes.third_step_form_serviceLayout} key={id}>
                <Checkbox
                    classNameCheckBox={classes.third_step_form_checkboxes_check}
                    classNameLabel={classes.third_step_form_serviceTitle}
                    checked={values.amenity_ids.find(id=>id==elem.id)}
                    value={values.amenity_ids.find(id=>id==elem.id)}
                    onChange={(event=>{
                        if(!values.amenity_ids.includes(elem.id)){
                            let arr = [...values.amenity_ids,elem.id]
                            handleChange({target:{name:"amenity_ids",value:arr}})
                        }else{
                            handleChange({target:{name:"amenity_ids",value:values.amenity_ids.filter(e=>e!==elem.id)}})
                        }
                    })}
                    text={elem.name.ru}
                />
            </div>
        })
    };
    /** Очищаем ошибки и изменяем состояние */
    function ClearErrorAndChange (field,value){
        if(errors[field]){
            dispatcher(clearHotelError(field))
        }
        handleChange({target: {name: field, value: value}})
    }
    /** Рендерим группы услуг */
    const templateServicesTypes = useMemo(() => {
        return groupsId.map((elem,id) => {
            return <DropdownList
                key={id}
                id={elem.group_id}
                title={elem.name}
                titleClassName={classes.third_step_services_dropdown}
                className={[classes.third_step_form_field, classes.third_step_form_field_dropdown].join(" ")}>
                {renderServices(elem.group_id)}
            </DropdownList>
        })
    },[groupsId,values.amenity_ids]);

    return (
        <div className={classes.third_step}>
            <h2 className={classes.third_step_title} >{t("addNewObjects.thirdStep.title")}</h2>
            <p className={classes.third_step_subtitle}>{t("addNewObjects.thirdStep.subTitle")}</p>
            <form className={classes.third_step_form}>

                <div className={classes.third_step_form_block}>
                    <h2 className={classes.third_step_form_field_title}>{t("addNewObjects.thirdStep.form.parking")}</h2>

                    <div className={classes.third_step_form_field}>
                        <CustomSelect
                            label={t("addNewObjects.thirdStep.form.guestParking")}
                            name="parking_type_id"
                            value={fakeArrParkingType.find(elem=>elem.value==values.parking_type_id)}
                            defaultValue={fakeArrParkingType[0]}
                            onChange={(value)=>{
                                return ClearErrorAndChange("parking_type_id",value.value)
                            }}
                            shouldValidate
                            touched={!touched.parking_type_id}
                            valid={!errors.parking_type_id}
                            errorMessage={errors.parking_type_id}
                            options={fakeArrParkingType}></CustomSelect>
                        <div className={classes.third_step_form_field}>
                            <CustomSelect
                                className={classes.third_step_form_fieldMargin}
                                name="parking_territory_id"
                                touched={!touched.parking_territory_id}
                                valid={!errors.parking_territory_id}
                                errorMessage={errors.parking_territory_id}
                                value={fakeArrParkingTerritory.find(elem=>elem.value==values.parking_territory_id)}
                                defaultValue={fakeArrParkingTerritory[0]}
                                onChange={(value)=>{
                                    return ClearErrorAndChange("parking_territory_id",value.value)
                                }}
                                shouldValidate
                                options={fakeArrParkingTerritory}></CustomSelect>
                            <CustomSelect
                                className={classes.third_step_form_fieldMargin}
                                name="parking_placement_id"
                                touched={!touched.parking_placement_id}
                                valid={!errors.parking_placement_id}
                                errorMessage={errors.parking_placement_id}
                                value={fakeArrParkingPlacement.find(elem=>elem.value==values.parking_placement_id)}
                                defaultValue={fakeArrParkingPlacement[0]}
                                onChange={(value)=>{
                                    return ClearErrorAndChange("parking_placement_id",value.value)
                                }}
                                shouldValidate
                                options={fakeArrParkingPlacement}></CustomSelect>
                        </div>
                    </div>

                    <div className={classes.third_step_form_field}>
                        <CustomSelect
                            label={t("addNewObjects.thirdStep.form.bookingParking")}
                            name="parking_appoint_id"
                            touched={!touched.parking_appoint_id}
                            valid={!errors.parking_appoint_id}
                            errorMessage={errors.parking_appoint_id}
                            value={fakeArrParkingAppoint.find(elem=>elem.value==values.parking_appoint_id)}
                            defaultValue={fakeArrParkingAppoint[0]}
                            onChange={(value)=>{
                                return ClearErrorAndChange("parking_appoint_id",value.value)
                            }}
                            shouldValidate
                            options={fakeArrParkingAppoint}></CustomSelect>
                        <InputWithSelect
                            optionsSelect={optionsCurrency}
                            nameInput="parking_price"
                            touched={!touched.parking_price}
                            valid={!errors.parking_price}
                            errorMessage={errors.parking_price}
                            valueInput={values.parking_price}
                            onChangeInput={(event)=>{
                                return ClearErrorAndChange("parking_price",event.target.value)
                            }}
                            shouldValidate
                            label={t("addNewObjects.thirdStep.form.parkingPrice")}>
                        </InputWithSelect>
                    </div>
                </div>

                <div className={classes.third_step_form_block}>
                    <h2 className={classes.third_step_form_field_title}>{t("addNewObjects.thirdStep.form.complimentTitle")}</h2>
                    <div className={classes.third_step_form_info}>
                        <div className={classes.third_step_form_infoImage} />
                        <div className={classes.third_step_form_infoText}>
                            {t("addNewObjects.thirdStep.form.complimentInfo")}
                        </div>
                    </div>
                    <div className={classes.third_step_form_field}>
                        <CustomRadio
                            name="has_compliment"
                            listRadio={radioTemplate}
                            value={values.has_compliment}
                            checked={true}
                            onChange={(value)=>{
                                return ClearErrorAndChange("has_compliment",value)
                            }}
                            shouldValidate
                            touched={!touched.has_compliment}
                            valid={!errors.has_compliment}
                            errorMessage={errors.has_compliment}
                        ></CustomRadio>
                    </div>
                    <CustomTextArea
                        className={classes.third_step_form_field_textarea}
                        name="description"
                        label={t("addNewObjects.thirdStep.form.compliment")}
                        value={values.description}
                        onChange={(event)=>{
                            return ClearErrorAndChange("description",event.target.value)
                        }}
                        shouldValidate
                        touched={!touched.description}
                        valid={!errors.description}
                        errorMessage={errors.description}
                    />
                </div>

                {/*<div className={classes.third_step_form_block}>*/}
                {/*    <h2 className={classes.third_step_form_field_title}>{t("addNewObjects.thirdStep.form.language")}</h2>*/}
                {/*    {renderLanguage}*/}
                {/*    <Button*/}
                {/*        type={'button'}*/}
                {/*        className={classes.third_step_form_addLanguage}*/}
                {/*        onClick={()=>addLanguageSelect()}>+</Button>*/}
                {/*    <span className={classes.third_step_form_addLanguageText}>{t("addNewObjects.thirdStep.form.addLanguage")}</span>*/}
                {/*</div>*/}

                <div className={classes.third_step_form_block}>
                    <h2 className={classes.third_step_form_field_title}>{t("addNewObjects.thirdStep.form.extraBeds")}</h2>
                    <div className={classes.third_step_form_field_hint}>{t("addNewObjects.thirdStep.form.addExtraBeds")}</div>
                    <div className={classes.third_step_form_extraBedsSelect}>
                        <CustomRadio
                            listRadio={[
                                {text:t("addNewObjects.thirdStep.form.yes"),value:1},
                                {text:t("addNewObjects.thirdStep.form.no"),value:0}
                            ]}
                            value={values.is_beds}
                            checked={true}
                            name="is_beds"
                            edit={true}
                            onChange={(value)=>{
                                return ClearErrorAndChange("is_beds",value)
                            }}
                            shouldValidate
                            touched={!touched.is_beds}
                            valid={!errors.is_beds}
                            errorMessage={errors.is_beds}
                        ></CustomRadio>
                    </div>

                    {Boolean(values.is_beds) && <>
                        <div className={classes.third_step_form_field}>
                            <CustomSelect
                                name="count"
                                className={"tariff_item_guest"}
                                label={t("addNewObjects.thirdStep.form.countOfBeds")}
                                value={optionsExtraBed.find(elem=>elem.value==values.count)}
                                options={optionsExtraBed}
                                defaultValue={optionsExtraBed[0]}
                                onChange={(value)=>{
                                    return ClearErrorAndChange("count",value.value)
                                }}
                                shouldValidate
                                touched={!touched.count}
                                valid={!errors.count}
                                errorMessage={errors.count}
                            >
                            </CustomSelect>
                        </div>
                        </>
                        }
                </div>

                <div className={classes.third_step_form_block}>
                    <h2 className={classes.third_step_form_field_title}>{t("addNewObjects.thirdStep.form.services.popularServices")}</h2>
                    <div className={classes.third_step_form_field_hint}>{t("addNewObjects.thirdStep.form.services.searchServices")}</div>
                    <div>
                        {templateServicesTypes}
                    </div>
                </div>
            </form>

            <div className={classes.third_step_buttons}>
                {/*<Button*/}
                {/*    typeButton={2}*/}
                {/*    btnColor="ButtonWhite"*/}
                {/*    className={classes.third_step_buttons_cancel}*/}
                {/*    onClick={()=>{navigate("/personal-area/objects/1")}}*/}
                {/*>{t("addNewObjects.firstStep.btnCancel")}</Button>*/}
                <Button
                    typeButton={1}
                    btnColor="outline_blue"
                    className={classes.third_step_back}
                ><NavLink to={`/edit-object/${id}/third-step`}>{t("addNewObjects.secondStep.buttons.back")}</NavLink></Button>
                <Button
                    typeButton={1}
                    btnColor="green"
                    className={classes.third_step_buttons_save}
                    onClick={save}
                >{t("addNewObjects.firstStep.btnSave")}</Button>
            </div>
        </div>
    )
}

export default ForthStep