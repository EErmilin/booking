import React, {useCallback, useEffect, useMemo, useState} from "react";
import classes from "../Reservations.module.scss";
import Hotel from "./components/Hotel/Hotel";
import {useDispatch, useSelector} from "react-redux";
import {getHotelStats, getPartnerReservations} from "../../../../../store/actions/bookingActions";
import usePagination from "../../../../../hooks/usePagination";
import Preloader from "../../../../../components/Preloader/Preloader";
import Button from "../../../../../components/UI/btns/Button/Button";
import {useTranslation} from "react-i18next";
import {getHotelListPartner} from "../../../../../store/actions/partnerHotelsActions";



function ListPartnerReservations(){
    const {t} = useTranslation()
    const dispatcher = useDispatch()
    const stats = useSelector(state =>state.book.stats)


    /** Подтигиваем информацию */
    useEffect(()=>{
        dispatcher(getHotelStats())
    },[])

    /** Список бронирований партнера */
    const templatePartnerReservations = useMemo(()=> {
        if(!stats)return []
        return stats.map((hotel, id) => {
            return <Hotel key={id} reservation={hotel} isBook={true}/>
        })
    },[stats])

    const emptyReservations = (<div className={classes.client_empty}>
        <h2 className={classes.client_empty_title}>
            {t('reservations.partner.title')}
        </h2>
        {/*<Button*/}
        {/*    className={classes.client_empty_btn}*/}
        {/*    btnColor="ButtonGreen"*/}
        {/*    typeButton={2} >*/}
        {/*    {t('reservations.client.emptyButton')}*/}
        {/*</Button>*/}
    </div>)


    if(!stats)return <Preloader></Preloader>
    return (
        stats.length?<div className={classes.reservations_area}>
                <div>
                    {templatePartnerReservations}
                </div>
        </div>:emptyReservations
    )
}

export default ListPartnerReservations