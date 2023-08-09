import React from "react";
import classes from "./RoomOptions.module.scss"

export default function RoomOptions({ options, className }) {

    const allClasses = [classes.list];
    let templateOptions = [];
    if (className) allClasses.push(className);

    if (options.length) {
        templateOptions = options.map((item, index) => {
            if (item.value) {
                let text = item.value
                if (item.id === 'area') {
                    text = item.value + ' м²'
                }
                if(item.id === "beds"){
                    text = item.value.map((elem,i)=> {
                        if(i !== item.value.length-1) {
                            return ` ${elem.bedType.name.ru},`
                        }else return` ${elem.bedType.name.ru}`
                    })
                }
                return (
                    <div className={[classes.item,classes[item.id]].join(' ')} key={index}>
                        <div className={classes.name}>
                            {item.name}:
                        </div>
                        <div className={classes.value}>
                            {text}
                        </div>
                    </div>
                )
            } else return null;
        })
    }

    return (
        <div className={allClasses.join(" ")}>
            {templateOptions}
        </div>
    )
}