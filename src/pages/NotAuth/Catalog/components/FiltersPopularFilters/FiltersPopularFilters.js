import React,{useMemo} from "react"
import classes from "./FiltersPopularFilters.module.scss"
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import Checkbox from "../../../../../components/UI/areas/Checkbox/Checkbox";
import HideFilters from "../HideFilters/HideFilters";
import {catalogFiltersConfig} from "../../constants/catalogFiltersConfig";
import StarRating from "../../../../../components/StarRating/StarRating";

function FiltersPopularFilters ({filters,onChange}){
    const popularFilters = useSelector(state => state.catalog.popularFilters)
    const {t} = useTranslation()


    const filtersTemplate = useMemo(()=>{
        const arrFilters = []
        if(!Object.keys(popularFilters).length)return <div></div>
        for (let key in popularFilters){
            popularFilters[key].forEach((elem,id)=>{
                arrFilters.push({...elem,type:catalogFiltersConfig[key]})
            })
        }

        return arrFilters.sort((a, b) => +a.position - (+b.position)).map((elem,id)=>{
            if(elem.type === "stars"){
                return (
                    <div className={classes.filter_popular_filters_all_checkboxes_item} key={id}>
                        <Checkbox
                            className={classes.filter_popular_filters_checkboxes}
                            checked={filters.stars?.includes(+elem.value)}
                            onChange={() => onChange(elem)}
                            text={
                                <StarRating
                                    className={classes.filter_popular_filters_checkboxes_label}
                                    maxRating={5}
                                    starRating={elem.value}
                                ></StarRating>
                            }>
                        </Checkbox>
                    </div>
                )
            }else if(Array.isArray(filters[elem.type])){
                return (
                    <div className={classes.filter_popular_filters_all_checkboxes_item} key={id}>
                        <Checkbox
                            checked={filters[elem.type].includes(+elem.value?+elem.value:elem.value)}
                            classNameCheckBox={classes.filter_popular_filters_all_checkboxes_check}
                            classNameLabel={classes.filter_popular_filters_all_checkboxes_label}
                            text={elem.name}
                            onChange={()=>onChange(elem)}
                        />
                    </div>
                )
            }else{

                return (
                    <div className={classes.filter_popular_filters_all_checkboxes_item} key={id}>
                        <Checkbox
                            checked={filters[elem.type]}
                            classNameCheckBox={classes.filter_popular_filters_all_checkboxes_check}
                            classNameLabel={classes.filter_popular_filters_all_checkboxes_label}
                            text={elem.name}
                            onChange={()=>onChange(elem)}
                        />
                    </div>
                )
            }
        })
    },[popularFilters,filters])

    if(!Object.keys(popularFilters).length)return ''

    return (
        <div className={classes.filter_popular_filters}>
            <div className={classes.filter_popular_filters_all_item}>
                <h3 className={classes.filter_popular_filters_all_subtitle}>{t(`filterCatalog.popularFilters`)}</h3>
                <div className={classes.filter_popular_filters_all_checkboxes}>
                    {filtersTemplate}
                </div>
            </div>
        </div>
    )
}

export default FiltersPopularFilters