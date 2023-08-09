import React, { useMemo } from "react"
import classes from "./ReservationClient.module.scss";
import { NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MenuLine from "../../../../../../../components/UI/line/Mnuline/MenuLine";
import StatusHotel from "../../../../../../../components/StatusHotel/StatusHotel";
import Button from "../../../../../../../components/UI/btns/Button/Button";
import useToggleVisibility from "../../../../../../../hooks/useToggleVisibility";
import CancelReservationModal from "../../../../../../../components/UI/modals/CancelReservationModal/CancelReservationModal";
import TwoButtonModal from "../../../../../../../components/UI/modals/TwoButtonModal/TwoButtonModal";
import { useDispatch, useSelector } from "react-redux";
import { cancelBooking, createBook, forcePayment, forcePaymentNoAuth, lockRoom } from "../../../../../../../store/actions/bookingActions";
import EmptyModal from "../../../../../../../components/UI/modals/EmptyModal/EmptyModal";
import moment from "moment";
import { DispatchUrlToObject } from "../../../../../../../functions/dispatchUrlToObject";
import numberFormat from "../../../../../../../functions/numberFormat"
import ReviewModal from "../../../../../../../components/UI/modals/ReviewModal/ReviewModal";
import useWindowSize from "../../../../../../../hooks/useWindowSize";


function ReservationClient({
    bookInfo,
    setModal,
    setShowCancelSuccessModal,
    filters
}) {
    const { t } = useTranslation()
    const dispatcher = useDispatch()
    const navigate = useNavigate()
    const windowSize = useWindowSize()
    const lockInfo = useSelector(state => state.book.lockInfo)
    const [showModalCancel, setShowModalCancel, closeModalCancel] = useToggleVisibility()
    const [modalReview, setModalReview, closeModalReview] = useToggleVisibility()
    const [searchParams, setSearchParams] = useSearchParams()
    /** Модалка если не удалось залочить комнату */
    const [modalLock, setModalLock, closeModalLock] = useToggleVisibility()
    const location = useLocation()
    const menuList = [
        {
            text: t(t("reservations.client.menu.again")),
            onClick: async () => {
                let isLock = await dispatcher(lockRoom(bookInfo))
                if (isLock) {
                    dispatcher(createBook({ ...bookInfo, room_uuid: isLock }))
                    navigate("/personal-area/my-reservations")
                } else {
                    setModalLock(true)
                }
            }
        },
    ]
    /** Колличество гостей */
    const guestCount = bookInfo.adult_count
    /** Подтягиваем дату 1 */
    const dateFrom = moment(bookInfo.arrival_date, "YY-MM-DD")
    /** Подтягиваем дату 2 */
    const dateTo = moment(bookInfo.departure_date, "YY-MM-DD")
    const countDays = +dateTo.diff(dateFrom, "days")

    const templateModal = showModalCancel &&
        <CancelReservationModal
            bookInfo={bookInfo}
            btnCancelClick={() => setShowModalCancel(false)}
            btnCancelText={t("addNewObjects.secondStep.roomModal.cancel")}
            btnNextClick={() => {
            }}
            filters={filters}
            btnNextText={t("addNewObjects.secondStep.roomModal.yes")}
            closeModal={closeModalCancel}
            width={948}
            background="blue"
            typeModal="withoutBack"
            title={t("reservations.title")}
            setShowCancelSuccessModal={setShowCancelSuccessModal}
        >
        </CancelReservationModal>

    const templateModalLockError = modalLock && <EmptyModal
        close={true}
        closeModal={(event) => {
            closeModalLock(event)
            navigate(`/hotel?id=${bookInfo.hotel_id}&dateFrom=${bookInfo.arrival_date}&dateTo=${bookInfo.departure_date}`)
        }}
        btnCancelClick={() => setModalLock(false)}
        width={400}
        background="blue"
        typeModal={"withoutBack"}
    >
        <h2>{t("lockRoom.title")}</h2>
        <Button
            typeButton={1}
            btnColor="green"
            onClick={() => navigate(`/hotel?id=${bookInfo.hotel_id}&dateFrom=${bookInfo.arrival_date}&dateTo=${bookInfo.departure_date}`)}
        >{t("lockRoom.btn")}</Button>
    </EmptyModal>

    const templateModalReview = modalReview && <ReviewModal
        btnClose={setModalReview}
        onClose={closeModalReview}
        bookingInfo={bookInfo}
        setModal={setModal}
    ></ReviewModal>

    let statusBook = useMemo(() => {
        switch (bookInfo.status_id) {
            case 1:
            case 7: {
                return 'send'
            }
            case 2: {
                return 'placed'
            }
            case 6:
            case 4:
            case 3: {
                return 'canceled'
            }
            case 5: {
                return "completed"
            }
        }
    }, [bookInfo])

    const cancelButtonHandler = () => {
        setShowModalCancel(true)
    }

    const renderCancelReason = () => {
        if (bookInfo.reject_reason) {
            return (<>
                <p className={classes.cancel_subtitle}>{t("reservations.partner.reasonsCancel")}</p>
                <div className={classes.cancel_text}>
                    {bookInfo.reject_reason}
                </div>
            </>)

        }
    }

    const renderPrice = () => {
        const price = bookInfo.integration_data ?
            (Number(bookInfo.discount_sum) ? bookInfo.discount_sum : bookInfo.price) :
            (Number(bookInfo.discount_sum) ? bookInfo.discount_sum * 1 : bookInfo.price * 1)
        const outputPrice = bookInfo.points_spent ? bookInfo.sailplay_price : price

        return (
            <div className={classes.info_price}>
                <div className={classes.info_price_current}>
                    {Number(outputPrice).toFixed(2)} руб.
                </div>
                {bookInfo.points_spent ? <div className={classes.info_price_old}>
                    Без списания ключей: {price} руб.
                </div> : null}
            </div>
        )
    }
    async function payAgain() {
        let response
        const token = searchParams.get("token_view")
        if (token) {
            response = await dispatcher(forcePaymentNoAuth({ booking_id: bookInfo.id, token_view: token }))
        } else {
            response = await dispatcher(forcePayment({ booking_id: bookInfo.id }))
        }
        if (response.payment_url) {
            window.location.href = response.payment_url
        }
    }

    return (
        <div className={classes.reservation}>
            <div className={classes.reservation_img_bar}>
                <NavLink to={`/personal-area/my-reservations/reservation/${bookInfo.id}`} state={location.pathname + location.search} className={classes.reservation_clickable}></NavLink>
                {<img src={`${bookInfo.room_main_image}`} alt="HotelCardCatalog" />}
            </div>
            <div className={classes.info}>
                {/*<NavLink to={`/personal-area/my-reservations/reservation/${bookInfo.id}`} className={classes.reservation_clickable}></NavLink>*/}
                <div className={classes.info_header}>
                    <div>
                        <NavLink to={`/personal-area/my-reservations/reservation/${bookInfo.id}`} state={location.pathname + location.search}>
                            <h3 className={classes.reservation_info_header_title}>{bookInfo.hotel_name.ru}</h3>
                        </NavLink>

                        <p className={classes.reservation_info_body_description}>{bookInfo.room_name.ru}</p>

                    </div>
                    {windowSize.width > 767 && renderPrice()}
                </div>
                <div className={classes.info_body}>
                    <div className={classes.info_guest}>
                        {bookInfo.arrival_date} — {bookInfo.departure_date} {guestCount}взр.

                    </div>
                    {windowSize.width < 767 && <div className={classes.info_address_wrp}>
                        <div className={classes.info_address} >{!bookInfo.integration_data ? `г. ${bookInfo.region?.name.ru}, ` : ''}{bookInfo.hotel_address}</div>
                        {bookInfo.status_id == 4 ? renderCancelReason() : ''}
                        {[7].includes(bookInfo.status_id) && <div className={classes.info_body}>
                            <div className={classes.onlinePayWarning}>{t("reservations.payOnlineWarning")}</div>
                        </div>}
                        {[6].includes(bookInfo.cancel_sub_reason_id) && <div className={classes.info_body}>
                            <div className={classes.onlinePayWarning}>{t("reservations.didntPay")}</div>
                        </div>}
                        <div className={classes.info_status}>
                            <StatusHotel status={statusBook} text={t("reservations.client.status." + bookInfo.status_id)} />
                        </div>
                    </div>
                    }
                    <div className={classes.info_number_wrp}>
                        {windowSize.width > 767 && <div>
                            <div className={classes.info_address} >{!bookInfo.integration_data ? `г. ${bookInfo.region?.name.ru}, ` : ''}{bookInfo.hotel_address}</div>
                            {bookInfo.status_id == 4 ? renderCancelReason() : ''}</div>}
                        {windowSize.width < 767 && renderPrice()}
                        <div className={classes.info_number}>
                            <span>{t("reservations.client.namber")}:</span>
                            <p>{bookInfo.id}</p>
                        </div>

                    </div>
                    {windowSize.width > 767 && [6].includes(bookInfo.cancel_sub_reason_id) && <div className={classes.info_body}>
                        <div className={classes.onlinePayWarning}>{t("reservations.didntPay")}</div>
                    </div>}
                    <div className={classes.info_button_wrp}>
                        {windowSize.width > 767 &&
                            <div className={classes.info_status}>
                                <StatusHotel status={statusBook} text={t("reservations.client.status." + bookInfo.status_id)} />
                            </div>}
                        <div className={classes.info_button}>
                            {!([5].includes(bookInfo.status_id) && !bookInfo.reviews?.length) &&
                                <Button
                                    onClick={() => navigate(`/personal-area/my-reservations/reservation/${bookInfo.id}`, { state: location.pathname + location.search })}
                                    typeButton={1}
                                    btnColor="outline_blue">{t("reservations.reservationDetails")}
                                </Button>}
                            {[1, 2].includes(bookInfo.status_id) &&
                                <Button
                                    id="button_profile_guest_b2c_cancel_booking"
                                    className={"button_profile_guest_b2c_cancel_booking"}
                                    onClick={() => cancelButtonHandler()}
                                    typeButton={1}
                                    btnColor="outline_red">{t("reservations.client.cancel")}
                                </Button>

                            }
                            {([5].includes(bookInfo.status_id) && !bookInfo.reviews?.length) &&
                                <Button
                                    onClick={() => setModalReview(true)}
                                    typeButton={1}
                                    className={classes.info_button_comment}
                                    btnColor="ButtonGreen">Оставить отзыв
                                </Button>
                            }
                        </div>
                    </div>
                    {([7].includes(bookInfo.status_id)) && <div className={classes.info_button}>
                        <Button
                            onClick={payAgain}
                            typeButton={1}
                            btnColor="ButtonGreen">Оплатить
                        </Button>
                    </div>
                    }
                </div>
            </div>
            {templateModal}
            {templateModalLockError}
            {templateModalReview}
        </div >
    )
}

export default ReservationClient