import serialize from "../../functions/serialize";
import axiosCustom from "../../axios/axiosCustom";
import {
    CANCEL_BOOKING_PARTNER_ERROR,
    CANCEL_BOOKING_PARTNER_SUCCESS,
    CANCEL_CLIENT_BOOK_ERROR,
    CANCEL_CLIENT_BOOK_SUCCESS,
    CLEAR_BOOK_FORM_ERROR,
    CLEAR_ERROR_BOOKING,
    CONFIRM_BOOK_SUCCESS,
    CREATE_BOOK_ERROR,
    CREATE_BOOK_SUCCESS,
    GET_PARTNER_BOOKING_REJECT_REASONS,
    GET_PARTNER_BOOKING_REJECT_REASONS_ERROR,
    GET_BOOKINGS_CLIENT_ERROR,
    GET_BOOKINGS_CLIENT_SUCCESS,
    GET_CLIENT_CALC_PENALTY,
    GET_CURRENT_BOOK_CLIENT_ERROR,
    GET_CURRENT_BOOK_CLIENT_SUCCESS,
    GET_HOTEL_FOR_BOOK_ERROR,
    GET_HOTEL_FOR_BOOK_SUCCESS,
    GET_HOTEL_STATS_SUCCESS,
    GET_REASON_FOR_CANCEL_SUCCESS,
    GET_ROOM_FOR_BOOK_ERROR,
    GET_ROOM_FOR_BOOK_SUCCESS,
    GET_SUB_REASON_FOR_CANCEL_SUCCESS,
    LOCK_ERROR,
    LOCK_SUCCESS, GET_COUNT_ARCHIVE_BOOKING, GET_COUNT_ACTIVE_BOOKING, CLEAR_BOOK_FORM_ERROR_FIELD
} from "./actionsType";
import bookInfo from "../../components/BookInfo/BookInfo";
import { startRequest } from "./routerActions";

const baseUrlClient = process.env.REACT_APP_CLIENT_ENDPOINT
const baseUrl = process.env.REACT_APP_BACKEND_ENDPOINT


export function clearErrorsBooking() {
    return {
        type: CLEAR_ERROR_BOOKING
    }
}

/** Получение отеля для бронирования */
export function getHotelForBookSuccess(hotel) {
    return {
        type: GET_HOTEL_FOR_BOOK_SUCCESS,
        payload: hotel
    }
}
export function getHotelForBookError(error) {
    return {
        type: GET_HOTEL_FOR_BOOK_ERROR,
        error: error
    }
}
export function getRoomForBookSuccess(hotel) {
    return {
        type: GET_ROOM_FOR_BOOK_SUCCESS,
        payload: hotel
    }
}
export function getRoomForBookError(error) {
    return {
        type: GET_ROOM_FOR_BOOK_ERROR,
        error: error
    }
}
/** Подтягиваем отель для бронирования */
export function getBookingHotel(hotelId, roomId, filters = {}) {
    const formatParams = {
        id: hotelId,
        expand: 'rooms.amenities.group,rooms.tariffs,region,rooms,rooms.beds,amenities,rooms.beds.bedType',
        ...filters
    }

    return async (dispatch) => {
        try {
            const response = await axiosCustom.get(`${baseUrl}/partner/hotel/preview?${serialize(formatParams)}`)
            const { data } = response
            if (roomId) {
                const room = data.rooms.length ? data.rooms.find(elem => elem.id == roomId) : {}
                dispatch(getRoomForBookSuccess(room))
            } else {
                dispatch(getHotelForBookSuccess(data))
            }
        } catch (e) {
            if (e.response) {
                if (roomId) {
                    dispatch(getRoomForBookError(e.response.data))
                } else {
                    dispatch(getHotelForBookError(e.response.data))
                }
            }
        }
    }
}
/** Подтягиваем отель для бронирования */
export function getHotelForBook(hotelId, roomId, filters = {}) {
    const formatParams = {
        id: hotelId,
        expand: 'rooms.amenities.group,rooms.tariffs,region,rooms,rooms.beds,amenities,rooms.beds.bedType',
        ...filters
    }

    return async (dispatch) => {
        try {
            const response = await axiosCustom.get(`${baseUrl}/public/hotel/view?${serialize(formatParams)}`)
            const { data } = response

            if (roomId) {
                const room = data.rooms.length ? data.rooms.find(elem => elem.id == roomId) : {}
                dispatch(getRoomForBookSuccess(room))
                dispatch(getHotelForBookSuccess(data))
            } else {
                dispatch(getHotelForBookSuccess(data))
            }
        } catch (e) {
            if (e.response) {
                if (roomId) {
                    dispatch(getRoomForBookError(e.response.data))
                } else {
                    dispatch(getHotelForBookError(e.response.data))
                }
            }
        }
    }
}
/** Повторная оплата если первая не успешна */
export function forcePayment(obj) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.post(`${baseUrl}/client/booking/forse-payment`, obj)
            const { data } = response

            return data
        } catch (e) {
        }
    }
}
export function forcePaymentNoAuth(obj) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.post(`${baseUrl}/public/simple-booking/forse-payment`, obj)
            const { data } = response

            return data
        } catch (e) {
        }
    }
}
/** Создаем бронь */
export function createBookSuccess(bookInfo) {
    return {
        type: CREATE_BOOK_SUCCESS,
        payload: bookInfo
    }
}
export function createBookError(error) {
    return {
        type: CREATE_BOOK_ERROR,
        error: error
    }
}
export function createBook(bookInfo) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.post(`${baseUrl}/client/booking/book?expand=hotel,hotel.region,room,tariff`, bookInfo)
            const { data } = response

            dispatch(createBookSuccess(data))
            return { status: 200, data: data, id: data.id }
        } catch (e) {
            if (e.response) {
                if (e.response.data.status === 400) return e.response.data
                dispatch(createBookError(e.response.data))
                return { status: 404 }
            }
        }
    }
}
export function getCodeBookNoAuth(bookInfo) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.post(`${baseUrlClient}/user/request-simple-booking-registration-code`, bookInfo)
            return { status: 200, data: response.data }
        } catch (e) {
            if (e.response) {
                dispatch(createBookError(e.response.data.error))
                return { status: 400}

            }
        }
    }
}
export function createBookNoAuth(bookInfo) {
    return async (dispatch) => {
        try {
            let response = await axiosCustom.post(`${baseUrlClient}/user/simple-booking-register-by-sms`, bookInfo)

            response = await axiosCustom.post(`${baseUrl}/public/simple-booking/book`, {...bookInfo, uuid: response.data.uuid})

            dispatch(createBookSuccess(response.data))
            return { status: 200, data:response.data }
        } catch (e) {
            if (e.response) {
                dispatch(createBookError(e.response.data))
                return { status: 400}
            }
        }
    }
}

