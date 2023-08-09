import React, {useEffect, useState} from "react"
import numberFormat from "../../../../functions/numberFormat";
import classes from "./MarkerWithPopup.module.scss"
import CommentRatingV2 from "../../../CommentRatingV2/CommentRatingV2";

const noImg = require("../../../../assets/image/noHotelImg.png");

function MarkerWithPopup({
    hotel,
    id,
    filters,
    isCatalog,
    mainHotel,
    isCityCenter,
    setActive,
    reactify,
    active
}){
    const [showPopup,setShowPopup] = useState(false)
    const [isHover,setIsHover] = useState(false)
    /** Замена для поломаных картинок */
    const [isNoImg, setIsNoImg] = useState(false)

    useEffect(()=>{
        if(showPopup && hotel.id !== active){
            setShowPopup(false)
        }
    },[active])

    const toHotel = () => {
        if (isCatalog) {
            window.open(`/hotel?id=${hotel.id}&dateFrom=${filters.dateFrom.format('YYYY-MM-DD')}&dateTo=${filters.dateTo.format('YYYY-MM-DD')}&adults=${filters.adults}&children=0`, '_blank')
        } else {
            setShowPopup(false)
        }
    }
    return (
        <reactify.YMapMarker coordinates={[+hotel.lon,+hotel.lat]} zIndex={isHover?10:showPopup?10:1}>
            <div className={classes.mark}>
                {!isCatalog ?
                    <div class="pointGreen"/> :
                    <div
                        onMouseOver={(event)=>{
                            setIsHover(true)
                            event.target.classList.add('hover')
                        }}
                        onMouseLeave={(event)=>{
                            setIsHover(false)
                            event.target.classList.remove("hover")
                        }}
                        onClick={()=>{
                            setActive(hotel.id)
                            setShowPopup(!showPopup)
                        }}
                        class={`${mainHotel && hotel.id === mainHotel.id && !isCityCenter ? 'pointCenter' : 'point'}`}
                    >
                        {numberFormat(hotel.sum)}
                    </div>}
                {showPopup &&
                    <div className={classes.popup}>
                        <div className={classes.btn_close} onClick={()=>setShowPopup(false)}></div>
                        <div className={classes.popup_hotel} onClick={() => toHotel()}>
                            <img className={classes.popup_hotel_img} onError={() => setIsNoImg(true)} src={isNoImg ? noImg : hotel.main_image} alt="" />
                            <div className={classes.popup_right}>
                                <div className={classes.popup_hotel_name}>{hotel.name.ru}</div>
                                <div>
                                    <div className={classes.discount_wrp}>
                                        <CommentRatingV2
                                            rating={hotel.reviews_rating}
                                            size="small"
                                            commentCount={189}
                                        ></CommentRatingV2>
                                        {hotel.price !== hotel.discount_price &&<p className={classes.discount}>Скидка 10%</p>}
                                    </div>
                                </div>
                                {!!hotel?.price &&
                                    <div className={classes.popup_hotel_price}>

                                        <div className={classes.popup_hotel_price_title}>Кол-во ночей: {filters.dateTo.diff(filters.dateFrom, "days")}</div>
                                        {hotel.price !== hotel.discount_price && <h3 className={classes.popup_hotel_price_full}>от {numberFormat(hotel.sum)} руб.</h3>}
                                        <h3 className={classes.popup_hotel_price_value}>от {numberFormat(hotel.discount_sum)} руб.</h3>

                                    </div>
                                }
                            </div>
                        </div>
                    </div>}
            </div>
        </reactify.YMapMarker>
    )
}

export default MarkerWithPopup