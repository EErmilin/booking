import React from "react"
import classes from "./ButtonMap.module.scss";


function ButtonMap ({
    className,
    children,
    icon,
    onClick,
    id
}){
    const cls = [classes.button_map]
    if(className)cls.push(className)

    const btnIcon = icon?icon:classes.button_map_icon_map

    return (
        <div className={cls.join(" ")}>
            <button className={classes.button_map_btn} onClick={onClick} id={id}>
                <span className={[classes.button_map_icon,btnIcon].join(' ')}></span>
                {children}
            </button>
        </div>
    )
}

export default ButtonMap