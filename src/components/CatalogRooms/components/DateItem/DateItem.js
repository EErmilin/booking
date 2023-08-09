import React from "react"
import classes from "./DateItem.module.scss"
import moment from "moment";
import { useLocation, useSearchParams } from "react-router-dom";
import serialize from "../../../../functions/serialize";


function DateItem({
    date,
    filters
}) {
    const [searchParams, setSearchParams] = useSearchParams()

    const changeDate = () => {
        let obj = {
            id: filters.region.id,
            dateFrom: date.date_arrival,
            dateTo: date.date_departure,
            adults: filters.adults,
            children: filters.children,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice
        }
        setSearchParams(obj, { replace: true })
    }

    return (
        <div className={classes.date_item} onClick={changeDate}>
            <div className={classes.date_item_date}>
                {moment(date.date_arrival, "YYYY-MM-DD").format("DD MMM")} — {moment(date.date_departure, "YYYY-MM-DD").format("DD MMM")}
            </div>
            <div className={classes.date_item_price_wrp}>
                {date.sum !== date.discount_sum && <div className={classes.date_item_price_full}>от {date.sum} руб.</div>}
                <div className={classes.date_item_price}>от {date.discount_sum} руб.</div>
                <div className={classes.date_item_availability}>Доступные варианты: {date.count_rooms}</div>
            </div>
        </div>
    )
}


export default DateItem