import React, { useEffect, useState } from "react";
import classes from "./BestDirectionsPage.module.scss";
import Button from "../../../components/UI/btns/Button/Button";
import BestDirections from "../../../components/BestDirections/BestDirections";
import heroBackground from "../../../assets/image/blog.png";
import Breadcrumbs from "../../../components/Breadcrumbs/Breadcrumbs";
import {useDispatch, useSelector} from "react-redux";
import {getDirectionCities, getDirectionPageTitle} from "../../../store/actions/directionsActions";
import { Helmet } from "react-helmet"
import siteLogo from "../../../assets/svg/logo.svg"

function BestDirectionsPage() {

    /** Формируем хлебные крошки */
    const BREADCRUMBS = [
        {
            name: 'Направления',
            url: ''
        },
    ]
    const directions = useSelector(state => state.directions.directions)
    const pageTitle = useSelector(state => state.directions.pageTitle)

    const heroBackground = require("../../../assets/image/BestDirections.png")


    const dispatcher = useDispatch()

    useEffect(() => {
        dispatcher(getDirectionPageTitle())
        dispatcher(getDirectionCities())
    }, [])

    function getMetaTags() {
        return(
            <Helmet>
                <title>Направления для путешествий | Check in — удобный сервис бронирования отелей и гостиниц</title>
                <meta name="description" content={'Онлайн сервис поиска и бронирования проверенных отелей, апартаментов, хостелов по заданным направлениям. Выбирайте лучшие места размещения для работы и отдыха с Check in'} />
                <meta property="og:title" content={'Направления для путешествий | Check in — удобный сервис бронирования отелей и гостиниц'}/>
                <meta property="og:description" content={'Онлайн сервис поиска и бронирования проверенных отелей, апартаментов, хостелов по заданным направлениям. Выбирайте лучшие места размещения для работы и отдыха с Check in'}/>
                {<meta property="og:image" content={siteLogo} />}
            </Helmet>
        )
    }

    return (
        <div className={classes.wrap}>
            {getMetaTags()}
            <div className={classes.hero}>
                <div className={classes.hero_inner}>
                    <div className={classes.hero_background}>
                        <img className={classes.hero_background_image} src={heroBackground} />
                    </div>
                    <div className={classes.hero_container}>
                        <Breadcrumbs className={classes.breadcrumbs} breadcrumbs={BREADCRUMBS}></Breadcrumbs>
                        <div className={classes.hero_info}>
                            <h1 className={classes.hero_title}>{pageTitle.title.ru}</h1>
                            <p className={classes.hero_text}>{pageTitle.sub_title.ru}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={classes.container}>
                <div className={classes.categories}></div>
                <BestDirections isDirectionPage={true} directions={directions}></BestDirections>
            </div>
        </div>
    )
}

export default BestDirectionsPage