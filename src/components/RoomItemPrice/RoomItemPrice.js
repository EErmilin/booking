import React, {useCallback, useEffect, useMemo} from "react"
import classes from "./RoomItemPrice.module.scss";
import Button from "../UI/btns/Button/Button";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector, } from "react-redux";
import {NavLink, useLocation, useNavigate, useSearchParams} from "react-router-dom";
import VectorWithText from "../VectorWithText";
import moment from "moment";
import numberFormat from "../../functions/numberFormat"
import { showAuthModal } from "../../store/actions/authActions";
import {getHotelPage} from "../../store/actions/catalogActions";
import BookingNotAvailable from "./components/BookingNotAvailable/BookingNotAvailable";

function RoomItemPrice({ info = [], isBooking, room, hotel, tariff, filterGuest, setModal,className }) {
    const { t } = useTranslation()
    /** Стили */
    const cls = [classes.wrap]
    if(className)cls.push(className)
    /** Модалка если комната не доступна */
    const location = useLocation()
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate()
    const dispatcher = useDispatch()
    const id = searchParams.get("id")
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")
    const adults = searchParams.get("adults")
    const children = searchParams.get("children")
    const edit = searchParams.get("edit")
    const city = useSelector(state => state.catalog.city)
    /**Формируем массив гостей*/
    const guestTemplate = []
    const userInfo = useSelector(state => state.auth.userInfo)
    const isAuth = useSelector(state => state.auth.isAuth)

    let urlFilters = useMemo(() => {
        return {
            region: { id: searchParams.get("id"), type: 'hotel', region: searchParams.get("regionId"), label: '' },
            dateFrom: searchParams.get("dateFrom"),
            dateTo: searchParams.get("dateTo"),
            adults: searchParams.get("adults"),
            children: searchParams.get("children"),
            minPrice: searchParams.get("minPrice"),
            maxPrice: searchParams.get("maxPrice"),
            edit: searchParams.get("edit"),
            preview: searchParams.get("preview"),
        }
    }, [searchParams]);

    const pendingBooking =useCallback(async (roomId)=>{
        let isReadyToBook = await  dispatcher(getHotelPage(urlFilters))
        if(isReadyToBook){
            return isReadyToBook.rooms? isReadyToBook.rooms.find(elem=>elem.id==roomId) :false
        }
        else return isReadyToBook
    },[urlFilters])

    if (tariff.guests <= 3) {
        for (let i = 0; i < tariff.guests; i++) {
            guestTemplate.push(<span className={classes.guest_icon}></span>)
        }
    } else {
        if (filterGuest && filterGuest.adults < 7) {
            guestTemplate.push(<span data-count={tariff.guests} className={[classes.guest_icon, classes.guest_icon_single].join(" ")}></span>)
        } else {
            guestTemplate.push(
                <span className={classes.icon_wrp}>
                    <span className={classes.guest_icon}></span>
                    <span className={classes.icon_count}> до {room.max_guests}</span>
                </span>

            )
        }
    }

    const dateCancel = moment(new Date()).format('LL');

    const countNight = moment(dateTo,"YYYY-MM-DD").diff(moment(dateFrom,"YYYY-MM-DD"),"days")

    function gaEvent() {
        const bookingNightsCount = moment(dateTo, "YYYY-MM-DD").diff(moment(dateFrom, "YYYY-MM-DD"), "days")

        /** clear previous ecommerce object */
        window.dataLayer.push({
            ecommerce: null
        })

        window.dataLayer.push({
            event: "add_to_cart",
            ecommerce: {
                booking_country: "Russia",       // Страна, где расположен отель. Если у отелей нет такого параметра, то всегда передавать статическое значение “Russia”
                booking_city: city,       // Город, где расположен отель
                booking_start_date: dateFrom, // Дата заезда
                booking_end_date: dateTo,     // Дата выезда
                booking_adults: +adults,       // Кол-во взрослых
                booking_kids: +children,       // Кол-во детей
                booking_nights: +bookingNightsCount, // Кол-во ночей в поиске
                items: [
                    {
                        item_list_name: hotel?.name?.ru, // Название отеля
                        item_list_id: `H${hotel.id}`,    // Префикс “H” (от Hotel) + ID отеля
                        item_name: room?.name?.ru,       // Название номера
                        item_id: `R${room.id}`,          // Префикс “R” (от Room) + ID номера
                        item_variant: `T${tariff.id}::${tariff.name.ru}`,       // Префикс “T” (от Tarif) + ID тарифа + “::” + Название тарифа
                        price: tariff.price       // Стоимость брони за ночь (В UI не отображается)
                    }]
            }
        })
    }

    const bookingButtonClickHandler =async () => {
        let isReadyToBook =await pendingBooking(room.id)
        if(isReadyToBook){
            if (isAuth && userInfo.user_type === 2) {
                return dispatcher(showAuthModal(true, false, false))
            }
            gaEvent()
            window.rrApiOnReady.push(function () {
                try {
                    console.log('rrApi.addToBasket', id)
                    window.rrApi.addToBasket(id)
                } catch (e) { }
            })
            navigate(`/booking/${id}/${room.id}?dateFrom=${dateFrom}&dateTo=${dateTo}&tarrif_id=${tariff.id}&adults=${adults}&children=${children}`)
        }else{
            if(location.pathname.includes("room")) {
                navigate(`/hotel?id=${urlFilters.region.id}&dateFrom=${dateFrom}&dateTo=${dateTo}&adults=${adults}&children=${children}&maxPrice=${urlFilters.maxPrice}&minPrice=${urlFilters.minPrice}${urlFilters.preview ? '&preview=true' : ''}`)
                document.body.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                })
            }
            setModal(true)
        }
    }

    let paymentText = ''

    if (hotel.payment_type_id) {
        if (hotel.payment_type_id.length === 1 && hotel.payment_type_id.includes(4)) {
            paymentText = "Предоплата онлайн"
        } else {
            if (!hotel.payment_type_id.includes(4) && (hotel.payment_type_id.includes(1) || hotel.payment_type_id.includes(2))) {
                paymentText = "Предоплата не требуется, платите на месте"
            } else {
                paymentText = "Предоплата онлайн или платите на месте"
            }
        }
    }

    if (tariff) {
        return (
            <div className={cls.join(' ')}>
                <div className={classes.room_item_price}>
                    <div className={classes.info}>
                        { /* <p className={classes.tariff_name}>{tariff.name && tariff.name.ru}</p> */ }
                        <div className={classes.guest}>
                            <div className={classes.guest_wrap}>
                                {guestTemplate}
                            </div>
                            <div className={classes.room_item_price_restaurant}>
                                <p className={classes.room_item_price_restaurant_title}>{tariff.meal_type_name?tariff.meal_type_name.ru:"Стандарт"}</p>
                                {
                                    <div className={classes.room_item_price_conditions}>
                                        {                                //<VectorWithText className={classes.room_item_price_conditions_item}
                                            //   text={`Бесплатная отмена вплоть до ${dateCancel}`}></VectorWithText>
                                        }
                                        {paymentText &&
                                          <VectorWithText
                                            className={classes.room_item_price_conditions_item}
                                            text={paymentText}
                                          ></VectorWithText>
                                        }
                                    </div>
                                }
                            </div>
                        </div>
                    </div>

                    {!isBooking && <div className={classes.controls}>
                        <div className={classes.prices}>
                            <p className={classes.price_subtitle}>Кол-во ночей: {countNight}</p>
                            {tariff.discount_price !== tariff.price && <p className={classes.price_discount}>от {numberFormat(tariff.sum)} руб.</p>}
                            <h2 className={classes.price_title}>от {numberFormat(tariff.discount_sum)} руб.</h2>
                        </div>
                        {edit ?
                            <Button btnColor="ButtonGray" className={classes.price_button} >
                                {t("hotelCard.prices.book")}
                            </Button> :
                            (hotel.status_id==11?<BookingNotAvailable hotelInfo={hotel}></BookingNotAvailable>:<Button btnColor="green" className={classes.price_button} onClick={() => bookingButtonClickHandler()}>
                                {t("hotelCard.prices.book")}
                            </Button>)
                        }
                    </div>}
                </div>

            </div>
        )
    }
}

export default RoomItemPrice