import React, { useState } from 'react'
import classes from "./MainHotelItem.module.scss";
import { useTranslation } from "react-i18next";
import StarRating from "../StarRating/StarRating";
import { NavLink } from "react-router-dom";
import FavoriteBtnCard from "../UI/btns/FavoriteBtnCard/FavoriteBtnCard";
import numberFormat from "../../functions/numberFormat"

const imgUrl = '';
function MainHotelItem({
    className,
    hotelInfo,
    filters
}) {
    const noImg = require("../../assets/image/noHotelImg.png")
    const [isNoImg, setIsNoImg] = useState(false)
    const { t } = useTranslation()
    const cls = [classes.wrap]
    if (className) cls.push()



    if (hotelInfo) {

        return (
            <div className={cls.join(' ')}>
                {hotelInfo.discount_price !== hotelInfo.price && <div className={classes.discond}>-10%</div>}
                <FavoriteBtnCard
                    id={"button_guest_b2c_add_to_wishlist"}
                    hotel={hotelInfo}
                    className={[classes.favorite, "button_guest_b2c_add_to_wishlist"].join(" ")}
                    hotelId={hotelInfo.id}
                    isActive={hotelInfo.is_favorite}
                />
                <div className={classes.header}>
                    {filters.dateTo && <NavLink className={classes.clickable} to={`/hotel?id=${hotelInfo.id}&adults=${filters.adults}&children=${filters.children}&dateFrom=${filters.dateFrom.format('YYYY-MM-DD')}&dateTo=${filters.dateTo.format('YYYY-MM-DD')}`}></NavLink>}
                    <img className={classes.img}
                        onError={() => setIsNoImg(true)} src={(isNoImg || !hotelInfo.main_image) ? noImg : imgUrl + hotelInfo.main_image}
                        alt="Hotel-picture" />
                    <div className={classes.comment}>
                        <span className={classes.comment_txt}>{hotelInfo.commentRating}</span>
                        <span className={classes.comment_txt}>{hotelInfo.reviews_rating > 9 ? 'Превосходно' : 'Отлично'}</span> {//∙ {hotelInfo.commentCount} отзывов
                        }
                    </div>
                </div>
                <div className={classes.body}>
                    {filters.dateTo && <NavLink className={classes.clickable} to={`/hotel?id=${hotelInfo.id}&adults=${filters.adults}&children=${filters.children}&dateFrom=${filters.dateFrom.format('YYYY-MM-DD')}&dateTo=${filters.dateTo.format('YYYY-MM-DD')}`}></NavLink>}
                    <div className={classes.info}>
                        <span className={classes.city}>{hotelInfo.city}</span>
                        <p className={classes.name}>{hotelInfo.name && hotelInfo.name.ru}</p>
                        <StarRating
                            className={classes.rating}
                            maxRating={5}
                            starRating={hotelInfo.star_rating}
                        ></StarRating>
                    </div>
                    <div className={classes.price}>
                        {numberFormat(hotelInfo.discount_sum) !== numberFormat(hotelInfo.sum) &&
                            <p className={classes.price_from}>{`${t('mainPage.priceFrom')} ${numberFormat(hotelInfo.sum)}`} руб.</p>}
                        <p className={classes.price_discount}>{`${t('mainPage.priceFrom')} ${numberFormat(hotelInfo.discount_sum)}`} руб.</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default MainHotelItem