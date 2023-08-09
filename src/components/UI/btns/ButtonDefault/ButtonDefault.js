import React from "react"
import classes from "./ButtonDefault.module.scss";

function ButtonDefault ({
    text,
    disabled = false,
    type = 'button',
    style = null,
    onClick,
    className,
    children
}){
    const cls = [classes.ButtonDefault];
    if (className) {
        cls.push(className);
    }


    return (
        <button
            className={cls.join(' ')}
            type={type}
            disabled={disabled}
            onClick={() => onClick && onClick()}
            style={style}
        >
            {children || text}
        </button>

    )
}

export default ButtonDefault