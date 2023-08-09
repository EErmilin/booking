import React, { useEffect, useMemo, useState } from "react"
import classes from "./BookingForm.module.scss";
import { useTranslation } from "react-i18next";
import CustomSelect from "../../../../components/UI/areas/CustomeSelect/CustomSelect";
import Input from "../../../../components/UI/areas/Input/Input";
import Button from "../../../../components/UI/btns/Button/Button";
import RoomItem from "../../../../components/RoomItem/RoomItem";
import CustomRadio from "../../../../components/UI/areas/CustomRadio/CustomRadio";
import Checkbox from "../../../../components/UI/areas/Checkbox/Checkbox";
import CustomTextArea from "../../../../components/UI/areas/CustomTextArea/CustomTextArea";
import { array, object, string } from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { clearBookingFormError, clearBookingFormErrorField, createBook, createBookNoAuth, getCodeBookNoAuth } from "../../../../store/actions/bookingActions";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import useToggleVisibility from "../../../../hooks/useToggleVisibility";
import EmptyModal from "../../../../components/UI/modals/EmptyModal/EmptyModal";
import ProgressBar from "./ProgessBar/ProgressBar";
import { useCookies } from "react-cookie"
import ModalBookingPayment from "./ModalBookingPayment/ModalBookingPayment";
import ModalPolitic from "./ModalPolitic/ModalPolitic";
import ModalConfirmSmsCode from "../../../../components/UI/modals/ModalConfirmSmsCode/ModalConfirmSmsCode";

const Guest = ({ isMain = true, value, onChange}) => {

    const errors = useSelector(state => state.book.errors)

    return (
      <div className={classes.form_field_row}>
        <Input
            className={classes.form_field_input}
            label={`Имя гостя`}
            value={value.first_name}
            typeClsInput={"field"}
            onChange={(e => {
                onChange({ first_name: e.target.value, last_name: value.last_name })
            })}
            touched={true}
            valid={!errors.additional_guests}
            errorMessage={errors.additional_guests}
            shouldValidate
        />
        <Input
            className={classes.form_field_input}
            label={`Фамилия гостя`}
            value={value.last_name}
            typeClsInput={"field"}
            onChange={(e => {
                onChange({ first_name: value.first_name, last_name: e.target.value })
            })}
            touched={true}
            valid={!errors.additional_guests}
            errorMessage={errors.additional_guests}
            shouldValidate
        />
    </div>
    )
}

