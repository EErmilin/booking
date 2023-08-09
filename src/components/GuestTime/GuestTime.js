import React from "react"
import classes from "./GuestTime.module.scss";
import {useTranslation} from "react-i18next";



function GuestTime ({
    className,
    classNameTitle,
    guest_time
}){
    const {t} = useTranslation()
    const cls = []
    if(className)cls.push(className)
    const clsTitle = [classes.title]
    if(classNameTitle)clsTitle.push(classNameTitle)
    return (
        <div className={cls.join(' ')}>
            <h2 className={clsTitle.join(' ')}>{t("hotelCard.description.settlement")}</h2>
            <div className={classes.guest_time}>
                <ul className={classes.guest_time_list}>
                    <div className={[classes.guest_time_wrap,classes.arrival].join(' ')}>
                        <li>
                            <span>{t("hotelCard.description.checkInText")}</span>
                            <p>После {guest_time.arrival_after}</p>
                        </li>
                    </div>
                    <div className={[classes.guest_time_wrap,classes.departure].join(' ')}>
                        <li>
                            <span>{t("hotelCard.description.checkOutText")}</span>
                            <p>До {guest_time.departure_before}</p>
                        </li>
                    </div>

                </ul>
            </div>
        </div>

    )
}


export default GuestTime