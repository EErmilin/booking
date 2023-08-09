import React from "react";
import classes from "./BestDirectionItem.module.scss";
import { NavLink } from "react-router-dom";


function BestDirectionItem({
    directionItem,
}) {
    const url = `/catalog/1?id=${directionItem.region_id}&type=region&name=${directionItem.name.ru}`

    return (
        <div className={classes.wrap}>
            <NavLink to={url} className={classes.clickable}></NavLink>
            <img className={classes.img} src={directionItem.image} alt={directionItem.name.ru} />
            <div className={classes.panel}>
                <h2 className={classes.title}>{directionItem.name.ru}</h2>
                <p className={classes.text}>{directionItem.text}</p>
            </div>
        </div>
    )
}

export default BestDirectionItem