import React, {useEffect, useState} from "react"
import classes from "./HotelCardComment.module.scss";
import { NavLink, useNavigate } from "react-router-dom";
import Button from "../UI/btns/Button/Button";
import { useTranslation } from "react-i18next";
import moment from "moment";
import StatusHotel from "../StatusHotel/StatusHotel";
import useToggleVisibility from "../../hooks/useToggleVisibility";
import ReviewModal from "../UI/modals/ReviewModal/ReviewModal";

const noImg = require("../../assets/image/noHotelImg.png")

function HotelCardComment({
    bookInfo,
    setModal,
    hotelId
}) {
    const { t } = useTranslation()
    const [isNoImg, setIsNoImg] = useState(false)
    const navigate = useNavigate()
    const [modalReview,setIsShowModalReview,closeModalReview] = useToggleVisibility()


    const templateModalReview = modalReview && <ReviewModal
        btnClose={setIsShowModalReview}
        onClose={closeModalReview}
        bookingInfo={bookInfo}
        setModal={setModal}
        hotelId={hotelId}
    ></ReviewModal>

    const hotelImgUrl = isNoImg ? noImg : bookInfo.hotel_main_image
    useEffect(()=>{
        if(!bookInfo.hotel_main_image){
            setIsNoImg(true)
        }
    
    },[bookInfo])

    return (
        <div className={classes.hotel_card_catalog}>
            <div className={classes.hotel_card_catalog_picture}>
                <div className={classes.hotel_card_catalog_img_bar}>
                    <img className={classes.hotel_card_catalog_img} onError={() => setIsNoImg(true)} src={hotelImgUrl} alt="HotelCardCatalog" />
                    <NavLink className={classes.clickable} to={`/hotel?id=${bookInfo && bookInfo.hotel_id}&dateFrom=${moment(new Date()).format("YYYY-MM-DD")}&dateTo=${moment(new Date()).add(2, 'days').format("YYYY-MM-DD")}&adults=${1}&children=${0}`}></NavLink>
                </div>
            </div>
            <div className={classes.hotel_card_catalog_info}>
                <NavLink className={classes.clickable} to={`/hotel?id=${bookInfo && bookInfo.hotel_id}&dateFrom=${moment(new Date()).format("YYYY-MM-DD")}&dateTo=${moment(new Date()).add(2, 'days').format("YYYY-MM-DD")}&adults=${1}&children=${0}`}></NavLink>
                <div className={classes.hotel_card_catalog_info_header_left_title}>
                    <StatusHotel status={2} text={t("comment.waitingReview")}></StatusHotel>
                </div>
                <div className={classes.hotel_card_catalog_info_header}>
                    <div className={classes.hotel_card_catalog_info_header_left}>
                        <div className={classes.hotel_card_catalog_info_header_left_title}>
                            <h3 className={classes.hotel_card_catalog_info_header_title} onClick={() => {}}>{bookInfo.hotel_name.ru}</h3>
                        </div>
                        <p className={classes.hotel_card_catalog_info_header_roomName}>{bookInfo.room_name?.ru}</p>
                    </div>
                </div>
                <div className={classes.hotel_card_catalog_date}>{moment(bookInfo.arrival_date).format("DD.MM.YY")}-{moment(bookInfo.departure_date).format("DD.MM.YY")} {bookInfo.additional_guests.length+1} взр.</div>
                <div className={classes.hotel_card_catalog_info_body}>
                    <div className={classes.hotel_card_catalog_info_body_left}>
                        <div className={classes.hotel_card_catalog_info_body_address}>{!bookInfo.integration_data ? `г. ${bookInfo.region?.name.ru}, ` : ''}{bookInfo.hotel_address}</div>
                    </div>
                    <div className={classes.hotel_card_catalog_info_body_right}>
                        <Button
                            onClick={() => {
                                setIsShowModalReview(true)
                            }}
                            className={bookInfo.hotel_priceSale ? classes.hotel_card_catalog_btn : classes.hotel_card_catalog_btn_mg}
                            btnColor="ButtonGreen">{t("comment.hotelCard.btn")}
                        </Button>
                    </div>
                </div>
            </div>
            {templateModalReview}
        </div>
    )

}

export default HotelCardComment