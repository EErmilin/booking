import React, { useState, useMemo, useEffect } from "react"
import classes from "../../../Reservations.module.scss";
import { useTranslation } from "react-i18next";
import Button from "../../../../../../../components/UI/btns/Button/Button";
import StatusHotel from "../../../../../../../components/StatusHotel/StatusHotel";
import EmptyModal from "../../../../../../../components/UI/modals/EmptyModal/EmptyModal";
import TwoButtonModal from "../../../../../../../components/UI/modals/TwoButtonModal/TwoButtonModal";
import useToggleVisibility from "../../../../../../../hooks/useToggleVisibility";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  clearBookingFormError,
  confirmBook,
  getBookingHotel,
  noArrival
} from "../../../../../../../store/actions/bookingActions";
import numberFormat from "../../../../../../../functions/numberFormat";
import { useParams } from "react-router-dom";
import PartnerBookingCancelModal from "../../../../../../../components/UI/modals/PartnerBookingCancelModal"

function Reservation({ bookInfo, otherParams, setModal }) {
  const { t } = useTranslation()
  const dispatcher = useDispatch()

  /** События модалок */
  const [showModalAccept, setModalAccept, closeModalAccept] = useToggleVisibility()
  const [showModalCancel, setModalCancel, closeModalCancel] = useToggleVisibility()
  const [showModalCancelSuccess, setModalCancelSuccess, closeModalCancelSuccess] = useToggleVisibility()
  const [clientNotArriveModal, setClientNotArriveModal, closeClientNotArriveModal] = useToggleVisibility()
  const [clientNotArriveModalSeccess, setClientNotArriveModalSeccess, closeClientNotArriveModalSeccess] = useToggleVisibility()
  const [isOpen, setIsOpen] = useState(false)
  const { page } = useParams()
  useEffect(() => {
    setIsOpen(false)
  }, [otherParams, page])


  /** Колличество гостей */
  const guestCount = bookInfo.adult_count ? bookInfo.adult_count : bookInfo.additional_guests.length + 1
  /** Даты прибывания */
  const arrivalDate = moment(bookInfo.arrival_date, "YYYY-MM-DD")
  const departureDate = moment(bookInfo.departure_date, "YYYY-MM-DD")
  const countDays = +departureDate.diff(arrivalDate, "days")


  /** Выбранный при бронировании тип кровати */
  const bedTypes = useSelector(state => state.objects.bedTypes)
  const selectedBedType = bedTypes.filter(item => item.id === bookInfo.bed_type_id)[0]

  let statusBook = useMemo(() => {
    switch (bookInfo.status_id) {
      case 7:
      case 1: {
        return 'send'
      }
      case 2: {
        return 'placed'
      }
      default:
      case 4:
      case 3: {
        return 'canceled'
      }
      case 5: {
        return "completed"
      }
    }
  }, [bookInfo])

  const guestTemplate = useMemo(() => {
    let guestArr = [{ main: true, first_name: bookInfo.client_first_name, last_name: bookInfo.client_last_name }]
    guestArr = guestArr.concat(bookInfo.additional_guests)
    return guestArr.map((elem, id) => {
      return (
        <div key={id} className={classes.selected_guest_name}>
          <span>{elem.first_name} {elem.last_name}</span>
          <span>{elem.main && <StatusHotel status={"mainGuest"}></StatusHotel>}</span>
        </div>
      )
    })
  }, [
    bookInfo.client_first_name,
    bookInfo.client_last_name,
    bookInfo.additional_guests
  ])

  const renderButtons = () => {
    const cancelButton = <Button btnColor="outline_red"
                                 className={[classes.reservation_cancelButton, classes.button].join(" ")}
                                 onClick={(event) => {
                                   dispatcher(clearBookingFormError())
                                   setModalCancel(true)
                                   event.stopPropagation()
                                 }}
                                 disabled={bookInfo.cancel_moderation_process}
                                 typeButton={1}>
      {bookInfo.cancel_moderation_process ? "Ожидается отмена" : t('reservations.cancel')}
    </Button>
    const approveButton = <Button btnColor="ButtonGreen"
                                  onClick={(event) => {
                                    dispatcher(confirmBook(bookInfo.id, bookInfo.hotel_id, { ...otherParams, page: page }))
                                    setModalAccept(true)
                                    event.stopPropagation()
                                  }}
                                  className={classes.button}
                                  typeButton={2}>
      {t('reservations.approve')}
    </Button>

    return <>
      {bookInfo.status_id == 1 ? approveButton : ''}
      {[2, 1].includes(bookInfo.status_id) ? cancelButton : ''}
    </>
  }

  /** Модалка принятия брони клиента */
  const templateModalAccept = showModalAccept &&
    <EmptyModal
      close={true}
      closeModal={closeModalAccept}
      btnCancelClick={() => setModalAccept(false)}
      background="blue"
      width={296}
      typeModal="withoutBack">
      <h2>{t("reservations.excellent")}</h2>
      <p >{t("reservations.sendEmail")}</p>
    </EmptyModal>

  /** Модалка с формой для отмены брони */
  const templateModalCancel = showModalCancel &&
    <PartnerBookingCancelModal
      bookInfo={bookInfo}
      closeModal={closeModalCancel}
      otherParams={otherParams}
      btnCancelClick={() => setModalCancel(false)}
      modalSuccess={setModalCancelSuccess}
    />

  /** Модалка успешной отмены брони */
  const modalCancelSuccess = showModalCancelSuccess &&
    <EmptyModal
      close={true}
      btnCancelClick={() => setModalCancelSuccess(false)}
      closeModal={closeModalCancelSuccess}
      background={"blue"}
      width={296}
      typeModal="withoutBack"
      className={classes.modalCancel}
    >
      <p>{t("reservations.canceledEmail")}</p>
    </EmptyModal>

  /** Модалка запроса клиент не приехал */
  const notArriveModal = clientNotArriveModal && <TwoButtonModal
    className={classes.notArriveModal}
    btnCancelClick={() => setClientNotArriveModal(false)}
    btnCancelText={t("reservations.noArrivalModal.no")}
    btnNextClick={() => {
      dispatcher(noArrival(bookInfo.id, bookInfo.hotel_id, { ...otherParams, page: page }))
      setClientNotArriveModal(false)
      setClientNotArriveModalSeccess(true)
    }}
    btnNextText={t("reservations.noArrivalModal.yes")}
    closeModal={closeClientNotArriveModal}
    width={360}
    background="blue"
    typeModal="withoutBack"
  >
    <p>После подтверждения, бронирование будет отменено.</p>
    <p>Отметить как незаезд?</p>
  </TwoButtonModal>

  /** Модалка клиент не приехал */
  const notArriveModalSeccess = clientNotArriveModalSeccess && <EmptyModal
    close={true}
    btnCancelClick={() => setClientNotArriveModalSeccess(false)}
    closeModal={closeClientNotArriveModal}
    background="blue"
    width={296}
    typeModal="withoutBack">
    <h2>{t("reservations.notArrivePity")}!</h2>
    <p>{t("reservations.notArriveEmail")}</p>
  </EmptyModal>

  const renderReservationHeader = useMemo(() => {
    return (
      <div className={classes.selected_header} onClick={() => setIsOpen(!isOpen)}>
        <div className={classes.selected_title_roomType}>
          {bookInfo.room_type_name ? bookInfo.room_type_name?.ru : 'Не указан'}
        </div>
        <div className={[classes.selected_title_propsTitle, classes.selected_title_arrival].join(" ")}>
          <label>{t('reservations.checkIn')}</label>
          <span>{moment(bookInfo.arrival_date).format("DD.MM.YYYY")}</span>
        </div>
        <div className={[classes.selected_title_propsTitle, classes.selected_title_departure].join(" ")}>
          <label>{t('reservations.leaving')}</label>
          <span>{moment(bookInfo.departure_date).format("DD.MM.YYYY")}</span>
        </div>
        <div className={[classes.selected_title_propsTitle, classes.selected_title_guests].join(" ")}>
          <label>{t('reservations.guests')}</label>
          <span>{guestCount}</span>
        </div>
        <div className={classes.selected_title_status}>
          <StatusHotel status={statusBook} text={t("reservations.client.statusPartner." + bookInfo.status_id)} />
        </div>
        <div className={classes.selected_title_buttonsArea}>
          {renderButtons(statusBook)}
        </div>
      </div>)
  }, [bookInfo, otherParams, page, isOpen])

  const renderAdditionalInfo = () => {
    return (
      <div className={classes.selected_section}>
        <div className={classes.selected_section_title}>{t('reservations.additionalInfo')}</div>
        <div className={classes.selected_field_column}>
          <div className={classes.selected_additionalInfo}>
            {bookInfo.is_need_transfer &&
              <div className={classes.selected_additionalInfo_props}>
                <div className={classes.selected_greenArrow} />
                {t("reservations.needTransfer")}
              </div>
            }
            {bookInfo.estimated_arrival_time &&
              <div className={classes.selected_additionalInfo_props}>
                {bookInfo.estimated_arrival_time ? `${t('reservations.arrival')} ${bookInfo.estimated_arrival_time}-${moment(bookInfo.estimated_arrival_time, "HH:mm").add(1, "hour").format("HH:mm")}` : ''}
              </div>
            }
          </div>
          {bookInfo.requirements_comment &&
            <div className={classes.selected_additionalInfo_comment}>{bookInfo.requirements_comment}</div>
          }
          {bookInfo.status_id !== 3 && bookInfo.status_id !== 4 &&
            <Button btnColor="outline_blue"
              typeButton={1}
              className={[classes.button, classes.button_collapse].join(" ")}
              onClick={() => setIsOpen(false)}>
                <div className={classes.selected_blueArrow} />
                {t('reservations.collapse')}
          </Button>
          }
        </div>
      </div>
    )
  }
  const renderCancelReason = () => {
    if (bookInfo.cancel_sub_reason_id) {
      return <>
        <p className={classes.selected_cancel_subTitle}>{t("reservations.partner.reasonsCancel")}</p>
        {bookInfo.cancel_sub_reason_id == 5 ?
          <div
            className={classes.selected_cancel_reason}>{bookInfo.reject_reason ?? bookInfo.cancel_reason}
          </div> :
          <div className={classes.selected_cancel_reason}>
            {bookInfo.cancel_sub_reason_text}
          </div>
        }
      </>
    } else {
      return (<div className={classes.selected_cancel_reason}>
        {bookInfo.reject_reason}
      </div>)
    }
  }

  return (
    <div className={classes.selected_area}>
      <div className={classes.selected}>
        {renderReservationHeader}
        {isOpen &&
          <>
            <div className={classes.selected_section}>
              <div className={classes.selected_main}>
                <div className={classes.selected_main_column}>
                  <div className={classes.title}>
                    {t('reservations.roomName')}
                  </div>
                  <div className={classes.selected_main_value}>
                    {bookInfo?.room_name.ru}
                  </div>
                </div>
                <div className={classes.selected_main_column}>
                  <div className={classes.title}>
                    {t('reservations.tariffName')}
                  </div>
                  <div className={classes.selected_main_value}>
                    {bookInfo?.tariff_name.ru}
                  </div>
                  {Number(bookInfo.discount) ? <div className={classes.discount}>
                    <div className={classes.title}>
                      Скидка 10% на первое бронирование
                    </div>
                    <div className={classes.selected_main_value}>
                      {bookInfo.discount} руб.
                    </div>
                  </div> : null}
                </div>
                <div className={classes.selected_main_column}>
                  <div className={classes.title}>
                    {t('reservations.price')}
                  </div>
                  <div className={classes.selected_main_value}>
                    <div className={[Number(bookInfo.sailplay_price) ? classes.room_price_old : ''].join(" ")}>{
                      bookInfo.sailplay_price !== null &&
                      !bookInfo.sailplay_price === "0.00" ?
                        Number(bookInfo.sailplay_price).toFixed(2) :
                        Number(bookInfo.price - bookInfo.discount).toFixed(2)} руб.</div>
                    {bookInfo.points_spent ? <div className={classes.room_price_sailplay}><div className={classes.title}>С учётом списания ключей:</div>{Number(bookInfo.sailplay_price).toFixed(2)} руб.</div> : null}
                  </div>
                </div>
              </div>
            </div>
            <div className={classes.selected_section}>
              <div className={classes.selected_section_title}>{t('reservations.info')}</div>
              <div className={classes.selected_info}>
                <div className={classes.selected_info_cell}>
                  <div className={classes.selected_info_label}>{t('reservations.guest')}</div>
                  <div className={classes.selected_info_value}>
                    {guestTemplate}
                  </div>
                </div>
                <div className={classes.selected_info_cell}>
                  <div className={classes.selected_info_label}>E-mail</div>
                  <div className={[classes.selected_info_value, classes.selected_info_value_email].join(" ")}>
                    <a href={`mailto:${bookInfo.client_email}`} title={bookInfo.client_email}>
                      {bookInfo.client_email}
                    </a>
                  </div>
                </div>
                <div className={classes.selected_info_cell}>
                  <div className={classes.selected_info_label}>{t('reservations.phone')}</div>
                  <div className={classes.selected_info_value}>{bookInfo.client_phone}</div>
                </div>
                <div className={classes.selected_info_cell}>
                  <div className={classes.selected_info_label}>{t('reservations.date')}</div>
                  <div className={classes.selected_info_value}>{moment.unix(bookInfo.updated_at).format("DD.MM.YYYY HH:mm")}</div>
                </div>
                <div className={[classes.selected_info_cell, classes.selected_info_cell_double, classes.selected_info_cell_dates].join(" ")}>
                  <div className={classes.selected_info_cell_item}>
                    <div className={classes.selected_info_label}>{t('reservations.checkIn')}</div>
                    <div className={classes.selected_info_value}>{moment(bookInfo.arrival_date).format("DD.MM.YYYY")}</div>
                  </div>
                  <div className={classes.selected_info_cell_item}>
                    <div className={classes.selected_info_label}>{t('reservations.leaving')}</div>
                    <div className={classes.selected_info_value}>{moment(bookInfo.departure_date).format("DD.MM.YYYY")}</div>
                  </div>
                </div>
                <div className={classes.selected_info_cell}>
                  <div className={classes.selected_info_label}>{t('reservations.nights')}</div>
                  <div className={classes.selected_info_value}>{countDays}</div>
                </div>
                <div className={classes.selected_info_cell}>
                  <div className={classes.selected_info_label}>{t('reservations.number')}</div>
                  <div className={classes.selected_info_value}>{bookInfo.id}</div>
                </div>
                {bookInfo.bed_type_id &&
                  <div className={classes.selected_info_cell}>
                    <div className={classes.selected_info_label}>{t('reservations.bedType')}</div>
                    <div className={classes.selected_info_value}>{selectedBedType?.name?.ru}</div>
                  </div>
                }
                {bookInfo.payment_type_id &&
                  <div className={classes.selected_info_cell}>
                    <div className={classes.selected_info_label}>{t('reservations.paymentType.title')}</div>
                    <div className={classes.selected_info_value}>{t(`reservations.paymentType.${bookInfo.payment_type_id}`)}</div>
                  </div>
                }
                <div className={classes.selected_info_cell}>
                  <div className={classes.selected_info_label}>{t('reservations.client.food')}</div>
                  <div className={classes.selected_info_value}>{bookInfo.meal_type_name ? bookInfo.meal_type_name.ru : "Стандарт"}</div>
                </div>
              </div>
              <div className={classes.selected_guest_banBtnArea}>
                {bookInfo.cancel_booking_button ?
                  <Button
                    btnColor="ButtonRed"
                    className={[classes.button, classes.reservation_cancelButton].join(" ")}
                    typeButton={2}
                    onClick={() => setClientNotArriveModal(true)}
                  >
                    {t('reservations.notCheckIn')}
                  </Button> : ''}
              </div>
            </div>

            {renderAdditionalInfo()}
            {(bookInfo.status_id == 3 || bookInfo.status_id == 4) && <div className={classes.selected_cancel}>
              <p className={classes.selected_cancel_title}>
                {bookInfo.status_id == 3 ? t('reservations.partner.clientCancel') :
                  t('reservations.partner.hotelCancel')}</p>
              {renderCancelReason()}
              <Button btnColor="blueBorderButton"
                      typeButton={2}
                      className={[classes.button, classes.button_collapse].join(" ")}
                      onClick={() => setIsOpen(false)}>
                <div className={classes.selected_blueArrow} />
                {t('reservations.collapse')}
              </Button>
            </div>}
          </>
        }
      </div>
      {templateModalAccept}
      {templateModalCancel}
      {modalCancelSuccess}
      {notArriveModal}
      {notArriveModalSeccess}
    </div>)
}

export default Reservation