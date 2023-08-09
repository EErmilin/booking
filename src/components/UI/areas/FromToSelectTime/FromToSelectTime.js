import React from "react"
import classes from "./FromToSelectTime.module.scss";
import {useTranslation} from "react-i18next";
import CustomSelect from "../CustomeSelect/CustomSelect";


function FromToSelectTime ({
    label,
    className,
    classNameWrap,
    classNameSelects,
    valueFrom,
    valueTo,
    onChangeFrom,
    onChangeTo,
}){
    const {t} = useTranslation()


    const optionTime = []
    for (let i = 1;i<25;i++){
        if(i<10){
            optionTime.push({
                label:`0${i}:00`,
                value:i,
            })
        }else{
            optionTime.push({
                label:`${i}:00`,
                value:i,
            })
        }

    }

    /** Создаем уникальный id */
    const id = `select-${Math.random()}`;

    /** Отображение label */
    const labelTemplate = label ? <label htmlFor={id}>{label}</label> : null;


    /** Формируем стили */
    const cls = [classes.from_to_select]
    if(className)cls.push(className)


    const clsSelectWrap = [classes.from_to_select_wrap]
    if(classNameWrap)clsSelectWrap.push(classNameWrap)

    const clsSelect = [classes.from_to_select_select]
    if(classNameSelects)clsSelect.push(classNameSelects)

    function handleChange(from,to){

    }

    return (
        <div className={cls.join(' ')}>
            {labelTemplate}
            <div className={clsSelectWrap.join(' ')}>
                <span>{t("fromToSelect.from")}</span>
                <CustomSelect
                    options={optionTime}
                    defaultValue={optionTime[0]}
                    className={clsSelect.join(' ')}
                    value={optionTime.find(elem=>elem.value==+valueFrom)}
                    onChange={(value)=>onChangeFrom(value.value)}
                ></CustomSelect>
                <span>{t("fromToSelect.to")}</span>
                <CustomSelect
                    options={optionTime}
                    defaultValue={optionTime[0]}
                    className={clsSelect.join(' ')}
                    value={optionTime.find(elem=>elem.value==+valueTo)}
                    onChange={(value)=>onChangeTo(value.value)}
                ></CustomSelect>
            </div>
        </div>
    )
}

export default FromToSelectTime