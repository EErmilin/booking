import React, { useEffect, useMemo, useRef, useState } from "react"
import classes from "./AnimatedContainer.module.scss";
import Button from "../UI/btns/Button/Button";
import { useTranslation } from "react-i18next";


function AnimatedContainer({
    className,
    children,
    btnText,
    btnTextActive,
    classNameButton,
    textRef,
    photos
}) {
    const [isClick, setIsClick] = useState(false)
    const [isShowButton, setIsShowButton] = useState(false)
    const cls = [classes.animated_container, (isClick ? classes.animated_container_active : '')]
    const clsButton = [classes.animated_container_btn, (isClick ? classes.animated_container_btn_active : "")]
    if (classNameButton) clsButton.push(classNameButton)
    const descriptionRef = useRef()
    const descriptionWrpRef = useRef()
    if (className) cls.push(className)

    const { t } = useTranslation()

    function expandBlock() {
        if (!isClick) {
            const scrollHeight = descriptionRef.current.scrollHeight
            descriptionWrpRef.current.style.height = `${scrollHeight}px`
            setIsClick(!isClick)
        } else {
            descriptionWrpRef.current.style.height = photos ? `${textRef.current.scrollHeight > 200 ? 200 : textRef.current.scrollHeight}px` : `200px`
            setIsClick(!isClick)
        }

    }

    useEffect(() => {
        if (textRef.current && photos) {
            if (!isClick) {
                descriptionWrpRef.current.style.height = `${textRef.current.scrollHeight > 200 ? 200 : textRef.current.scrollHeight}px`
            } else {
                descriptionWrpRef.current.style.height = `${descriptionRef.current.scrollHeight}px`
            }
        } else {
            descriptionWrpRef.current.style.height = `200px`
        }
        if (descriptionRef.current && descriptionRef.current.scrollHeight > 200) {
            setIsShowButton(true)
        }
    }, [descriptionRef, textRef])

    return (
        <div className={cls.join(' ')} ref={descriptionWrpRef}>
            <div className={classes.animated_container_wrap} ref={descriptionRef}>
                {children}
            </div>
            {isShowButton && <Button
                onClick={expandBlock}
                btnColor="outline_blue"
                className={clsButton.join(' ')}
            >{isClick ? (btnText ? btnText : t("hotelCard.description.hideBtn")) : (btnTextActive ? btnTextActive : t("hotelCard.description.openBtn"))}</Button>}
        </div>
    )
}
export default AnimatedContainer