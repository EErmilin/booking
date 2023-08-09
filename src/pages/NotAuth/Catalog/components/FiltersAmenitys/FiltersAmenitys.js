import React, {useEffect, useMemo,useState} from "react"
import classes from "./FilterAmenitys.module.scss";
import {useDispatch, useSelector} from "react-redux";
import Checkbox from "../../../../../components/UI/areas/Checkbox/Checkbox";
import {useTranslation} from "react-i18next";
import Button from "../../../../../components/UI/btns/Button/Button";
import HideFilters from "../HideFilters/HideFilters";




function FiltersAmenity ({filters,onChange}){
    const filtersCatalog = useSelector(state => state.catalog.allFilters)
    const {t} = useTranslation()
    const filtersTemplate = useMemo(()=>{
        let arrTypes = []
        filtersCatalog.forEach(elem=>{
            if(!arrTypes.includes(elem.type) && (elem.type!=="departure_time" && elem.type!=="arrival_time")){
                arrTypes.push(elem.type)
            }
        })
        if(!arrTypes.length)return <div></div>

        return arrTypes.length ? arrTypes.map((elemType,id)=>{
            if(elemType==="meal_type")return
            const filteredArr = filtersCatalog.filter(elem=>elem.type===elemType)
            const shownFilters = filteredArr.slice(0,5).map((elem,key)=>{
                return <div className={classes.filter_amenity_all_checkboxes_item} key={key}>
                    <Checkbox
                        checked={filters.includes(+elem.body.id)}
                        classNameCheckBox={classes.filter_amenity_all_checkboxes_check}
                        classNameLabel={classes.filter_amenity_all_checkboxes_label}
                        text={elem.body.amenity_ru}
                        onChange={()=>onChange(+elem.body.id)}
                    />
                </div>
            })
            const hiddenFilters = filteredArr.slice(5).map((elem,key)=>{
                return <div className={classes.filter_amenity_all_checkboxes_item} key={key}>
                    <Checkbox
                        checked={filters.includes(+elem.body.id)}
                        classNameCheckBox={classes.filter_amenity_all_checkboxes_check}
                        classNameLabel={classes.filter_amenity_all_checkboxes_label}
                        text={elem.body.amenity_ru}
                        onChange={()=>onChange(+elem.body.id)}
                    />
                </div>
            })
            return(
            <div className={classes.filter_amenity_all_item}>
                <h3 className={classes.filter_amenity_all_subtitle}>{t(`filterCatalog.amenity.${elemType}`)}</h3>
                <HideFilters
                    children={shownFilters}
                    hiddenChildren={hiddenFilters}
                    length={filteredArr.length}
                ></HideFilters>
            </div>)
        }):null
    },[filtersCatalog,filters])

    return (
        <div className={classes.filter_amenity}>
            {filtersTemplate}
        </div>
    )
}

export default FiltersAmenity