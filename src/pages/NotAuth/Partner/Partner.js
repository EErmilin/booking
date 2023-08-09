import React, {useEffect, useState} from "react";
import classes from "./Partner.module.scss";
import "./Partner.scss";
import {useTranslation} from "react-i18next";
import Button from "../../../components/UI/btns/Button/Button";
import SupportModal from "../../../components/UI/modals/SupportModal/SupportModal";
import { SwiperSlide } from "swiper/react";
import CustomSlider from "../../../components/UI/areas/CustomSlider/CustomSlider";
import partnerDefaultImage from "../../../assets/svg/icons/deafultPartner.svg"
import OurPartners from "../../../components/OurPartners/OurPartners";
import { useDispatch, useSelector } from "react-redux";
import {
    getDirectionCities,
    getDirectionPageInfo,
    getPatners,
    getPatnersPageInfo
} from "../../../store/actions/directionsActions";
import {NavLink, useNavigate} from "react-router-dom";
import Breadcrumbs from "../../../components/Breadcrumbs/Breadcrumbs";
import { Helmet } from "react-helmet"
import siteLogo from "../../../assets/svg/logo.svg"

function Partner() {

    const {t} = useTranslation()
    const [isShowModal, setIsShowModal] = useState(false)
    const [showVisitorModal, setShowVisitorModal] = useState(false)
    const dispatcher = useDispatch()
    const navigate = useNavigate()
    const directions = useSelector(state => state.directions.directions)
    const directionsInfo = useSelector(state => state.directions.directionsInfo)
    const partners = useSelector(state => state.directions.partners)
    const info = useSelector(state => state.directions.info)
    const isAuth = useSelector(state => state.auth.isAuth)
    const userInfo = useSelector(state => state.auth.userInfo)

    useEffect(() => {
        dispatcher(getDirectionPageInfo())
        dispatcher(getDirectionCities())
        dispatcher(getPatners())
        dispatcher(getPatnersPageInfo())
    }, [])

    /** Формируем хлебные крошки */
    const BREADCRUMBS = [
        {
            name: 'Отелям',
            url: ''
        },
    ]

    const templateImage = directions && directions.map((elem, id) => {
        return (
            <SwiperSlide
                id={id + 1}
                className={classes.best}
                onClick={() => navigate(`/catalog/1?id=${elem.region_id}&name=${elem.name.ru}`)}
                key={id}>
                <div className={classes.best_title}>{elem.name.ru}</div>
                <img className={classes.best_img} src={elem.image} alt={""} />
            </SwiperSlide>
        )
    })

    const partnerStats = directionsInfo.length && directionsInfo.filter(item => item.type === 2)

    const renderStats = partnerStats.length && partnerStats.map((elem, id) => {
        return (
            <div className={classes.stat}>
                <h1 className={classes.stat_title}>Более <span>{elem.title.ru}</span></h1>
                <h3 className={classes.stat_subtitle}>{elem.sub_title.ru}</h3>
                <p className={classes.stat_text}>{elem.text.ru}</p>
            </div>
        )
    })

    const partnerSteps = directionsInfo.length && directionsInfo.filter(item => item.type === 1)

    const renderSteps = partnerSteps.length && partnerSteps.map((elem, id) => {
        return (
            <div className={classes.step}>
                <h2 className={classes.step_title}><span>{elem.title.ru}</span></h2>
                <h3 className={classes.step_subtitle}>{elem.sub_title.ru}</h3>
                <p className={classes.step_text}>{elem.text.ru}</p>
            </div>
        )
    })

    const toRegister = () => {
        if (isAuth && userInfo.user_type===2) {
            navigate(`/personal-area/objects/1`)
        } else {
            navigate(`/auth/partner/register`)
        }
    }

    function getMetaTags() {
        return(
            <Helmet>
                <title>Добавление объекта размещения | Эффективное продвижение отелей с Check in</title>
                <meta name="description" content={'Привлекайте больше клиентов с Check in. Быстрая и бесплатная регистрация объектов размещения. Check in — удобный сервис бронирования отелей и гостиниц.'} />
                <meta property="og:title" content={'Добавление объекта размещения | Эффективное продвижение отелей с Check in'} />
                <meta property="og:description" content={'Привлекайте больше клиентов с Check in. Быстрая и бесплатная регистрация объектов размещения. Check in — удобный сервис бронирования отелей и гостиниц.'}/>
                {<meta property="og:image" content={siteLogo} />}
            </Helmet>
        )
    }

    return (
        <div className={classes.wrap}>
            {getMetaTags()}
            {isShowModal && <SupportModal
                isNoAuth={true}
                setIsShow={setIsShowModal} />}

            <div className={classes.hero}>
                <div className={classes.hero_inner}>
                    <div className={classes.hero_background}>
                        {info.image && <img className={classes.hero_background_image} src={info.image} />}
                    </div>
                    <div className={classes.hero_container}>
                        <Breadcrumbs className={classes.breadcrumbs} breadcrumbs={BREADCRUMBS}></Breadcrumbs>
                        <div className={classes.hero_info}>
                            {info.title && <h1 className={classes.hero_title}>{info.title.ru}</h1>}
                            {info.sub_title && <p className={classes.hero_text}>{info.sub_title.ru}</p>}
                            <div className={classes.hero_bottom}>
                                <Button
                                    className={classes.button_register_object}
                                    btnColor="ButtonBlue"
                                    onClick={() => toRegister()}
                                >
                                    Зарегистрировать объект
                                </Button>
                                {!isAuth && <div className={classes.hero_authorize}>
                                    <span>{t('auth.login.isAccountExists')}</span> <NavLink to={'/auth/partner/login'}>{t('auth.login.signIn')}</NavLink>
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={classes.container}>
                {/*<div className={classes.stats}>*/}
                {/*    {renderStats}*/}
                {/*</div>*/}
            </div>

            <div className={classes.best_swiper_wrap}>
                <div className={classes.best_swiper}>
                    <h2 className={classes.section_title}>Лучшие направления</h2>
                    <CustomSlider
                        // className={classes.best_swiper_swiper}
                        slidesPerView='auto'
                        spaceBetween={20}
                        //onSwiper={setSwiperFooter}
                        customSlide={templateImage}
                        className={'partner-best-slider'}
                    >
                    </CustomSlider>
                </div>
            </div>

            <div className={classes.container}>
                <h2 className={classes.section_title}>{info.step_text && info.step_text.ru}</h2>
                <div className={classes.steps}>
                    {renderSteps}
                </div>
                {/*<h2 className={[classes.section_title, classes.section_title_big].join(" ")}>*/}
                {/*    C нами работают уже более <span>5 000</span> отелей по всей стране*/}
                {/*</h2>*/}
                <div className={classes.partners}>
                    <OurPartners isPartnerPage={true}></OurPartners>
                </div>
                <div className={classes.join_us}>
                    <h1 className={classes.section_title}></h1>
                    <Button
                        className={classes.button_register_object}
                        btnColor="ButtonBlue"
                        onClick={() => toRegister()}
                    >Зарегистрировать объект
                    </Button>
                </div>
            </div>
        </div >
    )
}

export default Partner