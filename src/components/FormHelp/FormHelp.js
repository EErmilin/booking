import React from "react";
import classes from "./FormHelp.module.scss";


function FormHelp ({
    text,
    className
}){
    const cls = [classes.form_help]
    if(className)cls.push(className)

    return (
        <div className={cls.join(' ')}>
            <div className={classes.form_help_txt}>{text}</div>
        </div>
    )
}


export default FormHelp