import React, {useMemo, useState} from 'react'
import classes from './MainHero.module.scss'
import {useDispatch} from "react-redux";
import {useLocation} from "react-router-dom";

const defaultImage = require("../../assets/image/байкал.webp")

export default function MainHero({children,images}) {
    const [imgError,setImageError]  = useState(false)
    const location = useLocation()
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
    }

    const image = useMemo(()=>{
        return images[getRandomInt(0,images.length)]?.filepath
    },[images,location.pathname])


    return(
        <div className={classes.wrap}>
            <div className={classes.background}>
                <img src={(imgError && !image)?defaultImage:image} onError={() => setImageError(true)} />
            </div>
            <div className={classes.filter}>
                {children}
            </div>
        </div>
    )
}