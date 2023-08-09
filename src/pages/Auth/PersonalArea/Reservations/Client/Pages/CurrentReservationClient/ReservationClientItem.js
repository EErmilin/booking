import React, { useEffect, useMemo, useRef, useState } from "react"
import classes from "./ReservationClientItem.module.scss";
import { useTranslation } from "react-i18next";
import { NavLink, useLocation, useParams, useSearchParams } from "react-router-dom";
import Compliment from "../../../../../../../components/Compliment/Compliment";
import Breadcrumbs from "../../../../../../../components/Breadcrumbs/Breadcrumbs";
import BookingItem from "../../../../../../../components/BookingItem/BookingItem";
import Button from "../../../../../../../components/UI/btns/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import EmptyModal from "../../../../../../../components/UI/modals/EmptyModal/EmptyModal";
import TwoButtonModal from "../../../../../../../components/UI/modals/TwoButtonModal/TwoButtonModal";
import Input from "../../../../../../../components/UI/areas/Input/Input";
import Preloader from "../../../../../../../components/Preloader/Preloader";
import { cancelBooking, getBookInfoClient, getBookInfoClientNoAuth } from "../../../../../../../store/actions/bookingActions";
import moment from "moment";
import { callPrint } from "../../../../../../../functions/callPrint";
import CancelReservationModal from "../../../../../../../components/UI/modals/CancelReservationModal/CancelReservationModal";
import useToggleVisibility from "../../../../../../../hooks/useToggleVisibility";
import ReactGA from "react-ga4"
import { useReactToPrint } from "react-to-print"
import numberFormat from "../../../../../../../functions/numberFormat"
import { getBedTypes } from "../../../../../../../store/actions/partnerHotelsActions"



