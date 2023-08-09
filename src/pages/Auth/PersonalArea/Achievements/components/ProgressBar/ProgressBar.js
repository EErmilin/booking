import React from "react"
import classes from "./ProgressBar.module.scss"


function ProgressBar ({
    className,
    progress=30
}){
    const cls = [classes.progress_bar]
    if(className)cls.push(className)


    return <div className={cls.join(' ')}>
        <div className={classes.progress} style={{width:`${progress}%`}}></div>
    </div>
}

export default ProgressBar