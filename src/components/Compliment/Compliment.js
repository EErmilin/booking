import React from "react"
import classes from "./Compliment.module.scss";
import {useTranslation} from "react-i18next";


function Compliment ({
    className,
    compliment
}){
    const {t} = useTranslation()
    const cls = [classes.compliment]
    if(className)cls.push(className)

    return (
        <div className={cls.join(' ')}>
            <h2 className={classes.compliment_title}>{t("hotelCard.description.compliment")}</h2>
            <div className={classes.compliment_text}>{compliment.description}</div>
        </div>
    )
}

export default Compliment