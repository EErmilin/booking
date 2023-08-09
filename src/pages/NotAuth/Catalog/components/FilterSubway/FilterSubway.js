import React, { useEffect, useMemo, useState } from "react"
import classes from "./FilterSubway.module.scss"
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import MultipleSelect from "../../../../../components/UI/areas/MultipleSelect/MultipleSelect";
import { Tag } from "antd";




function FilterSubway({
    filters,
    onChange
}) {
    const subwayFilters = useSelector(state => state.catalog.subwayFilters)
    const { t } = useTranslation()




    const handleCloseTag = (e, tag) => {
        e.preventDefault();
        let arr = filters.station_ids.filter(e => e !== tag.id)
        onChange(arr)
    }

    const templateTags = useMemo(() => {
        const tags = subwayFilters.length ? subwayFilters.filter(elem => filters.station_ids.includes(elem.id)).map((elem, i) => {
            return (
                <Tag
                    closable
                    onClose={(event) => handleCloseTag(event, elem)}
                    key={i}
                    className={classes.tag}
                    style={{
                        marginRight: 3,
                        background: "white",
                        border: "1px solid #56C2FE",
                        borderRadius: "27px",
                        color: "#56C2FE",
                        fontSize: "12px",
                        marginTop: "8px"
                    }}
                >
                    {elem.name.ru}
                </Tag>
            );
        }) : []
        return tags
    }, [subwayFilters, filters.station_ids])




    const optionsSubway = useMemo(() => {
        return subwayFilters.length ? subwayFilters.map((elem, key) => {
            return {
                name: elem.name.ru,
                value: elem.id,
                label: <div className={classes.filter_subway_option}>
                    <span className={classes.filter_subway_option_color} style={{ background: elem.color }}></span>
                    <div>{elem.name.ru}</div>
                </div>
            }
        }) : []
    }, [subwayFilters])


    return ((filters.region.type === "region" && subwayFilters.length) ?
        <div className={classes.filter_subway}>
            <div className={classes.filter_subway_all_item}>
                <h3 className={classes.filter_subway_all_subtitle}>{t("filterCatalog.subway.title")}</h3>
                <div className={classes.filter_subway_wrap}>
                    <MultipleSelect
                        options={optionsSubway}
                        onChange={onChange}
                        value={filters.station_ids}
                    ></MultipleSelect>
                    <div className={classes.filter_subway_tags}>
                        {templateTags}
                    </div>
                </div>
            </div>
        </div> : ""
    )
}


export default FilterSubway