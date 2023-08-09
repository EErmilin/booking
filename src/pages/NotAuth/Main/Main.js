import React, { useEffect, useState } from "react";

import classes from "./Main.module.scss";
import BackgroundMain from "../../../components/Backgounds/BackgroundMain/BackgroundMain";
import WrapperFilterMain from "../../../components/Wrappers/WrapperFilterMain/WrapperFilterMain";
import FilterMain from "../../../components/FilterMain/FilterMain";
import LastSearchFilter from "../../../components/LastSearchFilter/LastSearchFilter";
import LastSearchHotel from "../../../components/LastSearchHotel/LastSearchHotel";
import BestDirections from "../../../components/BestDirections/BestDirections";
import OurPartners from "../../../components/OurPartners/OurPartners";
import PopularPlaces from "../../../components/PopularPlaces/PopularPlaces";
import MainHero from "../../../components/MainHero/MainHero";
import { clearCity, clearHotels, getLastHotels, getPopularHotels } from "../../../store/actions/catalogActions";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { getDirectionCities, getImagesMain, getPatners } from "../../../store/actions/directionsActions";
import FirstVisitorModal from "../../../components/UI/modals/FirstVisitorModal/FirstVisitorModal"
import { useLocation } from "react-router-dom";
import { DispatchUrlToObject } from "../../../functions/dispatchUrlToObject";
import { Helmet } from "react-helmet"
import Discount from "../../../components/Discount/Discount";

function Main() {
    const location = useLocation()
    const dispatcher = useDispatch()

    const [filters, setFilters] = useState({
        search: '',
        adults: 2,
        children: 0,
        dateFrom: moment(new Date()).add(2, 'days'),
        dateTo: moment(new Date()).add(3, 'days'),
    })

    useEffect(() => {
        if (location.search) {
            let filterObject = location.search.slice(1)
                .split('&')
                .map((elem) => ({ [elem.split('=')[0]]: elem.split('=')[1] }))
                .reduce((result, item) => {
                    let key = Object.keys(item)[0]; //first property: a, b, c
                    result[key] = item[key];
                    return result;
                }, {})
            setFilters({
                search: '',
                adults: filterObject.adults ? filterObject.adults : 1,
                children: filterObject.children ? filterObject.children : 0,
                dateFrom: filterObject.dateFrom ? moment(filterObject.dateFrom, "YYYY-MM-DD") : moment(new Date()).add(2, 'days'),
                dateTo: filterObject.dateTo ? moment(filterObject.dateTo, "YYYY-MM-DD") : moment(new Date()).add(3, 'days'),
            })
        }
    }, [location.search])

    const [showVisitorModal, setShowVisitorModal] = useState(false)
    const popularHotels = useSelector(state => state.catalog.popular)
    const lastWatchHotels = useSelector(state => state.hotels.lastWatchHotels)
    const partners = useSelector(state => state.directions.partners)
    const images = useSelector(state => state.directions.images)

    //  localStorage.setItem('lastRequests', JSON.stringify([]));

    const directions = useSelector(state => state.directions.directions)

    useEffect(() => {
        dispatcher(getDirectionCities())
        dispatcher(getImagesMain())
        dispatcher(clearCity())
        dispatcher(clearHotels())
    }, [dispatcher])

    const lastRequests = JSON.parse(localStorage.getItem("lastRequests")) || [];

    useEffect(() => {
        const lastWatchArray = JSON.parse(localStorage.getItem("lastWatchHotels")) || [];

        // const filtersObg = {
        //     room_adult_count: filters.adults,
        //     date_arrival: filters.dateFrom.format('YYYY-MM-DD'),
        //     date_departure: filters.dateTo.format('YYYY-MM-DD'),
        // }
        // dispatcher(getPopularHotels(filtersObg))
        
        dispatcher(getLastHotels(lastWatchArray))
        dispatcher(getPatners())
    }, [dispatcher])


    const firstVisitorModalShown = localStorage.getItem("firstVisitorModalShown")

    if (!firstVisitorModalShown) {
        localStorage.setItem("firstVisitorModalShown", "1")
        setTimeout(() => {
            setShowVisitorModal(true)
        }, 2000)
    }

    function getMetaTags() {
        return (
            <Helmet>
                <title>Check in &mdash; удобный сервис бронирования отелей и гостиниц | Включайся в путешествия</title>
                <meta name="description" content='Онлайн сервис поиска и бронирования проверенных отелей, апартаментов, хостелов, комплексов загородного отдыха. Выбирайте лучшие места размещения для работы и отдыха. Сравнивайте цены, фото, отзывы, чтобы найти подходящее жилье в любой точке России. Check in помогает планировать безопасные и выгодные путешествия с прозрачными и надежными условиями заселения.' />
            </Helmet>
        )
    }

    return (
        <div className={classes.wrap}>
            {getMetaTags()}
            <div className={classes.hero}>
                <MainHero images={images}>
                    <FilterMain filters={filters} setFilters={setFilters} />
                </MainHero>
            </div>
            <div className={classes.container}>

                {lastRequests.length ? <LastSearchFilter filters={filters} lastRequests={lastRequests}></LastSearchFilter> : null}
                {lastWatchHotels.length ? <LastSearchHotel filters={filters} lastWatchHotels={lastWatchHotels}></LastSearchHotel> : null}
                <Discount />
            </div>
            <div className={classes.popular}>
                {
                    //popularHotels.length ? <PopularPlaces popularHotels={popularHotels} filters={filters} /> : null
                }
            </div>
            <div className={classes.container}>
                <BestDirections directions={directions.slice(0, 3)}></BestDirections>
                <OurPartners partners={partners} isMainPage={true}></OurPartners>
            </div>
            {showVisitorModal && <FirstVisitorModal btnCancelClick={setShowVisitorModal} />}
        </div>
    )
}

export default Main