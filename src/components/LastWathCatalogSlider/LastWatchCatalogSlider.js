import React, {useEffect, useState} from "react";
import CustomSlider from "../UI/areas/CustomSlider/CustomSlider";
import {Navigation} from "swiper";
import classes from "./LastWatchCatalogSlider.module.scss";
import {useTranslation} from "react-i18next";
import {SwiperSlide} from "swiper/react";
import CatalogHotelSliderItem from "../CatalogHotelSliderItem/CatalogHotelSliderItem";
import "./LastWatchCatalogSwiper.scss"
import NavigationBtn from "../UI/btns/NavigationBtn/NavigationBtn";



function LastWatchCatalogSlider ({
    hotels,
    slidesPerView
}){
    const {t} = useTranslation()
    const [swiper,setSwiper] = useState()
    const prevRef = React.useRef();
    const nextRef = React.useRef();

    function handleSwiper(swiper){

    }
    function handleSlide(){

    }

    const templateSlides =hotels.map((elem,id)=>{
        return (
            <SwiperSlide className={classes.slide}><CatalogHotelSliderItem key={id} hotel={elem}></CatalogHotelSliderItem></SwiperSlide>
        )
    })

    useEffect(()=>{
        if(swiper && swiper.params){
            console.log(`Swiper instance: `, swiper)
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
        }
    },[swiper])

    return (
        <div className={[classes.last_watch_catalog_slider,"last-watch-catalog-swiper"].join(' ')}>
            <h2 className={classes.last_watch_catalog_slider_title}>{t("mainPage.lastSearchHotel")}</h2>
            <CustomSlider
                className={classes.slider}
                modules={[Navigation]}
                slidesPerView={'auto'}
                spaceBetween={20}
                onInit={handleSwiper}
                onSwiper={setSwiper}
                onSlideChange={handleSlide}
                customSlide={templateSlides}
                navigation={{
                    prevEl: prevRef?.current,
                    nextEl: nextRef?.current
                }}
                breakpoints={{
                    992: {
                        spaceBetween: 20,
                        slidesPerView: 'auto'
                    },
                    1024: {
                        slidesPerView: 3,
                    },
                }}
            ></CustomSlider>
            <div className={classes.last_watch_catalog_slider_navigation}>
                <div className="swiper-button" ref={prevRef}>
                    <NavigationBtn type="prev"  />
                </div>
                <div className="swiper-button" ref={nextRef} >
                    <NavigationBtn type="next" />
                </div>
            </div>
        </div>
    )
}


export default LastWatchCatalogSlider