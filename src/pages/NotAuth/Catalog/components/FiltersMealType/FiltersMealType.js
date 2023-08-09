import React, { useMemo} from "react"
import classes from "./FiltersMealType.module.scss";
import { useSelector} from "react-redux";
import Checkbox from "../../../../../components/UI/areas/Checkbox/Checkbox";
import {useTranslation} from "react-i18next";
import HideFilters from "../HideFilters/HideFilters";


function FiltersMealType ({filters,onChange}){
    const filtersCatalog = useSelector(state => state.catalog.allFilters)
    const {t} = useTranslation()
    const filtersTemplate = useMemo(()=>{
        let filteredArr = filtersCatalog.filter(elem=>elem.type==="meal_type")
        if(!filteredArr.length)return <div></div>

        const shownFilters = filteredArr.slice(0,5).map((elem,key)=>{
            return <div className={classes.filter_meal_all_checkboxes_item} key={key}>
                <Checkbox
                    checked={filters.includes(+elem.body.id)}
                    classNameCheckBox={classes.filter_meal_all_checkboxes_check}
                    classNameLabel={classes.filter_meal_all_checkboxes_label}
                    text={elem.body.name}
                    onChange={()=>onChange(+elem.body.id)}
                />
            </div>
        })
        const hiddenFilters = filteredArr.slice(5).map((elem,key)=>{
            return <div className={classes.filter_meal_all_checkboxes_item} key={key}>
                <Checkbox
                    checked={filters.includes(+elem.body.id)}
                    classNameCheckBox={classes.filter_meal_all_checkboxes_check}
                    classNameLabel={classes.filter_meal_all_checkboxes_label}
                    text={elem.body.name}
                    onChange={()=>onChange(+elem.body.id)}
                />
            </div>
        })
        return(
            <div className={classes.filter_meal_all_item}>
                <h3 className={classes.filter_meal_all_subtitle}>{t(`filterCatalog.amenity.meal_type`)}</h3>
                <HideFilters
                    children={shownFilters}
                    hiddenChildren={hiddenFilters}
                    length={filteredArr.length}
                ></HideFilters>
            </div>
        )
    },[filtersCatalog,filters])

    return (
        <div className={classes.filter_meal}>
            {filtersTemplate}
        </div>
    )
}

export default FiltersMealType