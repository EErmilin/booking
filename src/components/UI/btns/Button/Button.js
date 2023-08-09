import React from "react"
import classes from "./Button.module.scss";


/**
 *
 * @param className
 * @param withoutBorder
 * @param children
 * @param btnColor "ButtonGreen" || "ButtonGradient" || "ButtonBlue" || "ButtonRed"
 * @returns {JSX.Element}
 * @constructor
 */

function Button({
    className,
    withoutBorder,
    children,
    btnColor,
    type,
    disabled,
    onClick,
    typeButton=1,
    ...rest
}){
    const cls = [typeButton === 1 ? classes.Button : classes.Button2]

    if(btnColor){
        const arColors = btnColor.split(" ")
        arColors.forEach(color => {
            cls.push(classes[color])
        })
    }

    if(className){
        cls.push(className)
    }

    if(withoutBorder){
        cls.push(classes.WithoutBorder)
    }

    return (
        <button
            type={type}
            onClick={onClick}
            className={cls.join(' ')}
            disabled={disabled}
            {...rest}
        >{children}</button>
    )
}

export default Button