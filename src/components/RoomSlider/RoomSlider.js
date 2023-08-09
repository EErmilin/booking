import React from "react"
import classes from './RoomSlider.module.scss'
import {Swiper, SwiperSlide} from "swiper/react"
import {Pagination, Navigation} from 'swiper'
import Fancybox from "../UI/other/Fancybox/Fancybox"
import { useTranslation } from "react-i18next"

export default function RoomSlider({slides, className}) {

    const { t } = useTranslation()
    const cls = ["swiper-h"]

    if (className) cls.push(className)


    const templateSlides = slides.map(slide => {
        return (
            <SwiperSlide key={slide.id}>
                <div className={classes.slide}>
                    <img
                        src={slide.url}
                        alt=""
                        data-fancybox={'gallery-slider'}
                        data-src={slide.url}
                    />
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

    return(
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