import {
    CLEAR_HOTEL_INFO,
    CLEAR_FIELD_HOTEL_ERROR,
    CLEAR_ROOM_INFO,
    CLEAR_SERVICES,
    CREATE_TARIFF_SUCCESS,
    DELETE_BED_SUCCESS,
    DELETE_HOTEL_ERROR_IMAGE,
    DELETE_HOTEL_IMAGE_SUCCESS,
    DELETE_HOTEL_SUCCESS,
    DELETE_ROOM_IMAGE_SUCCESS,
    DELETE_ROOM_SUCCESS,
    DELETE_TARIFF_SUCCESS,
    EDIT_HOTEL_ROOM_SUCCESS,
    EDIT_ROOM_TARIFF_SUCCESS,
    GET_HOTEL_INFO_SUCCESS,
    GET_LIST_TARIFF_SUCCESS,
    GET_OBJECTS_ERROR,
    GET_OBJECTS_SUCCESS,
    GET_ROOM_INFO_SUCCESS,
    GET_ROOMS_LIST_PARTNER_SUCCESS,
    GET_SERVICE_ROOM_SUCCESS,
    HOTEL_CREATE_ERROR,
    HOTEL_CREATE_SUCCESS,
    HOTEL_ROOM_CREATE_ERROR,
    HOTEL_ROOM_CREATE_SUCCESS,
    LOGOUT_SUCCESS,
    REVOKE_HOTEL_SUCCESS,
    REVOKE_HOTEL_ERROR,
    UPLOAD_HOTEL_IMAGE_ERROR,
    UPLOAD_HOTEL_IMAGE_SUCCESS,
    UPLOAD_ROOM_IMAGE_SUCCESS,
    CLEAR_ERRORS,
    CLEAR_HOTEL_ALL_ERROR,
    SAVE_MAIN_IMAGE_SUCCESS,
    HOTEL_TRAVELLINE_ERROR,
    GET_REPORTS_SUCCESS,
    GET_REPORT_SUCCESS,
    GET_BED_TYPES,
    GET_REQUISITES_SECCESS,
    GET_REQUISITES_ERROR,
    CHANGE_HOTEL_AMENITY,
    ARCHIVE_HOTEL_SUCCESS,
    GET_ARCHIVE_HOTELS,
    RESTORE_ARCHIVE_HOTEL,
    GET_OBJECTS_FOR_DOCUMENTS_SECCESS,
    SET_PAYMENT_TYPE_SUCCESS,
    CLEAR_HOTEL_IMAGE, GET_MEAL_TYPE,

} from "../actions/actionsType";

const initialValues = {
    registerObjects: [
        {
            name: 'Отель «Capa Gama»',
            location: 'Старообрядядческая ул, 12, Москва',
            type: 'Объект',
            rating: 4,
            status: 'placed'
        },
        {
            name: 'Отель «Capa Gama»',
            location: 'Старообрядядческая ул, 12, Москва',
            type: 'Объект',
            rating: 4,
            status: 'canceled'
        }
    ],
    hotels:[],
    rooms:[],
    tariff:null,
    beds:[],
    bedTypes: [],
    roomsInfo:{},
    hotelInfo:{},
    amenity:[],
    errors:{},
    travellineError:null,
    errorsImage:[],
    total:null,
    limit:25,
    reports: [],
    report: [],
    requisites: [],
    archiveHotels:[],
    archiveLimit:25,
    archiveTotal:null,
    hotelsForDocuments: [],
    mealType:[]
}