function BookingForm({
    hotelInfo,
    roomTypeId,
    room,
    hotelId,
    arrival_date,
    departure_date,
    tariff_id,
    countDay,
    className,
    is_crib_keys,
    cribKeysCount,
    city,
    adults,
    children
}) {
    const environment = process.env.REACT_APP_ENVIRONMENT || null
    const { t } = useTranslation()
    const dispatcher = useDispatch()
    const [modalMessage, setModalMessage] = useState()
    const amenity = useSelector(state => state.objects.amenity)
    const errors = useSelector(state => state.book.errors)
    const lockInfo = useSelector(state => state.book.lockInfo)
    const userInfo = useSelector(state => state.auth.userInfo)
    const [isCardPay, setIsCardPay] = useState(true);
    const [guests, setGuests] = useState([]);
    const cls = []
    if (className) cls.push(className)
    const navigate = useNavigate()
    const [isBook, setIsBook] = useState(false)
    const [gaBeginCheckoutSent, setGaBeginCheckoutSent] = useState(false)
    const [modal, setModal, closeModal] = useToggleVisibility()
    const isAuth = useSelector(state => state.auth.isAuth)
    const { tariffs } = room;
    const [preloader, setPreloader] = useState(false)
    const [cookies] = useCookies(["admitad_uid"])
    /** Модалка с условиями оплаты бронирования */
    const [modalPayments, setModalPayments, closeModalPayments] = useToggleVisibility()
    /** Модалка подтверждения кода */
    const [isShowModalCode, setIsShowModalCode, closeModalCode] = useToggleVisibility()
    const [phone, setPhone] = useState('')
    const [errorCode, setErrorCode] = useState(null)
    const [timerCount, setTimerCount] = useState(120)

    const templateModalPayments = modalPayments && <ModalBookingPayment
        setModal={setModalPayments}
        closeModal={closeModalPayments}
    ></ModalBookingPayment>

    /** Модалка с политикой обработки персональных данных */
    const [modalPolitic, setModalPolitic, closeModalPolitic] = useToggleVisibility()

    const templateModalPolitic = modalPolitic && <ModalPolitic
        setModal={setModalPolitic}
        closeModal={closeModalPolitic}
    ></ModalPolitic>

    const templateModal = modal && <EmptyModal
        close={true}
        closeModal={closeModal}
        btnCancelClick={() => setModal(false)}
        width={400}
        background="blue"
        typeModal={"withoutBack"}
    >
        <div className={classes.form_modal}>{modalMessage}</div>
    </EmptyModal>

    /** Список преблезительного время прибытия */
    const optionsTimes = useMemo(() => {
        let arr = []
        for (let i = 0; i < 24; i++) {
            arr.push({ label: `${i}:00 - ${i + 1}:00`, value: i })
        }
        return arr
    }, [])

    const optionsPayment = useMemo(() => {
        let paymentArr = []
        for (let payment of hotelInfo.payment_type_id) {
            if (payment == 1) {
                paymentArr.push({ text: t("addNewObjects.secondStep.cash"), value: 1 })
            } else if (payment == 2) {
                paymentArr.push({ text: t("addNewObjects.secondStep.card"), value: 2 })
            } else if (payment == 4) {
                paymentArr.push({ text: t("addNewObjects.secondStep.online"), value: 4 })
            }
        }
        return paymentArr
    }, [])

    /** Список кроватей */
    const optionsBeds = useMemo(() => {
        if (!room.beds) return []
        else return room.beds.map(elem => ({
            label: elem.bedType.name.ru,
            value: elem.bed_type_id
        }))
    }, [room])

    /** Список гостей */
    const guestTemplate = guests.map((elem, id) => {
        return (
            <Guest
                isMain={false}
                value={elem}
                key={id}
                id={id}
                onChange={(value) => {
                    let arrGuests = [...guests]
                    arrGuests.splice(id, 1, value)
                    setGuests(arrGuests)
                }}
            />
        )
    })

    const integration_data = useMemo(() => {
        return room.tariffs.find(elem => elem.id == tariff_id)?.integration_data
    }, [room])

    /** Начальные значения */
    const initialValues = useMemo(() => {
        return {
            arrival_date: arrival_date,
            departure_date: departure_date,
            hotel_id: +hotelId,
            room_id: +roomTypeId,
            tariff_id: +tariff_id,
            adult_count: room.tariffs.find(elem => elem.id == tariff_id)?.guests,
            client_first_name: userInfo.first_name,
            client_last_name: userInfo.last_name,
            client_phone: userInfo.phone,
            client_email: userInfo.email,
            is_need_transfer: false,
            requirements_comment: "",
            bed_type_id: "",
            payment_type_id: "",
            additional_guests: [],
            integration_data: integration_data,
            admitad_uid: cookies.admitad_uid || null
        }
    }, [arrival_date, departure_date, room, is_crib_keys])

    /** Схема валидации */
    const validationSchema = useMemo(
        () =>
            object().shape({
                room_uuid: string().required(),
                hotel_id: string().required(),
                room_id: string().required(),
                client_first_name: string().required(),
                client_last_name: string().required(),
                client_phone: string().required(),
                client_email: string().required(),
                is_need_transfer: string().required(),
                requirements_comment: string().required(),
                bed_type_id: string().required(),
                payment_type_id: string().required(),
                additional_guests: array().required()
            }),
        []
    );

    /** Стейт полей и правила */
    const {
        values,
        handleChange,
        handleSubmit,
        touched,
    } = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {

        },
        enableReinitialize: true
    });

    const formatData = function (value) {
        let phone = value.client_phone.match(/\d/g)
        return {
            ...value,
            client_phone: phone ? `+${phone.join('')}` : '',
            additional_guests: guests,
            room_uuid: lockInfo.room_uuid,
            is_crib_keys: is_crib_keys,
        }
    }

    function gaPurchaseEvent(bookId) {

        const discount = is_crib_keys && cribKeysCount ? cribKeysCount : 0

        setTimeout(() => {

            // clear previous ecommerce object
            window.dataLayer.push({
                ecommerce: null
            })

            /** Event for GA4 */
            window.dataLayer.push({
                event: "purchase",
                ecommerce: {
                    transaction_id: bookId, // ID транзакции
                    value: room.sum,       // Сумма транзакции. Полная стоимость брони за все ночи.
                    discount: discount,       // Кол-во списанных бонусов (“ключей”)
                    booking_country: "Russia",       // Страна, где расположен отель
                    booking_city: city,       // Город, где расположен отель
                    booking_start_date: arrival_date,       // Дата заезда
                    booking_end_date: departure_date,       // Дата выезда
                    booking_adults: parseInt(adults),       // Кол-во взрослых
                    booking_kids: parseInt(children),       // Кол-во детей
                    booking_nights: countDay,       // Кол-во ночей
                    items: [
                        {
                            item_list_name: hotelInfo?.name?.ru,       // Название отеля
                            item_list_id: `H${hotelInfo.id}`,       // Префикс “H” (от Hotel) + ID отеля
                            item_name: room?.name?.ru,       // Название номера
                            item_id: `R${room.id}`,       // Префикс “R” (от Room) + ID номера
                            item_variant: `T${tariffs[0].id}::${tariffs[0]?.name?.ru}`,       // Префикс “T” (от Tarif) + ID тарифа + “::” + Название тарифа
                            price: room.price       // Стоимость брони за ночь (В UI не отображается)
                        }]
                }
            })
        }, 100)

        setTimeout(() => {

            /** clear previous ecommerce object */
            window.dataLayer.push({
                ecommerce: null
            })

            /** Event for old GA3 (UA) */
            window.dataLayer.push({
                ecommerce: {
                    purchase: {
                        actionField: {
                            id: bookId,       // ID транзакции
                            revenue: room.sum,       // Сумма транзакции. Полная стоимость брони за все ночи.
                        },
                        products: [
                            {
                                category: hotelInfo?.name?.ru,       // Название отеля
                                brand: `H${hotelInfo.id}`,       // Префикс “H” (от Hotel) + ID отеля
                                name: room?.name?.ru,       // Название номера
                                id: `R${room.id}`,       // Префикс “R” (от Room) + ID номера
                                variant: `T${tariffs[0].id}::${tariffs[0]?.name?.ru}`,      // Префикс “T” (от Tarif) + ID тарифа + “::” + Название тарифа
                                price: room.price       // Стоимость брони за ночь (В UI не отображается)
                            }]
                    }
                }
            })
        }, 300)

    }

    function gaBeginCheckoutEvent() {
        if (!gaBeginCheckoutSent) {

            /** clear previous ecommerce object */
            window.dataLayer.push({
                ecommerce: null
            })

            window.dataLayer.push({
                event: "begin_checkout",
                ecommerce: {
                    booking_country: "Russia",       // Страна, где расположен отель
                    booking_city: city,       // Город, где расположен отель
                    booking_start_date: arrival_date,       // Дата заезда
                    booking_end_date: departure_date,       // Дата выезда
                    booking_adults: +adults,       // Кол-во взрослых
                    booking_kids: +children,       // Кол-во детей
                    booking_nights: +countDay,       // Кол-во ночей
                    items: [
                        {
                            item_list_name: hotelInfo?.name?.ru,       // Название отеля
                            item_list_id: `H${hotelInfo.id}`,       // Префикс “H” (от Hotel) + ID отеля
                            item_name: room?.name?.ru,       // Название номера
                            item_id: `R${room.id}`,       // Префикс “R” (от Room) + ID номера
                            item_variant: `T${tariffs[0].id}::${tariffs[0]?.name?.ru}`,       // Префикс “T” (от Tarif) + ID тарифа + “::” + Название тарифа
                            price: room.price       // Стоимость брони за ночь (В UI не отображается)
                        }]
                }
            })

            setGaBeginCheckoutSent(true)
        }
    }

    /** Очищаем ошибки и изменяем состояние */
    function ClearErrorAndChange(field, value) {
        if (errors[field]) {
            dispatcher(clearBookingFormErrorField(field))
        }
        handleChange({ target: { name: field, value: value } })

        if (environment === "production" && hotelInfo.metric) {
            gaBeginCheckoutEvent()
        }
    }


    const isPhoneValid = (values.client_phone.match(/\d/g)?.join('')[1] === '9' && (values.client_phone.match(/\d/g)?.join('')?.length == 11)) || !values.client_phone[4]

    async function save() {
        if (!isPhoneValid) return

        document.body.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })
        if (isBook) return

        let response
        if (!isAuth) {
            response = await dispatcher(getCodeBookNoAuth(formatData(values)))
            if (response.status === 200) {
                setIsBook(true)
                setPreloader(true)
                const data = {
                    ...formatData(values),
                    recoveryCode: response.data.recoveryCode
                }
                 response = await dispatcher(createBookNoAuth(data))
                if (response.data.token_view) {
                    if (environment === "production" && hotelInfo.metric) {
                        const { client_email } = formatData(values)
                        gaPurchaseEvent(response.data.id)
                        window.rrApiOnReady.push(function () {
                            try {
                                window.rrApi.setEmail(client_email);
                                window.rrApi.order({
                                    "transaction": response.data.id,
                                    "items": [
                                        { "id": hotelId, "qnt": countDay, "price": room.price },
                                    ]
                                });
                            } catch (e) { }
                        })
                    }

                    if (response.data.payment_type_id == 4 && response.data.payment_url) {
                        window.location.href = response.data.payment_url
                    } else {
                        navigate(`/booking?token_view=${response.data.token_view}`)
                    }
                } else if(response.status === 400){
                    setIsBook(false)
                    setPreloader(false)
                }
            }
        } else {
            setIsBook(true)
            setPreloader(true)
            const bookId = await dispatcher(createBook(formatData(values)))
            if (bookId.status === 400) {
                setPreloader(false)
                setModalMessage(bookId.message)
                setModal(true)
                setIsBook(false)
            } else if (typeof bookId.id === "object" || bookId.status === 400) {
                setPreloader(false)
                setModalMessage(JSON.parse(bookId.message).message)
                setModal(true)
                setIsBook(false)
            }
            if (bookId.status == 404) {
                setPreloader(false)
                setIsBook(false)
                document.querySelector('[class*="_invalid"]')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                })
            }
            if (bookId.status == 200) {
                setIsBook(true)
                const { client_email } = formatData(values)

                if (environment === "production" && hotelInfo.metric) {
                    gaPurchaseEvent(bookId.id)
                    window.rrApiOnReady.push(function () {
                        try {
                            window.rrApi.setEmail(client_email);
                            window.rrApi.order({
                                "transaction": bookId.id,
                                "items": [
                                    { "id": hotelId, "qnt": countDay, "price": room.price },
                                ]
                            });
                        } catch (e) { }
                    })
                }

                if (bookId.data.payment_type_id == 4 && bookId.data.payment_url) {
                    window.location.href = bookId.data.payment_url
                } else {
                    navigate("/personal-area/my-reservations/1")
                }
            }
        }
    }

    const guestButtonHandler = (extraGuestsNumber ) => {
        let arGuests = []
        if (!guests.length) {
            for (let i = 0; i < extraGuestsNumber; i++) {
                arGuests.push({first_name: '', last_name: ""})
            }
        }
        setGuests(arGuests)
    }

    return <div className={cls.join(" ")}>
        <RoomItem
            headerClassName={classes.roomItem}
            isBooking={true}
            room={room}
            hotel={hotelInfo}
            amenity={room.amenities}
            noTariff={true}
            hotelId={hotelInfo.id}
        />
        {preloader ? <ProgressBar
            className={classes.preloader}
            title={t("booking.preloaderTitle")}
            text={t("booking.progressText")}
        ></ProgressBar> : <div>
            <div className={classes.form_field}>
                <h2 className={classes.form_field_title}>{t("booking.info")}</h2>
                <div className={classes.form_field_row}>
                    <Input
                      className={classes.form_field_input}
                      mask="+7 (999) 999-99-99"
                      label={t("booking.phone")}
                      name="client_phone"
                      value={values.client_phone}
                      shouldValidate
                      typeClsInput={"field"}
                      onChange={e => {
                          return ClearErrorAndChange("client_phone", e.target.value)
                      }}
                      touched={!touched.client_phone}
                      valid={isPhoneValid && !errors.client_phone}
                      errorMessage={errors.client_phone ?? t("auth.register.noValidPhone")}
                      required
                    ></Input>
                    <Input
                      className={classes.form_field_input}
                      label={t("booking.email")}
                      name="client_email"
                      value={values.client_email}
                      shouldValidate
                      typeClsInput={"field"}
                      onChange={e => {
                          return ClearErrorAndChange("client_email", e.target.value)
                      }}
                      touched={!touched.client_email}
                      valid={!errors.client_email}
                      errorMessage={errors.client_email}
                      required
                    ></Input>
                </div>
                <div className={classes.form_notification}>
                    {t('booking.smsNotification')}
                </div>
                <div className={classes.form_field_row}>
                    <Input
                        className={classes.form_field_input}
                        label={`Ваше имя`}
                        name="client_first_name"
                        value={values.client_first_name}
                        typeClsInput={"field"}
                        onChange={e => {
                            return ClearErrorAndChange("client_first_name", e.target.value)
                        }}
                        touched={!touched.client_first_name}
                        valid={!errors.client_first_name}
                        errorMessage={errors.client_first_name}
                        shouldValidate
                        required
                    ></Input>
                    <Input
                        className={classes.form_field_input}
                        label={`Ваша фамилия`}
                        value={values.client_last_name}
                        name="client_last_name"
                        typeClsInput={"field"}
                        onChange={e => {
                            return ClearErrorAndChange("client_last_name", e.target.value)
                        }}
                        touched={!touched.client_last_name}
                        valid={!errors.client_last_name}
                        errorMessage={errors.client_last_name}
                        shouldValidate
                        required
                    ></Input>
                </div>
                {room.tariffs && room.tariffs.length &&
                  <div className={classes.guest_button_wrap}>
                      <Button
                        typeButton={1}
                        className={[classes.guest_button, guests.length ? classes.guest_button_hide : classes.guest_button_show].join(" ")}
                        onClick={() => guestButtonHandler(room.tariffs[0]?.guests - 1)}
                        btnColor="outline_blue"
                      >{guests.length ? `Скрыть имена всех гостей` : t('booking.addGuest')}</Button>
                  </div>
                }
                {guestTemplate}
                <div className={classes.form_notification}>
                    {t('booking.nameNotification')}
                </div>

            </div>
            <div className={classes.form_field}>
                <h2 className={classes.form_field_title}>{t("booking.wishes")}</h2>
                {t("booking.transfer")}
                <div className={classes.form_field_radio}>
                    <CustomRadio
                        listRadio={[{
                            text: t("addNewObjects.thirdStep.form.yes"),
                            value: true
                        }, { text: t("addNewObjects.thirdStep.form.no"), value: false }]}
                        edit={true}
                        name="is_need_transfer"
                        value={values.is_need_transfer}
                        onChange={value => {
                            return ClearErrorAndChange("is_need_transfer", value)
                        }}
                        touched={!touched.is_need_transfer}
                        valid={!errors.is_need_transfer}
                        errorMessage={errors.is_need_transfer}
                        checked={true}
                        required
                        shouldValidate
                    ></CustomRadio>
                </div>
                <CustomTextArea
                    className={classes.form_field_textarea}
                    label={t("booking.addWishes")}
                    placeholder={t("booking.wishesPlaceholder")}
                    name="requirements_comment"
                    value={values.requirements_comment}
                    onChange={e => {
                        return ClearErrorAndChange("requirements_comment", e.target.value)
                    }}
                    touched={!touched.requirements_comment}
                    valid={!errors.requirements_comment}
                    errorMessage={errors.requirements_comment}
                    required
                    shouldValidate
                />
                {/** <CustomSelect
                    label={t("booking.bed")}
                    name="bed_type_id"
                    value={optionsBeds.find((elem) => elem.value == values.bed_type_id)}
                    options={optionsBeds}
                    className={classes.form_field_select}
                    onChange={value => {
                        onFieldChange("bed_type_id", value.value)
                    }}
                    touched={!touched.bed_type_id}
                    valid={!errors.bed_type_id}
                    errorMessage={errors.bed_type_id}
                    shouldValidate
                ></CustomSelect> */}
            </div>
            <div />
            <div className={classes.form_field}>
                <h2 className={classes.form_field_title}>{t("booking.pay")}</h2>
                <CustomRadio
                    listRadio={optionsPayment}
                    value={isCardPay}
                    name="payment_type_id"
                    edit={true}
                    className={classes.form_field_radio}
                    onChange={value => {
                        return ClearErrorAndChange("payment_type_id", value)
                    }}
                    touched={!touched.payment_type_id}
                    valid={!errors.payment_type_id}
                    errorMessage={errors.payment_type_id}
                    required
                    shouldValidate
                ></CustomRadio>
            </div>
            <div />
            <div className={classes.form_buttons}>
                <Checkbox
                    classNameLabel={classes.form_field_checkbox}
                    className={classes.policy_checkbox}
                    text={<span>Нажимая на кнопку «Оплатить», я принимаю условия <a onClick={() => setModalPayments(true)}>Оплаты бронирования</a> и соглашаюсь с <a onClick={() => setModalPolitic(true)}>Политикой обработки персональных данных.</a></span>}
                    checked={true} />
                {errors.status === 409 && <p className={classes.error}>{errors.message}</p>}
                <Button
                    typeButton={2}
                    onClick={save}
                    btnColor="ButtonGreen"
                >{values.payment_type_id == 4 ? t('booking.payOnline') : t('booking.booking')}
                </Button>
                <Button
                    className={classes.form_cancel}
                    typeButton={2}
                    onClick={() => { navigate(`/hotel?id=${hotelInfo.id}&${window.location.search.slice(1)}`) }}
                    btnColor="ButtonRed"
                    disabled={isBook}
                >{t('booking.cancel')}
                </Button>
            </div>
        </div>}
        {templateModalPayments}
        {templateModalPolitic}
        {templateModal}
    </div>
}

export default BookingForm