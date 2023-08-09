import React, {useRef, useEffect, useState, useMemo} from "react"
import classes from "./ModalGallery.module.scss";
import CustomSlider from "../../areas/CustomSlider/CustomSlider";
import {SwiperSlide} from "swiper/react";
import NavigationBtn from "../../btns/NavigationBtn/NavigationBtn";
import {Navigation} from "swiper";



function ModalGallery ({
    className,
    photos,
    currentImage,
    title
}){
    const cls = [classes.modal_gallery]
    if(className)cls.push(className)

    const [swiperMain,setSwiperMain] = useState()
    const [swiperFooter,setSwiperFooter] = useState()
    const prevRef = useRef();
    const nextRef = useRef();

    const [paginationImg,setPaginationImg] = useState(currentImage)
    
    const templateCurrentImage = photos.map((elem,id)=>{
        return (
            <SwiperSlide className={classes.modal_gallery_current_swiper} key={id}>
                    <img className={classes.modal_gallery_current_img} src={photos[paginationImg].url} alt={""} />
            </SwiperSlide>
        )
    })
    function handleSlide(id){
        if(swiperMain && swiperFooter){
            swiperMain.slideTo(id)
            swiperFooter.slideTo(id)
            setPaginationImg(id)
        }
    }
    function handleSlideMain(elem){

        swiperFooter.slideTo(elem.activeIndex)
        setPaginationImg(elem.activeIndex)
    }

    const templateFooterImage = useMemo(()=>{
        return photos.map((elem,id)=>{
            return (
                <SwiperSlide
                    id={id+1}
                    onClick={(event)=>handleSlide(id)}
                    className={[classes.modal_gallery_footer,(id==paginationImg?classes.modal_gallery_footer_active:'')].join(' ')}
                    key={id}>
                    <img className={classes.modal_gallery_footer_img} src={elem.url} alt={""} />
                </SwiperSlide>
            )
        })
    },[paginationImg])

    useEffect(()=>{
        if(swiperMain && swiperMain.params){
            swiperMain.params.navigation.prevEl = prevRef.current;
            swiperMain.params.navigation.nextEl = nextRef.current;
            swiperMain.navigation.init();
            swiperMain.navigation.update();
        }
    },[swiperMain])




    return (
        <div className={cls.join(' ')}>
            <h2 className={classes.modal_gallery_title}>{title}</h2>
            <div className={classes.modal_gallery_current}>
                <CustomSlider
                    modules={[Navigation]}
                    slidesPerView={1}
                    onSlideChange={handleSlideMain}
                    onSwiper={setSwiperMain}
                    customSlide={templateCurrentImage}
                    navigation={{
                        prevEl: prevRef?.current,
                        nextEl: nextRef?.current,
                    }}
                ></CustomSlider>
                <div className={classes.modal_gallery_navigation}>
                    <div className="swiper-button" ref={prevRef}>
                        <NavigationBtn type="prev"  />
                    </div>
                    <div className="swiper-button" ref={nextRef} >
                        <NavigationBtn type="next" />
                    </div>
                </div>
            </div>
            <div className={classes.modal_gallery_pagination}>
                <p className={classes.modal_gallery_pagination_txt}>{paginationImg+1} из {photos.length}</p>
            </div>
            <div className={classes.modal_gallery_footer_swiper}>
                <CustomSlider
                    slidesPerView='auto'
                    spaceBetween={20}
                    onSwiper={setSwiperFooter}
                    customSlide={templateFooterImage}
                ></CustomSlider>
            </div>
        </div>
    )
}

export default ModalGallery