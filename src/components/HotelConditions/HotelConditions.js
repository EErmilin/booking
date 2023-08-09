import React, {useMemo} from "react"
import classes from "./HotelConditions.module.scss"
import { INTEGRATION_TYPE_TRAVELLINE_FIRST } from "../../constants/integrations";

function HotelConditions ({
    roomInfo,
    amenity,
    className,
    hotelInfo
}){
    const cls = [classes.conditions]
    if(className)cls.push(className)


    // const conditionsTemplate = amenity.map((elem,id)=>{
    //     let icon = ''
    //     try {
    //          icon= require(`../../assets/svg/icons/amenity/${elem.name.en}.svg`)
    //     }catch (e) {
    //
    //     }
    //     return (
    //         <div className={classes.conditions_icon_wrp} key={id}>
    //             <span style={{backgroundImage:`url("${icon}")`}} className={classes.conditions_icon}></span>
    //             <span className={classes.conditions_text}>{elem.name.ru}</span>
    //         </div>
    //     )
    // })


    const bedsTemplate = useMemo(()=>{
        if(!roomInfo.beds || !roomInfo.beds.length)return ""

        return (
            <div className={[classes.conditions_icon_wrp,classes.bed_wrap].join(' ')}>
                <span className={[classes.conditions_icon,classes.bed].join(' ')}></span>
                <div>
                    {roomInfo.beds.map((elem,id)=>(
                        <p key={id} className={classes.bed_text}>{elem.bedType.name.ru}</p>
                    ))}
                </div>
            </div>
        )
    },[roomInfo])
    const area = useMemo(()=>{
        if(!roomInfo.area || hotelInfo.integration_type == INTEGRATION_TYPE_TRAVELLINE_FIRST)return ""
        return (
            <div className={[classes.conditions_icon_wrp].join(' ')}>
                <span className={[classes.conditions_icon,classes.ruler].join(' ')}></span>
                <span className={classes.conditions_text}>{Number(roomInfo.area)} кв. м.</span>
            </div>
        )
    },[roomInfo,hotelInfo])

    const kitchen = useMemo(()=>{
        if(!roomInfo.kitchen)return ""
        return (
            <div className={[classes.conditions_icon_wrp].join(' ')}>
                <span className={[classes.conditions_icon,classes.kitchen].join(' ')}></span>
                <span className={classes.conditions_text}>Есть кухня</span>
            </div>
        )
    },[roomInfo])


    return (
        <div
        className={cls.join(' ')}
        >
            {bedsTemplate}
            {area}
            {kitchen}
        </div>
    )
}

export default HotelConditions