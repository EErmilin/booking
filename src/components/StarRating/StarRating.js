import React from 'react'
import classes from "./StarRating.module.scss";

function StarRating({
    width,
    height,
    className,
    starClassName,
    starRating,
    maxRating,
}) {
    const cls = [classes.star_rating]

    if (className) cls.push(className)

    const starTemplate = []

    for (let i = 0; i < maxRating; i++) {
        if (i < starRating) {
            starTemplate.push(<div style={{ width: width ? `${width}px` : '', height: height ? `${height}px` : '' }} className={[classes.icon, starClassName, classes.star].join(' ')} key={i} ></div>)
        } else {
            starTemplate.push(<div style={{ width: width ? `${width}px` : '', height: height ? `${height}px` : '' }} className={[classes.icon, starClassName, classes.default_star].join(' ')} key={i} ></div>)
        }
    }

    if (!starRating) {
        return <div className={cls.join(' ')}>
            <span className={classes.noRating}>Без звезд</span>
        </div>
    } else {
        return (
            <div className={cls.join(' ')}>
                {starTemplate}
            </div>)
    }

}

export default StarRating