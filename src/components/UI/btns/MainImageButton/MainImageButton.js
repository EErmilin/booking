import React, {useEffect, useState} from "react"
import classes from "./MainImageButton.module.scss"
import {useTranslation} from "react-i18next";



function MainImageButton({
    className,
    type="room",
    activeButton,
    onClick
}){
    const [active,setActive]=useState(activeButton)
    useEffect(()=>{
        setActive(activeButton)
    },[activeButton])
    const {t} = useTranslation()
    const cls = [active?classes.main_image_button_active:classes.main_image_button]
    if(className)cls.push(className)


    return (
        <div className={cls.join(" ")}>
            {!active && <div
                className={classes.main_image_button_help}>{type === "room" ? t("mainImage.roomHelp") : t("mainImage.hotelHelp")}</div>}
            <button
                type="button"
                onClick={(e)=>{
                    e.preventDefault()
                    onClick(active)
                    setActive(!active)
                }}
            ></button>
            {active &&<span className={classes.main_image_button_active_text}>{t("mainImage.text")}</span>}
        </div>
    )
}

export default MainImageButton