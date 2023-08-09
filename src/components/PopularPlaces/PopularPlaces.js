import React, {useRef, useState, useEffect} from "react"
import classes from './PopularPlaces.module.scss'
import './PopularPlaces.scss'
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation} from "swiper";
import NavigationBtn from "../UI/btns/NavigationBtn/NavigationBtn";
import MainHotelItem from "../MainHotelItem/MainHotelItem";

export default function PopularPlaces({popularHotels, filters}) {

    const [swiper, setSwiper] = useState()
    const prevRef = useRef();
    const nextRef = useRef();

    const templatePlaces = popularHotels.length && popularHotels.map(place => {
        const templateHotels = place.hotels.map(hotel => {
            return (
                <SwiperSlide className={classes.hotel_slide}><MainHotelItem filters={filters} hotelInfo={hotel}/></SwiperSlide>
            )
        })
        return (
            <SwiperSlide className={classes.place_slide}>
                <div className={classes.place_card} style={{backgroundImage: `url("${place.background}")`}}>
                    <div className={classes.place_title}>{place.title}</div>
                    <div className={classes.hotel_slider_wrap}>
                        <Swiper
                            className={[classes.hotel_slider, "hotel-slider", "swiper-v"].join(" ")}
                            direction={"horizontal"}
                            spaceBetween={20}
                            allowTouchMove={true}
                            slidesPerView={'auto'}
                            navigation={false}
                            breakpoints={{
                                992: {
                                    spaceBetween: 20,
                                    slidesPerView: 'auto'
                                },
                                1200: {
                                    slidesPerView: 4,
                                },
                            }}
                        >
                            {templateHotels}
                        </Swiper>
                    </div>
                </div>
            </SwiperSlide>
        )
    })

    useEffect(()=>{
        if(swiper && swiper.params){
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
        }
    },[swiper])

    return (
        <div className={classes.wrap}>
            <Swiper
                modules={[Navigation]}
                onSwiper={setSwiper}
                className={[classes.place_slider, "swiper-h popular-places-swiper"].join(" ")}
                spaceBetween={50}
                allowTouchMove={false}
                navigation={{
                    prevEl: prevRef?.current,
                    nextEl: nextRef?.current,
                }}
            >
                {templatePlaces}
            </Swiper>
            <div className={classes.navigation}>
                <div className="swiper-button swiper-button-prev swiper-button--white" ref={prevRef}></div>
                <div className="swiper-button swiper-button-next swiper-button--white" ref={nextRef} ></div>
            </div>
        </div>
    )
}