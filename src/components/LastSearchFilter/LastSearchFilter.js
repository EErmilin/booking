import React from 'react'
import classes from "./LastSearchFilter.module.scss"
import "./LastSearchFilter.scss"
import { Swiper, SwiperSlide } from "swiper/react"
import { useTranslation } from "react-i18next"
import LastSearchItem from "../LastSearchItem/LastSearchItem"
import { Navigation } from "swiper"

function LastSearchFilter({ lastRequests, filters }) {
    const { t } = useTranslation()
    const cls = [classes.slider, "last-search-slider"]

    const lastSearchSlides = lastRequests.map((elem, id) => {
        if (elem.name || elem.label) {
            return (
                <SwiperSlide key={id}>
                    <LastSearchItem lastRequest={elem} filters={filters}></LastSearchItem>
                </SwiperSlide>
            )
        }
    })

    return (
        <div className={classes.wrap} >
            <h3 className={classes.title}>{t('mainPage.lastSearch')}</h3>
            <Swiper
                className={cls.join(" ")}
                direction={"horizontal"}
                spaceBetween={16}
                allowTouchMove={true}
                slidesPerView={"auto"}
                navigation={true}
                modules={[Navigation]}
            >
                {lastSearchSlides}
            </Swiper>
        </div>
    )
}

export default LastSearchFilter