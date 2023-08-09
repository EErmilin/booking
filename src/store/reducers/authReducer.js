import {
    AUTH_SUCCESS, CHANGE_USER_AVATAR_SUCCESS,
    CLEAR_FIELD_ERROR, GET_INFO_ERROR,
    GET_INFO_SUCCESS, LOGOUT_SUCCESS,
    REGISTER_ERROR,
    SET_FIELD_ERROR,
    CHECK_EMAIL_SECCESS,
    SAVE_RECOVERY_TOKEN, DELETE_RECOVERY_TOKEN,
    SHOW_AUTH_MODAL,
    CLEAR_ERRORS,
    SET_USER_TYPE, CHECK_FIRST_BOOKING
} from "../actions/actionsType";


const initialValues = {
    isAuth: localStorage.getItem('token') && localStorage.getItem('refreshToken'),
    userInfo: {
        avatar: '',
        first_name: "",
        middle_name: "",
        email: "",
        last_name: "",
        company_name: "",
        company_type: Number,
        inn: "",
        kpp: "",
        phone: "",
        dob: "",
        country: "",
        gender: Number,
        user_type: +localStorage.getItem('userType'),
        firstBookingCompleted: false
    },
    avatar: '',
    errors: {},
    isCheckEmail: false,
    isShowAuthModal: false,
    isAunthModalComment: false,
    isAunthModalFavorite: false,
}

export function authReducer(state = initialValues, action) {
    switch (action.type) {
        case SHOW_AUTH_MODAL: {
            return {
                ...state,
                isShowAuthModal: action.isShowAuthModal,
                isAunthModalComment: action.isAunthModalComment,
                isAunthModalFavorite: action.isAunthModalFavorite
            }
        }
        case LOGOUT_SUCCESS: {
            return {
                ...state,
                isAuth: false,
                userInfo: initialValues.userInfo,
                avatar: '',
                errors: {}
            }
        }
        case CHECK_EMAIL_SECCESS: {
            return {
                ...state,
                isCheckEmail: true
            }
        }
        case GET_INFO_SUCCESS: {
            const userInfo = {
                ...state.userInfo,
                avatar: action.payload.avatar,
                first_name: action.payload.first_name,
                middle_name: action.payload.middle_name,
                last_name: action.payload.last_name,
                company_name: action.payload.company_name,
                email: action.payload.email,
                company_type: action.payload.company_type,
                inn: action.payload.inn,
                kpp: action.payload.kpp,
                phone: action.payload.phone,
                dob: action.payload.dob,
                country: action.payload.country,
                gender: action.payload.gender,

            }
            if (action.payload.sailplay) {
                Object.assign(userInfo, { sailplay: action.payload.sailplay })
            }
            return {
                ...state,
                userInfo,
                errors: {}
            }
        }
        case CLEAR_ERRORS: {
            return {
                ...state,
                errors: {}
            }
        }
        case SAVE_RECOVERY_TOKEN: {
            return {
                ...state,
                recoveryToken: action.payload.recoveryToken,
                uuid: action.payload.uuid
            }
        }
        case DELETE_RECOVERY_TOKEN: {
            return {
                ...state,
                recoveryToken: null,
                uuid: null
            }
        }
        case AUTH_SUCCESS: {
            return {
                ...state,
                userInfo: action.payload,
                isAuth: true,
                errors: {}
            }
        }
        case REGISTER_ERROR: {
            let errorObj = {}
            action.error.length ? action.error.forEach((elem) => {
                errorObj[elem.field] = elem.message
            }) : errorObj = { phone: action.error.message }
            return {
                ...state,
                errors: errorObj
            }
        }
        case SET_FIELD_ERROR: {
            return {
                ...state,
                errors: { ...state.errors, [action.error.field]: action.error.message }
            }
        }
        case CLEAR_FIELD_ERROR: {
            let errorsObj = { ...state.errors }
            delete errorsObj[action.field]
            return {
                ...state,
                errors: errorsObj
            }
        }
        case GET_INFO_ERROR: {
            return {
                ...state,
                isAuth: false
            }
        }
        case CHANGE_USER_AVATAR_SUCCESS: {
            return {
                ...state,
                userInfo: {
                    ...state.userInfo,
                    avatar: action.payload[2]
                }
            }
        }
        case SET_USER_TYPE: {
            return {
                ...state,
                userInfo: {
                    ...state.userInfo,
                    user_type: action.user_type
                }
            }
        }
        case CHECK_FIRST_BOOKING: {
            const userInfo = {
                ...state.userInfo,
                firstBookingCompleted: action.payload.success
            }
            return {
                ...state,
                userInfo
            }
        }
        default: return state
    }
}