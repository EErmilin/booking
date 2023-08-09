import React from "react"
import classes from "./BackgroundMain.module.scss"


/**
 * Бэкгроунд главной страницы
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */

function BackgroundMain ({
    children
}){
    return (
        <div className={classes.background_main}>
            {children}
        </div>
    )
}

export default BackgroundMain