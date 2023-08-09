import React, {useMemo} from "react"
import classes from "./NearbyAttractions.module.scss"
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import VectorWithText from "../../../../../components/VectorWithText";


function NearbyAttractions({
    hotelInfo
}){
    const sightsFilters = useSelector(state => state.catalog.sightsFilters)
    const {t} = useTranslation()


    function getDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Радиус Земли в километрах
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = R * c;
        return distance;
    }

    function toRad(degrees) {
        return degrees * (Math.PI / 180);
    }




    const templateSights = useMemo(()=>{
        if (!sightsFilters) return
        let arr = []
        sightsFilters.forEach((elem)=> {
            if(getDistance(hotelInfo.lat, hotelInfo.lon, elem.lat, elem.lon) <= 1.5){
                arr.push({...elem,distance:getDistance(hotelInfo.lat, hotelInfo.lon, elem.lat, elem.lon)})
                return true
            }else return false
        })

        return arr.map((elem,id)=>{
            return <VectorWithText
                className={classes.nearby_attractions_sight_wrap}
                text={
                <div className={classes.nearby_attractions_text}>
                    {elem.name.ru}
                <span className={classes.nearby_attractions_distance}>{elem.distance.toFixed(1)} км</span>
            </div>}></VectorWithText>
        })
    },[sightsFilters,hotelInfo])

    if (!sightsFilters) return null

    return (templateSights.length?
        <div className={classes.nearby_attractions}>
            <h2 className={classes.nearby_attractions_block_title} >
                {t("hotelCard.sights.title")}
            </h2>
            <div className={classes.nearby_attractions_block}>
                <h2 className={[classes.nearby_attractions_title,classes.sights].join(' ')}>{t("hotelCard.sights.subTitle")}</h2>
                <div className={classes.nearby_attractions_wrap}>{templateSights}</div>
            </div>
        </div>:''
    )
}

export default NearbyAttractions