export function getBookInfoClientNoAuth(token) {
    return async (dispatch) => { 
        try {
            dispatch(startRequest())
            const response = await axiosCustom.post(`${baseUrl}/public/simple-booking/view?expand=region,cancel_sub_reason_text`, {token_view:token})
            const { data } = response

            dispatch(getBookInfoClientSuccess(data))
        } catch (e) {
            if (e.response) {
                dispatch(getBookInfoClientError(e.response.data))
                return { status: 400}
            }
        }
    }
}

/** Лочим комнату при бронировании */
export function lockRoomSuccess(lockInfo) {
    return {
        type: LOCK_SUCCESS,
        payload: lockInfo
    }
}
export function lockRoomError(error) {
    return {
        type: LOCK_ERROR,
        error: error
    }
}
export function lockRoom(lockInfo) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.post(`${baseUrl}/client/booking/lock`, lockInfo)
            const { data } = response
            dispatch(lockRoomSuccess(data))
            return false
        } catch (e) {
            if (e.response) {
                dispatch(lockRoomError(e.response.data))
                return e.response.data.status
            }
        }
    }
}
/** Получаем список резерваций клиента */
export function getClientReservationsSuccess(bookings) {
    return {
        type: GET_BOOKINGS_CLIENT_SUCCESS,
        payload: bookings
    }
}
export function getClientReservationsError(error) {
    return {
        type: GET_BOOKINGS_CLIENT_ERROR,
        error: error
    }
}

/** Получаем список резерваций клиента */
export function getClientReservations(params) {
    const formatParams = `?${serialize(params)}`
    return async (dispatch) => {
        try {
            dispatch(startRequest())
            const response = await axiosCustom(`${baseUrl}/client/booking/index${formatParams}`)
            const { data } = response

            dispatch(getClientReservationsSuccess(data))
            return data.items
        } catch (e) {
            if (e.response) {
                dispatch(getClientReservationsError(e.response.data))
            }
        }
    }
}

/** Получаем список резерваций клиента */
export function getDiscountPecent(params) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom(`${baseUrl}/public/catalog/discount-percent`)
            const { data } = response
            return data
        } catch (e) {
        }
    }
}

