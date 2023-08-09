import React, { useState } from "react"
import classes from "./HotelCardCatalog.module.scss";
import StarRating from "../StarRating/StarRating";
import CommentRating from "../CommentRating/CommentRating";
import { useNavigate } from "react-router-dom";
import Button from "../UI/btns/Button/Button";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import FavoriteBtnCard from "../UI/btns/FavoriteBtnCard/FavoriteBtnCard";
import numberFormat from "../../functions/numberFormat"
const noImg = require("../../assets/image/noHotelImg.png")

function HotelCardCatalog({
    hotelInfo,
    filters,
    setIsShowMap,
    isShowMap,
    setIsCityCenter,
    setCurrentMapHotel,
}) {
    const { t } = useTranslation()
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const imgUrl = '';
    const [isNoImg, setIsNoImg] = useState(false)
    const [showVerifiedPopup, setShowVerifiedPopup] = useState(false)
    const { children, adults } = filters

    const dateTo = filters.dateTo && filters.dateTo.format('YYYY-MM-DD');
    const dateFrom = filters.dateFrom && filters.dateFrom.format('YYYY-MM-DD');

    const hotelImgUrl = isNoImg ? noImg : imgUrl + hotelInfo.main_image

    const showMap = () => {
        setCurrentMapHotel(hotelInfo)
        setIsCityCenter(false)
        setIsShowMap(true)
    }

    const priceFull = numberFormat(hotelInfo.sum) !== numberFormat(hotelInfo.discount_sum) ?
        <div className={classes.price_full}>{hotelInfo.price && 'от ' + numberFormat(hotelInfo.sum) + ' руб.'}</div> : null
    const priceNight = <div className={classes.price_night}>{hotelInfo.discount_price && 'от ' + numberFormat(hotelInfo.discount_price) + ' руб./ночь'} </div>
    const priceDiscount = <div className={classes.price_discount}>{hotelInfo.discount_sum && 'от ' + numberFormat(hotelInfo.discount_sum) + ' руб.'} </div>

    const cardStyle = isShowMap ? [classes.wrap, classes.wrap_small].join(" ") : classes.wrap

    let countDays = 2;
    if (filters.dateTo && filters.dateFrom) {
        countDays = filters.dateTo.diff(filters.dateFrom, 'days')
    }
    if (hotelInfo) {

        const hotelUrl = `/hotel?id=${hotelInfo && hotelInfo.id}&dateFrom=${dateFrom}&dateTo=${dateTo}&adults=${adults}&children=${children}&maxPrice=${filters.maxPrice}&minPrice=${filters.minPrice}${filters.preview ? '&preview=true' : ''}`

        return (
            <div className={cardStyle}>
                <div className={classes.img_bar}>
                    {hotelInfo.discount_price !== hotelInfo.price && <div className={classes.img_bar_discond}>-10%</div>}
                    <a
                        target="_blank"
                        className={classes.clickable}
                        href={hotelUrl}
                    />
                    <img className={classes.hotel_card_catalog_img} onError={() => setIsNoImg(true)} src={hotelImgUrl} alt="HotelCardCatalog" />
                    <FavoriteBtnCard
                        id={"button_guest_b2c_add_to_wishlist"}
                        hotel={hotelInfo}
                        hotelId={hotelInfo.id}
                        isActive={hotelInfo.is_favorite}
                        className={[classes.favorite_btn, "button_guest_b2c_add_to_wishlist"].join(" ")}
                    ></FavoriteBtnCard>
                    {hotelInfo.compliment && hotelInfo.compliment.has_compliment && <div className={classes.hotel_card_catalog_compliment}>{t("hotelCard.compliment")}</div>}
                </div>

                <div className={classes.info}>
                    <a
                        target="_blank"
                        className={classes.clickable}
                        href={hotelUrl}
                    />
                    <div className={classes.header}>
                        <div className={classes.hotel_card_catalog_info_header_left}>
                            <div className={classes.title_place}>
                                <div className={classes.title_wrap}>
                                    {hotelInfo.is_verified &&
                                        <div onClick={() => { setShowVerifiedPopup(!showVerifiedPopup) }} className={[classes.verified, isMobile ? classes.verified_mobile : classes.verified_desktop].join(" ")}>
                                            <div className={[classes.verified_popup, isMobile && showVerifiedPopup ? classes.verified_popup_active : ""].join(" ")}>
                                                Этот объект проверен экспертом Check in
                                            </div>
                                        </div>
                                    }
                                    <h3 className={classes.title}>{hotelInfo.name.ru}</h3>
                                </div>
                                <StarRating
                                    maxRating={5}
                                    starRating={hotelInfo.star_rating}
                                ></StarRating>
                            </div>
                            {  // <HotelPrivilege
                                //    className={classes.hotel_card_catalog_privilege}
                                //    privilege={hotelInfo.privilege}
                                //></HotelPrivilege>
                            }
                        </div>
                        <CommentRating // commentCount={516} 
                            commentRating={hotelInfo.reviews_rating} className={classes.rating}>
                        </CommentRating>
                    </div>
                    <div className={classes.hotel_card_catalog_info_body}>
                        <div className={classes.row}>
                            <div>
                                <p className={classes.hotel_card_catalog_info_body_description}>{hotelInfo.room && hotelInfo.room.name.ru}</p>
                                {hotelInfo.guest_count &&
                                    <div className={classes.guest}>
                                        <span>Кол-во ночей: {countDays}</span>
                                        <span>{'Взрослых: ' + hotelInfo.guest_count}</span>
                                    </div>
                                }
                            </div>
                            <div className={classes.prices}>
                                {priceFull}
                                {priceDiscount}
                                {priceNight}
                                { /* hotelInfo.priceSale && <div className={classes.hotel_card_catalog_info_body_priceSale}>{hotelInfo.priceSale} руб.</div> */}
                            </div>
                        </div>
                        <div className={classes.row}>
                            <div onClick={() => showMap()} className={classes.hotel_card_catalog_info_body_address}>{hotelInfo.address}</div>
                            {!isShowMap &&
                                <a href={hotelUrl} target="_blank">
                                    <Button
                                        className={hotelInfo.priceSale ? classes.hotel_card_catalog_btn : classes.hotel_card_catalog_btn_mg}
                                        btnColor="ButtonGreen">{t("hotelCard.showAllRooms")}
                                    </Button>
                                </a>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default HotelCardCatalog