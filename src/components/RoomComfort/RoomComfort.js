import React from "react";
import classes from "./RoomComfort.module.scss"

export default function RoomComfort({comfort, className}) {
    const allClasses = [classes.list];
    if (className) allClasses.push(className);

    const comfortTemplate = comfort.map((elem, id) => {
        return (
            <div className={classes.item} key={id}>
                <div className={[classes.icon, classes[elem.code]].join(" ")}></div>
                <div className={classes.text}>{elem.text}</div>
            </div>
        )
    })

    return(
        <div className={allClasses.join(" ")}>
            {comfortTemplate}
        </div>
    )
}