export function objectsReducer(state = initialValues, action) {
    switch (action.type) {
        case SET_PAYMENT_TYPE_SUCCESS:{
            let arr = [...state.hotels]
            let index = state.hotels.findIndex(elem=>elem.id==action.payload.id)
            arr.splice(index,1,action.payload)

            return {
                ...state,
                hotels: [].concat(arr)
            }
        }
        case GET_MEAL_TYPE:{
            return {
                ...state,
                mealType: action.payload
            }
        }
        case GET_REQUISITES_ERROR:{
            return {
                ...state,
                errors: action.errors
            }
        }
        case GET_REPORT_SUCCESS:{
            return {
                ...state,
                report: action.payload
            }
        }
        case GET_REQUISITES_SECCESS:{
            return {
                ...state,
                requisites: action.payload
            }
        }
        case GET_REPORTS_SUCCESS:{
            return {
                ...state,
                reports: action.payload
            }
        }
        case GET_ROOM_INFO_SUCCESS:{
            return {
                ...state,
                roomsInfo: action.payload
            }
        }
        case CLEAR_SERVICES:{
            return {
                ...state,
                amenity: []
            }
        }
        case GET_HOTEL_INFO_SUCCESS:{
            return {
                ...state,
                hotelInfo: action.payload
            }
        }
        case CLEAR_HOTEL_INFO:{
            return {
                ...state,
                hotelInfo: {}
            }
        }
        case CLEAR_HOTEL_IMAGE:{
            return {
                ...state,
                hotelInfo:{
                    ...state.hotelInfo,
                    images:[]
                }
            }
        }
        case GET_OBJECTS_SUCCESS:{
            return {
                ...state,
                hotels: action.payload.items,
                total:action.payload._meta.totalCount,
                limit: action.payload._meta.perPage
            }
        }
        case GET_OBJECTS_FOR_DOCUMENTS_SECCESS:{
            return {
                ...state,
                hotelsForDocuments: action.payload.items.filter(hotel => !!hotel.requisites_id)
            }
        }
        case REVOKE_HOTEL_SUCCESS:{
            let indexHotel = state.hotels.findIndex(elem=>action.payload.id==elem.id)
            let arrHotels = [...state.hotels]
            if(arrHotels.length){
                arrHotels.splice(indexHotel,1,action.payload)
            }
            return {
                ...state,
                hotels: [...arrHotels],
                errors: {}
            }
        }
        case REVOKE_HOTEL_ERROR: {
            const errorObj = {}

            action.error.forEach((elem)=>{
                errorObj[elem.field]=elem.message
            })

            return {
                ...state,
                errors: errorObj
            }
        }
        case HOTEL_CREATE_SUCCESS:{
            return {
                ...state,
                hotelInfo: action.payload,
            }
        }
        case HOTEL_CREATE_ERROR:{
            let errorObj = {}
            action.error.forEach((elem)=>{
                errorObj[elem.field]=elem.message
            })
            return {
                ...state,
                errors: errorObj
            }
        }
        case CLEAR_HOTEL_ALL_ERROR :{
            return {
                ...state,
                travellineError: null,
                errors: {}
            }
        }
        case CLEAR_FIELD_HOTEL_ERROR :{
            let errorsObj = {...state.errors}
            delete errorsObj[action.field]
            return {
                ...state,
                errors: errorsObj
            }
        }
        case GET_ROOMS_LIST_PARTNER_SUCCESS:{
            return {
                ...state,
                rooms: action.payload
            }
        }
        case GET_SERVICE_ROOM_SUCCESS:{
            return {
                ...state,
                amenity: action.payload
            }
        }
        case HOTEL_ROOM_CREATE_SUCCESS:{
            return {
                ...state,
                rooms: [...state.rooms,action.payload],
                errors: {},
                roomsInfo: {
                    ...action.payload,
                    images: []
                }
            }
        }
        case EDIT_HOTEL_ROOM_SUCCESS:{
            let indexRoom = state.rooms.findIndex(elem=>action.payload.id==elem.id)
            let arrRooms = [...state.rooms]
            if(arrRooms.length){
                arrRooms.splice(indexRoom,1,action.payload)
            }
            return {
                ...state,
                rooms: [...arrRooms],
                errors: {}
            }
        }
        case CREATE_TARIFF_SUCCESS:{
            return {
                ...state,
                tariff: [...state.tariff,action.payload]
            }
        }
        case HOTEL_ROOM_CREATE_ERROR:{
            let errorObj = {}
            action.error.forEach((elem)=>{
                errorObj[elem.field]=elem.message
            })
            return {
                ...state,
                errors: errorObj
            }
        }
        case DELETE_ROOM_SUCCESS:{
            return {
                ...state,
                rooms: state.rooms.filter(elem=>elem.id!==action.payload)
            }
        }
        case DELETE_HOTEL_SUCCESS:{
            return {
                ...state,
                hotels: state.hotels.filter(elem=>elem.id!==action.payload)
            }
        }
        case UPLOAD_HOTEL_IMAGE_SUCCESS:{
            return {
                ...state,
                hotelInfo: {
                    ...state.hotelInfo,
                    images:[...state.hotelInfo.images,action.payload]
                }
            }
        }
        case UPLOAD_HOTEL_IMAGE_ERROR:{
            return {
                ...state,
                hotelInfo: {
                    ...state.hotelInfo,
                    images:state.hotelInfo.images?[...state.hotelInfo.images,action.error]:[action.error]
                },
                errorsImage:[...state.errorsImage,state.errorsImage.find(elem=>elem.id==action.error.id)?null:action.error].filter(elem=>elem)
            }
        }
        case DELETE_HOTEL_ERROR_IMAGE:{
            return {
                ...state,
                hotelInfo: {
                    ...state.hotelInfo,
                    images:state.hotelInfo.images && state.hotelInfo.images.filter(elem=>elem.id!==action.payload)
                },
                errorsImage: state.errorsImage.filter(elem=>elem.id!==action.payload)
            }
        }
        case DELETE_HOTEL_IMAGE_SUCCESS:{
            return {
                ...state,
                hotelInfo: {
                    ...state.hotelInfo,
                    images:state.hotelInfo.images.filter(elem=>elem!==action.payload)
                }
            }
        }
        case UPLOAD_ROOM_IMAGE_SUCCESS:{
            return {
                ...state,
                roomsInfo: {
                    ...state.roomsInfo,
                    images:state.roomsInfo.images?[...state.roomsInfo.images,action.payload]:[action.payload]
                }
            }
        }
        case DELETE_ROOM_IMAGE_SUCCESS:{
            return {
                ...state,
                roomsInfo: {
                    ...state.roomsInfo,
                    images:state.roomsInfo.images.filter(elem=>elem!==action.payload.url)
                }

            }
        }
        case GET_LIST_TARIFF_SUCCESS:{
            return {
                ...state,
                tariff: action.payload
            }
        }
        case EDIT_ROOM_TARIFF_SUCCESS:{
            let indexTariff = state.tariff.findIndex(elem=>action.payload.id==elem.id)
            let arrTariff = [...state.tariff]
            if(arrTariff.length){
                arrTariff.splice(indexTariff,1,action.payload)
            }
            return {
                ...state,
                tariff: arrTariff
            }
        }
        case DELETE_TARIFF_SUCCESS:{
            return {
                ...state,
                tariff: state.tariff.filter(elem=>elem.id!==action.payload)
            }
        }
        case CLEAR_ROOM_INFO:{
            return {
                ...state,
                roomsInfo: {},
                errors: {},
                errorsImage: []
            }

        }

        case CLEAR_ERRORS:{
            return {
                ...state,
                errors: {},
            }

        }
        case SAVE_MAIN_IMAGE_SUCCESS:{
            return {
                ...state,
                hotelInfo: {
                    ...state.hotelInfo,
                    main_image:action.payload.main_image
                },
            }
        }
        // case DELETE_BED_SUCCESS:{
        //     return {
        //         ...state,
        //         roomsInfo: {
        //             ...state,
        //             beds:state.roomsInfo.beds.filter(elem=>elem.id!==action.payload)
        //         }
        //     }
        // }
        case GET_BED_TYPES: {
            return {
                ...state,
                bedTypes: action.payload
            }
        }
        case LOGOUT_SUCCESS: return initialValues
        case HOTEL_TRAVELLINE_ERROR:{
            return {
                ...state,
                travellineError: action.error
            }
        }
        case CHANGE_HOTEL_AMENITY:{
            let index = state.hotels.findIndex((elem)=>elem.id==action.payload.id)
            state.hotels[index].amenity_ids = action.payload.amenity_ids
            return {
                ...state
            }
        }
        case ARCHIVE_HOTEL_SUCCESS:{
            return {
                ...state,
                hotels:state.hotels.filter(elem=>elem.id !== action.payload.id)
            }
        }
        case GET_ARCHIVE_HOTELS:{
            return {
                ...state,
                archiveHotels: action.payload.items,
                archiveTotal:action.payload._meta.totalCount,
                archiveLimit: action.payload._meta.perPage
            }
        }
        case RESTORE_ARCHIVE_HOTEL:{
            return {
                ...state,
                archiveHotels:state.archiveHotels.filter(elem=>elem.id !== action.payload)
            }

        }
        default: return state
    }
}