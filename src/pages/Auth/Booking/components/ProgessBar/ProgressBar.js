import classes from "./ProgressBar.module.scss";
import React from "react";


function ProgressBar({
    className,
    progress,
    cityName="",
    title,
    text
}){
    const cls = [classes.progress_bar]
    if(className)cls.push(className)

    return (
        <div className={cls.join(' ')}>
            <div className={classes.progress_bar_city}>{title}</div>
            <div className={classes.progress_bar_wrp}>
                <div className={classes.progress_bar_progress} style={{width:`${progress}%`}}></div>
            </div>
            <div className={classes.progress_bar_text}>{text}</div>
        </div>
    )
}

export default ProgressBar