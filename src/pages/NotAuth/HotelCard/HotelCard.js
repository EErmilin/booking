import { useEffect, useRef, useState } from "react";

import React, { useMemo } from "react"
import classes from "./HotelCard.module.scss";
import Breadcrumbs from "../../../components/Breadcrumbs/Breadcrumbs";
import { useTranslation } from "react-i18next";
import CustomHeaderAnchor from "../../../components/CustomHeaderAnchor/CustomHeaderAnchor";
import LastWatchCatalogSlider from "../../../components/LastWathCatalogSlider/LastWatchCatalogSlider";
import StarRating from "../../../components/StarRating/StarRating";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import BtnIcon from "../../../components/UI/btns/BtnIcon/BtnIcon";
import ButtonMap from "../../../components/UI/btns/ButtonMap/ButtonMap";
import GridPhoto from "../../../components/GridPhoto/GridPhoto";
import CommentRating from "../../../components/CommentRating/CommentRating";
import HotelsCommentSwiper from "../../../components/HotelsComentSwiper/HotelsComentSwiper";
import HotelComfort from "../../../components/HotelComfort/HotelComfort";
import HotelDescription from "../../../components/HotelDescription/HotelDescription";
import SettlementConditions from "../../../components/SettlementСonditions/SettlementСonditions";
import Compliment from "../../../components/Compliment/Compliment";
import CatalogRooms from "../../../components/CatalogRooms/CatalogRooms";
import CustomMap from "../../../components/UI/other/CustomMap/CustomMap";
import ServiceHotel from "../../../components/ServiceHotel/ServiceHotel";
import HotelSlider from "../../../components/HotelSlider/HotelSlider";
import {
    clearHotel, getCityNameById,
    getHotelPage, getHotelPageEdit, getSights,
    getSimilarHotels,
} from "../../../store/actions/catalogActions";
import * as ReactRouterDOM from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Preloader from "../../../components/Preloader/Preloader";
import Button from "../../../components/UI/btns/Button/Button";
import NoFunctionalModal from "../../../components/UI/modals/NoFunctionalModal/NoFunctionalModal";
import NoComents from "../../../components/NoComents/NoComents";
import { getHotelListPartner, getServices, getTypeHotels } from "../../../store/actions/partnerHotelsActions";
import useToggleVisibility from "../../../hooks/useToggleVisibility";
import EmptyModal from "../../../components/UI/modals/EmptyModal/EmptyModal";
import { OKShareButton, TelegramShareButton, VKShareButton } from "react-share";
import numberFormat from "../../../functions/numberFormat"
import HotelWithdrawn from "../HotelWithdrawn/HotelWithdrawn";
import moment from "moment"
import serialize from "../../../functions/serialize";
import ReviewModal from "./components/ReviewModal/ReviewModal";
import { Helmet } from "react-helmet"
import numWord from "../../../functions/numWord"
import clearText from "../../../functions/clearText"
import NearbyAttractions from "./components/NearbyAttractions/NearbyAttractions";
import { PARTNER_ROLE } from "../../../roles/roles";
import Discount from "../../../components/Discount/Discount";
import useWindowSize from "../../../hooks/useWindowSize"


