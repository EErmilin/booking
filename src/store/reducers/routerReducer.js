import {
    GET_HOTELS_REQUEST,
    GET_HOTELS_SUCCESS,
    START_REQUEST,
    GET_OBJECTS_ERROR,
    CANCEL_CLIENT_BOOK_SUCCESS,
    GET_BOOKINGS_CLIENT_SUCCESS,
    GET_OBJECTS_SUCCESS,
    CANCEL_BOOKING_PARTNER_SUCCESS,
    GET_REVIEWS_CLIENT_SUCCESS,
    GET_NOTIFICATION_PARTNER_SUCCESS,
    GET_OBJECTS_FOR_DOCUMENTS_SECCESS,
    GET_CURRENT_BOOK_CLIENT_SUCCESS,
    HOTEL_CREATE_ERROR, HOTEL_CREATE_SUCCESS, HOTEL_TRAVELLINE_ERROR
} from "../actions/actionsType";

const initialState = {
    preloaderVisible: false,
    progressVisible: false,
}



export default function routerReducer(state = initialState, action) {
    switch (action.type) {
        case START_REQUEST:
            return {
                ...state,
                progressVisible: true,
            }
        case GET_HOTELS_REQUEST:
            return {
                ...state,
                preloaderVisible: true,
            }
        case GET_CURRENT_BOOK_CLIENT_SUCCESS:
        case CANCEL_BOOKING_PARTNER_SUCCESS:
        case GET_NOTIFICATION_PARTNER_SUCCESS:
        case GET_OBJECTS_FOR_DOCUMENTS_SECCESS:
        case GET_OBJECTS_ERROR:
        case GET_OBJECTS_SUCCESS:
        case GET_REVIEWS_CLIENT_SUCCESS:
        case GET_BOOKINGS_CLIENT_SUCCESS:
        case CANCEL_CLIENT_BOOK_SUCCESS:
        case HOTEL_CREATE_ERROR:
        case HOTEL_CREATE_SUCCESS:
        case GET_HOTELS_SUCCESS:
        case HOTEL_TRAVELLINE_ERROR:
            return {
                ...state,
                preloaderVisible: false,
                progressVisible: false,
            }
        default: {
            return state
        }
    }
}