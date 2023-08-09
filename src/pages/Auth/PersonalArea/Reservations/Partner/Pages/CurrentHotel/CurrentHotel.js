import React, {useState, useCallback, useMemo, useEffect} from "react"
import classes from "../../../Reservations.module.scss";
import { useTranslation } from "react-i18next";
import Button from "../../../../../../../components/UI/btns/Button/Button";
import { useDispatch, useSelector } from "react-redux";

import usePagination from "../../../../../../../hooks/usePagination";
import {useNavigate, useParams} from "react-router-dom";
import SearchInputAsync from "../../../../../../../components/UI/areas/SearchInputAsync/SearchInputAsync";
import TransitionContainer from "../../../../../../../components/UI/other/TransitionContainer/TransitionContainer";
import {getBookingHotel, getPartnerReservations} from "../../../../../../../store/actions/bookingActions";
import Preloader from "../../../../../../../components/Preloader/Preloader";
import CurrentHotelReservationList from "../../components/CurrentHotelReservationList/CurrentHotelReservationList";
import {getBedTypes} from "../../../../../../../store/actions/partnerHotelsActions"


function CurrentHotel() {
    const { t } = useTranslation();
    /** Инфа для пагинации */
    const limit = useSelector(state => state.book.limit)
    const total = useSelector(state => state.book.total)
    const statusLength = useSelector(state => state.book.statusLength)
    const {page} = useParams()
    const {hotelId} = useParams()
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [otherParams,setOtherParams] = useState({status_id: "1,2,3,4,5,6"})
    const reservations = useSelector(state => state.book.reservation)

    const hotelInfo = useSelector(state => state.book.hotelInfo)

    useEffect(()=>{
        dispatch(getBookingHotel(hotelId))
        dispatch(getBedTypes())
    },[])

    /** Список новых броней */
    const templateNewReservations = useMemo(()=>{
        if(!reservations)return []
        return reservations.filter(elem=>elem.status_id==1)
    },[reservations])
    /** Список подтвержденых броней */
    const templateAcceptedReservations = useMemo(()=>{
        if(!reservations)return []
        return reservations.filter(elem=>elem.status_id==2)
    },[reservations])
    /** Список броней ожидающих оплату */
    const templateWaitingForPaymentCount = useMemo(()=>{
        if(!reservations)return []
        return reservations.filter(elem=>elem.status_id==7)
    },[reservations])
    /** Список отменённых броней */
    const templateCanceledClientReservations = useMemo(()=>{
        if(!reservations)return []
        return reservations.filter(elem=>elem.status_id==3)
    },[reservations])
    /** Список подтвержденых броней */
    const templateCanceledHotelReservations = useMemo(()=>{
        if(!reservations)return []
        return reservations.filter(elem=>(elem.status_id==4 || elem.status_id==6))
    },[reservations])
        /** Список завершённых броней */
    const templateСompletedReservations = useMemo(()=>{
            if(!reservations)return []
            return reservations.filter(elem=>(elem.status_id==5))
        },[reservations])


        const allReservationsCount = statusLength.newCount +
        statusLength.approvedCount +
        statusLength.cancelledCount +
        statusLength.rejectedCount +
        statusLength.completedCount +
        statusLength.guestNoShowCount +
        statusLength.waitingForPaymentCount
        
    /** Блоки для переключения */
    const blocks = useMemo(()=>[
        {
            title: <div
                className={classes.support_blocks_wrap}
                onClick={()=> {
                    navigate(`/personal-area/reservations/hotel/${hotelId}/1`)
                    setOtherParams({'per-page': 4, status_id: "1,2,3,4,5,6"})
                }}
            >
                {t("reservations.all")}
                {allReservationsCount?
                    <span className={classes.support_blocks_notification}>{allReservationsCount}</span>:''}
            </div>,
            block:<CurrentHotelReservationList otherParams={otherParams} reservations={reservations} formatParams></CurrentHotelReservationList>
        },
        {
            title:<div
                className={classes.support_blocks_wrap}
                onClick={()=> {
                    navigate(`/personal-area/reservations/hotel/${hotelId}/1`)
                    setOtherParams({'per-page': 4, status_id: 2})
                }}
            >
                {t("reservations.approved")}
                {statusLength.approvedCount?
                    <span className={classes.support_blocks_notification}>{statusLength.approvedCount}</span>:''}
            </div>,
            block:<CurrentHotelReservationList otherParams={otherParams} reservations={templateAcceptedReservations}></CurrentHotelReservationList>
        },
        {
            title:<div
                className={classes.support_blocks_wrap}
                onClick={()=> {
                    navigate(`/personal-area/reservations/hotel/${hotelId}/1`)
                    setOtherParams({'per-page': 4, status_id: 3})
                }}
            >
                {t("reservations.canseledClient")}
                {statusLength.cancelledCount?
                    <span className={classes.support_blocks_notification}>{statusLength.cancelledCount}</span>:''}
            </div>,
            block:<CurrentHotelReservationList otherParams={otherParams} reservations={templateCanceledClientReservations}></CurrentHotelReservationList>
        },
        {
            title:<div
                className={classes.support_blocks_wrap}
                onClick={()=> {
                    navigate(`/personal-area/reservations/hotel/${hotelId}/1`)
                    setOtherParams({'per-page': 4, status_id: '4,6'})
                }}
            >
                {t("reservations.canseledHotel")}
                {statusLength.rejectedCount + statusLength.guestNoShowCount ?
                    <span className={classes.support_blocks_notification}>{statusLength.rejectedCount + statusLength.guestNoShowCount}</span>:''}
            </div>,
            block:<CurrentHotelReservationList otherParams={otherParams} reservations={templateCanceledHotelReservations}></CurrentHotelReservationList>
        },
        {
            title: <div
                className={classes.support_blocks_wrap}
                onClick={()=> {
                    navigate(`/personal-area/reservations/hotel/${hotelId}/1`)
                    setOtherParams({'per-page': 4, status_id: 5})
                }}
            >
                {t("reservations.completed")}
                {statusLength.completedCount?
                    <span className={classes.support_blocks_notification}>{statusLength.completedCount}</span>:''}
            </div>,
            block:<CurrentHotelReservationList otherParams={otherParams} reservations={templateСompletedReservations} ></CurrentHotelReservationList>
        },
    ],[
        templateCanceledHotelReservations,
        templateCanceledClientReservations,
        templateAcceptedReservations,
        templateNewReservations,
        templateСompletedReservations,
        reservations,
        otherParams,
        page
    ])

    const onClick = () => {
        navigate('/personal-area/reservations/')
    };

    /** Обертка для получения инфы объектов партнера */
    const getInfo = useCallback(async (params)=>{
        const formatParams = {hotel_id:hotelId,expand:"cancel_sub_reason_text",'per-page':4,sort:`-id`,...params,page:page}
        return await dispatch(getPartnerReservations(formatParams))
    },[page])

    /** Пагинация */
    const [pagination] = usePagination({
        getInfo: getInfo,
        limit: 4,
        total: total,
        otherParams:otherParams,
        className: classes.pagination,
    });
    if(!reservations || !Object.keys(hotelInfo).length) return <Preloader></Preloader>
    return (
        <div className={classes.reservations}>
            <h2 className={classes.reservations_title}>{t('personalArea.navBar.reservations')}</h2>
            <Button onClick={() => onClick()} className={classes.selected_back}>
                <div className={classes.selected_backArrow} />
                {t('reservations.back')}
            </Button>
            <h2 className={classes.reservations_hotel_name}>{t('reservations.hotel')} «{hotelInfo.name.ru}»</h2>
            <SearchInputAsync
                className={classes.search}
                typeField={2}
                icon={classes.search_icon}
            />
            <div className={classes.reservations_area}>
            <TransitionContainer
                    classNameTitlesWrap={classes.filter_wrap}
                    classNameTitle={classes.filter}
                    blocks={blocks}
                    className={classes.tabs}
                ></TransitionContainer>
            </div>
            {pagination}
        </div >
    )

}

export default CurrentHotel