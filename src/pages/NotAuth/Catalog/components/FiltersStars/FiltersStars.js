import React from 'react'
import classes from "./FiltersStars.module.scss";
import Checkbox from "../../../../../components/UI/areas/Checkbox/Checkbox";
import { useTranslation } from "react-i18next";
import StarRating from '../../../../../components/StarRating/StarRating';

function FiltersStars({
    filters,
    onChange
}) {
    const { t } = useTranslation()
    const filterValues = [5, 4, 3, 2, 1, 0]

    const renderFilter = () => {
        return filterValues.map((value) => {
            return <Checkbox
                className={classes.filter_stars_checkboxes}
                checked={filters?.includes(value)}
                onChange={() => onChange(value)}
                text={
                    <StarRating
                        className={classes.filter_stars_checkboxes_label}
                        maxRating={5}
                        starRating={value}
                    ></StarRating>
                }>
            </Checkbox>

        })
    }

    return renderFilter()


}

export default FiltersStars