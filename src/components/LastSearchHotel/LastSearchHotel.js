import React, { useEffect, useRef, useState } from "react";
import classes from "./LastSearchHotel.module.scss";
import { useTranslation } from "react-i18next";
import CustomSlider from "../UI/areas/CustomSlider/CustomSlider";
import MainHotelItem from "../MainHotelItem/MainHotelItem";
import { SwiperSlide } from "swiper/react";
import NavigationBtn from "../UI/btns/NavigationBtn/NavigationBtn";
import { Navigation } from "swiper";


function LastSearchHotel({ lastWatchHotels, filters }) {
    const { t } = useTranslation()
    const [swiper, setSwiper] = useState()
    const prevRef = useRef();
    const nextRef = useRef();

    const templateHotels = lastWatchHotels.map((elem, id) => {
        return (
            <SwiperSlide className={classes.slide} key={id}><MainHotelItem hotelInfo={elem} filters={filters}/></SwiperSlide>
        )
    })


    function handleInit() {

    }

    function handleSlide(swiper) {

    }

    useEffect(() => {
        if (swiper && swiper.params) {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
        }
    }, [swiper])


    if (lastWatchHotels.length) {
        return (
            <div className={classes.wrap}>
                <h2 className={classes.title}>{t('mainPage.lastSearchHotel')}</h2>
                <div className={classes.last_search_hotel_bar}>
                    <CustomSlider
                        className={classes.slider}
                        modules={[Navigation]}
                        slidesPerView={'auto'}
                        spaceBetween={16}
                        customSlide={templateHotels}
                        onInit={handleInit}
                        onSwiper={setSwiper}
                        onSlideChange={handleSlide}
                        navigation={{
                            prevEl: prevRef?.current,
                            nextEl: nextRef?.current,
                        }}
                        breakpoints={{
                            992: {
                                spaceBetween: 20,
                                slidesPerView: 4
                            },
                        }}
                    />
                </div>
                <div className={classes.last_search_hotel_navigation}>
                    <div className="swiper-button" ref={prevRef}>
                        <NavigationBtn type="prev" />
                    </div>
                    <div className="swiper-button" ref={nextRef}>
                        <NavigationBtn type="next" />
                    </div>
                </div>
            </div>
        )
    }
}

export default LastSearchHotel