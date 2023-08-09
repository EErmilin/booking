import React from "react"
import classes from "./BookingNotAvailable.module.scss"
import useToggleVisibility from "../../../../hooks/useToggleVisibility";
import {useTranslation} from "react-i18next";
import Button from "../../../UI/btns/Button/Button";
import EmptyModal from "../../../UI/modals/EmptyModal/EmptyModal";
import StarRating from "../../../StarRating/StarRating";


function BookingNotAvailable ({
    hotelInfo
}){
    const [modal,setModal,closeModal] = useToggleVisibility()
    const {t} = useTranslation()

    const templateModal =modal && <EmptyModal
        close={true}
        background="blue"
        btnCancelClick={() => setModal(false)}
        closeModal={closeModal}
        width={467}
        typeModal="withoutBack"
        className={classes.modal}
    >
        <StarRating
            className={classes.modal_rating}
            starClassName={classes.star}
            maxRating={5}
            starRating={hotelInfo.star_rating}
        ></StarRating>
        <h2 className={classes.modal_title}>{hotelInfo.name.ru}</h2>
        {hotelInfo.address?<div className={classes.modal_line}>
            <div className={classes.modal_line_title}>{t("hotelCard.prices.detailModal.address")}</div>
            <div className={classes.modal_line_text}>{hotelInfo.address}</div>
        </div>:""}
        {hotelInfo.contact_phone?<div className={classes.modal_line}>
            <div className={classes.modal_line_title}>{t("hotelCard.prices.detailModal.phone")}</div>
            <div className={classes.modal_line_text}>{hotelInfo.contact_phone}</div>
        </div>:""}
        {hotelInfo.contact_name?<div className={classes.modal_line}>
            <div className={classes.modal_line_title}>{t("hotelCard.prices.detailModal.contactPerson")}</div>
            <div className={classes.modal_line_text}>{hotelInfo.contact_name}</div>
        </div>:""}
        {hotelInfo.contact_email?<div className={classes.modal_line}>
            <div className={classes.modal_line_title}>{t("hotelCard.prices.detailModal.email")}</div>
            <div className={classes.modal_line_text}>{hotelInfo.contact_email}</div>
        </div>:""}
        {hotelInfo.site?
          <a
            href={hotelInfo.site}
            id={"hotel_website_exit"}
            className={[classes.link_site, "hotel_website_exit"].join(" ")}
            target={"_blank"}
          >{t("hotelCard.prices.detailModal.site")}</a>:""
        }
    </EmptyModal>

    return (
        <div>
            {templateModal}
            <Button btnColor="green" className={classes.button} onClick={() => setModal(true)}>
                {t("hotelCard.prices.detail")}
            </Button>
        </div>
    )
}


export default BookingNotAvailable