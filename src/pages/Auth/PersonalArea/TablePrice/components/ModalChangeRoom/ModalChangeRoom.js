import React, {useEffect, useMemo, useState} from "react"
import classes from "./ModalChangeRoom.module.scss"
import TwoButtonModal from "../../../../../../components/UI/modals/TwoButtonModal/TwoButtonModal";
import {useTranslation} from "react-i18next";
import CalendarRange from "../CalendarRange/CalendarRange"
import CustomSelect from "../../../../../../components/UI/areas/CustomeSelect/CustomSelect";
import InputWithSelect from "../../../../../../components/UI/areas/InputWithSelect/InputWithSelect";
import NumberInputArrow from "../../../../../../components/UI/areas/NumberInputArrow/NumberInputArrow";
import HelpNotation from "../../../../../../components/UI/other/HelpNotation/HelpNotation";
import {useDispatch, useSelector} from "react-redux";
import {getListTariff} from "../../../../../../store/actions/partnerHotelsActions";
import {number, object, string} from "yup";
import {useFormik} from "formik";
import {clearCalendarError, savePrice} from "../../../../../../store/actions/tablePriceActions";
import moment from "moment";
import Checkbox from "../../../../../../components/UI/areas/Checkbox/Checkbox";
import MonthSwiper from "../MonthSwiper/MonthSwiper";
import FormHelp from "../../../../../../components/FormHelp/FormHelp";
import "./ModalChnageRoom.scss"
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

function ModalChangeRoom({
    closeModal,
    btnCancelClick,
    roomInfo,
    planInfo,
    hotelId,
    filters,
    setModalError
}){
    const {t} = useTranslation()
    const dispatcher = useDispatch()
    const tariffs = useSelector(state => state.objects.tariff)
    const errors = useSelector((state)=>state.table.errors)
    const [checkedArr,setCheckedArr] = useState([])
    useEffect(()=>{
        dispatcher(clearCalendarError())
        dispatcher(getListTariff(hotelId))
    },[])
    const optionsCurrency = [
        {
            label: "₽",
            value: "₽"
        },
    ]

    const optionsTariffs = useMemo(()=>{
        return tariffs? tariffs.map(elem=>({
                value:elem.id,
                label:<div className={classes.modal_change_room_tariff}>
                    <p className={classes.modal_change_room_tariff_name}>Тариф «{elem.name.ru}»</p>
                    <p className={classes.modal_change_room_tariff_text}>({elem.mealType?elem.mealType.name.ru:"Без питания"})</p>
                </div>
            })
        ):[]
    },[tariffs])

    /** Начальные значения */
    const initialValues = {
        date:[moment(planInfo.date,"YYYY-MM-DD"),moment(planInfo.date,"YYYY-MM-DD").add(3,"day")],
        id:planInfo.id,
        tariffId:planInfo.tariffId,
        price:planInfo.price,
        minStay:planInfo.minStay?planInfo.minStay:1,
        isPerDays:planInfo.daysOfWeek?.length,
        daysOfWeek:planInfo.daysOfWeek ?? []
    }

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
        let isSave =await dispatcher(savePrice({
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

    const weekTemplate = useMemo(()=>{
        return weekDays.map((elem,id)=>{
            return (
                <Checkbox
                    className={classes.modal_change_room_week_checkbox}
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
            className={classes.modal_change_room_modal}
            classNameTitle={classes.modal_change_room_mainTitle}
        >
            <div className={classes.modal_change_room}>
                <FormHelp
                    text={"Укажите информацию о периодах выставления тарифов, стоимости и минимального срока проживания"}
                    className={classes.modal_change_room_help}
                ></FormHelp>
                <div className={classes.modal_change_room_month}>
                    <MonthSwiper checkedArr={checkedArr} onChange={(array)=>setCheckedArr(array)}></MonthSwiper>
                </div>
                <div className={classes.modal_change_room_date}>
                    <CalendarRange
                        value={values.date}
                        onChange={(value)=>{
                            setCheckedArr([])
                            handleChange({ target: { name: "date", value: value } })
                        }}
                        errorMessage={errors.dateTo}
                    ></CalendarRange>
                </div>
                <div className={classes.modal_change_room_week}>
                    <Checkbox
                        className={classes.modal_change_room_week_checkbox}
                        text={"Установить период по дням"}
                        checked={values.isPerDays}
                        name="isPerDays"
                        onChange={(event)=>{
                            handleChange({target:{ name: "isPerDays", value: event.target.checked }})
                            if(!event.target.checked)handleChange({target:{name:"daysOfWeek",value:[]}})

                        }}
                    ></Checkbox>
                    {values.isPerDays && <div className={classes.modal_change_room_week_wrap}>
                        {weekTemplate}
                    </div>}
                </div>
                <div className={classes.modal_change_room_field}>
                    <CustomSelect
                        label={"Тариф"}
                        options={optionsTariffs}
                        name="tariff"
                        value={optionsTariffs.find(elem => elem.value == values.tariffId)}
                        defaultValue={optionsTariffs.find(elem => elem.value == values.tariffId)}
                        onChange={(value) => {
                            handleChange({ target: { name: "tariffId", value: value.value } })
                        }}
                        className={"modal-change-room-selector"}
                    ></CustomSelect>
                    <InputWithSelect
                        optionsSelect={optionsCurrency}
                        nameInput="price"
                        // touched={!touched.parking_price}
                        // valid={!errors.parking_price}
                        // errorMessage={errors.parking_price}
                        valueInput={values.price}
                        onChangeInput={(event)=>{
                            handleChange({ target: { name: "price", value: event.target.value } })
                        }}
                        shouldValidate
                        required
                        errorMessage={errors.price}
                        className={classes.modal_change_room_input}
                        classNameInputWrap={classes.modal_change_room_input}
                        classNameSelect={classes.modal_change_room_input}
                        label={"Цена за ночь"}>
                    </InputWithSelect>
                </div>
                <h2 className={classes.modal_change_room_title}>Ограничения</h2>
                <p className={classes.modal_change_room_label}>Мин. срок проживания</p>
                <div className={classes.modal_change_room_minStay}>
                    <NumberInputArrow
                        className={classes.modal_change_room_number_inp}
                        name={"minStay"}
                        value={values.minStay}
                        onChange={(event)=>handleChange({ target: { name: "minStay", value: event }})}
                        errorMessage={errors.minStay}
                    ></NumberInputArrow>
                    <HelpNotation
                        text={"Укажите минимально допустимое кол-во ночей для бронирования"}
                        className={classes.modal_change_room_notation}
                    >
                    </HelpNotation>
                </div>
            </div>
        </TwoButtonModal>
    )
}

export default ModalChangeRoom