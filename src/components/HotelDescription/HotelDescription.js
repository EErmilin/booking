import React, { useEffect, useRef, useState } from "react"
import classes from "./HotelDescription.module.scss";
import { useTranslation } from "react-i18next";
import Button from "../UI/btns/Button/Button";

function HotelDescription({
    className,
    description
}) {
    const [isClick, setIsClick] = useState(false)
    const cls = [classes.hotel_description]
    const descriptionRef = useRef()
    const descriptionWrpRef = useRef()
    if (className) cls.push(className)

    const { t } = useTranslation()

    const [longDescription, setLongDescription] = useState(false)

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    const height = isMobile ? 130 : 500

    function expandDescription() {
        if (!isClick) {
            const scrollHeight = descriptionRef.current.scrollHeight
            descriptionWrpRef.current.style.height = `${scrollHeight}px`
            descriptionWrpRef.current.classList.add(classes.hotel_description_active)
            setIsClick(!isClick)
        } else {
            descriptionWrpRef.current.style.height = `${height}px`
            descriptionWrpRef.current.classList.remove(classes.hotel_description_active)
            setIsClick(!isClick)
        }
    }

    function descriptionFrameHandler() {
        if (isMobile) {
            descriptionWrpRef.current.style.height = `130px`
        }
        const descriptionHeight = descriptionRef.current.scrollHeight;

        if (descriptionHeight > height) {
            descriptionWrpRef.current.classList.add(classes.hotel_description_long)
            setLongDescription(true);
        }
    }

    useEffect(descriptionFrameHandler, [])

    return (
        <div className={cls.join(' ')} ref={descriptionWrpRef}>
            <div className={classes.hotel_description_wrap} ref={descriptionRef}>
                <div className={classes.description} dangerouslySetInnerHTML={{ __html: description.ru }} />
            </div>
            {longDescription &&
                <Button
                    onClick={expandDescription}
                    btnColor="ButtonWhite"
                    className={classes.hotel_description_btn}
                >{isClick ? t("hotelCard.description.hideBtn") : t("hotelCard.description.openBtn")}</Button>
            }
        </div>
    )
}

export default HotelDescription