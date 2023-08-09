import React, { useCallback, useEffect, useState } from "react";
import classes from "./Catalog.module.scss";
import FilterCatalog from "../../../components/FilterCatalog/FilterCatalog";
import moment from "moment";
import ButtonMap from "../../../components/UI/btns/ButtonMap/ButtonMap";
import { useTranslation } from "react-i18next";
import SortSelect from "../../../components/UI/areas/SortSelect/SortSelect";
import HotelCardCatalog from "../../../components/HotelCardCatalog/HotelCardCatalog";
import usePagination from "../../../hooks/usePagination";
import { useDispatch, useSelector } from "react-redux";
import {
    getFiltersCatalog,
    getGeoData,
    getHotels,
    getMapHotels,
    getTypeHotels,
    getSights, getPopularFilters,
    getSubway, getConfigSubway, clearSubway,
} from "../../../store/actions/catalogActions";
import Preloader from "../../../components/Preloader/Preloader";
import * as ReactRouterDOM from "react-router-dom";
import { dispatchObjectToUrl } from "../../../functions/dispatchObjectToUrl";
import CustomMap from "../../../components/UI/other/CustomMap/CustomMap";
import Breadcrumbs from "../../../components/Breadcrumbs/Breadcrumbs";
import priceMatchingPicture from "../../../assets/image/price_matching_picture.svg"
import mobileButtonIconFilter from "../../../assets/svg/icons/mobile-button-filter.svg"
import mobileButtonIconMap from "../../../assets/svg/icons/mobile-button-map.svg"
import useWindowSize from "../../../hooks/useWindowSize"
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ProgressBarMap from "./components/ProgressBar/ProgressBar";
import { Helmet } from "react-helmet"
import siteLogo from "../../../assets/svg/logo.svg"
import Discount from "../../../components/Discount/Discount";
import CustomMapCatalog from "../../../components/CustomMapCatalog/CustomMapCatalog";

