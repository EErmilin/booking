import React from "react";
import classes from "./RoomServices.module.scss";
import VectorWithText from "../VectorWithText";
import {getAmenitie} from "./functions/functions";

function RoomServices({amenities=[],integration_type}) {
    let servicesTemplate = [];

    if (amenities.length && integration_type!==2) {
        servicesTemplate = amenities.map((item, index) => {
            return(
                <div className={classes.item} key={index}>
                    <VectorWithText text={getAmenitie(item).name}/>
                </div>
            );
        })
    }else{
        servicesTemplate = amenities.map((item, index) => {
            return(
                <div className={classes.item} key={index}>
                    <VectorWithText text={item.name}/>
                </div>
            );
        })
    }

    return (
        <div className={classes.list}>
            {servicesTemplate}
        </div>
    )
}

export default RoomServices;