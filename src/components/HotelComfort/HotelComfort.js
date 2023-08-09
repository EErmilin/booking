import React from "react"
import classes from "./HotelComfort.module.scss"
import {useTranslation} from "react-i18next";

const fakeComfort = [
    {
        type:"wifi"
    },
    {
        type:"headPhone"
    },
    {
        type:"accessible",
    },
    {
        type:"parking",
    },
    {
        type: "pool",
    },

]


function HotelComfort ({
    className,
    comfortArray=fakeComfort,
}){
    const {t} = useTranslation()
    const cls = [classes.hotel_comfort]
    if(className)cls.push(className)

    const templateComfort = comfortArray.map((elem,id)=>{
        return (
            <div className={classes.hotel_comfort_item} key={id}>
                <span className={[classes.hotel_comfort_icon,classes[elem.type]].join(' ')}></span>
                <span className={classes.hotel_comfort_text}>{t(`hotelCard.comfort.${elem.type}`)}</span>
            </div>
        )
    })

    return (
        <div
            className={cls.join(' ')}
        >
            {templateComfort}
        </div>
    )
}

export default HotelComfort