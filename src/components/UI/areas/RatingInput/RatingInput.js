import React, {useMemo} from "react"
import classes from "./RatingInput.module.scss"
import {useTranslation} from "react-i18next";


function RatingInput ({
    starLength,
    value,
    onChange,
    className,
    label,
    id
}){
    const cls = [classes.rating_input]
    const { t } = useTranslation()
    if(className)cls.push(className)
    /** Отображение label */
    const labelTemplate = label ? <label htmlFor={id}>{label}</label> : null;
    const templateStars = useMemo(()=>{
        let arr =[]
        for (let i = 1; i <= starLength; i++) {
            arr.push(<div className={i<=value?classes.active:classes.star} key={i} onClick={()=>onChange(i)}></div>)
        }
        return arr
    },[value])

    let ratingText = ''
    if (value >= 9) {
        ratingText = t("hotelCard.excellent")
    } else if (value >= 8) {
        ratingText = t("hotelCard.perfect")
    }
    else if (value >= 7) {
        ratingText = t("hotelCard.veryGood")
    }
    else if (value >= 6) {
        ratingText = t("hotelCard.good")

    }
    else if (value >= 5) {
        ratingText = t("hotelCard.notBad")

    }
    else if (value < 5) {
        ratingText = t("hotelCard.bad")

    }

    return <div className={cls.join(' ')}>
        {labelTemplate}
        <div className={classes.rating_input_wrap}>
            <div className={classes.rating_input_wrap_star}>{templateStars}</div>
            <div className={classes.rating_input_wrap}>
                <div className={classes.rating_input_number}>{value}</div>
                <div className={classes.rating_input_text}>({ratingText})</div>
            </div>
        </div>
    </div>
}

export default RatingInput