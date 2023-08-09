import React, { useState, useMemo } from 'react'
import classes from "./FiltersTypeHotel.module.scss";
import Checkbox from "../../../../../components/UI/areas/Checkbox/Checkbox";
import Button from "../../../../../components/UI/btns/Button/Button";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

function FiltersTypeHotel({
    filters,
    onChange
}) {
    const { t } = useTranslation()
    const [active, setActive] = useState(false)
    const typeHotels = useSelector(state => state.catalog.typeHotels)

    const shownFilters = useMemo(() => {
        return typeHotels && typeHotels.length && typeHotels.slice(0, 5).map((elem, id) => {
            return (
                <div className={classes.filter_type_hotel_checkboxes_item} key={id}>
                    <Checkbox
                        classNameCheckBox={classes.filter_type_hotel_checkboxes_check}
                        classNameLabel={classes.filter_type_hotel_checkboxes_label}
                        checked={filters.includes(elem.id)}
                        onChange={() => {
                            onChange(elem.id)
                        }}
                        text={elem.name}></Checkbox>
                </div>
            )
        })
    }, [typeHotels, filters])

    const hideFilters = useMemo(() => {
        return typeHotels && typeHotels.length && typeHotels.slice(5).map((elem, id) => {
            return (
                <div className={classes.filter_type_hotel_checkboxes_item} key={id}>
                    <Checkbox
                        classNameCheckBox={classes.filter_type_hotel_checkboxes_check}
                        classNameLabel={classes.filter_type_hotel_checkboxes_label}
                        checked={filters.includes(elem.id)}
                        onChange={() => {
                            onChange(elem.id)
                        }}
                        text={elem.name}></Checkbox>
                </div>
            )
        })
    }, [typeHotels, filters])

    if (typeHotels && typeHotels.length) {
        return (
            <div className={classes.filter_type_hotel_checkboxes}>
                <div className={classes.filter_type_hotel_shown}>
                    {shownFilters}
                </div>
                <div className={active ? classes.filter_type_hotel_shown : classes.filter_type_hotel_hide}>
                    {hideFilters}
                </div>
                {hideFilters.length ? <Button
                    onClick={() => setActive(!active)}
                    className={classes.show_all}
                >
                    {active ? t("filterCatalog.search.hideAllType") : `Показать все ${typeHotels.length} фильтров `}
                </Button> : ''}
            </div>
        )
    }
}

export default FiltersTypeHotel