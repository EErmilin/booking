import React, { useEffect, useMemo, useState } from "react"
import classes from "./HotelRoom.module.scss";
import { useTranslation } from "react-i18next";
import Breadcrumbs from "../../../components/Breadcrumbs/Breadcrumbs";
import StarRating from "../../../components/StarRating/StarRating";
import RoomGallery from "../../../components/RoomGallery";
import RoomComfort from "../../../components/RoomComfort";
import RoomOptions from "../../../components/RoomOptions";
import RoomServices from "../../../components/RoomServices";
import RoomType from "../../../components/RoomType";
import HotelsCommentSwiper from "../../../components/HotelsComentSwiper/HotelsComentSwiper";
import {NavLink, useLocation, useNavigate, useSearchParams} from "react-router-dom";
import RoomSlider from "../../../components/RoomSlider/RoomSlider";
import {
    getCityNameById,
    getHotelCommentsRoom,
    getRoomPreview,
    saveHotelInfo
} from "../../../store/actions/catalogActions";
import { useDispatch, useSelector } from "react-redux";
import Preloader from "../../../components/Preloader/Preloader";
import NoFunctionalModal from "../../../components/UI/modals/NoFunctionalModal/NoFunctionalModal";
import NoComents from "../../../components/NoComents/NoComents";
import Button from "../../../components/UI/btns/Button/Button";
import {getHotelListPartner} from "../../../store/actions/partnerHotelsActions";
import useToggleVisibility from "../../../hooks/useToggleVisibility";
import {getClientReservations} from "../../../store/actions/bookingActions";
import AuthModal from "../../../components/UI/modals/AuthModal/AuthModal";
import moment from "moment"
import ReviewModal from "../HotelCard/components/ReviewModal/ReviewModal";
import serialize from "../../../functions/serialize";

import { Helmet } from "react-helmet"
import numWord from "../../../functions/numWord"
import Discount from "../../../components/Discount/Discount";