/** Получаем список резерваций для партнера */
export function getPartnerReservations(params) {
    const formatParams = `?${serialize({ expand: "hotel,room,room.roomType,tariff", 'per-page': 4, sort: `-created_at`, ...params })}`
    return async (dispatch) => {
        try {
            dispatch(startRequest())
            const response = await axiosCustom(`${baseUrl}/partner/booking/index${formatParams}`)
            const { data } = response

            dispatch(getClientReservationsSuccess(data))
        } catch (e) {
            if (e.response) {
                dispatch(getClientReservationsError(e.response.data))
            }
        }
    }
}
/** Получаем статистику отелей партнера */
export function getHotelStatsSuccess(stat) {
    return {
        type: GET_HOTEL_STATS_SUCCESS,
        payload: stat
    }
}
export function getHotelStats() {
    return async (dispatch) => {
        try {
            const response = await axiosCustom(`${baseUrl}/partner/booking/stat`)
            const { data } = response

            dispatch(getHotelStatsSuccess(data))
        } catch (e) {
            if (e.response) {
                dispatch(getClientReservationsError(e.response.data))
            }
        }
    }
}
/** Отменяем бронь клиентом */
export function cancelBookingSuccess(payload) {
    return {
        type: CANCEL_CLIENT_BOOK_SUCCESS,
        payload: payload
    }
}
export function clearBookingFormError(field) {
    return {
        type: CLEAR_BOOK_FORM_ERROR,
        field: field
    }
}

export function clearBookingFormErrorField(field) {
    return {
        type: CLEAR_BOOK_FORM_ERROR_FIELD,
        field: field
    }
}

export function cancelBookingError(error) {
    return {
        type: CANCEL_CLIENT_BOOK_ERROR,
        error: error
    }
}
export function cancelBooking(cancel, filters) {
    return async (dispatch) => {
        try {
            dispatch(startRequest())
            const response = await axiosCustom.post(`${baseUrl}/client/booking/cancel?expand=hotel,region,hotel.region,room,tariff`, cancel)
            const { data } = response

            dispatch(getClientReservations({ expand: "hotel,region,room,tariff", sort: `-id`, ...filters }))
            dispatch(cancelBookingSuccess(data))
            return true
        } catch (e) {
            if (e.response) {
                dispatch(cancelBookingError(e.response.data))
                return false
            }
        }
    }
}

export function cancelBookingNoAuth(cancel, filters) {
    return async (dispatch) => {
        try {
            dispatch(startRequest())
            const response = await axiosCustom.post(`${baseUrl}/public/simple-booking/cancel?expand=hotel,region,hotel.region,room,tariff`, cancel)
            const { data } = response

            dispatch(getClientReservations({ expand: "hotel,region,room,tariff", sort: `-id`, ...filters }))
            dispatch(cancelBookingSuccess(data))
            return true
        } catch (e) {
            if (e.response) {
                dispatch(cancelBookingError(e.response.data))
                return false
            }
        }
    }
}

/** Отменяем бронь клиентом */
export function getBookInfoClientSuccess(id) {
    return {
        type: GET_CURRENT_BOOK_CLIENT_SUCCESS,
        payload: id
    }
}
export function getBookInfoClientError(error) {
    return {
        type: GET_CURRENT_BOOK_CLIENT_ERROR,
        error: error
    }
}
export function getBookInfoClient(id) {
    return async (dispatch) => {
        try {
            dispatch(startRequest())
            const response = await axiosCustom(`${baseUrl}/client/booking/view?id=${id}&expand=region,cancel_sub_reason_text`)
            const { data } = response

            dispatch(getBookInfoClientSuccess(data))
        } catch (e) {
            if (e.response) {
                dispatch(getBookInfoClientError(e.response.data))
            }
        }
    }
}
/** Подтвержаем бронь */
export function confirmBookSuccess(data) {
    return {
        type: CONFIRM_BOOK_SUCCESS,
        payload: data
    }
}
export function confirmBook(id, hotelId, otherParams) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.put(`${baseUrl}/partner/booking/approve?id=${id}&expand=hotel,room,tariff`)
            const { data } = response

            dispatch(getPartnerReservations({ hotel_id: hotelId, expand: "hotel,room,tariff", ...otherParams }))
            // dispatch(confirmBookSuccess(data))
        } catch (e) {
            if (e.response) {
                dispatch(getBookInfoClientError(e.response.data))
            }
        }
    }
}

/** Отменяем бронь партнером */
export function cancelBookingPartner(cancel, hotelId, otherParams) {
    return async (dispatch) => {
        try {
            dispatch(startRequest())
            const response = await axiosCustom.post(`${baseUrl}/partner/booking/cancel?expand=tariff`, cancel)
            const { data } = response

            dispatch(getPartnerReservations({ hotel_id: hotelId, expand: "hotel,room,tariff,room.roomType", ...otherParams }))
            dispatch(cancelBookingPartnerSuccess(data))
            return true
        } catch (e) {
            if (e.response) {
                dispatch(cancelBookingPartnerError(e.response.data))
            }
        }
    }
}

