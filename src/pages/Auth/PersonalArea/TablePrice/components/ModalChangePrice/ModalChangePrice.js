import React, {useEffect, useMemo,useState} from "react"
import classes from "./ModalChangePrice.module.scss"
import TwoButtonModal from "../../../../../../components/UI/modals/TwoButtonModal/TwoButtonModal";
import {useTranslation} from "react-i18next";
import CalendarRange from "../CalendarRange/CalendarRange"
import NumberInputArrow from "../../../../../../components/UI/areas/NumberInputArrow/NumberInputArrow";

import CustomRadio from "../../../../../../components/UI/areas/CustomRadio/CustomRadio";
import moment from "moment";
import {number, object, string} from "yup";
import {useFormik} from "formik";
import {clearCalendarError, savePrice, saveRoom} from "../../../../../../store/actions/tablePriceActions";
import {useDispatch, useSelector} from "react-redux";
import MonthSwiper from "../MonthSwiper/MonthSwiper";
import FormHelp from "../../../../../../components/FormHelp/FormHelp";
import Checkbox from "../../../../../../components/UI/areas/Checkbox/Checkbox";

const weekDays = [
    {
        id:1,
        text:"Пн"
    },
    {
        id:2,
        text:"Вт"
    },
    {
        id:3,
        text:"Ср"
    },
    {
        id:4,
        text:"Чт"
    },
    {
        id:5,
        text:"Пт"
    },
    {
        id:6,
        text:"Сб"
    },
    {
        id:7,
        text:"Вс"
    },
]

function ModalChangePrice({
      closeModal,
      btnCancelClick,
      roomInfo,
      planInfo,
      filters,
      hotelId,
      setModalError
}){
    const {t} = useTranslation()
    const dispatcher = useDispatch()
    const errors = useSelector((state)=>state.table.errors)
    const [checkedArr,setCheckedArr] = useState([])
    const radioList = [
        {text:"Открыт",value:true},
        {text:"Закрыт",value:false}
    ]



    /** Начальные значения */
    const initialValues = {
        date:[moment(planInfo.date,"YYYY-MM-DD"),moment(planInfo.date,"YYYY-MM-DD").add(3,"day")],
        id:planInfo.id,
        isActive:planInfo.isActive,
        roomsCount:planInfo.roomsCount,
        isPerDays:planInfo.daysOfWeek?.length,
        daysOfWeek:planInfo.daysOfWeek ?? []
    }
    useEffect(()=>{
        dispatcher(clearCalendarError())
    },[])
    /** Схема валидации */
    const validationSchema = useMemo(
        () =>
            object().shape({
                date: string().required(),
                price: string().required(),
                minStay: number().required(),
            }),
        []
    );

    /** Стейт полей и правила */
    const {
        values,
        handleChange,
        handleSubmit,
        touched,
        setFieldValue
    } = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {

        },
    });

    const weekTemplate = useMemo(()=>{
        return weekDays.map((elem,id)=>{
            return (
                <Checkbox
                    className={classes.modal_change_price_week_checkbox}
                    text={elem.text}
                    name="daysOfWeek"
                    key={id}
                    onChange={()=>{
                        let arr = [...values.daysOfWeek]
                        if(arr.includes(elem.id)){
                            arr = arr.filter(e=>e !== elem.id)
                        }else {
                            arr.push(elem.id)
                        }
                        handleChange({target:{name:"daysOfWeek",value:arr}})
                    }}
                    checked={values.daysOfWeek.includes(elem.id)}
                ></Checkbox>
            )
        })
    },[values.daysOfWeek])

    useEffect(()=>{
        if(checkedArr.length){
            let lowestDate = moment(checkedArr[0].startOfMonth,"YYYY-MM-DD")
            let highestDate = moment(checkedArr[0].endOfMonth,"YYYY-MM-DD")
            checkedArr.forEach(elem=>{
                if(moment(elem.startOfMonth,"YYYY-MM-DD").isBefore(lowestDate)){
                    lowestDate = moment(elem.startOfMonth,"YYYY-MM-DD")
                }
                if(moment(elem.endOfMonth,"YYYY-MM-DD").isAfter(highestDate)){
                    highestDate = moment(elem.endOfMonth,"YYYY-MM-DD")
                }
            })
            setFieldValue("date",[lowestDate,highestDate])
        }
    },[checkedArr])

    const save = async ()=>{
        let isSave =await dispatcher(saveRoom({
            ...values,
            dateFrom:moment(values.date[0]).format("YYYY-MM-DD"),
            dateTo:moment(values.date[1]).add(1,"day").format("YYYY-MM-DD")
        },filters,hotelId))
        if(isSave.status==200)btnCancelClick(false)
        else if(isSave.status == 403){
            btnCancelClick(false)
            setModalError(true)
        }
    }

    return (
        <TwoButtonModal
            closeModal={closeModal}
            close={true}
            btnCancelClick={()=>btnCancelClick(false)}
            btnCancelText={t("modalADdTariff.btn.cancel")}
            btnNextText={t("modalADdTariff.btn.save")}
            btnNextClick={save}
            width={440}
            background="blue"
            typeModal="withoutBack"
            title={roomInfo.name.ru}
            classNameTitle={classes.modal_change_price_mainTitle}
            className={classes.modal_change_price_modal}
        >
            <div className={classes.modal_change_price}>
                <FormHelp
                    text={"Укажите информацию о периодах выставления номеров на продажу"}
                    className={classes.modal_change_price_help}
                ></FormHelp>
                <div className={classes.modal_change_price_month}>
                    <MonthSwiper checkedArr={checkedArr} onChange={(array)=>setCheckedArr(array)}></MonthSwiper>
                </div>
                <div className={classes.modal_change_price_date}>
                    <CalendarRange
                        value={values.date}
                        onChange={(value)=>{
                            setCheckedArr([])
                            handleChange({ target: { name: "date", value: value } })
                        }}
                        errorMessage={errors.dateTo}
                    ></CalendarRange>
                </div>
                <div className={classes.modal_change_price_week}>
                    <Checkbox
                        className={classes.modal_change_price_week_checkbox}
                        text={"Установить период по дням"}
                        checked={values.isPerDays}
                        name="isPerDays"
                        onChange={(event)=>{
                            handleChange({target:{ name: "isPerDays", value: event.target.checked }})
                            if(!event.target.checked)handleChange({target:{name:"daysOfWeek",value:[]}})

                        }}
                    ></Checkbox>
                    {values.isPerDays && <div className={classes.modal_change_price_week_wrap}>
                        {weekTemplate}
                    </div>}
                </div>
                <div className={classes.modal_change_price_field}>
                    <NumberInputArrow
                        label={'Количество номеров на продажу'}
                        className={classes.modal_change_price_inp}
                        name="roomsCount"
                        value={values.roomsCount}
                        onChange={(event)=>handleChange({ target: { name: "roomsCount", value: event }})}
                    ></NumberInputArrow>
                </div>

                <div className={classes.modal_change_price_minStay}>
                    <CustomRadio
                        listRadio={radioList}
                        label={"Статус номера"}
                        name='isActive'
                        value={values.isActive}
                        checked={true}
                        onChange={(value)=>{
                            handleChange({ target: { name: "isActive", value: value }})
                        }}
                    ></CustomRadio>
                </div>
            </div>
        </TwoButtonModal>
    )
}

export default ModalChangePrice