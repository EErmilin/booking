import {
    CANCEL_BOOKING_PARTNER_ERROR,
    CANCEL_CLIENT_BOOK_ERROR,
    CANCEL_CLIENT_BOOK_SUCCESS,
    CLEAR_BOOK_FORM_ERROR,
    CLEAR_ERROR_BOOKING,
    CONFIRM_BOOK_SUCCESS,
    CREATE_BOOK_ERROR,
    CREATE_BOOK_SUCCESS,
    GET_BOOKINGS_CLIENT_SUCCESS,
    GET_CLIENT_CALC_PENALTY, GET_COUNT_ACTIVE_BOOKING, GET_COUNT_ARCHIVE_BOOKING,
    GET_CURRENT_BOOK_CLIENT_SUCCESS,
    GET_HOTEL_FOR_BOOK_SUCCESS,
    GET_HOTEL_STATS_SUCCESS,
    GET_PARTNER_BOOKING_REJECT_REASONS,
    GET_REASON_FOR_CANCEL_SUCCESS,
    GET_ROOM_FOR_BOOK_SUCCESS,
    GET_SUB_REASON_FOR_CANCEL_SUCCESS,
    LOCK_ERROR,
    LOCK_SUCCESS,
    CLEAR_BOOK_FORM_ERROR_FIELD
} from "../actions/actionsType";

const initialState = {
    hotelInfo:{},
    roomInfo:{},
    reservation:null,
    reservationInfo:{},
    isLock:null,
    lockInfo:{},
    lockStatus:null,
    stats:null,
    errors:{},
    total:null,
    limit:25,
    reasons:[],
    subReasons:[],
    partnerRejectReasons:[],
    calcPenalty:null,
    errorsForm:{},
    statusLength:{
        newCount:0,
        approvedCount:0,
        cancelledCount:0,
        completedCount:0,
        rejectedCount:0,
        waitingForPaymentCount:0
    },
    countBooking:0,
    countActiveBook:0
}

export function bookingReducer (state=initialState,action){
    switch (action.type){
        case GET_HOTEL_FOR_BOOK_SUCCESS:{
            return {
                ...state,
                hotelInfo: action.payload
            }
        }
        case CREATE_BOOK_ERROR:{
            if(action.error.status === 409){
                return{
                    ...state,
                    errors: action.error
                }
            }
            let errorObj = {}
            action.error.forEach((elem)=>{
                errorObj[elem.field]=elem.message
            })
            return {
                ...state,
                errors: errorObj
            }
        }
        case GET_ROOM_FOR_BOOK_SUCCESS:{
            return {
                ...state,
                roomInfo: action.payload
            }
        }
        case GET_BOOKINGS_CLIENT_SUCCESS:{
            return {
                ...state,
                reservation: action.payload.items,
                total:action.payload._meta.totalCount,
                limit: action.payload._meta.perPage,
                statusLength: {
                    ...action.payload._meta
                }
            }
        }
        case CANCEL_CLIENT_BOOK_SUCCESS:{
            const id = state.reservation?state.reservation.indexOf(elem=>elem.id==action.payload.id):null
            let listReservations = id?[...state.reservation]:[]
            listReservations.splice(id,1,action.payload)
            return {
                ...state,
                reservation: id?listReservations:null,
                reservationInfo: action.payload
            }
        }
        case GET_CURRENT_BOOK_CLIENT_SUCCESS:{
            return {
                ...state,
                reservationInfo: action.payload
            }
        }
        case GET_HOTEL_STATS_SUCCESS:{
            return {
                ...state,
                stats: action.payload
            }
        }
        case CONFIRM_BOOK_SUCCESS:{
            const id = state.reservation?state.reservation.indexOf(elem=>elem.id==action.payload.id):null
            let listReservations = id?[...state.reservation]:[]
            listReservations.splice(id,1,action.payload)
            return {
                ...state,
                reservation: id?listReservations:null,
                reservationInfo: action.payload
            }
        }
        case CREATE_BOOK_SUCCESS:{
            let arr = state.reservation?[...state.reservation,action.payload]:[action.payload]
            return {
                ...state,
                reservation: arr,
                errors: {}
            }
        }
        case LOCK_SUCCESS:{
            return {
                ...state,
                isLock: true,
                lockInfo: action.payload,
            }
        }
        case LOCK_ERROR:{
            return {
                ...state,
                lockStatus:action.error.status
            }
        }
        case GET_REASON_FOR_CANCEL_SUCCESS:{
            return {
                ...state,
                reasons:action.payload
            }
        }
        case GET_SUB_REASON_FOR_CANCEL_SUCCESS:{
            return {
                ...state,
                subReasons:action.payload
            }
        }
        case GET_CLIENT_CALC_PENALTY:{
            return {
                ...state,
                calcPenalty:action.payload
            }
        }
        case GET_PARTNER_BOOKING_REJECT_REASONS: {
            return {
                ...state,
                partnerRejectReasons: action.payload
            }
        }
        case CLEAR_ERROR_BOOKING:{
            return {
                ...state,
                errors: {}
            }
        }
        case CANCEL_CLIENT_BOOK_ERROR:{
            let errorObj = {}
            action.error.length ? action.error.forEach((elem) => {
                errorObj[elem.field] = elem.message
            }) : errorObj = { phone: action.error.message }
            return {
                ...state,
                errorsForm: errorObj
            }
        }
        case CANCEL_BOOKING_PARTNER_ERROR: {
            const errorObj = {}

            action.error.forEach(elem => {
                errorObj[elem.field] = elem.message
            })

            return  {
                ...state,
                errorsForm: errorObj
            }
        }
        case CLEAR_BOOK_FORM_ERROR:{
            return {
                ...state,
                errorsForm: {}
            }
        }
        case CLEAR_BOOK_FORM_ERROR_FIELD:{
            let errorsObj = {...state.errors}
            delete errorsObj[action.field]
            return {
                ...state,
                errors: errorsObj
            }
        }
        case GET_COUNT_ARCHIVE_BOOKING:{
            return {
                ...state,
                countBooking: action.payload
            }
        }
        case GET_COUNT_ACTIVE_BOOKING:{
            return {
                ...state,
                countActiveBook: action.payload
            }
        }
        default :{
            return state
        }
    }
}
