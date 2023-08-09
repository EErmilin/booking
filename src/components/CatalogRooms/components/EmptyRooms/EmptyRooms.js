import React, {useMemo,useRef, useState} from "react"
import classes from "./EmptyRooms.module.scss"
import {useTranslation} from "react-i18next";
import {Navigation} from "swiper";
import NavigationBtn from "../../../UI/btns/NavigationBtn/NavigationBtn";
import CustomSlider from "../../../UI/areas/CustomSlider/CustomSlider";
import DateItem from "../DateItem/DateItem";
import {SwiperSlide} from "swiper/react";
import useWindowSize from "../../../../hooks/useWindowSize";




function EmptyRooms({dates,filters}){
    const {t} = useTranslation()
    const [swiper, setSwiper] = useState()
    const templateDate = useMemo(()=>{
        return dates.map((elem,id)=>{
            return <SwiperSlide className={classes.empty_rooms_wrap} key={id}>
                <DateItem filters={filters} date={elem}></DateItem>
            </SwiperSlide>
        })
    },[dates])

    function handleInit() {

    }


    function handleSlide(swiper) {

    }

    return (
        <div className={classes.empty_rooms}>
            <h2 className={classes.empty_rooms_title}>{t("emptyRooms.title")}</h2>
            <p className={classes.empty_rooms_subTitle}>{t("emptyRooms.subTitle")}</p>
            <div className={classes.empty_rooms_swiper}>
                <CustomSlider
                    modules={[Navigation]}
                    slidesPerView={'auto'}
                    spaceBetween={16}
                    customSlide={templateDate}
                    onInit={handleInit}
                    onSwiper={setSwiper}
                    onSlideChange={handleSlide}
                    breakpoints={{
                        992: {
                            spaceBetween: 20,
                            slidesPerView: 4
                        },
                    }}
                />
                <div className={classes.empty_rooms_shadow}></div>
            </div>
        </div>
    )
}

export default EmptyRooms