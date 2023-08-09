import React from 'react'
import classes from "./HotelSlider.module.scss"
import {Swiper, SwiperSlide} from "swiper/react"
import {Pagination, Navigation} from 'swiper'
import Fancybox from "../UI/other/Fancybox/Fancybox"
import { useTranslation } from "react-i18next"

const noImg = require("../../assets/image/noHotelImg.png")

export default function HotelSlider({
        className,
        slides
    }) {

    const { t } = useTranslation()
    const cls = [classes.slider, "swiper-v"]

    if (className) cls.push(className)

    const templateSlides = slides.length? slides.map((slide, index) => {
        return (
            <SwiperSlide key={index}>
                <div className={classes.slide}>
                    <img
                        src={slide.url} alt=""
                        data-fancybox={'gallery-slider'}
                        data-src={slide.url}
                    />
                </div>
            </SwiperSlide>
        )
    }):['','','','','','',''].map((slide, index) => {
        return (
            <SwiperSlide key={index}>
                <div className={classes.slide}>
                    <img src={noImg} alt=""/>
                </div>
            </SwiperSlide>
        )
    })

    const paginationFraction = {
        type: "fraction",
        renderFraction: function (currentClass, totalClass) {
            return '<span class="swiper-pagination-fraction-wrapper"><span class="' + currentClass + '"></span>' +
                t("swiper.fractionOf") +
                '<span class="' + totalClass + '"></span></span>';
        }
    }

    return (
        <Swiper
            className={cls.join(" ")}
            direction={"horizontal"}
            spaceBetween={4}
            allowTouchMove={true}
            slidesPerView={1}
            navigation={true}
            pagination={paginationFraction}
            modules={[Pagination, Navigation]}
        >
            <Fancybox options={{ infinite: false }}>
                {templateSlides}
            </Fancybox>
        </Swiper>
    )
}