import React from "react"
import classes from "./HelpNotation.module.scss"

function HelpNotation({className, text, classNameText, icon = `default`}) {

    const cls = [classes.wrap]
    const clsText = [classes.text]
    const clsIcon = [classes.icon]

    if (icon) clsIcon.push(classes[`icon_${icon}`])
    if (className) cls.push(className)
    if (classNameText) clsText.push(classNameText)

    return (
        <div className={cls.join(" ")}>
            <div className={clsText.join(" ")}>{text}</div>
            <div className={clsIcon.join(" ")}></div>
        </div>
    )
}

export default HelpNotation