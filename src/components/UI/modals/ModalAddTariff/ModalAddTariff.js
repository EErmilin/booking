import React, {useEffect, useMemo, useState} from "react"
import classes from "./ModalAddTariff.module.scss"
import TwoButtonModal from "../TwoButtonModal/TwoButtonModal";
import {useTranslation} from "react-i18next";
import Input from "../../areas/Input/Input";
import CustomRadio from "../../areas/CustomRadio/CustomRadio";
import FormHelp from "../../../FormHelp/FormHelp";
import {useDispatch, useSelector} from "react-redux";
import {createRoomTariff, editRoomTariff} from "../../../../store/actions/partnerHotelsActions";
import {boolean, number, object, string} from "yup";
import {useFormik} from "formik";
import CustomSelect from "../../areas/CustomeSelect/CustomSelect";




function ModalAddTariff ({
    tariff,
    hotelId,
    btnCancelClick,
    closeModal,
}){
    const {t} = useTranslation()
    const dispatcher = useDispatch()
    const meals = useSelector(state => state.objects.mealType)
    const [errors,setErrors] = useState({})
    const optionMeals = useMemo(()=>{
        return meals.map(elem=>({
            value:elem.id,
            label:elem.name.ru
        }))
    },[meals])
    useEffect(()=>{
        setErrors({})
    },[])
    const radioList = [
        {
            text:t("addNewObjects.thirdStep.form.yes"),
            value:true
        },
        {
            text:t("addNewObjects.thirdStep.form.no"),
            value:false
        }
    ]
    /** Начальные значения */
    const initialValues = tariff?{
        name: tariff.name && tariff.name.ru,
        meal_type_id: tariff.meal_type_id,
    }:{
        name: '',
        meal_type_id: '',
    };
    /** Схема валидации */
    const validationSchema = useMemo(
        () =>
            object().shape({
                name: string().required(),
                meal_type_id:number().required()
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

    async function addTariff(){
        let isSend;
        if(tariff){
            isSend = await dispatcher(editRoomTariff({
                ...tariff,
                name:{ru:values.name},
                meal_type_id:values.meal_type_id,
            },tariff.id))
        }else{
            isSend = await dispatcher(createRoomTariff({
                name:{ru:values.name},
                meal_type_id:values.meal_type_id,
                hotel_id:hotelId
            }))
        }
        if(isSend.status == 200){
            btnCancelClick(false)
        }else{
            let errorObj = {}
            isSend.errors.length ? isSend.errors.forEach((elem) => {
                errorObj[elem.field] = elem.message
            }) : errorObj = { phone: isSend.errors.message }
            setErrors(errorObj)
        }

    }
    return (
        <TwoButtonModal
            closeModal={closeModal}
            close={true}
            btnCancelClick={()=>btnCancelClick(false)}
            btnCancelText={t("modalADdTariff.btn.cancel")}
            btnNextText={t("modalADdTariff.btn.save")}
            btnNextClick={addTariff}
            width={420}
            background="blue"
            typeModal="withoutBack"
            title={tariff?t("modalADdTariff.editTitle"):t("modalADdTariff.title")}
            className={classes.add_tariff}
        >
            <div className={classes.add_tariff_wrap}>
                {tariff?<FormHelp
                    className={classes.add_tariff_help}
                    text={t("modalADdTariff.formHelp")}
                />:""}
                <Input
                    name="name"
                    typeClsInput="field"
                    shouldValidate
                    required
                    label={t("modalADdTariff.name")}
                    value={values.name}
                    onChange={(e) => {
                        return handleChange({target:{name:"name",value:e.target.value}})
                    }}
                    touched={!touched.name}
                    valid={!errors.name}
                    errorMessage={errors.name}
                    shouldValidate
                    required
                ></Input>
                {/*<CustomRadio*/}
                {/*    name={"is_breakfast_included"}*/}
                {/*    listRadio={radioList}*/}
                {/*    label={t("modalADdTariff.guestBreakfast")}*/}
                {/*    className={classes.add_tariff_radio}*/}
                {/*    value={values.is_breakfast_included}*/}
                {/*    checked={true}*/}
                {/*    onChange={(value)=>handleChange({target:{name:"is_breakfast_included",value:value}})}*/}
                {/*></CustomRadio>*/}
                <CustomSelect
                    label={"Выберите тип питания"}
                    typeClsInput="field"
                    options={optionMeals}
                    value={values.meal_type_id?optionMeals.find(elem=>elem.value== values.meal_type_id):{value:"",label:"Выберите тип питания"}}
                    onChange={(e) => {
                        return handleChange({target:{name:"meal_type_id",value:e.value}})
                    }}
                    className={classes.add_tariff_breakfast}
                    name="meal_type_id"
                    touched={!touched.meal_type_id}
                    valid={!errors.meal_type_id}
                    errorMessage={errors.meal_type_id}
                    shouldValidate
                    required
                ></CustomSelect>
            </div>
        </TwoButtonModal>
    )
}


export default ModalAddTariff