function HotelCard() {
    const { t } = useTranslation()
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const [modalReview, setModalReview, closeModalReview] = useToggleVisibility()
    /** Якоря и тайтлы*/
    const anchors = [
        {
            title: t("hotelCard.titles.aboutHotel"),
            id: "#aboutHotel",
        },
        {
            title: t("hotelCard.titles.pricesAndRooms"),
            id: "#pricesAndRooms",
        },
        {
            title: t("hotelCard.titles.comfort"),
            id: "#comfort",
        },
        {
            title: t("hotelCard.titles.comment"),
            id: "#comment",
        },
    ]


    const location = useLocation()
    const useSearchParams = ReactRouterDOM.useSearchParams;
    const windowSize = useWindowSize()
    const [searchParams, setSearchParams] = useSearchParams();
    const similarHotels = useSelector(state => state.catalog.similar)
    const errors = useSelector(state => state.catalog.errors)
    const hotel = useSelector(state => state.catalog.hotel)
    const hotelComments = useSelector(state => state.catalog.hotelComments)
    const [modalShare, setModalShare, closeModalShare] = useToggleVisibility()
    const [copyModal, setCopyModal, closeCopyModal] = useToggleVisibility()
    const partnersHotels = useSelector(state => state.objects.hotels)
    const [isShowNoFunctionalModal, setIShowNoFunctionalModal] = useState(false)
    const [showVerifiedPopup, setShowVerifiedPopup] = useState(false)
    const typeHotels = useSelector(state => state.catalog.typeHotels)
    const userInfo = useSelector(state => state.auth.userInfo)
    const city = useSelector(state => state.catalog.city)
    const isAuth = useSelector(state => state.auth.isAuth)
    const dispatcher = useDispatch()
    const navigate = useNavigate()
    const [isIntersecting, setIsIntersecting] = useState(false);
    const refPrices = useRef(null)

    let urlFilters = useMemo(() => {
        let obj = {
            region: { id: searchParams.get("id"), type: 'hotel', region: searchParams.get("regionId"), label: '' },
            dateFrom: moment(searchParams.get("dateFrom"), "YYYY-MM-DD").isSameOrAfter(moment(moment().format("YYYY-MM-DD")), "YYYY-MM-DD") ? searchParams.get("dateFrom") : moment().add(2, "day").format("YYYY-MM-DD"),
            dateTo: moment(searchParams.get("dateTo"), "YYYY-MM-DD").isSameOrAfter(moment(moment().format("YYYY-MM-DD")), "YYYY-MM-DD") && moment(searchParams.get("dateTo"), "YYYY-MM-DD").isAfter(moment(searchParams.get("dateFrom"), "YYYY-MM-DD")) ? searchParams.get("dateTo") : moment().add(3, "day").format("YYYY-MM-DD"),
            adults: searchParams.get("adults") ? searchParams.get("adults") : 2,
            children: searchParams.get("children") ? searchParams.get("children") : 0,
            minPrice: searchParams.get("minPrice") ? searchParams.get("minPrice") : 0,
            maxPrice: searchParams.get("maxPrice") ? searchParams.get("maxPrice") : 999999,
            edit: searchParams.get("edit"),
            preview: searchParams.get("preview"),
            scroll: searchParams.get("scroll")
        }
        if (searchParams.get('isShowModal')) {
            obj.isShowModal = searchParams.get('isShowModal')
        }
        location.search = `?${serialize({ id: obj.region.id, ...obj })}`
        return obj
    }, [searchParams.get("id"), searchParams.get("dateFrom"), searchParams.get("dateTo")]);

    const observer = useMemo(
        () =>
            new IntersectionObserver(([entry]) =>
                setIsIntersecting(entry.isIntersecting),
            ),
        [],
    );

    useEffect(() => {
        if (refPrices.current) {
            observer.observe(refPrices.current);

            return () => {
                observer.disconnect();
            };
        }
    }, [refPrices, observer, hotel]);

    const chat = document.getElementsByClassName("UR_chatElement")
    useEffect(() => {
        if (chat.length && isMobile) {
            if (!isIntersecting) {
                chat[0].style.margin = '60px -15px'
            } else {
                chat[0].style.margin = '0px'
            }
        }
    }, [isIntersecting, isMobile, hotel]);

    useEffect(() => {
        return () => {
            chat[0].style.margin = '0px'
        };
    }, []);



    function gaEvent() {

        // В массив передаётся список всех показанных пар “Номер + тариф”
        const rooms = [];

        hotel?.rooms.forEach(room => {
            if (room.tariffs) {
                room.tariffs.forEach(tariff => {
                    rooms.push(
                        {
                            item_list_name: hotel.name.ru, // Название отеля
                            item_list_id: `H${hotel.id}`, // Префикс “H” (от Hotel) + ID отеля
                            item_name: room.name.ru, // Название номера
                            item_id: `R${room.id}`, // Префикс “R” (от Room) + ID номера
                            item_variant: `T${tariff.id}::${tariff.name.ru}`, // Префикс “T” (от Tarif) + ID тарифа + “::” + Название тарифа
                            price: tariff.price, // Стоимость брони за ночь (В UI не отображается)
                        })
                })
            }
        })

        const bookingNightsCount = moment(urlFilters.dateTo, "YYYY-MM-DD").diff(moment(urlFilters.dateFrom, "YYYY-MM-DD"), "days")

        /** clear previous ecommerce object */
        window.dataLayer.push({
            ecommerce: null
        })

        window.dataLayer.push({
            event: "view_item_list",
            ecommerce: {
                booking_country: "Russia",       // Страна, где расположен отель. Если у отелей нет такого параметра, то всегда передавать статическое значение “Russia”
                booking_city: city,       // Город, где расположен отель
                booking_start_date: urlFilters.dateFrom,       // Дата заезда
                booking_end_date: urlFilters.dateTo,       // Дата выезда
                booking_adults: urlFilters.adults,       // Кол-во взрослых
                booking_kids: urlFilters.children,       // Кол-во детей
                booking_nights: bookingNightsCount,       // Кол-во ночей
                items: rooms
            }
        })
    }

    useEffect(() => {
        if (hotel && Object.keys(hotel).length && city && city.length) {
            gaEvent()
        }
    }, [city, hotel])

    useEffect(() => {
        if (hotel) {
            dispatcher(getCityNameById(hotel.region_id))
        }

        if (isAuth && userInfo.user_type === PARTNER_ROLE && urlFilters.edit) {
            dispatcher(getHotelListPartner())
        }
        const lastRequests = JSON.parse(localStorage.getItem("lastRequests")) || [];

        const isNoPutToLastRequests = hotel && lastRequests.find((elem) => {
            return Number(elem.id) === hotel.id
        })
        if (hotel && !isNoPutToLastRequests) {
            const objToLast = urlFilters.region;
            objToLast.name = hotel.name.ru
            objToLast.region = hotel.region_id
            lastRequests.unshift(objToLast)
            localStorage.setItem('lastRequests', JSON.stringify(lastRequests.slice(0, 10)));
        }
        const lastWatchArray = JSON.parse(localStorage.getItem("lastWatchHotels")) || [];
        if (hotel && !lastWatchArray.includes(hotel.id)) {
            lastWatchArray.unshift(hotel.id)
            localStorage.setItem('lastWatchHotels', JSON.stringify(lastWatchArray));
        }
    }, [hotel])


    useEffect(() => {
        const hotelId = searchParams.get("id")
        dispatcher(getTypeHotels())

        if (urlFilters.edit) {
            dispatcher(getHotelPageEdit(urlFilters.region.id))
        } else {
            dispatcher(getHotelPage(urlFilters))
        }
        if (hotelId) {
            window.rrApiOnReady.push(function () {
                try {
                    window.rrApi.view(hotelId)
                } catch (e) { }
            })
        }
    }, [urlFilters])

    useEffect(() => {
        if (hotel) {
            dispatcher(getSights({ id: hotel.region_id, type: 'region' }))
        }
    }, [hotel])

    /** Формируем хлебные крошки */
    const BREADCRUMBS = useMemo(
        () => [
            {
                name: 'Россия',
                url: ''
            },
            {
                name: 'Московская область',
                url: ``
            },
            {
                name: 'Москва',
                url: ``
            },
            {
                name: 'Результаты поиска',
                url: `catalog`
            },
            {
                name: hotel && hotel.name && hotel.name.ru,
                url: ``
            }

        ],
    );

    const mainAmenities = <div className={classes.hotel_card_comfort}>
        <h2 className={classes.hotel_card_block_title}>
            {t("hotelCard.body.comfort")}
        </h2>
        <HotelComfort className={classes.hotel_card_comfort_mg}></HotelComfort>
    </div>

    const templateModalReview = modalReview && <ReviewModal
        setModal={setModalReview}
        closeModal={closeModalReview}
        btnCancelCLick={setModalReview}
        hotelId={urlFilters.region.id}
        hotelInfo={hotel}
    ></ReviewModal>

    /**Добавляем скролл к нужным полям если он нужен*/
    useEffect(() => {
        if (hotel && hotel.name) {
            let isScroll = searchParams.get("scroll")

            if (isScroll) {
                document.getElementById(`${anchors[+isScroll]?.id}`)?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                })
            }
        }
    }, [hotel])


    if (hotel && hotel.name) {



        const imgUrl = '';
        const photosObjects = hotel.images && hotel.images.map((elem, id) => {
            return { url: imgUrl + elem }
        })




        const renderEdit = () => {
            if (partnersHotels.filter(e => e.id === hotel.id).length > 0 && urlFilters.edit) {
                return <div className={classes.hotel_card_content_line_edit}>
                    <div className={classes.hotel_card_content_line_edit_text}>Пред. просмотр</div>
                    <Button
                        btnColor="outline_blue"
                        className={classes.hotel_card_content_line_edit_btn}
                        typeButton={1}
                        onClick={() => navigate(`/edit-object/${hotel.id}/first-step`)}
                    >{windowSize.width >= 576 && `Редактировать`}</Button>
                </div>
            }
        }

        const slideTopPicesAndRooms = () => {
            document.getElementById('#pricesAndRooms').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
        }

        const comments = hotelComments && hotelComments.length ? <>
            <HotelsCommentSwiper
                comments={hotelComments}
                typeSwiper={1}
                slidesPerView={1}
                hotelInfo={hotel}
                spaceBetween={0} />
            <div className={classes.hotel_card_grid_photos_comments_footer}>
                <Button btnColor="outline_blue" className={classes.hotel_card_rating_comment_btn} onClick={() => setModalReview(true)} >{t("hotelCard.showAllComments")}</Button>
            </div>
            <NoComents isShow={true} hotelId={hotel.id} />
        </> : <NoComents hotelId={hotel.id} />

        const сommentsBottom = hotelComments && hotelComments.length ?
            <>
                <div className={classes.comments_wrap}>
                    <h2 className={classes.hotel_card_block_title} >
                        {t("hotelCard.titles.comment")}
                    </h2>
                    <Button btnColor="outline_blue"
                        className={classes.noComments_btn}
                        typeButton={1}
                        onClick={() => setModalReview(true)}
                    >
                        Смотреть все
                    </Button>
                </div>
                <HotelsCommentSwiper
                    comments={hotelComments}
                    typeSwiper={2}
                    slidesPerView={1}
                    spaceBetween={20}
                    breakpoints={{
                        576: {
                            slidesPerView: 2
                        },
                        992: {
                            slidesPerView: 3
                        },
                    }}
                />
            </> : <NoComents isBlue={true} hotelId={hotel.id} />



        const map = <div className={classes.hotel_card_location} id="#location">
            <h2 className={classes.hotel_card_block_title} >
                {t("hotelCard.titles.location")}
            </h2>
            <CustomMap
                className={classes.hotel_card_map}
                hotels={[hotel]}
                currentMapHotel={hotel}
                filters={{ ...urlFilters, dateFrom: moment(urlFilters.dateFrom, "YYYY-MM-DD"), dateTo: moment(urlFilters.dateTo, "YYYY-MM-DD") }} />
        </div>

        const goToMap = () => {
            document.getElementById(`#location`).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
        }

        const shareModal = modalShare && <EmptyModal
            close={true}
            background="blue"
            btnCancelClick={() => setModalShare(false)}
            closeModal={closeModalShare}
            width={325}
            typeModal="withoutBack"
        >
            <h3>Поделиться ссылкой</h3>
            <div className={classes.share}>
                <div className={classes.copy} onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                    setModalShare(false)
                    setCopyModal(true)
                }} />
                <VKShareButton
                    url={String(window.location)}>
                    <div className={classes.vk} />
                </VKShareButton>
                <TelegramShareButton
                    url={String(window.location)}
                >
                    <div className={classes.tg} />
                </TelegramShareButton>
                <OKShareButton
                    url={String(window.location)}
                >
                    <div className={classes.ok} />

                </OKShareButton>
            </div>
        </EmptyModal>

        const hotelType = typeHotels && typeHotels.find((type) => type.id === hotel.type_id)


        const bookingBootton = isMobile && !isIntersecting && <Button
            className={classes.hotel_card_button}
            typeButton={2}
            btnColor="ButtonGreen"
            onClick={() => slideTopPicesAndRooms()}
        >Забронировать от {numberFormat(hotel.discount_price)} руб.</Button>

        const modalCopy = copyModal && <EmptyModal
            close={true}
            background="blue"
            btnCancelClick={() => setCopyModal(false)}
            closeModal={closeCopyModal}
            width={325}
            typeModal="withoutBack"
        >
            <div className={classes.success_wrap}>
                <div className={classes.success}></div>
                <h3>Ссылка скопирована!</h3>
            </div>
        </EmptyModal>

        function getMetaTags(hotel, city) {
            const name = hotel?.name?.ru ? hotel.name.ru : 'Отель'
            const stars = hotel.star_rating > 0 ? `${hotel.star_rating} ` + numWord(hotel.star_rating, ['звезда', 'звезды', 'звезд']) : "без звезд";
            const cityName = city ? city : ""

            /** Очищаю описание от тегов */
            const clearedDescriptionText = hotel?.description?.ru ? clearText(hotel.description.ru) : ""

            /** Массив предложений описания */
            const arDescription = clearedDescriptionText ? clearedDescriptionText.split(/\. |\? |! /) : []

            /** Беру первое предложение из описания */
            const description = arDescription.length ? arDescription[0] : ""

            const titleStr = `${name}, ${stars}, ${cityName}, забронировать номер онлайн Check in`

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
                        "name": `${cityName}: список отелей`,
                        "item": `https://checkin.ru/catalog/1?name=${cityName}&id=${hotel.region_id}`
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": `${name} - ${stars}`,
                        "item": `${window.location.href}`
                    }
                ]
            }

            const reviewsCount = hotelComments && hotelComments.length ? hotelComments.length : 0

            const hotelLdJson = {
                "@context": "https://schema.org",
                "@type": "Hotel",
                "name": `${name}`,
                "image": `${hotel.main_image}`,
                "photo": `${hotel.main_image}`,
                "address": {
                    "addressCountry": "Россия",
                    "addressLocality": `${cityName}`,
                    "addressRegion": `${cityName}`,
                    "streetAddress": `${hotel.address}`,
                    "@type": "PostalAddress"
                },
                "starRating": {
                    "@type": "Rating",
                    "ratingValue": parseInt(hotel.star_rating)
                },
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "bestRating": 10,
                    "ratingValue": parseFloat(hotel.reviews_rating),
                    "ratingCount": reviewsCount,
                    "reviewCount": reviewsCount,
                    "worstRating": 1
                },
                "makesOffer": {
                    "@type": "AggregateOffer",
                    "lowPrice": hotel.price,
                    "priceCurrency": "RUB"
                }
            }

            return (
                <Helmet>
                    <title>{titleStr}</title>
                    <meta name="description" content={description} />
                    <meta property="og:title" content="Check in — удобный сервис бронирования отелей и гостиниц. Включайся в путешествия" />
                    <meta property="og:description" content="Check in - онлайн сервис поиска проверенных отелей, апартаментов, хостелов. Выгодное планирование поездок, бесплатная отмена бронирования, поддержка 24 часа " />
                    {hotel?.main_image && <meta property="og:image" content={hotel.main_image} />}
                    <script type="application/ld+json">
                        {JSON.stringify(ldJson)}
                    </script>
                    <script type="application/ld+json">
                        {JSON.stringify(hotelLdJson)}
                    </script>
                </Helmet>
            )
        }

        return (
            <div className={classes.hotel_card}>
                {bookingBootton}
                {getMetaTags(hotel, city)}
                {modalCopy}
                {copyModal}
                {shareModal}
                <NoFunctionalModal setIShowNoFunctionalModal={setIShowNoFunctionalModal} isShowNoFunctionalModal={isShowNoFunctionalModal} />
                {/*<Breadcrumbs breadcrumbs={BREADCRUMBS}></Breadcrumbs>*/}
                <div className={classes.top}>
                    <div></div>
                    {renderEdit()}
                </div>
                <div className={classes.hotel_card_content}>
                    <div className={classes.tabs}>
                        <CustomHeaderAnchor className={classes.hotel_card_titles} anchorTitles={anchors}></CustomHeaderAnchor>
                    </div>
                    <div className={classes.hotel_card_content_line}>
                        <div className={classes.top_labels}>
                            <span className={classes.hotel_card_type}>{hotelType && hotelType.name}</span>
                        </div>
                        <div className={classes.top_buttons}>
                            <BtnIcon
                                icon={"share"}
                                modal={setModalShare}
                                className={classes.header_btn}
                            />
                            <BtnIcon
                                id={"button_guest_b2c_add_to_wishlist"}
                                className={[classes.header_btn, "button_guest_b2c_add_to_wishlist"].join(" ")}
                                icon={"black-heart"}
                                hotelId={hotel.id}
                                isActive={hotel.is_favorite}
                            />
                        </div>
                    </div>
                    <div className={classes.hotel_card_content_line}>
                        <StarRating
                            className={classes.hotel_card_rating}
                            starClassName={classes.star}
                            maxRating={5}
                            starRating={hotel.star_rating}
                        ></StarRating>
                    </div>
                    <div className={classes.hotel_card_header}>
                        <div className={classes.hotel_card_header_left}>
                            <h1 className={classes.hotel_card_header_title}>
                                {hotel.is_verified &&
                                    <div onClick={() => { setShowVerifiedPopup(!showVerifiedPopup) }} className={[classes.verified, isMobile ? classes.verified_mobile : classes.verified_desktop].join(" ")}>
                                        <div className={[classes.verified_popup, isMobile && showVerifiedPopup ? classes.verified_popup_active : ""].join(" ")}>
                                            {t("hotelCard.checkedByExpert")}
                                        </div>
                                    </div>
                                }
                                {hotel.name.ru}
                            </h1>
                            <div className={classes.hotel_card_header_address}>{hotel.address}
                            </div>
                            <div className={classes.hotel_card_map_pin} onClick={() => goToMap()}>Посмотреть на карте</div>
                        </div>
                        <div className={classes.hotel_card_header_right}>
                            <BtnIcon
                                icon={"share"}
                                modal={setModalShare}
                                className={classes.header_btn}
                            />
                            <BtnIcon
                                id={"button_guest_b2c_add_to_wishlist"}
                                className={[classes.header_btn, "button_guest_b2c_add_to_wishlist"].join(" ")}
                                icon={"black-heart"}
                                hotelId={hotel.id}
                                isActive={hotel.is_favorite}
                            />
                            <ButtonMap
                                onClick={() => goToMap()}
                                className={classes.map_button}
                            >
                                {t("filterCatalog.search.buttonMap")}
                            </ButtonMap>
                        </div>
                    </div>
                    {hotel.rooms && <div className={classes.panel}>
                        <div className={classes.panel_pictures}>
                            <div className={classes.panel_gallery}>
                                {photosObjects && <GridPhoto
                                    title={hotel.name.ru}
                                    photos={photosObjects}
                                ></GridPhoto>}
                            </div>
                            <div className={classes.panel_slider}>
                                {photosObjects && <HotelSlider slides={photosObjects} />}
                            </div>
                        </div>
                        <div className={classes.panel_info}>
                            <div className={classes.hotel_card_grid_photos_comments}>
                                <div className={classes.hotel_card_grid_photos_comments_header}>
                                    <CommentRating
                                        className={classes.hotel_card_rating_comment}
                                        classNameTitle={classes.hotel_card_rating_comment_title}
                                        commentCount={hotel.reviews_count}
                                        commentRating={hotel.reviews_rating}
                                        showTextRating={true}
                                    ></CommentRating>
                                </div>
                                <div className={classes.hotel_card_comment_swiper}>
                                    {comments}
                                </div>
                                <div className={classes.price}>
                                    {hotel.price ? <>
                                        <p className={classes.price_title}>Цена за 1 ночь от</p>
                                        {hotel.discount_price !== hotel.price && <p className={classes.price_discount}>{numberFormat(hotel.price)} руб.</p>}
                                        <p className={classes.price_price}>{numberFormat(hotel.discount_price)} руб.</p>

                                    </> :
                                        <div className={classes.noFind_message}> <h2>Отсутствуют свободные номера!</h2>
                                            <p>Измените даты для поиска или посмотрите другие варианты размещения. </p>
                                        </div>
                                    }
                                    {
                                        //<p className={classes.hotel_card_comment_price_price_sale}>4 300 руб.</p>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>}
                    { //Максим должен разделить услуги на главныен и не главные
                        //mainAmenities
                    }
                    <div className={classes.hotel_card_description} id="#aboutHotel">
                        <div className={classes.hotel_card_description_left}>
                            {hotel.compliment && hotel.compliment.has_compliment &&
                                <div
                                    className={classes.hotel_card_description_compliment}
                                >
                                    <h2 className={[classes.hotel_card_description_title, classes.hotel_card_description_gift].join(" ")}>Комплимент от отеля</h2>
                                    <div className={classes.hotel_card_description_text}>
                                        <p>{hotel.compliment.description}</p>
                                    </div>
                                </div>}
                            {(hotel.children_conditions && hotel.children_conditions.ru) &&
                                <div
                                    className={classes.hotel_card_description_compliment}
                                >
                                    <h2 className={[classes.hotel_card_description_title, classes.hotel_card_description_child].join(" ")}>Доступность для детей</h2>
                                    <div className={classes.hotel_card_description_text}>
                                        <p>{hotel.children_conditions.ru}</p>
                                    </div>
                                </div>}
                            {hotel.description && <>
                                <h2 className={classes.hotel_card_block_title} >
                                    Описание
                                </h2>
                                <HotelDescription description={hotel.description}></HotelDescription>

                            </>}
                        </div>
                        <div className={classes.hotel_card_description_right}>
                            {hotel.payment_type_id && <SettlementConditions hotel={hotel}></SettlementConditions>}
                        </div>
                    </div>
                    <div className={classes.hotel_card_comfort} >
                        {hotel.status_id !== 11 ? <Discount isTinny={true} /> : ""}
                        <div ref={refPrices} id="#pricesAndRooms">
                            <h2 className={classes.hotel_card_block_title} >
                                {t("hotelCard.titles.pricesAndRooms")}
                            </h2>
                            <CatalogRooms hotel={hotel} similarHotels={similarHotels} filters={urlFilters} />
                        </div>
                    </div>
                    {hotel.amenity_ids && hotel.amenity_ids.length ? <div className={classes.hotel_card_comfort} id="#comfort">
                        <h2 className={classes.hotel_card_block_title} >
                            {t("hotelCard.titles.comfortAndOffers")}
                        </h2>
                        <ServiceHotel className={classes.hotel_card_comfort_mg} amenities={hotel.amenity_ids}></ServiceHotel>
                    </div> : null}
                    <div className={classes.hotel_card_location} id="#location">
                        {map}
                    </div>
                    <div className={classes.hotel_card_comfort} id="#sights">
                        <NearbyAttractions hotelInfo={hotel}></NearbyAttractions>
                    </div>
                    <div className={classes.hotel_card_comfort} id="#comment">
                        {сommentsBottom}
                    </div>
                    { //Сделать недавно смотрели
                        // <LastWatchCatalogSlider slidesPerView={4} hotels={fakeHotels}></LastWatchCatalogSlider>
                    }
                </div>
                {templateModalReview}
            </div>
        )
    } else if (errors) {
        if (errors.status === 401) {
            return navigate('/auth/partner/login')
        } else {
            return <HotelWithdrawn />
        }
    } else {
        return <Preloader />
    }
}

export default HotelCard