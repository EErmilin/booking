import React, { useEffect } from 'react'
import classes from "./ServiceHotel.module.scss";
import VectorWithText from "../VectorWithText/VectorWithText";
import {getAmenitie} from "../../pages/NotAuth/HotelCard/functions/functions";
import {useDispatch, useSelector} from "react-redux";
import { getServices } from '../../store/actions/partnerHotelsActions';

function ServiceHotel({
    className,
    amenities
}) {
    const cls = [classes.service_hotel]
    if (className) cls.push(className)
    const amenity = useSelector(state=>state.objects.amenity)
     const dispatcher = useDispatch()
     
    useEffect(()=>{
        dispatcher(getServices({'per-page':1000,expand:"group"}))
    },[])

    const renderAmenities = () => {
        const allAmenities = []
        const groups = [];
        const groupsArray = [];
        if(!amenity.length)return ""
        amenities.forEach((item) => {
            const title = amenity.find((elem,key)=>elem.id==item)
            if (!groups.find(elem=>elem.id == title.group.id)) {
                groups.push(title.group)
            }
            allAmenities.push(title)
        })

        for (const group of groups) {
            const carrentGroupArray = []
            for (const aminitie of allAmenities) {
                if (aminitie.group.id === group.id) {
                    carrentGroupArray.push(aminitie)
                }
            }
            groupsArray.push(carrentGroupArray)
        }

        return groupsArray.length && groupsArray.map((elem, id) => {
            const list = elem.map((elem, id) => {
                return <VectorWithText key={id} text={elem.name.ru}></VectorWithText>

            })

            return (
                <div className={classes.item} key={id}>
                    <h4 className={[classes.item_title].join(' ')}>{elem[0].group.name.ru}</h4>
                    <div className={classes.item_list}>
                        {list}
                    </div>
                </div>
            )
        })
    }

    return (
        <div className={cls.join(' ')} >
            {//<HotelComfort></HotelComfort>
            }
            <div className={classes.wrap}>
                {renderAmenities()}
            </div>
        </div>
    )
}

export default ServiceHotel