function HotelRoom() {
    const { t } = useTranslation();
    const location = useLocation()
    const dispatcher = useDispatch()
    const [modalReview,setModalReview,closeModalReview] = useToggleVisibility()
    const [searchParams, setSearchParams] = useSearchParams();
    const [isShowNoFunctionalModal, setIShowNoFunctionalModal] = useState(false)
    const partnersHotels = useSelector(state => state.objects.hotels)
    const [room, setRoom] = useState()
    const navigate = useNavigate()
    const hotel = useSelector(state => state.catalog.hotel)
    const imgUrl = '';
    const city = useSelector(state => state.catalog.city)
    const hotelComments = useSelector(state => state.catalog.hotelComments)

    let urlFilters =useMemo(()=>{
        const dateFrom = moment(searchParams.get("dateFrom"),"YYYY-MM-DD").isSameOrAfter(moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD"))
                ?moment(searchParams.get("dateFrom"),"YYYY-MM-DD")
                :moment().add(2,"day")
        let obj = {
            id: searchParams.get("id"),
            room_adult_count: searchParams.get("adults") ?? 1,
            room_child_count: searchParams.get("children") ?? 0,
            date_arrival: dateFrom.format("YYYY-MM-DD"),
            date_departure: moment(searchParams.get("dateTo"),"YYYY-MM-DD").isSameOrAfter(moment()) && moment(searchParams.get("dateTo"),"YYYY-MM-DD").isAfter(dateFrom)
                ?searchParams.get("dateTo")
                :moment().add(3,"day").format("YYYY-MM-DD"),
            minPrice: searchParams.get("minPrice") ?? 0,
            maxPrice: searchParams.get("maxPrice") ?? 999999,
            edit: searchParams.get("edit"),
            roomId: searchParams.get("roomId"),
            hotelId: searchParams.get("id"),
            preview: searchParams.get("preview"),
        }

        let urlObj = {
            id:obj.id,
            roomId:obj.roomId,
            dateTo:obj.date_departure,
            dateFrom:obj.date_arrival,
            minPrice:obj.minPrice,
            maxPrice:obj.maxPrice,
            adults:obj.room_adult_count,
            children:obj.room_child_count,
        }
        if(obj.preview)urlObj.preview = obj.preview
        if(obj.edit)urlObj.edit = obj.edit
        location.search = `?${serialize({...urlObj})}`
        setSearchParams(location.search,{replace:true})
        return obj
    },[location.search])

    const breadcrumbs = useMemo(
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
                url: ``
            },
            {
                name: 'Отель «Гранд Будапешт»',
                url: ``
            },
            {
                name: hotel && hotel.name.ru,
                url: ``
            }

        ],
        []
    );

    function gaEvent() {
        if (hotel) {
            // тарифы комнаты
            const room = hotel?.rooms[0]
            const tariffs = room?.tariffs.map(tariff => {
                return(
                    {
                        item_list_name: hotel.name.ru, // Название отеля
                        item_list_id: `H${hotel.id}`, // Префикс “H” (от Hotel) + ID отеля
                        item_name: room.name.ru, // Название номера
                        item_id: `R${room.id}`, // Префикс “R” (от Room) + ID номера
                        item_variant: `T${tariff.id}::${tariff.name.ru}`,       // Префикс “T” (от Tarif) + ID тарифа + “::” + Название первого тарифа
                        price: tariff.price,       // Цена брони в данном тарифе

                    }
                )
            })

            const bookingNightsCount = moment(urlFilters.date_departure, "YYYY-MM-DD").diff(moment(urlFilters.date_arrival, "YYYY-MM-DD"), "days")

            /** clear previous ecommerce object */
            window.dataLayer.push({
                ecommerce: null
            })

            window.dataLayer.push({
                event: "view_item",
                ecommerce: {
                    booking_country: "Russia",       // Страна, где расположен отель. Если у отелей нет такого параметра, то всегда передавать статическое значение “Russia”
                    booking_city: city,       // Город, где расположен отель
                    booking_start_date: urlFilters.date_arrival,       // Дата заезда
                    booking_end_date: urlFilters.date_departure,       // Дата выезда
                    booking_adults: urlFilters.room_adult_count,       // Кол-во взрослых
                    booking_kids: urlFilters.room_child_count,       // Кол-во детей
                    booking_nights: bookingNightsCount,       // Кол-во ночей в поиске
                    items: tariffs
                }
            })
        }
    }

    useEffect(() => {
        if (hotel && Object.keys(hotel).length && city && city.length) {
            gaEvent()
        }
    }, [city])

    useEffect(() => {
        dispatcher(saveHotelInfo(urlFilters, !!urlFilters.edit))
        if(!!urlFilters.edit){
            dispatcher(getHotelListPartner())
        }
    }, [])

    useEffect(() => {
        const roomId = searchParams.get("roomId")
        if (hotel) {
            const room = hotel.rooms.filter(e => +e.id === Number(roomId))
            setRoom(room[0])
            dispatcher(getCityNameById(hotel.region_id))
        }
    }, [hotel])
    useEffect(()=>{
       if(hotel?.id){
           dispatcher(getHotelCommentsRoom(hotel.id))
       }
    },[hotel])
    useEffect(() => {
        const roomId = searchParams.get("roomId")

        if(roomId) {
            /*
            // uncomment the code below when rooms will appear in xml file
            window.rrApiOnReady.push(function() {
                try{
                    console.log('rrApi.view', roomId)
                    window.rrApi.view(roomId)
                } catch(e) {}
            })
            */
        }
    }, [])




    if (hotel && room) {

        const photos = room && room.images && room.images.map((photo, id) => {
            return {
                url: imgUrl + photo,
                id
            }
        })

        const templateModalReview = modalReview && <ReviewModal
            setModal={setModalReview}
            closeModal={closeModalReview}
            btnCancelCLick={setModalReview}
            hotelId={urlFilters.id}
            hotelInfo={hotel}
        ></ReviewModal>

        const renderEdit = () => {
            if (partnersHotels.filter(e => e.id === hotel.id).length > 0 && urlFilters.edit) {
                return <div className={classes.edit}>
                    <Button
                        btnColor="blueBorderButton"
                        className={classes.edit_btn}
                        typeButton={2}
                        onClick={() => navigate(`/edit-object/${hotel.id}/first-step`)}
                    >Редактировать</Button>
                    <div className={classes.edit_text}>Пред. просмотр</div>
                </div>
            }
        }

        const renderPhotes = () => {
            if (photos) {
                return <div className={classes.pictures}>
                    <div className={classes.gallery}>
                        <RoomGallery
                            title={room.name.ru}
                            photos={photos}
                        />
                    </div>
                    <div className={classes.slider}>
                        <RoomSlider slides={photos} />
                    </div>
                </div>
            }
        }

        const options = []

        if (room.area) {
            options.push(
                {
                    name: "Размер номера",
                    value: +room.area,
                    id: 'area',
                }
            )
        }
        if(room.kitchen){
            options.push(
                {
                    name: "Кухня",
                    value: "Есть",
                    id: 'kitchen',
                }
            )
        }
        if(room.bed_capacity){
            options.push(
                {
                    name: "Спальные места",
                    value: +room.bed_capacity,
                    id: 'bed_capacity',
                }
            )
        }
        if(room.room_capacity){
            options.push(
                {
                    name: "Количество комнат",
                    value: room.room_capacity,
                    id: 'room_capacity',
                }
            )
        }
        if(room.additional_bed_capacity){
            options.push(
                {
                    name: "Доп. спальные места",
                    value: +room.additional_bed_capacity,
                    id: 'additional_bed_capacity',
                }
            )
        }
        if(room.beds && room.beds.length){
            options.push(
                {
                    name: "Тип спального места (на выбор)",
                    value: room.beds,
                    id: 'beds',
                }
            )
        }
        const comments = (hotelComments && hotelComments.length) ?<>
            <div>
                <div className={classes.comments_wrap}>
                    <div className={classes.block_title}>{t("hotelRoom.titles.reviews")}</div>
                    <Button btnColor="outline_blue"
                            className={classes.noComments_btn}
                            typeButton={1}
                            onClick={()=>setModalReview(true)}
                    >
                        Смотреть все
                    </Button>
                </div>
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
            <NoComents isShow={true} hotelId={hotel.id} />
        </>: <NoComents isBlue={true} hotelId={hotel.id}/>

        function getMetaTags() {
            const hotelName = hotel?.name?.ru ? `${hotel.name.ru}, `: ''
            const hotelRoom = room?.name?.ru ? `${room.name.ru}, `: ''
            const stars = hotel.star_rating > 0 ? `${hotel.star_rating} ` + numWord(hotel.star_rating, ['звезда', 'звезды', 'звезд']) : "без звезд"
            const cityName = city ? `${city}, ` : ''
            const titleStr = `${hotelName}${hotelRoom}${cityName}онлайн бронирование Check in`

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
                        "name": `${city}: список отелей`,
                        "item": `https://checkin.ru/catalog/1?name=${city}&id=${hotel.region_id}`
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": `${hotel?.name?.ru} - ${stars}`,
                        "item": `https://checkin.ru/hotel?id=${hotel.id}`
                    },
                    {
                        "@type": "ListItem",
                        "position": 4,
                        "name": `${hotelRoom}`
                    }
                ]
            }

            return(
                <Helmet>
                    <title>{titleStr}</title>
                    <meta name="description" content={'Онлайн бронирование номеров в проверенных отелях и хостелах по выгодным ценам, бесплатная отмена, поддержка 24 часа, безопасные путешествия с Check in'} />
                    <meta property="og:title" content="Check in - быстрое и удобное бронирование номеров в отелях по всей России"/>
                    <meta property="og:description" content="Онлайн бронирование номеров в проверенных отелях и хостелах по выгодным ценам, бесплатная отмена, поддержка 24 часа, безопасные путешествия с Check in"/>
                    {room?.main_image && <meta property="og:image" content={room.main_image} />}
                    <script type="application/ld+json">
                        {JSON.stringify(ldJson)}
                    </script>
                </Helmet>
            )
        }

        return (
            <div className={classes.wrapper}>
                {getMetaTags()}
                <NoFunctionalModal setIShowNoFunctionalModal={setIShowNoFunctionalModal} isShowNoFunctionalModal={isShowNoFunctionalModal} />
                {<Breadcrumbs breadcrumbs={breadcrumbs}></Breadcrumbs>}
                <div className={classes.content}>
                    <div className={classes.hotel}>
                        <div className={classes.hotel_info}>
                            <div className={classes.hotel_info}>
                                <div className={classes.hotel_name}>{hotel.name.ru}</div>
                                <div className={classes.hotel_rating}>
                                    <StarRating
                                        width={13}
                                        height={13}
                                        maxRating={5}
                                        starRating={hotel.star_rating}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={classes.hotel_info}>
                            <div className={classes.hotel_address}>
                                {hotel.address}
                            </div>
                            {renderEdit()}
                        </div>
                    </div>
                    <h1 className={classes.title}>{hotel.name.ru}, {room.name.ru}</h1>
                    {renderPhotes()}
                    {/*<div className={classes.comfort}>
                        <RoomComfort comfort={fakeComfort} />
                    </div>*/}
                    {
                        options.length > 0 &&
                        <div className={classes.options}>
                            <RoomOptions options={options} />
                        </div>
                    }
                    <div className={classes.description}>
                        {room.description.ru}
                    </div>
                    <div className={classes.services}>
                        <div className={classes.block_title}>{t("hotelRoom.titles.services")}</div>
                        {room.amenity_ids && room.amenity_ids.length ? <RoomServices amenities={room.amenity_ids} integration_type={hotel.integration_type} /> : null}
                    </div>
                    {hotel.status_id !== 11?<Discount isTinny={true}/>:""}
                    <div className={classes.tariff}>
                        <div className={classes.block_title}>{t("hotelRoom.titles.tariff")}</div>
                        <RoomType room={room} hotel={hotel} />
                    </div>
                    <div className={classes.reviews}>
                        {comments}
                    </div>
                </div>
                {templateModalReview}
            </div>
        )
    } else return <Preloader />
}

export default HotelRoom