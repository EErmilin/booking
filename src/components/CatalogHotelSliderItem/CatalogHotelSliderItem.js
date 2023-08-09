import React, { useState } from "react"
import classes from "./CatalogHotelSliderItem.module.scss";
import FavoriteBtnCard from "../UI/btns/FavoriteBtnCard/FavoriteBtnCard";
import StarRating from "../StarRating/StarRating";
import CommentRatingV2 from "../CommentRatingV2/CommentRatingV2";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import numberFormat from "../../functions/numberFormat"
const noImg = require("../../assets/image/noHotelImg.png")


function CatalogHotelSliderItem({
    hotel,
    typeView = 1,
    filters,
}) {

    const navigate = useNavigate()
    const dispatcher = useDispatch()
    const [isNoImg, setIsNoImg] = useState(false)
    const isLoadingSimilar = useSelector(state => state.catalog.isLoadingSimilar)


    const { dateTo, dateFrom, adults, children } = filters

    if (hotel) {
        const hotelImgUrl = (!hotel.main_image || isNoImg) ? noImg : hotel.main_image

        const onClick = () => {
            dispatcher({ type: 'CLEAR_HOTEL' })
            navigate(`/hotel?id=${hotel.id}&dateFrom=${dateFrom}&dateTo=${dateTo}&adults=${adults}&children=${children}`)
            
        };

        return (
            <div className={[classes.hotel_item, typeView !== 1 ? classes.hotel_item_mg_top : ''].join(' ')}>
                {typeView == 1 ? <>
                    <div className={classes.hotel_item_header}>
                        <img className={classes.hotel_item_img} src={hotelImgUrl} onError={() => setIsNoImg(true)} alt="HotelCardImage" />
                        { //<FavoriteBtnCard hotel={hotel} className={classes.hotel_item_btn}></FavoriteBtnCard>
                        }
                        <div className={classes.hotel_item_price}>От 4 890 руб.</div>
                    </div>
                    <div className={classes.hotel_item_body}>
                        <p className={classes.hotel_item_city}>Москва</p>
                        <p className={classes.hotel_item_name}>{hotel.name.ru}</p>
                        <StarRating
                            className={classes.hotel_item_rating}
                            maxRating={5}
                            starRating={4}
                        ></StarRating>
                        <CommentRatingV2
                            rating={9.8}
                            commentCount={189}
                        ></CommentRatingV2>

                    </div>
                </> :
                    <div className={classes.hotel_item_wrap2} onClick={onClick}>
                        <div className={classes.hotel_item_header2}>
                        {!isLoadingSimilar && <img className={classes.hotel_item_img} src={hotelImgUrl} onError={() => setIsNoImg(true)} alt="HotelCardImage" /> }
                        </div>
                        <div className={classes.hotel_item_body2}>
                            <p className={ isLoadingSimilar ? classes.hotel_item_title2_loading : classes.hotel_item_title2}>{hotel.name.ru}</p>
                            <CommentRatingV2
                                rating={hotel.reviews_rating}
                                size="small"
                                commentCount={189}
                            ></CommentRatingV2>
                            {isLoadingSimilar ? <div className={classes.hotel_item_price2_loading} /> :
                            <div className={classes.hotel_item_price2}>От {numberFormat(hotel.price)} руб.</div>}
                        </div>
                    </div>}
            </div>
        )
    }
}

export default CatalogHotelSliderItem