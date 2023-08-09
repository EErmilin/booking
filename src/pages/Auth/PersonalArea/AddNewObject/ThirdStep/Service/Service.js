import React, {useEffect, useMemo, useState} from "react";
import classes from "./Service.module.scss";
import {useTranslation} from "react-i18next";
import Checkbox from "../../../../../../components/UI/areas/Checkbox/Checkbox";



function Service ({amenity, onChange,value}){
    const {t} = useTranslation()

    function handleChange (checked,id){
        if(!value.includes(id)){
            let arr = [...value,id]
            onChange([...arr])
        }else{
            let arr = value.filter(e=>e!==id)
            onChange([...arr])
        }

    }
    const templateService = useMemo(()=>{
        return amenity && amenity.map((elem,id)=>{
            const checked = value.find(e=>e==elem.id)?true:false
            return (
                <Checkbox
                    classNameLabel={classes.service_label}
                    classNameCheckBox={classes.service_checkbox}
                    name={`service-${id}`}
                    text={elem.name.ru}
                    key={id}
                    checked={checked}
                    value={value.find(e=>e==elem.id)}
                    onChange={(event)=>{
                        handleChange(event.target.checked ,elem.id)
                    }}
                ></Checkbox>
            )
        })
    },[value,amenity])


    return (
        <div className={classes.service}>
            <div className={classes.service_serive}>
                {value  && templateService}
            </div>
        </div>
    )
}

export default Service