import React, {useEffect, useState,useRef} from 'react'
import classes from "./HotelsComentSwiper.module.scss";
import {SwiperSlide} from "swiper/react";
import CommentSlide from "../CommentSlide/CommentSlide";
import CustomSlider from "../UI/areas/CustomSlider/CustomSlider";
import {Navigation} from "swiper";
import NavigationBtn from "../UI/btns/NavigationBtn/NavigationBtn";

const avatar = require("../../assets/image/fakeAvatar.png")

/**
 *
 * @param typeSwiper
 * @param comment
 * @param className
 * @param slidesPerView
 * @param spaceBetween
 * @returns {JSX.Element}
 * @constructor
 */

function HotelsCommentSwiper({
    typeSwiper,
    comments,
    className,
    slidesPerView,
    spaceBetween,
    breakpoints
}){
    /**Инстенс свипера*/
    const [swiper,setSwiper] = useState()

    /**Рефы на кнопки(вперед назад)*/
    const prevRef = useRef();
    const nextRef = useRef();

    /**Стили*/
    const cls = [classes.hotels_comment,'last-watch-catalog-swiper']
    if(className)cls.push(className)

    /**Кастомный слайды*/
    const commentSlide = comments.map((elem,id)=>{
        return (
            <SwiperSlide key={id}>
                <CommentSlide commentType={typeSwiper} commentInfo={elem}></CommentSlide>
            </SwiperSlide>
        )
    })

    /**Передача в инстенс свипера кнопок навигации*/
    useEffect(()=>{
        if(swiper && swiper.params){
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
        }
    },[swiper])

    return (
        <div className={cls.join(' ')}>
            <CustomSlider
                className={classes.comment_swiper}
                modules={[Navigation]}
                slidesPerView={slidesPerView}
                spaceBetween={spaceBetween}
                onSwiper={setSwiper}
                customSlide={commentSlide}
                navigation={{
                    prevEl: prevRef?.current,
                    nextEl: nextRef?.current,
                }}
                breakpoints={breakpoints}
            ></CustomSlider>
            <div className={typeSwiper==1?classes.hotels_comment_navigation:classes.hotels_comment_navigation2}>
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

export default HotelsCommentSwiper