import {
    GET_DIRECTIONS,
    GET_DIRECTIONS_INFO,
    GET_PARTNERS,
    GET_PARTNERS_PAGE_INFO,
    GET_DIRECTIONS_PAGE_TITLE, GET_IMAGES_MAIN
} from "../actions/actionsType";


const initialValues = {
    pageTitle: {
        sub_title: { ru: 'Тысячи объектов уже ждут Вас' },
        title: { ru: 'Путешествуйте по России с нами' }
    },
    info: {},
    directions: [],
    directionsInfo: [],
    partners: [],
    errors: {},
    images:[],
}

export function directionsReducer(state = initialValues, action) {
    switch (action.type) {
        case GET_DIRECTIONS_PAGE_TITLE: {
            return {
                ...state,
                pageTitle: action.pageTitle,
            }
        }
        case GET_IMAGES_MAIN:{
            return {
                ...state,
                images: action.payload
            }
        }
        case GET_DIRECTIONS: {
            return {
                ...state,
                directions: action.directions,
            }
        }
        case GET_DIRECTIONS_INFO: {
            return {
                ...state,
                directionsInfo: action.directionsInfo,
            }
        }
        case GET_PARTNERS: {
            return {
                ...state,
                partners: action.partners,
            }
        }
        case GET_PARTNERS_PAGE_INFO: {
            return {
                ...state,
                info: action.info,
            }
        }
        default: return state
    }
}