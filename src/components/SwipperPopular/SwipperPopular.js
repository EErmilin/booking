import React, {useRef, useState,useEffect} from "react"
import classes from "./SwipperPopular.module.scss";
import CustomSlider from "../UI/areas/CustomSlider/CustomSlider";
import SwiperPopularItem from "../SwipperPopularItem/SwipperPopularItem";
import {SwiperSlide} from "swiper/react";
import './SwiperPopular.scss'
import NavigationBtn from "../UI/btns/NavigationBtn/NavigationBtn";
import {Navigation} from "swiper";


const slides = [
    {
        direction:"Moscow",
        hotels:[],
    },
    {
        direction:"Simferopol",
        hotels:[],
    },
    {
        direction:"Ekaterinburg",
        hotels:[],
    },
    {
        direction:"Kaliningrad",
        hotels:[],
    },
    {
        direction:"Karelia",
        hotels:[],
    },{
        direction:"Kazan",
        hotels:[],
    },{
        direction:"Krasnodar",
        hotels:[],
    },{
        direction:"Saint Peterburg",
        hotels:[],
    },{
        direction:"Sochi",
        hotels:[],
    },
    {
        direction:"Volgograd",
        hotels:[],
    },
]

function SwiperPopular(){

    const [swiper,setSwiper] = useState()
    const prevRef = useRef();
    const nextRef = useRef();

    const templateSlides = slides.map((elem,id)=>{
        return (
            <SwiperSlide><SwiperPopularItem popularInfo={elem} key={id}></SwiperPopularItem></SwiperSlide>
        )
    })


    function handleSwiper (swiper){

    }

    function handleSlide (){

    }

    useEffect(()=>{
        if(swiper && swiper.params){
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
        }
    },[swiper])

    return (
        <div className={classes.swiper_popular}>
           <CustomSlider
                modules={[Navigation]}
                allowTouchMove={false}
                slidesPerView={1}
                spaceBetween={0}
                onInit={handleSwiper}
                onSwiper={setSwiper}
                onSlideChange={handleSlide}
                customSlide={templateSlides}
                navigation={{
                    prevEl: prevRef?.current,
                    nextEl: nextRef?.current,
                }}
           >
           </CustomSlider>
            <div className={classes.swiper_popular_navigation}>
                <div className="swiper-button" ref={prevRef}>
                    <NavigationBtn type="prev" />
                </div>
                <div className="swiper-button" ref={nextRef} >
                    <NavigationBtn type="next" />
                </div>
            </div>
        </div>
    )
}

export default SwiperPopular