function Catalog() {
    const { page } = useParams()
    const hotels = useSelector(state => state.catalog.hotels)
    const preloaderVisible = useSelector(state => state.router.preloaderVisible)
    const coordinates = useSelector(state => state.catalog.coordinates)
    const city = useSelector(state => state.catalog.city)
    const _meta = useSelector(state => state.catalog._meta)
    const navigate = useNavigate()
    const location = useLocation()
    const { t } = useTranslation()
    const dispatcher = useDispatch()
    const useSearchParams = ReactRouterDOM.useSearchParams;
    const [searchParams, setSearchParams] = useSearchParams();
    const [isRefreshed, setIsRefreshed] = useState(false) // TODO: Удалить поле, отрефачить логику
    const [isShowMap, setIsShowMap] = useState(searchParams.get("map") === 'true' ? true : false)
    const [isCityCenter, setIsCityCenter] = useState(true)
    const mapHotels = useSelector(state => state.catalog.mapHotels)
    const [currentMapHotel, setCurrentMapHotel] = useState()
    const [showAllFilterModal, setShowAllFilterModal] = useState(false)
    const [showSearchModal, setShowSearchModal] = useState(false)
    const windowSize = useWindowSize()
    const [prevPage, setPrevPage] = useState(page)
    const [progressBarMap, setProgressBarrMap] = useState(30)
    const [isShowProgressBarMap, setIsShowProgressBarMap] = useState(false)
    const isOldDates = moment(searchParams.get("dateFrom"), "YYYY-MM-DD").isSameOrAfter(moment(moment().format("YYYY-MM-DD")), "YYYY-MM-DD")

    /** Последний кликнутый фильтр */
    const [lastClickFilter, setLastClickFilter] = useState({ name: '', value: "" })

    const [filters, setFilters] = useState({
        region: { id: searchParams.get("id") ?? 6, type: searchParams.get("type") ?? 'region', city_region_id: searchParams.get("city_region_id") ?? null },
        adults: searchParams.get("adults") ?? 2,
        children: searchParams.get("children") ?? 0,
        dateFrom: searchParams.get("dateFrom") ? moment(searchParams.get("dateFrom")) : moment(new Date()).add(2, 'days'),
        dateTo: searchParams.get("dateTo") ? moment(searchParams.get("dateTo")) : moment(new Date()).add(3, 'days'),
        minPrice: searchParams.get("minPrice") ?? 0,
        maxPrice: searchParams.get("maxPrice") ?? 999999,
        compliment: searchParams.get("compliment") ?? 0,
        rating: searchParams.get("rating") ? searchParams.get("rating").split(',').map((elem) => { return Number(elem) }) : [],
        sort: searchParams.get("sort") ?? "-price",
        perPage: 10,
        sumCheckboxs: searchParams.get("rating"),
        shouldUpdate: true,
        type_id: searchParams.get("types") ? searchParams.get("types").split(',').map((elem) => { return Number(elem) }) : [],
        is_verified: searchParams.get("is_verified") ? +searchParams.get("is_verified") : 0,
        stars: searchParams.get("stars") ? searchParams.get("stars").split('').map((elem) => { return Number(elem) }) : [],
        amenity_ids: searchParams.get("amenity_ids") ? searchParams.get("amenity_ids").split(',').map((elem) => { return Number(elem) }) : [],
        point_of_interest_ids: searchParams.get("point_of_interest_ids") ? searchParams.get("point_of_interest_ids").split(',').map((elem) => { return Number(elem) }) : [],
        arrival_time_after: searchParams.get("arrival_time_after") ? searchParams.get("arrival_time_after").split(',') : [],
        departure_time_before: searchParams.get("departure_time_before") ? searchParams.get("departure_time_before").split(',') : [],
        meal_type_ids: searchParams.get("meal_type_ids") ? searchParams.get("meal_type_ids").split(',').map((elem) => { return Number(elem) }) : [],
        station_ids: searchParams.get("station_ids") ? searchParams.get("station_ids").split(',').map((elem) => { return Number(elem) }) : [],
    })

    let urlFilters = {
        region: { id: searchParams.get("id"), type: searchParams.get("type"), city_region_id: searchParams.get("city_region_id") ?? null, },
        adults: searchParams.get("adults") ?? 2,
        children: searchParams.get("children") ?? 0,
        dateFrom: isOldDates ? searchParams.get("dateFrom") : moment(new Date()).add(2, 'days').format("YYYY-MM-DD"),
        dateTo: isOldDates ? searchParams.get("dateTo") : moment(new Date()).add(3, 'days').format("YYYY-MM-DD"),
        sort: searchParams.get("sort") ?? "-price",
        minPrice: searchParams.get("minPrice") ?? filters.minPrice,
        maxPrice: searchParams.get("maxPrice") ?? filters.maxPrice,
        preview: searchParams.get("preview"),
        compliment: Number(searchParams.get("compliment")),
        rating: searchParams.get("rating") ? searchParams.get("rating").split(',').map((elem) => { return Number(elem) }) : [],
        sumCheckboxs: searchParams.get("sumCheckboxs") ?? '',
        type_id: searchParams.get("types") ? searchParams.get("types").split(',').map((elem) => { return Number(elem) }) : [],
        is_verified: searchParams.get("is_verified") ? +searchParams.get("is_verified") : 0,
        stars: searchParams.get("stars") ? searchParams.get("stars").split(',').map((elem) => { return Number(elem) }) : [],
        amenity_ids: searchParams.get("amenity_ids") ? searchParams.get("amenity_ids").split(',').map((elem) => { return Number(elem) }) : [],
        point_of_interest_ids: searchParams.get("point_of_interest_ids") ? searchParams.get("point_of_interest_ids").split(',').map((elem) => { return Number(elem) }) : [],
        arrival_time_after: searchParams.get("arrival_time_after") ? searchParams.get("arrival_time_after").split(',') : [],
        departure_time_before: searchParams.get("departure_time_before") ? searchParams.get("departure_time_before").split(',') : [],
        meal_type_ids: searchParams.get("meal_type_ids") ? searchParams.get("meal_type_ids").split(',').map((elem) => { return Number(elem) }) : [],
        station_ids: searchParams.get("station_ids") ? searchParams.get("station_ids").split(',').map((elem) => { return Number(elem) }) : [],
    }

    const searchHandler = () => {
        if (filters.dateTo) {
            const filtersObg = {
                adults: filters.adults,
                children: filters.children,
                dateFrom: filters.dateFrom.format('YYYY-MM-DD'),
                dateTo: filters.dateTo.format('YYYY-MM-DD'),
                minPrice: filters.minPrice,
                maxPrice: filters.maxPrice,
                compliment: filters.compliment ?? 0,
                rating: filters.rating.join(','),
                sumCheckboxs: filters.sumCheckboxs,
                types: filters.type_id.join(','),
                sort: filters.sort,
                is_verified: filters.is_verified,
                type: filters.region.type,
                stars: filters.stars.join(','),
                id: filters.region.id,
                amenity_ids: filters.amenity_ids.join(','),
                point_of_interest_ids: filters.point_of_interest_ids.join(','),
                arrival_time_after: filters.arrival_time_after.join(','),
                departure_time_before: filters.departure_time_before.join(','),
                meal_type_ids: filters.meal_type_ids.join(','),
                station_ids: filters.station_ids.join(','),
                map: isShowMap
            }
            if (filters.preview) {
                Object.assign(filtersObg, { preview: true })
            } else {
                delete filters.preview
            }
            if (filters.region.id) {
                filtersObg.id = filters.region.id;
                delete filtersObg.city_region_id
            }
            if (filters.region.city_region_id) {
                filtersObg.city_region_id = filters.region.city_region_id;
                delete filtersObg.id
            }
            setSearchParams(filtersObg, { replace: true });
        }
    }

    const gaEvent = useCallback(() => {
        if (city && hotels && hotels.length) {
            console.log(`gaEvent, city: ${city}`)

            const items = hotels.map(item => {
                return (
                    {
                        item_name: item.name.ru, // Название отеля в выдаче
                        item_id: `H${item.id}`, // Префикс “H” (от Hotel) + ID отеля
                        price: item.price // // Минимальная стоимость брони за ночь (В UI отображается как “От ххх.хх руб./ночь”. Здесь нужно указать только число)
                    }
                )
            })

            const bookingNightsCount = moment(urlFilters.dateTo, "YYYY-MM-DD").diff(moment(urlFilters.dateFrom, "YYYY-MM-DD"), "days")

            /** clear previous ecommerce object */
            window.dataLayer.push({
                ecommerce: null
            })

            window.dataLayer.push({
                event: "view_search_results",
                ecommerce: {
                    booking_country: "Russia",       // Страна, где идет поиск. Если у отелей нет такого параметра, то всегда передавать статическое значение “Russia”
                    booking_city: city || null,       // Город, где идет поиск
                    booking_start_date: filters.dateFrom.format('YYYY-MM-DD'),        // Дата заезда
                    booking_end_date: filters.dateTo.format('YYYY-MM-DD'),            // Дата выезда
                    booking_adults: parseInt(filters.adults),    // Кол-во взрослых
                    booking_kids: parseInt(filters.children),    // Кол-во детей
                    booking_nights: bookingNightsCount,          // Кол-во ночей в поиске
                    items: items
                }
            })
        }
    }, [
        city,
        hotels,
        filters.adults,
        filters.children,
        filters.dateFrom,
        filters.dateTo,
        urlFilters.dateFrom,
        urlFilters.dateTo
    ])

    useEffect(() => {
        gaEvent()
    }, [city, hotels, gaEvent])


    useEffect(() => {
        searchHandler()
    }, [filters, isShowMap])

    useEffect(() => {
        if (!isRefreshed) {
            const filtersObg = {
                ...urlFilters,
                dateFrom: urlFilters.dateFrom ? moment(urlFilters.dateFrom.replace(/-/g, '')) : filters.dateFrom,
                dateTo: urlFilters.dateFrom ? moment(urlFilters.dateTo.replace(/-/g, '')) : filters.dateTo,
                perPage: 10,
                shouldUpdate: true,
            }
            setFilters(filtersObg)
            setIsRefreshed(true)
            setPrevPage(page)
        }
    }, [])

    /** Подтягиваем фильтры */
    useEffect(() => {
        let filters = { "per-page": 1000 }
        dispatcher(getFiltersCatalog(filters))
    }, [dispatcher])

    useEffect(() => {
        dispatcher(getTypeHotels())
    }, [dispatcher])

    useEffect(() => {
        if (filters.region.type === "city-region") {
            dispatcher(getGeoData(filters.region.city_region_id, "city-region"));
        } else {
            window.rrApiOnReady.push(function () {
                try {
                    window.rrApi.categoryView(filters.region.id)
                } catch (e) { }
            })
            filters.region.type !== "hotel" && dispatcher(getGeoData(filters.region.id));
        }
    }, [dispatcher, filters.region.type, filters.region.id, filters.city_region_id, filters.region.city_region_id])

    useEffect(() => {
        dispatcher(clearSubway())
        dispatcher(getSights(filters.region))
    }, [filters.region, filters.region.type, filters.region.id, filters.city_region_id])

    useEffect(() => {
        if (filters.region.type === "region") { dispatcher(getConfigSubway(filters.region)) }
    }, [filters.region.id])

    const optionSort = [
        {
            value: "price",
            label: "Цена по возрастанию"
        },
        {
            value: "-price",
            label: "Цена по убыванию"
        },
        {
            value: "reviews_rating",
            label: "Рейтинг по возрастанию"
        },
        {
            value: "-reviews_rating",
            label: "Рейтинг по убыванию"
        },
    ]

    const listHotels = hotels && hotels.map((elem, id) => (
        <HotelCardCatalog
            hotelInfo={elem}
            key={id}
            sort={optionSort[1]}
            setIsShowMap={setIsShowMap}
            filters={filters}
            isShowMap={isShowMap}
            setIsCityCenter={setIsCityCenter}
            setCurrentMapHotel={setCurrentMapHotel}
        />
    ))

    /** Формируем хлебные крошки */
    const BREADCRUMBS = [
        {
            name: 'Россия',
            url: ''
        },
        {
            name: city,
            url: ``
        },
        {
            name: 'Результаты поиска',
            url: ``
        }

    ]

    const closeMap = () => {
        setIsShowMap(false)
    }

    const sortHotels = (value) => {
        setFilters(prevState => ({ ...prevState, sort: value, shouldUpdate: true }))
        navigate(`/catalog/1${location.search}`)
    }

    if (preloaderVisible) {
        document.body.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })
    }

    const findHotelMap = async (filters) => {
        setIsShowProgressBarMap(true)
        let isSuccess = await dispatcher(getMapHotels(filters, {
            onDownloadProgress: (progressEvent) => {
                setProgressBarrMap(prevState => prevState + 30)
            }
        }))
        if (isSuccess) {
            setIsShowProgressBarMap(false)
            setProgressBarrMap(30)
        } else {
            setIsShowProgressBarMap(false)
            setProgressBarrMap(30)
        }
    }

    useEffect(() => {
        if (filters.region.type === "hotel") {
            const filtersObg = {
                ...filters,
                id: filters.region.city_region_id
            }
            setSearchParams(filtersObg, { replace: true });
            return navigate(`/hotel?id=${filters.region.id}&dateFrom=${filters.dateFrom.format('YYYY-MM-DD')}&dateTo=${filters.dateTo.format('YYYY-MM-DD')}&adults=${filters.adults}&children=${filters.children}`)
        }
    }, [hotels])



    const getInfo = useCallback(async (params) => {

        setIsCityCenter(true)
        if (isRefreshed && params.dateTo) {
            const filtersObg = {
                ...params,
                dateFrom: filters.dateFrom.format('YYYY-MM-DD'),
                dateTo: filters.dateTo.format('YYYY-MM-DD'),
                page: +page,
                perPage: 10,
                type_id: filters.type_id.join(','),
                is_verified: +filters.is_verified,
                stars: filters.stars.join(','),
                amenity_ids: filters.amenity_ids.join(','),
                meal_type_ids: filters.meal_type_ids.join(','),
                station_ids: filters.station_ids.join(','),
                point_of_interest_ids: filters.point_of_interest_ids.join(','),
                arrival_time_after: filters.arrival_time_after.join(','),
                departure_time_before: filters.departure_time_before.join(','),
                "actual_filters_click[name]": lastClickFilter.name,
                "actual_filters_click[value]": lastClickFilter.value
            }


            const lastSearchArray = JSON.parse(localStorage.getItem("lastRequests")) || [];
            const isNoPutToLastRequests = lastSearchArray.find((elem) => {
                return elem.id === filters.region.id
            })
            if (filters.region.id) {
                filtersObg.id = filters.region.id;
                delete filtersObg.city_region_id
            }
            if (filters.region.city_region_id) {
                filtersObg.city_region_id = filters.region.city_region_id;
                delete filtersObg.id
            }
            if (filtersObg)
                if (!isNoPutToLastRequests && filters.region.id) {
                    lastSearchArray.unshift(filters.region)
                    localStorage.setItem('lastRequests', JSON.stringify(lastSearchArray.slice(0, 10)));

                }
            if (filters.region.type !== 'hotel') {
                if (page !== prevPage) {
                    setPrevPage(params.page)
                    findHotelMap(filtersObg)
                    setLastClickFilter({ name: "", value: "" })
                    dispatcher(getPopularFilters(filters.region))
                    return await dispatcher(getHotels(filtersObg))
                }
                if (filters.shouldUpdate) {
                    findHotelMap(filtersObg)
                    setLastClickFilter({ name: "", value: "" })
                    dispatcher(getPopularFilters(filters.region))
                    return await dispatcher(getHotels(filtersObg))
                }
            }
        }
    }, [filters, page, isRefreshed])


    useEffect(() => {
        window.onpopstate = e => {
            if (e) {
                let newSearchParams = new URLSearchParams(e.currentTarget.window.location.search)
                setFilters({
                    region: { id: newSearchParams.get("id") ?? null, type: newSearchParams.get("type") ?? 'region', city_region_id: newSearchParams.get("city_region_id") ?? null },
                    adults: newSearchParams.get("adults") ?? 2,
                    children: newSearchParams.get("children") ?? 0,
                    dateFrom: newSearchParams.get("dateFrom") ? moment(newSearchParams.get("dateFrom")) : moment(new Date()).add(2, 'days'),
                    dateTo: newSearchParams.get("dateTo") ? moment(newSearchParams.get("dateTo")) : moment(new Date()).add(3, 'days'),
                    minPrice: newSearchParams.get("minPrice") ?? 0,
                    maxPrice: newSearchParams.get("maxPrice") ?? 999999,
                    compliment: +newSearchParams.get("compliment") ?? 0,
                    rating: searchParams.get("rating") ? searchParams.get("rating").split(',').map((elem) => { return Number(elem) }) : [],
                    sort: newSearchParams.get("sort") ?? "-price",
                    perPage: 10,
                    sumCheckboxs: newSearchParams.get("rating"),
                    shouldUpdate: true,
                    type_id: newSearchParams.get("types") ? newSearchParams.get("types").split(',').map((elem) => { return Number(elem) }) : [],
                    is_verified: newSearchParams.get("is_verified") ? +newSearchParams.get("is_verified") : 0,
                    stars: newSearchParams.get("stars") ? newSearchParams.get("stars").split('').map((elem) => { return Number(elem) }) : [],
                    amenity_ids: searchParams.get("amenity_ids") ? searchParams.get("amenity_ids").split(',').map((elem) => { return Number(elem) }) : [],
                    meal_type_ids: searchParams.get("meal_type_ids") ? searchParams.get("meal_type_ids").split(',').map((elem) => { return Number(elem) }) : [],
                    station_ids: searchParams.get("station_ids") ? searchParams.get("station_ids").split(',').map((elem) => { return Number(elem) }) : [],
                    point_of_interest_ids: searchParams.get("point_of_interest_ids") ? searchParams.get("point_of_interest_ids").split(',').map((elem) => { return Number(elem) }) : [],
                    arrival_time_after: searchParams.get("arrival_time_after") ? searchParams.get("arrival_time_after").split(',') : [],
                    departure_time_before: searchParams.get("departure_time_before") ? searchParams.get("departure_time_before").split(',') : [],
                })
            }
        };
        return window.onpopstate
    }, [])

    function formatParams() {
        if (isRefreshed) {
            const filtersObg = {
                id: filters.region.id,
                type: filters.region.type,
                adults: filters.adults,
                children: filters.children,
                dateFrom: filters.dateFrom && filters.dateFrom.format('YYYY-MM-DD'),
                dateTo: filters.dateTo && filters.dateTo.format('YYYY-MM-DD'),
                minPrice: filters.minPrice,
                maxPrice: filters.maxPrice,
                preview: filters.preview,
                rating: filters.rating,
                sumCheckboxs: filters.sumCheckboxs,
                compliment: filters.compliment,
                types: filters.type_id.join(','),
                sort: filters.sort,
                is_verified: filters.is_verified,
                stars: filters.stars,
                amenity_ids: filters.amenity_ids,
                meal_type_ids: filters.meal_type_ids,
                station_ids: filters.station_ids,
                point_of_interest_ids: filters.point_of_interest_ids,
                arrival_time_after: filters.arrival_time_after,
                departure_time_before: filters.departure_time_before,
            }

            const filtersUrl = dispatchObjectToUrl(filtersObg)
            return filtersUrl
        }
    }

    /** Пагинация */
    const [pagination] = usePagination({
        limit: 10,
        getInfo: getInfo,
        perPage: 10,
        total: _meta && _meta.totalCount,
        otherParams: filters,
        urlParams: formatParams(),
    });

    const getCityHotels = () => {
        if (filters.region.type === "city-region") {
            dispatcher(getGeoData(filters.region.city_region_id, "city-region"));
        } else {
            dispatcher(getGeoData(filters.region.id));
        }
        setIsShowMap(true)
        document.body.scrollIntoView({ block: "start", behavior: "smooth" })
    }

    const sort = <div className={classes.sort}>
        <SortSelect
            className={classes.sort_select}
            option={optionSort}
            defaultValue={optionSort.find((sort) => sort.value === filters.sort)}
            onChange={(value) => {
                sortHotels(value.value)
            }} />
    </div>

    const noSearch = <div className={isShowMap ? classes.noSearch_map : classes.noSearch}>
        <div className={isShowMap ? classes.noSearch_map_text : classes.noSearch_text}>
            <h2>Ничего не нашли?</h2>
            <h3>Измените параметры поиска и повторите попытку</h3>
        </div>
        {        //<Button
            //   className={isShowMap ? classes.noSearch_map_btn : classes.noSearch_btn}
            //   // onClick={handleClick}
            //   btnColor="ButtonBlue">Мне повезет!</Button>
        }
    </div>

    const priceMatching =
        <div className={classes.price_matching}>
            <div className={classes.price_matching_info}>
                <div className={classes.price_matching_title}>
                    Сверяем номера и цены
                </div>
                <div className={classes.price_matching_text}>
                    Более 7000 объектов уже настраивают свои личные кабинеты и готовятся встречать гостей
                </div>
            </div>
            <div className={classes.price_matching_picture}>
                <img src={priceMatchingPicture} alt="" />
            </div>
        </div>

    const toggleAllFilterModal = () => {
        setShowAllFilterModal(!showAllFilterModal)
    }

    const toggleSearchModal = () => {
        setShowSearchModal(!showSearchModal)
    }

    const showAsideFilter = windowSize.width >= 1024 || (windowSize.width < 1024 && !isShowMap)

    function getMetaTags() {

        const ldJson = {
            "@context": "https://schema.org/",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Главная",
                    "item": "https://checkin.ru/"
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": `${filters.region?.name} : список отелей`,
                    "item": `${window.location.href}`
                }
            ]
        }

        return (
            <Helmet>
                {(filters.region.id || filters.region.city_region_id) && <title>{city ? city : hotels.length ? hotels[0].name.ru : ''}: поиск и бронирование отелей - Check in</title>}
                <meta name="description" content={'Планируете путешествие по России? Check in — удобный сервис бронирования отелей и гостиниц. Включайся в путешествия'} />
                <meta property="og:title" content="Check in - выгодные предложения на бронирование отелей в городах России" />
                <meta property="og:description" content="Планирование отдыха и командировок в проверенных отелях, бесплатная отмена бронирования, поддержка 24 часа, Check in" />
                <meta property="og:image" content={siteLogo} />
                <script type="application/ld+json">
                    {JSON.stringify(ldJson)}
                </script>
            </Helmet>
        )
    }

    return (
        <div className={[classes.layout, isShowMap ? classes.layout_map : classes.layout_default].join(" ")}>
            <div className={classes.wrap}>
                {getMetaTags()}
                {!isShowMap && <Breadcrumbs breadcrumbs={BREADCRUMBS}></Breadcrumbs>}
                <div className={classes.bar}>
                    <div className={classes.aside}>
                        {showAsideFilter && <FilterCatalog
                            filters={filters}
                            onChange={(filters) => {
                                setFilters(filters)
                                navigate(`/catalog/1${location.search}`)
                                setPrevPage("1")
                            }}
                            lastFilter={lastClickFilter}
                            setLastFilter={setLastClickFilter}
                            getInfo={getInfo}
                            setIsCityCenter={setIsCityCenter}
                            toggleAllFilterModal={toggleAllFilterModal}
                            showAllFilterModal={showAllFilterModal}
                            isShowMap={isShowMap}
                        />}
                        {windowSize.width < 1024 && <div className={classes.mobile_controls}>
                            <div
                                className={[classes.mobile_button, classes.mobile_button_filter].join(" ")}
                                onClick={() => { toggleAllFilterModal() }}
                            >
                                <div className={classes.mobile_button_icon}>
                                    <img src={mobileButtonIconFilter} alt="" />
                                </div>
                                {!isShowMap && <div className={classes.mobile_button_name}>Все фильтры</div>}
                            </div>
                            {!isShowMap &&
                                <div
                                    className={[classes.mobile_button, classes.mobile_button_map].join(" ")}
                                    onClick={() => getCityHotels()}
                                >
                                    <div className={classes.mobile_button_icon}>
                                        <img src={mobileButtonIconMap} alt="" />
                                    </div>
                                </div>
                            }
                        </div>}
                    </div>
                    <div className={classes.list}>
                        <div className={classes.header}>
                            <div className={classes.title_place}>
                                {
                                    !hotels.length && !preloaderVisible &&
                                    <>
                                        <h1 className={classes.title}>Поиск не дал результатов</h1>
                                        <p className={classes.title_note}>Попробуйте изменить параметры поиска</p>
                                    </>
                                }
                                {/* hotels.length
                                    ?
                                    <h1 className={classes.title}>
                                        {(filters.region.id || filters.region.city_region_id) && `${filters.region?.name}: `}
                                        {(filters.region.id || filters.region.city_region_id) ? numWord(_meta.totalCount, ['найден', 'найдено', 'найдено']) : numWord(_meta.totalCount, ['Найден', 'Найдено', 'Найдено'])} {`${_meta.totalCount} ` + numWord(_meta.totalCount, ['отель', 'отеля', 'отелей'])}
                                    </h1>
                                    :
                                    !preloaderVisible
                                        ?
                                        <>
                                            <h1 className={classes.title}>Поиск не дал результатов</h1>
                                            <p className={classes.title_note}>Попробуйте изменить параметры поиска</p>
                                        </>
                                        :
                                        <div />
                                */}
                            </div>
                            {!isShowMap &&
                                <ButtonMap
                                    id="button_catalog_guest_b2c_view_on_map"
                                    onClick={() => getCityHotels()}
                                    className={[classes.button_map, "button_catalog_guest_b2c_view_on_map"].join(" ")}
                                >
                                    {t("filterCatalog.search.buttonMap")}
                                </ButtonMap>
                            }
                        </div>
                        {!!hotels.length && sort}
                        <div className={classes.catalog_list_hotels}>
                            {preloaderVisible ? <Preloader /> : hotels.length ? <><Discount isShowMap={isShowMap} isCatalog={true} /> {listHotels}</> : ''}
                        </div>
                        <div className={classes.catalog_list_pagination}>
                            {/*<p className={classes.catalog_list_pagination_title}>{city && `${city}:`}{filters.region.id ? "найдено" : "Найдено"} вариантов: {hotels && hotels.length} </p>*/}
                            {pagination}
                        </div>
                        <div className={classes.catalog_list_swiper}>
                            {   //<LastWatchCatalogSlider
                                //       slidesPerView={3}
                                //       hotels={fakeHotels}
                                //   ></LastWatchCatalogSlider>
                            }
                        </div>
                    </div>
                </div>
            </div>
            {isShowMap &&
                <div className={[classes.map_place, showAllFilterModal ? classes.map_place_with_modal : ""].join(" ")}>
                    {windowSize.width < 1024 &&
                        <div className={classes.map_search}>
                            { /* <SearchPanel filters={filters} toggleModal={toggleSearchModal} /> */}
                            <FilterCatalog
                                filters={filters}
                                cityName={city}
                                onChange={(filters) => {
                                    setFilters(filters)
                                    navigate(`/catalog/1${location.search}`)
                                }}
                                getInfo={getInfo}
                                setIsCityCenter={setIsCityCenter}
                                className={[classes.filter_default].join(" ")}
                                toggleAllFilterModal={toggleAllFilterModal}
                                showAllFilterModal={showAllFilterModal}
                                isShowMap={isShowMap}
                            />
                        </div>
                    }
                    <div className={classes.map_wrap}>
                        {isShowProgressBarMap ? <ProgressBarMap cityName={city} progress={progressBarMap}></ProgressBarMap> :
                            !hotels.length && !preloaderVisible && <div className={classes.map_title_place}>


                                <>
                                    <h1 className={classes.title}>Поиск не дал результатов</h1>
                                    <p className={classes.title_note}>Попробуйте изменить параметры поиска</p>
                                </>
                            </div>}
                        { /* hotels.length
                                ?
                                <h1 className={classes.map_title}>
                                    {(filters.region.id || filters.region.city_region_id) && `${filters.region?.name}: `}
                                    {(filters.region.id || filters.region.city_region_id) ? numWord(_meta.totalCount, ['найден', 'найдено', 'найдено']) : numWord(_meta.totalCount, ['Найден', 'Найдено', 'Найдено'])} {`${_meta.totalCount} ` + numWord(_meta.totalCount, ['отель', 'отеля', 'отелей'])}

                                </h1>
                                :
                                !preloaderVisible
                                ?
                                <>
                                <h1 className={classes.map_title}>Поиск не дал результатов</h1>
                                <p className={classes.map_title_note}>Попробуйте изменить параметры поиска</p>
                                </>
                                :
                                <div />
                            */ }

                        <CustomMapCatalog
                            isShowMap={isShowMap}
                            className={classes.map}
                            hotels={mapHotels}
                            filters={filters}
                            isCatalog={true}
                            close={closeMap}
                            cityCenter={coordinates}
                            isCityCenter={isCityCenter}
                            currentMapHotel={currentMapHotel}
                            setCurrentMapHotel={setCurrentMapHotel}
                        ></CustomMapCatalog>
                    </div>
                </div>
            }
        </div>
    )
}

export default Catalog

export const filterPriceRoom = (rooms) => {
    if (!rooms.length) {
        return {
            price: 0
        };
    }
    let minimum = rooms[0].price;
    let room;
    for (const item of rooms) {
        if (item.price <= minimum) {
            minimum = item.price;
            room = item;
        }
    }
    return room
}