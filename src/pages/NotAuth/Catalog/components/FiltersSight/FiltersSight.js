import React, {useMemo} from "react"
import classes from "./FiltersSight.module.scss"
import {useTranslation} from "react-i18next";
import Checkbox from "../../../../../components/UI/areas/Checkbox/Checkbox";
import {useSelector} from "react-redux";
import HideFilters from "../HideFilters/HideFilters";



function FiltersSight({
    arrival=true,
    onChange,
    filters
}){
    const {t} = useTranslation()
    const sightsFilters = useSelector(state => state.catalog.sightsFilters)


    const shownFilters = useMemo(()=>{
        if(!sightsFilters)return
        return sightsFilters.slice(0,5).map((elem,id)=>{
            return <div className={classes.filter_sight_all_checkboxes_item} key={id}>
                <Checkbox
                    checked={filters.point_of_interest_ids.includes(elem.id)}
                    classNameCheckBox={classes.filter_sight_all_checkboxes_check}
                    classNameLabel={classes.filter_sight_all_checkboxes_label}
                    text={elem.name.ru}
                    onChange={()=>onChange(elem.id)}
                />
            </div>
        })
    },[sightsFilters,filters])

    const hiddenFilters = useMemo(()=>{
        if(!sightsFilters)return
        return sightsFilters.slice(5).map((elem,id)=>{
            return <div className={classes.filter_sight_all_checkboxes_item} key={id}>
                <Checkbox
                    checked={filters.point_of_interest_ids.includes(elem.id)}
                    classNameCheckBox={classes.filter_sight_all_checkboxes_check}
                    classNameLabel={classes.filter_sight_all_checkboxes_label}
                    text={elem.name.ru}
                    onChange={()=>onChange(elem.id)}
                />
            </div>
        })
    },[sightsFilters,filters])

    return (sightsFilters && sightsFilters.length?
            <div className={classes.filter_sight}>
                <div className={classes.filter_sight_all_item}>
                    <h3 className={classes.filter_sight_all_subtitle}>{t("filterCatalog.sights.title")}</h3>
                    <HideFilters
                        children={shownFilters}
                        hiddenChildren={hiddenFilters}
                        length={sightsFilters.length}
                    ></HideFilters>
                </div>
            </div>:''
    )
}

export default FiltersSight