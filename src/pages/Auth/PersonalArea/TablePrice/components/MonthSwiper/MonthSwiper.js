import React, {useMemo,useEffect, useRef, useState} from "react"
import classes from "./MonthSwiper.module.scss";
import {SwiperSlide} from "swiper/react";
import NavigationBtn from "../../../../../../components/UI/btns/NavigationBtn/NavigationBtn";
import {Navigation} from "swiper";
import CustomSlider from "../../../../../../components/UI/areas/CustomSlider/CustomSlider";
import moment from "moment";

function MonthDay({onClick,month,isActive}){
    return (
        <div
            className={[classes.month_name,isActive?classes.month_name_active:""].join(' ')}
            onClick={()=>onClick()}
        >
            {month.text}
        </div>
    )
}

function MonthSwiper ({checkedArr,onChange}){
    const [swiper, setSwiper] = useState()
    const [arrayMonth,setArrayMonth] = useState([])
    const prevRef = useRef();
    const nextRef = useRef();


    useEffect(()=>{
        let arrMonth =[]
        const currentMonth = +moment().format("MM")
        const restMonth = 12 - (12-(currentMonth-1))
        for (let i = currentMonth;i<13;i++){
            let textMonth = moment(i,"MM").format("MMM,yyyy").replace('.','').split('')
            textMonth[0] = textMonth[0].toUpperCase()
            arrMonth.push({
                id:Math.random(),
                month:i,
                text:textMonth.join(''),
                startOfMonth:moment(i,"MM").startOf('month').format('YYYY-MM-DD'),
                endOfMonth:moment(i,"MM").endOf('month').format('YYYY-MM-DD'),
            })
        }
        if(restMonth){
            for (let i = 1;i<=restMonth;i++){
                let textMonth = moment(i,"MM").add(1,"year").format("MMM,yyyy").replace('.','').split('')
                textMonth[0] = textMonth[0].toUpperCase()
                arrMonth.push({
                    id:Math.random(),
                    month:i,
                    text:textMonth.join(''),
                    startOfMonth:moment(i,"MM").add(1,"year").startOf('month').format('YYYY-MM-DD'),
                    endOfMonth:moment(i,"MM").add(1,"year").endOf('month').format('YYYY-MM-DD'),
                })
            }
        }
        setArrayMonth(arrMonth)
    },[])


    const templateMonth = useMemo(()=>{
        return arrayMonth.map((elem,id)=>
            <SwiperSlide
                className={classes.month_swiper_slide}
                key={id}

            >
                <MonthDay
                    isActive={checkedArr.find(e=>elem.id==e.id)}
                    month={elem}
                    onClick={()=>{

                        let newArray = [...checkedArr]
                        if(checkedArr.find(e=>elem.id==e.id)){
                            newArray = newArray.filter(e=>e.id!==elem.id)
                        }else{
                            newArray.push(elem)
                        }
                        onChange(newArray)
                    }}
                ></MonthDay>
            </SwiperSlide>
        )
    },[arrayMonth,checkedArr])

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

    return (
        <div className={classes.month_swiper}>
            <div className={classes.month_swiper_wrap}>
                <div className={classes.month_swiper_navigation}>
                    <div className={classes.month_swiper_arrow_left} ref={prevRef}>
                    </div>
                    <div className={classes.month_swiper_arrow_right} ref={nextRef}>
                    </div>
                </div>
                <CustomSlider
                    className={classes.month_swiper_swiper}
                    modules={[Navigation]}
                    slidesPerView={'auto'}
                    spaceBetween={16}
                    customSlide={templateMonth}
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

        </div>
    )
}

export default MonthSwiper