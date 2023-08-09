import React, {useState} from "react"
import "./BedLine.scss";
import CustomSelect from "../../areas/CustomeSelect/CustomSelect";
import NumberInputArrow from "../../areas/NumberInputArrow/NumberInputArrow";
import {useTranslation} from "react-i18next";


function BedLine ({
    bed,
    id,
    bedTypes,
    onDelete,
    onChange
}){
    const {t} = useTranslation()


    const optionBed = [
        {
            label:"Двуспальная кровать",
            value:1,
        },
        {
            label:"Односпальная кровать",
            value:2,
        },
        {
            label:"Двухъярусная кровать",
            value:3,
        }
    ]

  const bedTypesList = bedTypes.map(bedType => {
    return {
      label: bedType.name.ru,
      value: bedType.id
    }
  })


    return (
        <div className={"bed_line"}>
            <CustomSelect
                className={"bed_line_select"}
                options={bedTypesList}
                value={bedTypesList.find(elem=>elem.value==bed.bed_type_id)}
                onChange={(option)=>{
                    let newObj = {...bed}
                    newObj.bed_type_id = option.value
                    onChange(id,newObj)
                }}
                label={t("addNewObjects.secondStep.form.beds.typeBed")}
            ></CustomSelect>
            <NumberInputArrow
                value={bed.bed_count}
                onChange={(value)=>{
                    let newObj = {...bed}
                    newObj.bed_count = value
                    onChange(id,newObj)
                }}
                className="bed_line_field"
                label={t("addNewObjects.secondStep.form.beds.quantityBed")}

            ></NumberInputArrow>
            <div onClick={()=>onDelete(bed.deleteId,bed.id)} className={"bed_line_icon"}></div>
        </div>
    )
}

export default BedLine