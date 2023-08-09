import React, { useEffect, useMemo, useState } from "react"
import classes from "./Booking.module.scss";
import { useTranslation } from "react-i18next";
import StarRating from "../../../components/StarRating/StarRating";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import Compliment from "../../../components/Compliment/Compliment";
import BookingForm from "./components/BookingForm";
import Breadcrumbs from "../../../components/Breadcrumbs/Breadcrumbs";
import { useDispatch, useSelector } from "react-redux";
import Preloader from "../../../components/Preloader/Preloader";
import { clearErrorsBooking, getHotelForBook, lockRoom } from "../../../store/actions/bookingActions";
import { DispatchUrlToObject } from "../../../functions/dispatchUrlToObject";
import moment from "moment";
import useToggleVisibility from "../../../hooks/useToggleVisibility";
import EmptyModal from "../../../components/UI/modals/EmptyModal/EmptyModal";
import Button from "../../../components/UI/btns/Button/Button";
import AuthModal from "../../../components/UI/modals/AuthModal/AuthModal";
import { showAuthModal } from "../../../store/actions/authActions";
import numberFormat from "../../../functions/numberFormat"
import CribKey from "./components/CribKey/CribKey";
import { getCityNameById } from "../../../store/actions/catalogActions"
import GuestTime from "../../../components/GuestTime/GuestTime";


