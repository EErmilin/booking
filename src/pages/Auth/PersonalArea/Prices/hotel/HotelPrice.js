import React, {useEffect, useMemo} from "react"
import classes from "./Hotel.module.scss";
import Button from "../../../../../components/UI/btns/Button/Button";
import {useNavigate, useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import TariffPriceLine from "../../../../../components/UI/line/TariffPriceLine/TariffPriceLine";
import {useDispatch, useSelector} from "react-redux";
import {clearListPrices, getListPrices} from "../../../../../store/actions/pricesActions";
import {getHotelInfo} from "../../../../../store/actions/partnerHotelsActions";
import Preloader from "../../../../../components/Preloader/Preloader";



function HotelPrice({}){
    const navigate = useNavigate()
    const {t} = useTranslation()
    const dispatcher = useDispatch()
    const {id} = useParams()
    const hotelInfo = useSelector(state=>state.objects.hotelInfo)
    const rooms = useSelector(state => state.prices.rooms)
    const onClick = () => {
        navigate('/personal-area/prices/1')
    };
    useEffect(()=>{
        dispatcher(clearListPrices())
        dispatcher(getListPrices(id))
        dispatcher(getHotelInfo(id))
    },[])
    const templateTariffs = useMemo(()=>{
        return rooms.map((elem,id)=>{
            return <TariffPriceLine rooms={elem} key={id}></TariffPriceLine>
        })
    },[rooms])

    if(!Object.keys(hotelInfo).length)return <Preloader></Preloader>
    return (
        <div className={classes}>
            <h2 className={classes.hotel_price_title}>{t('prices.title')}</h2>
            <Button onClick={() => onClick()} className={classes.hotel_price_back}>
                <div className={classes.hotel_price_backArrow} />
                {t('reservations.back')}
            </Button>
            <h2 className={classes.hotel_price_hotel_name}>{t('reservations.hotel')} {hotelInfo.name.ru}</h2>
            <div className={classes.hotel_price_wrap}>
                {templateTariffs}
            </div>
        </div>
    )
}

export default HotelPrice