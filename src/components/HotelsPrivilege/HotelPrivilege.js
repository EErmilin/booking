import React from "react"
import classes from "./HotelsPrivilege.module.scss";

function HotelPrivilege ({
    className,
    privilege,
}){
    const cls = [classes.hotel_privilege]
    if(className)cls.push(className)

    const templatePrivilege = privilege.map((elem,id)=>{
        let icon;
        if(elem === "accessible"){
            icon = classes.accessible
        }else if(elem === "music"){
            icon = classes.music
        }else if(elem === "parking"){
            icon = classes.parking
        }else if(elem === "pool"){
            icon = classes.pool
        }else if(elem === "car"){
            icon = classes.car
        }else if(elem === "wifi"){
            icon = classes.wifi
        }

        return (
            <span key={id} className={[classes.icon,icon].join(' ')}></span>
        )
    })

    return (
        <div className={cls.join(' ')}>
            {templatePrivilege}
        </div>
    )
}

export default HotelPrivilege