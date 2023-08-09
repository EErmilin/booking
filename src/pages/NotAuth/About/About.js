import React, {useEffect} from "react"
import classes from "./About.module.scss"
import { useMemo } from "react"
import Breadcrumbs from "../../../components/Breadcrumbs/Breadcrumbs"
import InfoPageUnit from "../../../components/InfoPageUnit/InfoPageUnit"
import {useDispatch, useSelector} from "react-redux";
import Preloader from "../../../components/Preloader/Preloader";
import {getAboutInfo} from "../../../store/actions/generalInfoAction";
import { Helmet } from "react-helmet"
import siteLogo from '../../../assets/svg/logo.svg'
const fakeImg = require("../../../assets/image/баннер 1.png")

function About() {
    const info = useSelector(state => state.general.info)
    const dispatcher = useDispatch()


    /** Подтягиваем инфу */
    useEffect(()=>{
       dispatcher(getAboutInfo())
    },[])

    const breadcrumbs = useMemo(
        () => [
            {
                name: 'О нас',
                url: ''
            }
        ],
        []
    );

    function getMetaTags() {

        const ldJson = {
            "@context": "https://schema.org/",
            "@type": "BreadcrumbList",
            "itemListElement": [{
                "@type": "ListItem",
                "position": 1,
                "name": "Главная",
                "item": "https://checkin.ru/"
            },{
                "@type": "ListItem",
                "position": 2,
                "name": "О нас"
            }]
        }

        return(
            <Helmet>
                <title>О нас | Check in — удобный сервис бронирования отелей и гостиниц </title>
                <meta name="description" content={'Check in - онлайн сервис поиска проверенных отелей, апартаментов, хостелов. Выгодное планирование поездок, бесплатная отмена бронирования, поддержка 24 часа'} />
                <meta property="og:title" content={'О нас | Check in — удобный сервис бронирования отелей и гостиниц'}/>
                <meta property="og:description" content={'Check in - онлайн сервис поиска проверенных отелей, апартаментов, хостелов. Выгодное планирование поездок, бесплатная отмена бронирования, поддержка 24 часа'}/>
                {<meta property="og:image" content={siteLogo} />}
                <script type="application/ld+json">
                    {JSON.stringify(ldJson)}
                </script>
            </Helmet>
        )
    }

    if(!info)return <Preloader></Preloader>

    return (
        <div className={classes.wrapper}>
            {getMetaTags()}
            <div className={classes.content}>
                <InfoPageUnit title={info.name.ru}>
                    <img className={classes.img} src={fakeImg} alt="" />
                    <div dangerouslySetInnerHTML={{ __html: info.text.ru }}></div>
                </InfoPageUnit>
            </div>
        </div>
    )
}

export default About