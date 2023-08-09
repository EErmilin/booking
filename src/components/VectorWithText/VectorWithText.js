import React from "react"
import classes from "./VectorWithTitle.module.scss";


function VectorWithText({
    className,
    text
}){
    const cls = [classes.vector_with_text]
    if(className)cls.push(className)

    return (
        <div className={cls.join(" ")}>
            <span className={classes.vector_with_text_icon}></span>
            <span className={classes.vector_with_text_txt}>{text}</span>
        </div>
    )
}

export default VectorWithText