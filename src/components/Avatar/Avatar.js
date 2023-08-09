import React from "react"
import classes from "./Avatar.module.scss";

function Avatar({
                    className,
                    avatar,
                    width,
                    height,
                }) {
    const cls = [classes.avatar]
    if (className) cls.push(className)

    const style = {}

    if (width && height) {
       style.width = width
       style.height = height
    }

    return (
        <div
            style={style}
            className={cls.join(' ')}
        >
            {avatar
                ? <img src={avatar} className={classes.avatar_img} alt=""/>
                : <div className={classes.avatar_no_avatar}></div>
            }
        </div>
    )
}

export default Avatar