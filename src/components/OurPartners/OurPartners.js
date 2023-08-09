import React, { useEffect } from "react";
import classes from "./OurPartners.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getPatners } from "../../store/actions/directionsActions";

function OurPartners({ isPartnerPage, isMainPage }) {
    const { t } = useTranslation()
    const dispatch = useDispatch()

    const partners = useSelector(state => state.directions.partners)

    useEffect(() => {
        dispatch(getPatners())
    }, [])
    const firstPartners = partners.slice(0, 5);
    const templatePartners = firstPartners.map((elem, id) => {
        return (
                <a href={elem.url} className={[classes.item].join(' ')} target="_blank" key={id} >
                    <img src={elem.image} alt="" />
                </a>
        )
    })
    if(!firstPartners.length)return
    return (
        <div className={classes.wrap}>
            {!isPartnerPage && <h2 className={isMainPage ? classes.titleMain : classes.title}>{t("ourPartners.title")}</h2>}
            <div className={classes.wrapPartnerPage}>
                {templatePartners}
            </div>
        </div>
    )
}

export default OurPartners