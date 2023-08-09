import React from "react"
import classes from "./SwipperPopularItem.module.scss"
import MainHotelItem from "../MainHotelItem/MainHotelItem";
import {useTranslation} from "react-i18next";
import {NavLink} from "react-router-dom";

const hotels =[
    {
        img:require('../../assets/image/Rectangle10.png'),
        city:'Москва',
        name:'Отель Вега Измайлово',
        rating:4,
        priceFrom:"3450 руб",
        ratingComment:'9,8',
        link:'',
        commentCount:'189'
    },
    {
        img:require('../../assets/image/Rectangle10.png'),
        city:'Москва',
        name:'Отель Вега Измайлово',
        rating:4,
        priceFrom:"3450 руб",
        ratingComment:'9,8',
        link:'',
        commentCount:'189'
    },
    {
        img:require('../../assets/image/Rectangle10.png'),
        city:'Москва',
        name:'Отель Вега Измайлово',
        rating:4,
        priceFrom:"3450 руб",
        ratingComment:'9,8',
        link:'',
        commentCount:'189'
    },
    {
        img:require('../../assets/image/Rectangle10.png'),
        city:'Москва',
        name:'Отель Вега Измайлово',
        rating:4,
        priceFrom:"3450 руб",
        ratingComment:'9,8',
        link:'',
        commentCount:'189'
    },
]

function SwiperPopularItem({
    className,
    popularInfo
}){
    const {t} = useTranslation()
    const cls = [classes.swiper_popular_item]
    if(className)cls.push(className)

    switch (popularInfo.direction){
        case "Moscow":{
            cls.push(classes.moscow)
            break;
        }
        case "Simferopol":{
            cls.push(classes.simferopol)
            break;
        }
        case "Ekaterinburg":{
            cls.push(classes.ekaterinburg)
            break;
        }
        case "Kaliningrad":{
            cls.push(classes.kaliningrad)
            break;
        }
        case "Karelia":{
            cls.push(classes.karelia)
            break;
        }case "Kazan":{
            cls.push(classes.kazan)
            break;
        }
        case "Krasnodar":{
            cls.push(classes.krasnodar)
            break;
        }
        case "Saint Peterburg":{
            cls.push(classes.saintPeterburg)
            break;
        }
        case "Sochi":{
            cls.push(classes.sochi)
            break;
        }
        case "Volgograd":{
            cls.push(classes.volgograd)
            break;
        }
    }

    const templateHotels = hotels.map((elem,id)=>{
        return (<MainHotelItem hotelInfo={elem} key={id}></MainHotelItem>)
    })

    return (
        <div className={cls.join(' ')}>
            <div className={classes.swiper_popular_item_title} >
                {t(`mainPage.${popularInfo.direction}`)}
                <NavLink className={classes.swiper_popular_item_watch_all} to={''} >{t('mainPage.watchAll')}</NavLink>
            </div>
            <div className={classes.hotels_wrp}>
                {templateHotels}
            </div>
        </div>
    )
}

export default SwiperPopularItem