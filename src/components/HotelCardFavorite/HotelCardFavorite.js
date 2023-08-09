import React, { useState } from "react"
import classes from "./HotelCardFavorite.module.scss";
import StarRating from "../StarRating/StarRating";
import CommentRating from "../CommentRating/CommentRating";
import { useNavigate } from "react-router-dom";
import Button from "../UI/btns/Button/Button";
import { useTranslation } from "react-i18next";
import FavoriteBtnCard from "../UI/btns/FavoriteBtnCard/FavoriteBtnCard";
import moment from "moment";

const noImg = require("../../assets/image/noHotelImg.png")

function HotelCardFavorite({
    hotelInfo,
    isActive,
}) {
    const { t } = useTranslation()
    const imgUrl = '';
    const [isNoImg, setIsNoImg] = useState(false)
    const navigate = useNavigate()
    const toHotel = () => {
        navigate(`/hotel?id=${hotelInfo && hotelInfo.id}`)
    }
    const hotelImgUrl = isNoImg ? noImg : imgUrl + hotelInfo.main_image

    if (hotelInfo) {
        return (
            <div className={classes.wrap}>
                    <div className={classes.img_bar}>
                        <div
                            className={classes.clickable}
                            onClick={() => {toHotel()}}
                        />
                        <img className={classes.hotel_card_catalog_img} onError={() => setIsNoImg(true)} src={hotelImgUrl} alt="HotelCardCatalog" />
                        <FavoriteBtnCard hotel={hotelInfo} hotelId={hotelInfo.id} className={classes.favorite_btn} isActive={isActive} isFavoritePage={true}></FavoriteBtnCard>
                        {hotelInfo.compliment && hotelInfo.compliment.has_compliment && <div className={classes.hotel_card_catalog_compliment}>{t("hotelCard.compliment")}</div>}
                    </div>
                <div className={classes.hotel_card_catalog_info}>
                    <div
                        className={classes.clickable}
                        onClick={() => {toHotel()}}
                    />
                    <div className={classes.hotel_card_catalog_info_header}>
                        <div className={classes.hotel_card_catalog_info_header_left}>
                            <div className={classes.hotel_card_catalog_info_header_left_title}>
                                <h3 className={classes.hotel_card_catalog_info_header_title} onClick={() => toHotel()}>{hotelInfo.name.ru}</h3>
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
                            commentRating={hotelInfo.reviews_rating}
                            className={classes.rating}
                        ></CommentRating>
                    </div>
                    <div className={classes.hotel_card_catalog_info_body}>
                        <div className={classes.hotel_card_catalog_info_body_left}>
                            <div className={classes.hotel_card_catalog_info_body_address}>{hotelInfo.integration_type==0?`г. ${hotelInfo.region.name.ru}, `:''}{hotelInfo.address}</div>
                        </div>
                        <div className={classes.hotel_card_catalog_info_body_right}>
                            <Button
                                onClick={() => toHotel()}
                                className={hotelInfo.priceSale ? classes.hotel_card_catalog_btn : classes.hotel_card_catalog_btn_mg}
                                btnColor="ButtonGreen">{t("hotelCard.showAllRooms")}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default HotelCardFavorite