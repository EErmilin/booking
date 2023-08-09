import React, {useMemo} from "react"
import classes from "./FiltersArrival.module.scss"
import {useTranslation} from "react-i18next";
import Checkbox from "../../../../../components/UI/areas/Checkbox/Checkbox";
import {useSelector} from "react-redux";
import HideFilters from "../HideFilters/HideFilters";



function FiltersArrival({
    arrival=true,
    onChange,
    filters
}){
    const {t} = useTranslation()
    const allFiltersCatalog = useSelector(state => state.catalog.allFilters)
    const arrTime =useMemo(()=>{
        return allFiltersCatalog.filter(elem=>elem.type === (arrival?"arrival_time":"departure_time"))
    },[allFiltersCatalog])

    const shownFilters = useMemo(()=>{
        const type = arrival?"arrival":"departure"
        return arrTime.slice(0,5).map((elem,id)=>{

            const checked = type === "arrival"?
                filters[`${type}_time_after`].includes(elem.body.after):
                filters[`${type}_time_before`].includes(elem.body.before)

            return <div className={classes.filter_arrival_all_checkboxes_item} key={id}>
                <Checkbox
                    checked={checked}
                    classNameCheckBox={classes.filter_arrival_all_checkboxes_check}
                    classNameLabel={classes.filter_arrival_all_checkboxes_label}
                    text={type==="arrival"?`С ${elem.body.after}`:` До ${elem.body.before}`}
                    onChange={()=>onChange(elem.body)}
                />
            </div>
        })
    },[allFiltersCatalog,filters])

    const hiddenFilters = useMemo(()=>{
        const type = arrival?"arrival":"departure"
        return arrTime.slice(5).map((elem,id)=>{

            const checked = type === "arrival"?
                filters[`${type}_time_after`].includes(elem.body.after)
                :filters[`${type}_time_before`].includes(elem.body.before)

            return <div className={classes.filter_arrival_all_checkboxes_item} key={id}>
                <Checkbox
                    checked={checked}
                    classNameCheckBox={classes.filter_arrival_all_checkboxes_check}
                    classNameLabel={classes.filter_arrival_all_checkboxes_label}
                    text={type==="arrival"?`С ${elem.body.after}`:` До ${elem.body.before}`}
                    onChange={()=>onChange(elem.body)}
                />
            </div>
        })
    },[allFiltersCatalog,filters])

    return (arrTime.length?
        <div className={classes.filter_arrival}>
            <div className={classes.filter_arrival_all_item}>
                <h3 className={classes.filter_arrival_all_subtitle}>{arrival?t("filterCatalog.arrival.arrival"):t("filterCatalog.arrival.departure")}</h3>
                    <HideFilters
                        children={shownFilters}
                        hiddenChildren={hiddenFilters}
                        length={arrTime.length}
                    ></HideFilters>
            </div>
        </div>:''
    )
}

export default FiltersArrival