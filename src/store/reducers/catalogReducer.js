import {
    GET_HOTEL_ERROR,
    CLEAR_HOTELS,
    GET_HOTELS_SUCCESS,
    SET_CITY,
    GET_HOTEL_SUCCESS,
    SAVE_TARRIFF,
    CLEAR_HOTEL_ERROR,
    SET_POPULAR,
    GET_SIMILAR_SUCCESS, GET_SIMILAR_REQUEST,
    CLEAR_HOTEL,
    CLEAR_SIMILAR_HOTELS,
    SET_COORDINATES,
    CLEAR_COORDINATES,
    GET_TYPE_HOTELS,
    GET_COMMENTS_MODAL,
    GET_COMMENTS_ROOM,
    GET_MAP_HOTELS, 
    GET_CATALOG_FILTERS, GET_SIGHTS_FILTERS, CLEAR_CITY, GET_SUBWAY_FILTERS, CLEAR_SUBWAY_FILTERS, GET_POPULAR_FILTERS
} from "../actions/actionsType";

const initialState = {
    lastRequests: [],
    mapHotels: [],
    hotels: [],
    hotel: null,
    hotelComments: [],
    rooms: {},
    city: '',
    coordinates: null,
    popular: [],
    similar: [],
    _meta: null,
    errors: false,
    typeHotels:[],
    hotelCommentsModal:null,
    hotelCommentsModalTotal:null,
    filters: {},
    allFilters:[],
    sightsFilters:[],
    subwayFilters:[],
    popularFilters:[],
    isLoadingSimilar: false,
}



export default function catalogReducer(state = initialState, action) {
    switch (action.type) {
        case GET_COMMENTS_ROOM:{
            return {
                ...state,
                hotelComments: action.payload
            }
        }
        case GET_COMMENTS_MODAL:{
            return {
                ...state,
                hotelCommentsModal: action.payload.items,
                hotelCommentsModalTotal: action.payload._meta.totalCount
            }
        }
        case CLEAR_HOTEL_ERROR: {
            return {
                ...state,
                errors: false,
            }
        }
        case GET_HOTEL_ERROR: {
            return {
                ...state,
                errors: action.errors,
            }
        }
        case GET_MAP_HOTELS: {
            return {
                ...state,
                mapHotels: action.mapHotels,
            }
        }
        case CLEAR_COORDINATES: {
            return {
                ...state,
                coordinates: null,
            }
        }
        case SET_COORDINATES: {
            return {
                ...state,
                coordinates: action.coordinates,
            }
        }
        case GET_HOTELS_SUCCESS: {
            return {
                ...state,
                hotels: action.hotels,
                _meta: action._meta,
            }
        }
        case CLEAR_HOTEL: {
            return {
                ...state,
                hotel: null
            }
        }
        case CLEAR_HOTELS: {
            return {
                ...state,
                hotels: []
            }
        }
        case CLEAR_SIMILAR_HOTELS: {
            return {
                ...state,
                similar: [],
            }
        }
        case SAVE_TARRIFF: {
            let newHotel = state.hotel;
            newHotel.rooms = action.tariff
            return {
                ...state,
                hotel: newHotel
            }
        }
        case SET_CITY: {
            return {
                ...state,
                city: action.city
            }
        }
        case CLEAR_CITY: {
            return {
                ...state,
                city: ""
            }
        }
        case GET_SIMILAR_REQUEST:{
            return {
                ...state,
                isLoadingSimilar: true,
            }
        }
        case GET_SIMILAR_SUCCESS: {
            return {
                ...state,
                similar: action.hotels,
                isLoadingSimilar: false,
            }
        }
        case SET_POPULAR: {
            return {
                ...state,
                popular: action.hotels
            }
        }
        case GET_HOTEL_SUCCESS: {
            return {
                ...state,
                hotel: action.hotel,
                hotelComments: action.hotelComments
            }
        }
        case GET_TYPE_HOTELS: {
            return {
                ...state,
                typeHotels: action.payload
            }
        }
        case GET_CATALOG_FILTERS:{
            return {
                ...state,
                allFilters: action.payload
            }
        }
        case GET_SIGHTS_FILTERS:{
            return {
                ...state,
                sightsFilters:action.payload
            }
        }
        case GET_SUBWAY_FILTERS:{
            return {
                ...state,
                subwayFilters: action.payload
            }
        }
        case CLEAR_SUBWAY_FILTERS:{
            return {
                ...state,
                subwayFilters: []
            }
        }
        case GET_POPULAR_FILTERS:{
            return {
                ...state,
                popularFilters: action.payload
            }
        }
        default: {
            return state
        }
    }
}