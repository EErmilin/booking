import React from "react"
import classes from "./WrapperFilterMain.module.scss"

/**
 * Обертка для фильтров на главной
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */

function WrapperFilterMain ({
    children
    }){
    return (
        <div className={classes.wrapper_filter_main}>
            <div className={classes.wrapper_background}></div>
            <div className={classes.wrapper_filter}>{children}</div>
        </div>
    )
}

export default WrapperFilterMain