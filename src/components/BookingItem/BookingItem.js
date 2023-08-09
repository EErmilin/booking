import React, { useMemo } from "react";
import classes from "./BookingItem.module.scss";
import { useTranslation } from "react-i18next";
import CustomMap from "../UI/other/CustomMap/CustomMap";
import { useDispatch, useSelector } from "react-redux";
import Button from "../UI/btns/Button/Button";
import moment from "moment";
import { createBook, forcePayment, forcePaymentNoAuth, lockRoom } from "../../store/actions/bookingActions";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import EmptyModal from "../UI/modals/EmptyModal/EmptyModal";
import useToggleVisibility from "../../hooks/useToggleVisibility";
import logo from "../../assets/svg/logo.svg"

function BookingItem({ countDays }) {
    const { t } = useTranslation()
    const dispatcher = useDispatch()
    const navigate = useNavigate()
    const reservationInfo = useSelector(state => state.book.reservationInfo)
    const [searchParams, setSearchParams] = useSearchParams()
    /** Модалка если не удалось залочить комнату */
    const [modalLock, setModalLock, closeModalLock] = useToggleVisibility()
    /** Выбранный при бронировании тип кровати */
    const bedTypes = useSelector(state => state.objects.bedTypes)
    const selectedBedType = bedTypes.filter(item => item.id === reservationInfo.bed_type_id)[0]

    const header = useMemo(() => {
        switch (reservationInfo.status_id) {
            case 5:
                return {
                    modifierClass: classes.item_header_blue,
                    title: t('reservations.client.status.5')
                }
            case 2:
                return {
                    modifierClass: classes.item_header_green,
                    title:
                        t('reservations.reservation') + ' ' +
                        t('reservations.client.status.2').toLowerCase()
                }
            case 1:
                return { modifierClass: classes.item_header_yellow, title: t('reservations.client.status.1') }
            case 3:
                return { modifierClass: classes.item_header_red, title: t('reservations.client.status.3') }
            case 4:
                return { modifierClass: classes.item_header_red, title: t('reservations.client.status.4') }
            case 7:
                return { modifierClass: classes.item_header_yellow, title: t('reservations.client.status.7') }
            default:
                return {};
        }
    }, [reservationInfo])

    const againButton = <Button
        className={classes.item_field_footer_apply_btn}
        btnColor="ButtonGreen"
        onClick={async () => {
            let isLock = await dispatcher(lockRoom(reservationInfo))
            if (isLock) {
                dispatcher(createBook({ ...reservationInfo, room_uuid: isLock }))
                navigate("/personal-area/my-reservations/1")
            } else {
                setModalLock(true)
            }
        }}
    >Забронировать заново</Button>

    const renderFooterCanceled = () => {
        return <div className={classes.item_field_footer}>
            <h3 className={classes.item_field_title}>Ваше бронирование
                {reservationInfo.integration_data ?
                    (reservationInfo.integration_data.cancellationPolicy.freeCancellationDeadlineUtc && moment(reservationInfo.integration_data.cancellationPolicy.freeCancellationDeadlineUtc).isAfter(reservationInfo.integration_data.modifiedDateTime) ?
                        <span className={classes.item_field_footer_free}> отменено БЕСПЛАТНО!</span> : <span className={classes.item_field_footer_free}> отменено БЕСПЛАТНО!</span>
                        // <span className={classes.item_field_footer_canceled}> отменено со штрафом {reservationInfo.integration_data.cancellationPolicy.penaltyAmount} рублей</span>
                    )
                    : <span className={classes.item_field_footer_free}> отменено БЕСПЛАТНО!</span>}
            </h3>
            {/*{againButton}*/}
        </div>
    }

    /** Дата прибытия */
    const arrivalDate = moment(reservationInfo.arrival_date, "YYYY-MM-DD").format('dd, DD.MM.YY')
    /** Дата отбытия */
    const departureDate = moment(reservationInfo.departure_date, "YYYY-MM-DD").format('dd, DD.MM.YY')

    const guestTemplate = useMemo(() => {
        let arr = [
            `${reservationInfo.client_first_name} ${reservationInfo.client_last_name}`,
            ...reservationInfo.additional_guests.map(elem => `${elem.first_name} ${elem.last_name}`)]
        return arr.map((elem, id) => elem).join(", ")
    }, [reservationInfo])

    const templateModal = modalLock && <EmptyModal
        close={true}
        closeModal={(event) => {
            closeModalLock(event)
            navigate(`/hotel?id=${reservationInfo.hotel_id}&dateFrom=${reservationInfo.arrival_date}&dateTo=${reservationInfo.departure_date}`)
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
            onClick={() => navigate(`/hotel?id=${reservationInfo.hotel_id}&dateFrom=${reservationInfo.arrival_date}&dateTo=${reservationInfo.departure_date}`)}
        >{t("lockRoom.btn")}</Button>
    </EmptyModal>


    async function payAgain() {
        const token = searchParams.get("token_view")
        let response;
        if (token) {
            response = await dispatcher(forcePaymentNoAuth({ booking_id: reservationInfo.id, token_view: token }))
        } else {
            response = await dispatcher(forcePayment({ booking_id: reservationInfo.id }))
        }
        if (response.payment_url) {
            window.location.href = response.payment_url
        }
    }

    return (
        <div className={classes.item} id="print">
            <div
                className={[classes.item_header, header.modifierClass].join(" ")}
            >
                {header.title}
                {((reservationInfo.cancel_reason || reservationInfo.reject_reason) && reservationInfo?.cancel_sub_reason_id !== 6) && <>
                    <div>
                        Причины отмены бронирования:
                    </div>
                    <div className={classes.booking_reject}>
                        {reservationInfo.cancel_reason ?? reservationInfo.reject_reason}
                    </div></>}
                {((![5, 6].includes(reservationInfo.cancel_sub_reason_id) && reservationInfo.cancel_sub_reason_id !== 6) && reservationInfo.cancel_sub_reason_text) ? <>
                    <div>
                        Причины отмены бронирования:
                    </div>
                    <div className={classes.booking_reject}>
                        {reservationInfo.cancel_sub_reason_text}
                    </div>
                </> : ''}
            </div>
            {reservationInfo.status_id == 7 && <div className={classes.payment_warning}>
                <div className={classes.payment_warning_text}>{t("reservations.payOnlineWarningFull")}</div>
                <Button
                    onClick={payAgain}
                    typeButton={1}
                    btnColor="ButtonGreen">Оплатить
                </Button>
            </div>}
            {reservationInfo.cancel_sub_reason_id == 6 && <div className={classes.payment_warning}>
                <div className={classes.payment_warning_text}>{t("reservations.didntPay")}</div>
            </div>}
            <div className={classes.item_sub_header}>
                <div className={classes.item_header_logo}>
                    <img src={logo} />
                </div>
                <div className={classes.item_header_number}>
                    <div className={classes.item_header_number_title}>
                        {t('reservations.client.namber')}
                    </div>
                    <div className={classes.item_header_number_value}>
                        {reservationInfo.id}
                    </div>
                </div>
            </div>
            <div className={classes.main}>
                <div className={classes.picture}>
                    <NavLink className={classes.clickable} to={`/hotel?id=${reservationInfo.hotel_id}`}></NavLink>
                    <div className={classes.item_wrp_image}>
                        <img className={classes.item_image} src={`${reservationInfo.room_main_image && reservationInfo.room_main_image}`} alt="room-image" />
                        {/*<div className={classes.item_wrp_image_length}>${roomInfo.images && roomInfo.images.length}</div>*/}
                    </div>
                </div>
                <div className={classes.info}>
                    <h3 className={classes.room_title}>
                        <NavLink className={classes.link} to={`/hotel?id=${reservationInfo.hotel_id}`}>
                            {reservationInfo.hotel_name.ru}
                        </NavLink>
                    </h3>
                    <p><span>{t("addNewObjects.firstStep.form.location.address")}:</span>{!reservationInfo.integration_data ? ` г. ${reservationInfo.region?.name.ru}, ` : ''} {reservationInfo.hotel_address}</p>
                    <p><span>{t("reservations.phone")}:</span> {reservationInfo.hotel_contact_phone}</p>
                    {/*<p><span>{t("reservations.email")}:</span> {hotelInfo.contact_email}</p>*/}
                    <div className={classes.room_info}>
                        {reservationInfo.room_name.ru}
                    </div>
                </div>
            </div>
            <div className={classes.options_list}>
                <div className={classes.option}>
                    <div className={classes.option_title}>{t("reservations.checkIn")}</div>
                    <div className={[classes.option_value, classes.option_value_big, classes.option_date].join(" ")}>
                        {arrivalDate}
                    </div>
                </div>
                <div className={classes.option}>
                    <div className={classes.option_title}>{t("reservations.leaving")}</div>
                    <div className={[classes.option_value, classes.option_value_big, classes.option_date].join(" ")}>
                        {departureDate}
                    </div>
                </div>
                <div className={classes.option}>
                    <div className={classes.option_title}>{t("reservations.nights")}</div>
                    <div className={[classes.option_value, classes.option_value_big].join(" ")}>
                        {countDays}
                    </div>
                </div>
                <div className={classes.option}>
                    <div className={classes.option_title}>{t("reservations.countGuests")}</div>
                    <div className={[classes.option_value, classes.option_value_big].join(" ")}>
                        {reservationInfo.adult_count}
                    </div>
                </div>
                <div className={classes.option}>
                    <div className={classes.option_title}>{t("reservations.client.food")}</div>
                    <div className={classes.option_value}>
                        {reservationInfo?.meal_type_name ? reservationInfo?.meal_type_name.ru : `Стандарт`}
                    </div>
                </div>
                <div className={classes.option}>
                    <div className={classes.option_title}>{t("reservations.transfer")}</div>
                    <div className={classes.option_value}>
                        {reservationInfo.is_need_transfer ? `Требуется` : `Не требуется`}
                    </div>
                </div>
                <div className={classes.option}>
                    <div className={classes.option_title}>{t("reservations.guests")}</div>
                    <div className={classes.option_value}>
                        {guestTemplate}
                    </div>
                </div>
                {(reservationInfo.estimated_arrival_time && reservationInfo.estimated_arrival_time) &&
                    <div className={classes.option}>
                        <div className={classes.option_title}>{t("reservations.arrival")}</div>
                        <div className={classes.option_value}>
                            {`${reservationInfo.estimated_arrival_time} – ${moment(reservationInfo.estimated_arrival_time, "HH:mm").add(1, "hour").format("HH:mm")}`}
                        </div>
                    </div>
                }
                {reservationInfo.bed_type_id &&
                    <div className={classes.option}>
                        <div className={classes.option_title}>{t("reservations.bedType")}</div>
                        <div className={classes.option_value_bed}>
                            {selectedBedType?.name?.ru}
                        </div>
                    </div>
                }
            </div>
            {((reservationInfo.status_id == 3) || (reservationInfo.status_id == 4)) ? renderFooterCanceled() : <>

                <h3 className={classes.item_field_time}>{t("reservations.client.terms")}</h3>
                <div className={classes.item_field}>
                    <div className={classes.checkIn}>
                        <div>
                            <p className={classes.item_field_subtitle}>{t("reservations.client.checkIn")}</p>
                            <p className={classes.item_field_title}>
                                После {reservationInfo.hotel_guest_time ? reservationInfo.hotel_guest_time.arrival_after : "14:00"}
                            </p>
                        </div>
                    </div>
                    <div className={classes.leaving}>
                        <div>
                            <p className={classes.item_field_subtitle}>{t("reservations.client.checkOut")}</p>
                            <p className={classes.item_field_title}>
                                До {reservationInfo.hotel_guest_time ? reservationInfo.hotel_guest_time.departure_before : "12:00"}
                            </p>
                        </div>
                    </div>
                    <div className={classes.datetime}>
                        <p className={classes.item_field_subtitle}>{t('reservations.date')}</p>
                        <p className={classes.item_field_title}>
                            {moment.unix(reservationInfo.created_at).format("DD.MM.YYYY HH:mm")}
                        </p>
                    </div>
                    <div className={[classes.special, classes.max_age, classes.forPrint].join(' ')}>Возрастные ограничения для гостей отсутствуют</div>
                    {(reservationInfo.hotel_compliment && reservationInfo.hotel_compliment.has_compliment) ?
                        <div className={[classes.special, classes.gift, classes.compliment].join(' ')}>{reservationInfo.hotel_compliment?.description}</div>
                        : ''
                    }
                </div>
                <center>
                    <CustomMap
                        hotels={[{ lat: reservationInfo.hotel_lat, lon: reservationInfo.hotel_lon, }]}
                        className={[classes.item_map, 'no-print'].join(" ")}
                        currentMapHotel={{ lat: reservationInfo.hotel_lat, lon: reservationInfo.hotel_lon, }}
                    />
                </center>
                {/*<div className={classes.noComments_bottom} id="#location">*/}

                {/*    <p className={classes.noComments_text}>*/}
                {/*        Данный функционал*/}
                {/*    </p>*/}
                {/*    находится в разработке!*/}
                {/*</div>*/}
                {((reservationInfo.status_id == 3) || (reservationInfo.status_id == 4)) && <div className={classes.item_field_footer}>{againButton}</div>}
            </>}
            {templateModal}
        </div >
    )
}

export default BookingItem