export function cancelBookingPartnerSuccess(data) {
    return {
        type: CANCEL_BOOKING_PARTNER_SUCCESS,
        payload: data
    }
}

export function cancelBookingPartnerError(data) {
    return {
        type: CANCEL_BOOKING_PARTNER_ERROR,
        error: data
    }
}

export function getPartnerBookingRejectReasonsSuccess(data) {
    return {
        type: GET_PARTNER_BOOKING_REJECT_REASONS,
        payload: data
    }
}

export function getPartnerBookingRejectReasonsError(data) {
    return {
        type: GET_PARTNER_BOOKING_REJECT_REASONS_ERROR,
        error: data
    }
}

/** Получаем причины отмены брони для партнера */
export function getPartnerBookingRejectReasons() {
    return async (dispatch) => {
        try {
            const response = await axiosCustom(`${baseUrl}/partner/booking/get-reject-reasons`)
            const { data } = response
            dispatch(getPartnerBookingRejectReasonsSuccess(data))
        } catch (e) {
            if (e.response) {
                getPartnerBookingRejectReasonsError(e.response.data)
            }
        }
    }
}

/** Незаезд */
export function noArrival(bookId, hotelId, otherParams) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom(`${baseUrl}/partner/booking/guest-no-show?id=${bookId}`)
            dispatch(getPartnerReservations({ hotel_id: hotelId, expand: "hotel,room,tariff", ...otherParams }))
        } catch (e) {
            if (e.response) {
            }
        }
    }
}

/** Получаем причины для отмены брони */
export function getClientCancelReasonSuccess(reasons) {
    return {
        type: GET_REASON_FOR_CANCEL_SUCCESS,
        payload: reasons
    }
}
export function getClientCancelReason() {
    return async (dispatch) => {
        try {
            const response = await axiosCustom(`${baseUrl}/client/booking/cancel-reasons`)
            const { data } = response

            return dispatch(getClientCancelReasonSuccess(data))
        } catch (e) {

        }
    }
}
/** Получаем подпричины для отмены брони */
export function getClientCancelSubReasonSuccess(reasons) {
    return {
        type: GET_SUB_REASON_FOR_CANCEL_SUCCESS,
        payload: reasons
    }
}
export function getClientCancelSubReason() {
    return async (dispatch) => {
        try {
            const response = await axiosCustom(`${baseUrl}/client/booking/cancel-sub-reasons`)
            const { data } = response

            return dispatch(getClientCancelSubReasonSuccess(data))
        } catch (e) {

        }
    }
}
export function getClientCalcPenaltySuccess(reasons) {
    return {
        type: GET_CLIENT_CALC_PENALTY,
        payload: reasons
    }
}
export function getClientCalcPenalty(id) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom(`${baseUrl}/client/booking/calc-penalty?id=${id}`)
            const { data } = response

            return dispatch(getClientCalcPenaltySuccess(data.penaltyAmount))
        } catch (e) {

        }
    }
}

export function getClientCalcPenaltyNoAuth(token, id) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.get(`${baseUrl}/public/simple-booking/calc-penalty?id=${id}`, {token_view:token})
            const { data } = response

            return dispatch(getClientCalcPenaltySuccess(data.penaltyAmount))
        } catch (e) {

        }
    }
}

/** Получаем список броней в архивированых отелях */
export function getBookingArchiveHotelsSuccess(count) {
    return {
        type: GET_COUNT_ARCHIVE_BOOKING,
        payload: count
    }
}
export function getBookingArchiveHotels() {
    return async (dispatch) => {
        try {
            const response = await axiosCustom(`${baseUrl}/partner/booking/count-active-bookings`)
            const { data } = response

            dispatch(getBookingArchiveHotelsSuccess(data))
        } catch (e) {

        }
    }
}
/** Получаем список броней в архивированых отелях */
export function getCountActiveBookingActiveSuccess(count) {
    return {
        type: GET_COUNT_ACTIVE_BOOKING,
        payload: count
    }
}
export function getCountActiveBooking() {
    return async (dispatch) => {
        try {
            const response = await axiosCustom(`${baseUrl}/partner/booking/count-all-active-bookings`)
            const { data } = response

            dispatch(getCountActiveBookingActiveSuccess(data))
        } catch (e) {

        }
    }
}