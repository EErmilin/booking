import React, {useCallback, useMemo, useState} from "react"
import classes from "./ListHotels.module.scss"
import Button from "../../../../../components/UI/btns/Button/Button";
import {NavLink} from "react-router-dom";
import {useTranslation} from "react-i18next";
import Hotel from "../../Reservations/Partner/components/Hotel/Hotel";
import {getHotelListPartner} from "../../../../../store/actions/partnerHotelsActions";
import {useDispatch, useSelector} from "react-redux";
import usePagination from "../../../../../hooks/usePagination";
import Preloader from "../../../../../components/Preloader/Preloader";

function ListHotels (){
    const {t} = useTranslation()
    const dispatcher = useDispatch()
    const listHotel = useSelector(state => state.objects.hotels)
    const total = useSelector(state => state.objects.total)
    const [otherParams,setOtherParams] = useState({"per-page":10})

    const addButton = <Button
        btnColor="ButtonGreen"
        className={classes.add_object_button}
        typeButton={2} >
        <NavLink
            className={classes.list_hotels_empty_btn_link}
            to="/add-object">   +  {t("objects.addNewObject")}
        </NavLink>
    </Button>

    const templateHotels = useMemo(()=>{
        return listHotel && listHotel.map((elem,id)=>{
            return <Hotel price={true} key={id} reservation={elem}></Hotel>
        })
    })


    /** Обертка для получения инфы объектов партнера */
    const getInfo = useCallback(async (params)=>{
        return await dispatcher(getHotelListPartner(params))
    },[])


    const [pagination] = usePagination({
        getInfo: getInfo,
        limit: 10,
        total: total,
        otherParams:otherParams,
        className: classes.pagination,
    });
    if(!listHotel)return <Preloader></Preloader>
    return (
        <div className={classes.list_hotels}>
            <h2 className={classes.list_hotels_title}>{t('prices.title')}</h2>
                {listHotel.length?<div className={classes.object_area}>
                    {templateHotels}
                </div>:
                <div className={classes.list_hotels_empty}>
                    <h2 className={classes.list_hotels_empty_title}>
                        {t('objects.nonObjects')}
                    </h2>
                    {addButton}
                </div>}
                <div>
                    {pagination}
                </div>
        </div>
    )
}

export default ListHotels