function ReservationClientItem() {
    const { t } = useTranslation()
    const { id } = useParams()
    const dispatcher = useDispatch()
    const [searchParams, setSearchParams] = useSearchParams();
    const reservationInfo = useSelector(state => state.book.reservationInfo)
    const currentClientReservations = useSelector(state => state.reservations.currentClientReservations)
    const [showCancelSuccessModal, setShowCancelSuccessModal, closeModalSuccess] = useToggleVisibility();
    const [isShowSendModal, setIsShowSendModal] = useState(false)
    const [isShowSuccessSendModal, setIsShowSuccessSendModal] = useState(false)
    const [showModalCancel, setIsShowModalCancel, closeModalCancel] = useToggleVisibility()
    /** Подтягиваем дату 1 */
    const dateFrom = moment(reservationInfo.arrival_date, "YYYY-MM-DD")
    /** Подтягиваем дату 2 */
    const dateTo = moment(reservationInfo.departure_date, "YYYY-MM-DD")
    const countDays = +dateTo.diff(dateFrom, "days")
    const location = useLocation()


    const templateModalSuccess = showCancelSuccessModal && (
        <EmptyModal
            close={true}
            btnCancelClick={() => setShowCancelSuccessModal(false)}
            closeModal={closeModalSuccess}
            background="blue"
            width={308}
            typeModal="withoutBack">
            <h2>{t("support.excellent")}!</h2>
            <p className={classes.cancelReservation_modalText}>{t("reservations.cancelReservation.canceled")}</p>
        </EmptyModal>
    )


    useEffect(() => {
        const token = searchParams.get("token_view")
        if (token) {
            dispatcher(getBookInfoClientNoAuth(token))
        } else {
            dispatcher(getBookInfoClient(id))
        }

        dispatcher(getBedTypes())
    }, [])

    const BREADCRUMBS = useMemo(
        () => [
            {
                name: 'Мои бронирования',
                url: ''
            },
            {
                name: `Бронирование №${id}`,
                url: ''
            },
        ],
        [reservationInfo]
    );

    const cancelButtonHandler = () => {
        setIsShowModalCancel(true)
    }

    let componentPrintRef = useRef(null)

    const handlePrint = useReactToPrint({
        content: () => componentPrintRef.current,
    });

    const topButtons = <div className={classes.booking_rowButton}>
        <div className={classes.booking_rowButton_left}>
            <Button
                btnColor="outline_blue"
                className={classes.button_with_icon}
                onClick={handlePrint}
            >
                <div className={classes.print}>
                    <span>{t("reservations.client.print")}</span>
                </div>
            </Button>
            { /* <Button
                btnColor="outline_blue"
                className={classes.button_with_icon}
                onClick={() => setIsShowSendModal(true)}
            >
                <div className={classes.sendApprove}>
                    <span>{t("reservations.client.send")}</span>
                </div>
            </Button> */ }
        </div>
        {[1, 2].includes(reservationInfo.status_id) && <Button
            onClick={() => cancelButtonHandler()}
            btnColor="outline_red"
            id={`button_profile_guest_b2c_cancel_booking`}
            className={[`button_profile_guest_b2c_cancel_booking`, classes.booking_rowButton_cancel].join(" ")}>
            {t("reservations.client.cancelBtn")}
        </Button>}
    </div>
    const templateModal = showModalCancel &&
        <CancelReservationModal
            bookInfo={reservationInfo}
            btnCancelClick={() => setIsShowModalCancel(false)}
            btnCancelText={t("addNewObjects.secondStep.roomModal.cancel")}
            btnNextClick={() => {
            }}
            btnNextText={t("addNewObjects.secondStep.roomModal.yes")}
            closeModal={closeModalCancel}
            width={948}
            background="blue"
            typeModal="withoutBack"
            title={t("reservations.title")}
            setShowCancelSuccessModal={setShowCancelSuccessModal}>
        </CancelReservationModal>

    const successSendModal = isShowSuccessSendModal && <EmptyModal
        close={true}
        closeModal={() => setIsShowSuccessSendModal(false)}
        background="blue"
        btnCancelClick={() => setIsShowSuccessSendModal(false)}
        width={420}
        typeModal="withoutBack"
    >
        <h3>{t("support.excellent")}!</h3>
        {t("reservations.client.sendSeccsess")}
    </EmptyModal>

    const sendModal = isShowSendModal && <TwoButtonModal
        close={true}
        btnCancelClick={() => setIsShowSendModal(false)}
        btnCancelText={t("profile.cancel")}
        btnNextText={t("profile.save")}
        btnNextClick={() => { setIsShowSendModal(false); setIsShowSuccessSendModal(true) }}
        width={455}
        background="blue"
        typeModal="withoutBack"
        classNameButtonWrap={classes.modal_buttons}
    >
        <h3>{t("reservations.client.send")}</h3>
        <Input
            typeClsInput="field"
            label={'E-mail ' + t("reservations.client.sender")}
        ></Input>
    </TwoButtonModal>


    /** Сортируем тип оплаты */
    const paymentType = useMemo(() => {
        switch (reservationInfo.payment_type_id) {
            case 1: {
                return t("paymentType.cash")
            }
            case 2: {
                return t("paymentType.card")
            }
            case 3: {
                return t("paymentType.check")
            }
            case 4: {
                return t("paymentType.online")
            }
            default: {
                return ''
            }
        }
    }, [reservationInfo])

    if (!Object.keys(reservationInfo).length) return <Preloader></Preloader>

    return (
        <div className={classes.body} >
            {templateModalSuccess}
            {successSendModal}
            {sendModal}
            {templateModal}
            {/*<Breadcrumbs breadcrumbs={BREADCRUMBS} />*/}
            <NavLink to={location.state ? location.state : '/personal-area/my-reservations/1'} className={classes.booking_returnButton}>{t("reservations.return")}</NavLink>
            {((reservationInfo.status_id !== 3) || (reservationInfo.status_id !== 4) || (reservationInfo.status_id !== 5)) && topButtons}
            <div className={classes.booking}>
                <div ref={componentPrintRef} className={classes.booking_item}>
                    <BookingItem
                        bookInfo={reservationInfo}
                        headerClassName={classes.roomItem}
                        isBooking={true}
                        countDays={countDays}
                    />
                    <div className={classes.forPrint}>
                        <div className={classes.forPrint_wrap}>
                            <p className={classes.forPrint_title}>{paymentType}</p>
                            {((reservationInfo.status_id == 3) || (reservationInfo.status_id == 4)) ?
                                null
                                : <><div className={classes.forPrint_price}>
                                    <div>
                                        <p className={classes.forPrint_subtitle}>Стоимость проживания:</p>
                                        <h2 className={classes.forPrint_price_text}>
                                            {reservationInfo.integration_data ? numberFormat(reservationInfo.price) : numberFormat(reservationInfo.price * 1)} руб.
                                        </h2>
                                    </div>
                                    <div>
                                        {
                                            reservationInfo.points_spent > 0 &&
                                            <>
                                                <p className={classes.forPrint_subtitle}>Списано ключей:</p>
                                                <h2 className={classes.forPrint_price_text}> - {reservationInfo.points_spent} руб</h2>
                                            </>
                                        }
                                    </div>
                                    <div>
                                        {
                                            reservationInfo.discount > 0 &&
                                            <>
                                                <p className={classes.forPrint_subtitle}>Скидка 10%:</p>
                                                <h2 className={classes.forPrint_price_text}> - {reservationInfo.discount} руб</h2>
                                            </>
                                        }
                                    </div>
                                    <div>
                                        <>
                                            <p className={classes.forPrint_subtitle}>К оплате:</p>
                                            <h2 className={classes.forPrint_total}>{numberFormat(reservationInfo.points_spent ? reservationInfo.sailplay_price : reservationInfo.discount_sum)} руб.</h2>
                                        </>

                                    </div>
                                </div></>}
                        </div>
                    </div>
                </div>
                <div className={classes.booking_info_right}>
                    {((reservationInfo.status_id == 3) || (reservationInfo.status_id == 4)) ?
                        <div className={classes.booking_info_whiteArea}>
                            <p className={classes.booking_info_payment_type}>{paymentType}</p>
                            <p className={classes.booking_info_right_gray}>{t("reservations.client.cencelPrice")}</p>
                            <h2 className={classes.booking_info_green}>{'Бесплатно'.toUpperCase()}</h2>
                        </div>
                        : <>
                            <div className={classes.booking_info_whiteArea}>
                                <p className={classes.booking_info_payment_type}>{paymentType}</p>
                                {(reservationInfo.discount_sum !== reservationInfo.price && reservationInfo.discount) ?
                                    <>
                                        <p className={classes.booking_info_right_gray}>Стоимость проживания: </p>

                                        <p className={classes.booking_info_right_sum_old}>{numberFormat(reservationInfo.price)} руб.</p>

                                        <p className={classes.booking_info_right_gray}>Скидка 10% </p>
                                        <p className={classes.booking_info_right_gray}>
                                            (за первое бронирование): </p>
                                        <p className={classes.booking_info_right_sum_old}>{Number(reservationInfo.discount_sum - reservationInfo.price).toFixed(2)} руб.</p>
                                    </> : null}
                                <p className={classes.booking_info_right_gray}>{t("booking.price")}</p>

                                <h2 className={[reservationInfo.points_spent > 0 ? classes.booking_info_right_sum_old : classes.booking_info_right_sum].join(" ")}>

                                    {reservationInfo.integration_data ? Number(reservationInfo.price - reservationInfo.discount).toFixed(2) : Number(reservationInfo.price - reservationInfo.discount).toFixed(2)} руб.
                                </h2>
                                {
                                    reservationInfo.points_spent > 0 &&
                                    <>
                                        <p className={classes.booking_info_right_gray}>Списано ключей:</p>
                                        <h2 className={classes.booking_info_right_sum_old}>-{reservationInfo.points_spent}</h2>
                                    </>
                                }
                                {reservationInfo.sailplay_price ?
                                    <>
                                        <p className={classes.booking_info_right_gray}>К оплате:</p>
                                        <h2 className={classes.booking_info_right_sum}>{reservationInfo.sailplay_price} руб.</h2>
                                    </> : null
                                }
                            </div>
                            {((reservationInfo.status_id !== 3) || (reservationInfo.status_id !== 4)) && <>  <div className={classes.booking_notification}>
                                <div className={classes.booking_notificationImg} />
                                Возрастные ограничения для гостей отсутствуют
                            </div>
                                {/*<Compliment*/}
                                {/*    className={classes.booking_description_compliment}*/}
                                {/*/>*/}
                            </>}
                        </>}
                    {reservationInfo.hotel_compliment?.has_compliment ? <Compliment className={classes.compliment} compliment={reservationInfo.hotel_compliment}></Compliment> : ""}
                </div>
            </div>
        </div>
    )
}

export default ReservationClientItem