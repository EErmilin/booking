import React from "react"
import classes from "./ProgressBar.module.scss"


function ProgressBarMap({
    className,
    progress,
    cityName=""
}){
    const cls = [classes.progress_bar_map]
    if(className)cls.push(className)

    return (
        <div className={cls.join(' ')}>
            <div className={classes.progress_bar_map_city}>Ищем доступные объекты</div>
            <div className={classes.progress_bar_map_wrp}>
                <div className={classes.progress_bar_map_progress} style={{width:`${progress}%`}}></div>
            </div>
        </div>
    )
}


export default ProgressBarMap