function Booking() {
    const { t } = useTranslation()
    const dispatcher = useDispatch()
    const navigate = useNavigate()
    const userInfo = useSelector(state => state.auth.userInfo)
    const isAuth = useSelector(state => state.auth.isAuth)
    /** Модалка если не удалось залочить комнату */
    const [modalLock, setModalLock, closeModalLock] = useToggleVisibility()
    const [is_crib_keys, setIs_crib_keys] = useState()
    /** Модалка если пытаемся бронить как партнер */
    /** Подтягиваем отель */
    const hotel = useSelector(state => state.book.hotelInfo)
    /** Инфа по залочить комнату */
    const lockStatus = useSelector(state => state.book.lockStatus)
    /** Инфа по залочить комнату */
    const lockInfo = useSelector(state => state.book.lockInfo)
    /** Подтягиваем комнату */
    const room = useSelector(state => state.book.roomInfo)
    /** Подтягиваем тарифф */
    const tariffId = DispatchUrlToObject().get("tarrif_id")
    /** Подтягиваем дату 1 */
    const dateFrom = moment(DispatchUrlToObject().get("dateFrom"), "YYYY-MM-DD")
    /** Подтягиваем дату 2 */
    const dateTo = moment(DispatchUrlToObject().get("dateTo"), "YYYY-MM-DD")
    const countDay = +dateTo.diff(dateFrom, "days")
    const guest = DispatchUrlToObject().get("adults")
    const children = DispatchUrlToObject().get("children")
    const city = useSelector(state => state.catalog.city)
    /** количество подтвержденных ключей в Sailplay*/
    const cribKeysCount = userInfo.sailplay?.points?.confirmed
    const { tariffs } = room

    const { hotelId } = useParams()
    const { roomId } = useParams()
    const BREADCRUMBS = useMemo(
        () => [
            {
                name: 'Бронирование номера',
                url: ''
            },
        ],
        []
    );

    const [roomUpdated, setRoomUpdated] = useState(false)

    useEffect(() => {
        setRoomUpdated(true)
    }, [city, room])

    useEffect(() => {
        if (hotel) {
            dispatcher(getCityNameById(hotel.region_id))
        }
    }, [hotel, room])

    useEffect(() => {
        dispatcher(clearErrorsBooking())

        const fetchData = async () => {
            dispatcher(getHotelForBook(hotelId, roomId, {
                date_arrival: dateFrom.format("YYYY-MM-DD"),
                date_departure: dateTo.format("YYYY-MM-DD"),
                room_adult_count: guest,
                tariff_id: tariffId,
                room_id: roomId
            }, tariffId))
        }
        fetchData()
    }, [])

    const templateModal = modalLock && <EmptyModal
        close={true}
        closeModal={(event) => {
            navigate(`/hotel?id=${hotel.id}&dateFrom=${dateFrom.format("YYYY-MM-DD")}&dateTo=${dateTo.format("YYYY-MM-DD")}&regionId=${hotel.region_id}`)
            return closeModalLock(event)
        }}
        btnCancelClick={() => setModalLock(false)}
        width={400}
        background="blue"
        typeModal={"withoutBack"}
    >
        <h2>{t("lockRoom.title")}</h2>
        <Button
            typeButton={2}
            btnColor="ButtonGreen"
            onClick={() => navigate(`/hotel?id=${hotel.id}&dateFrom=${dateFrom.format("YYYY-MM-DD")}&dateTo=${dateTo.format("YYYY-MM-DD")}&regionId=${hotel.region_id}`)}
        >{t("lockRoom.btn")}</Button>
    </EmptyModal>



    if (!Object.keys(hotel).length || !Object.keys(room).length) return <Preloader></Preloader>

    const price = room.tariffs.find(elem => +elem.id === +tariffId)?.discount_sum
    const fullPrice = room.tariffs.find(elem => +elem.id === +tariffId)?.sum

    return (
        <div className={classes.body}>
            {/*<Breadcrumbs breadcrumbs={BREADCRUMBS} />*/}
            <NavLink to={`/hotel?id=${hotel.id}&${window.location.search.slice(1)}`} className={classes.booking_returnButton}>{t("booking.return")}</NavLink>
            <StarRating
                className={classes.booking_rating}
                starClassName={classes.star}
                maxRating={5}
                starRating={hotel.star_rating} />
            <h1 className={classes.title}>{hotel.name.ru}</h1>
            <div className={classes.booking_address}>{hotel.address}</div>
            <div className={classes.booking}>
                <BookingForm
                    hotelId={hotelId}
                    roomTypeId={roomId}
                    lockInfo={lockInfo}
                    room={room}
                    hotelInfo={hotel}
                    arrival_date={dateFrom.format("YYYY-MM-DD")}
                    departure_date={dateTo.format("YYYY-MM-DD")}
                    tariff_id={tariffId}
                    countDay={countDay}
                    className={classes.booking_form}
                    is_crib_keys={is_crib_keys}
                    cribKeysCount={cribKeysCount}
                    city={city}
                    adults={guest}
                    children={children}
                />
                <div className={classes.booking_info_right}>
                    <div className={classes.booking_row}>
                        <div className={classes.booking_info_date}>
                            <div className={classes.booking_info_date_text}>{t("booking.checkIn")}</div>
                            <div className={classes.booking_info_date_day}>{dateFrom.date()}</div>
                            <div className={classes.booking_info_date_date}>{dateFrom.format('MMMM')} {dateFrom.format('YYYY')}</div>
                        </div>
                        <div className={classes.booking_info_date}>
                            <div className={classes.booking_info_date_text}>{t("booking.leave")}</div>
                            <div className={classes.booking_info_date_day}>{dateTo.date()}</div>
                            <div className={classes.booking_info_date_date}>{dateTo.format('MMMM')} {dateTo.format('YYYY')}</div>
                        </div>
                    </div>
                   { !isAuth && <div className={[classes.booking_notification, classes.booking_notification_wrp].join(" ")}>
                        <div className={classes.booking_notificationImg} />
                        Скидка на первое бронирование предоставляется авторизованным пользователям
                    </div>}
                    <div className={classes.booking_info_whiteArea}>
                        <div className={classes.duration}>{t("booking.nights")}: <span>{countDay}</span></div>
                        {/*<p className={classes.booking_duration_title}>{t("booking.duration")}:</p>*/}
                        {/*<p className={classes.booking_duration_value}>{countDay} дня</p>*/}
                    </div>
                    <div className={classes.booking_info_whiteArea}>
                        <h3 className={classes.booking_price_title}>{t("booking.price")}</h3>
                        {price !== fullPrice && <p className={classes.booking_info_right_price_discount}>{Number(fullPrice).toFixed(2)} руб.</p>}
                        <p className={classes.booking_info_right_price}>{Number(price).toFixed(2)} руб.</p>
                        {/*{<p className={classes.booking_info_right_sale}>4 300 руб.</p>}*/}
                    </div>
                    {price !== fullPrice && <div className={classes.booking_notification_discount}>
                        <div className={classes.booking_notification_discount_img} />
                        Скидка 10% действует только на первое бронирование
                    </div>}
                    <div className={classes.booking_notification}>
                        <div className={classes.booking_notificationImg} />
                        Возрастные ограничения для гостей отсутствуют
                    </div>
                    {hotel.compliment && (<Compliment
                        className={classes.booking_description_compliment}
                        compliment={hotel.compliment}
                    ></Compliment>)}
                    <CribKey
                        className={classes.booking_key}
                        compliment={hotel.compliment}
                        checked={is_crib_keys}
                        onChange={setIs_crib_keys}
                        keysCount={cribKeysCount}
                    ></CribKey>
                    {hotel.guest_time && <GuestTime className={classes.guest_time} classNameTitle={classes.guest_time_title} guest_time={hotel.guest_time}></GuestTime>}
                </div>
            </div>
            {templateModal}
        </div>
    )
}

export default Booking

