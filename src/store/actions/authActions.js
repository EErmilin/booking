import axiosCustom from "../../axios/axiosCustom";
import {
    AUTH_SUCCESS, CHANGE_USER_AVATAR_SUCCESS,
    CLEAR_FIELD_ERROR, GET_INFO_ERROR,
    GET_INFO_SUCCESS, LOGOUT_SUCCESS,
    REGISTER_ERROR,
    REGISTER_SUCCESS,
    SET_FIELD_ERROR,
    CHECK_EMAIL_SECCESS,
    SAVE_RECOVERY_TOKEN,
    DELETE_RECOVERY_TOKEN,
    SHOW_AUTH_MODAL,
    SET_USER_TYPE, CHECK_FIRST_BOOKING
} from "./actionsType";
import parseJwt from "../../functions/parseJWT";



const baseUrl = "/user"
const baseUrlClient = `${process.env.REACT_APP_CLIENT_ENDPOINT}/user`
const baseUrlPartner = process.env.REACT_APP_PARTNER_ENDPOINT
const baseURLBackend = process.env.REACT_APP_BACKEND_ENDPOINT


/** Выход из аккаунта*/
export function logOutPartner() {
    localStorage.setItem('exp', '');
    localStorage.setItem('refreshToken', '');
    localStorage.setItem("token", '')
    axiosCustom.defaults.headers.common.Authorization = null;
    return {
        type: LOGOUT_SUCCESS
    }
}

/** Метод провальной авторизации */
export function authError(error) {

}
/** Метод успешной авторизации */
export function authSuccess(response, user) {
    /**
     * Добавляем заголовок для приватных запросов
     * @type {string}
     */

    // axiosCustom.defaults.headers.common.Authorization = `Bearer ${response.token}`;

    /**
     * Расшифровываем access_token и формируем объект с нужными данными
     */
    const data = parseJwt(response.token);


    /** Токен который пойдет в рефреш */
    localStorage.setItem('refreshToken', response.refreshToken);
    /** Токен для запросов */
    localStorage.setItem('token', response.token)
    localStorage.setItem('userType', data.type_id);
    let info = {}
    if (user) {
        info = {
            avatar: data.avatar,
            avatar_sizes: data.avatar_sizes,
            country: data.country,
            created_at: data.created_at,
            dob: data.dob,
            email: data.email,
            first_name: data.first_name,
            gender: data.gender,
            id: data.id,
            last_name: data.last_name,
            phone: data.phone,
            user_type: data.type_id,
            refreshToken: response.refreshToken
        }
    } else {
        info = {
            company_name: data.company_name,
            company_type: data.company_type,
            created_at: data.created_at,
            email: data.email,
            first_name: data.first_name,
            id: data.id,
            inn: data.inn,
            kpp: data.kpp,
            last_name: data.last_name,
            phone: data.phone,
            updated_at: data.updated_at,
            user_type: data.type_id,
            refreshToken: response.refreshToken
        };
    }

    return {
        type: AUTH_SUCCESS,
        payload: info,
    };
}

export function showAuthModal(isShowAuthModal, isAunthModalComment, isAunthModalFavorite) {
    return {
        type: SHOW_AUTH_MODAL,
        isShowAuthModal: isShowAuthModal,
        isAunthModalComment: isAunthModalComment,
        isAunthModalFavorite: isAunthModalFavorite,
    }
}

/** Регистрация партнера успешна или нет */
export function registerPartnerSuccess(user) {
    return {
        type: REGISTER_SUCCESS,
        payload: user
    }
}

export function registerPartnerError(error) {
    return {
        type: REGISTER_ERROR,
        error: error
    }
}

export function setUserType(type) {
    return {
        type: SET_USER_TYPE,
        user_type: type
    }
}


export function checkEmail(userObject) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.post(`${baseUrlPartner}/service/invite-partner/check-email`, userObject)
            const { data } = response
            dispatch({ type: CHECK_EMAIL_SECCESS })
        } catch (e) {
            dispatch(registerPartnerError(e.response.data))
        }
    }
}

export function simpleRegister(userObject) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.post(`${baseUrlPartner}/service/invite-partner/password`, userObject)
            const { data } = response

            dispatch(authSuccess(data))
            dispatch(getInfo())
            return true
        } catch (e) {
            dispatch(registerPartnerError(e.response.data))
        }
    }
}
export function checkNewEmail(userObject) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.post(`${baseUrlPartner}/service/invite-partner/check-new-email`, userObject)
            const { data } = response
            dispatch({ type: CHECK_EMAIL_SECCESS })
        } catch (e) {
            dispatch(registerPartnerError(e.response.data))
        }
    }
}
export function registerByInviteLink(userObject) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.post(`${baseUrlPartner}/service/invite-partner/register-by-invite-link`, userObject)
            const { data } = response

            dispatch(authSuccess(data))
            dispatch(getInfo())
            return true
        } catch (e) {
            dispatch(registerPartnerError(e.response.data))
        }
    }
}
/** Метод регистрация клиента */
export function registerClient(userObject) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.post(`${baseUrlClient}/request-registration-code`, userObject)
            const { data } = response
            return data
        } catch (e) {
            if (e.response.data.errorCode === 'shortBan') {
                return e.response.data
            }
            dispatch(registerPartnerError(e.response.data.error))
        }
    }
}
/** Метод регистрация партнера */
export function registerPartner(userObject) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.post(`${baseUrl}/request-registration-code`, userObject)
            const { data } = response

            return data
        } catch (e) {
            if (e.response.data.errorCode === 'shortBan') {
                return e.response.data
            }
            dispatch(registerPartnerError(e.response.data.error))
            return false
        }
    }
}
/** Метод регистрация партнёра */
export function registerPartnerBySms(userObject) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.post(`${baseUrl}/register-by-sms`, userObject)
            const { data } = response
            dispatch(authSuccess(data))
            dispatch(getInfo())
            return true
        } catch (e) {
            dispatch(registerPartnerError(e.response.data))
        }
    }
}

/** Метод регистрация клиента */
export function registerClientBySms(userObject) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.post(`${baseUrlClient}/register-by-sms`, userObject)
            const { data } = response
            dispatch(authSuccess(data))
            dispatch(getInfoClient())
            return true
        } catch (e) {
            dispatch(registerPartnerError(e.response.data))
        }
    }
}
/**Метод для входа партнера*/
export function authPartner(userInfo) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.post(`${baseUrl}/login`, userInfo)
            const { data } = response

            dispatch(authSuccess(data))
            dispatch(getInfo())
            return true
        } catch (e) {
            if (e.response) {
                dispatch(registerPartnerError(e.response.data))
            }
        }
    }
}
export function saveRecoverToken(data) {
    return {
        type: SAVE_RECOVERY_TOKEN,
        payload: data
    }
}
export function deleteRecoverToken(data) {
    return {
        type: DELETE_RECOVERY_TOKEN,
        payload: data
    }
}
export function loginByCodePartner(userInfo) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.post(`${baseUrl}/login-by-code`, userInfo)
            const { data } = response

            dispatch(authSuccess(data))
            dispatch(getInfo())
            dispatch(saveRecoverToken(data))
            return true
        } catch (e) {
            if (e.response) {
                dispatch(registerPartnerError(e.response.data))
            }
        }
    }
}
export function resetPasswordPartner(userInfo) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.post(`${baseUrl}/reset-password`, userInfo)
            const { data } = response

            dispatch(authSuccess(data))
            dispatch(deleteRecoverToken())
            return true
        } catch (e) {
            if (e.response) {
                dispatch(registerPartnerError(e.response.data))
                return true
            }
        }
    }
}
export function changeEmailPartnerSend(email) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.post(`${baseUrl}/change-partner-email`, { email })
            const { data } = response
            return true
        } catch (e) {
            if (e.response) {
                dispatch(registerPartnerError(e.response.data))
            }
        }
    }
}
export function changeEmailPartnerConfirm(userData) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.post(`${baseUrl}/confirm-change-partner-email`, userData)
            const { data } = response
            return data
        } catch (e) {
            if (e.response) {
                dispatch(registerPartnerError(e.response.data))
            }
        }
    }
}
export function sendEmailPartner(email) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.post(`${baseUrl}/send-recovery-email `, email)
            const { data } = response

            return true
        } catch (e) {
            if (e.response) {
                dispatch(registerPartnerError(e.response.data))
            }
        }
    }
}
export function sendSmsPartner(phone) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.post(`${baseUrl}/request-code`, phone)
            const { data } = response

            return data
        } catch (e) {
            if (e.response) {
                if (e.response.data.errorCode === 'shortBan') {
                    return e.response.data
                }
                dispatch(registerPartnerError(e.response.data.error))
            }
        }
    }
}
/**Метод для входа партнера*/
export function authClient(userInfo) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.post(`${baseUrlClient}/login-by-code`, userInfo)
            const { data } = response

            dispatch(authSuccess(data))
            dispatch(getInfoClient())
            return true
        } catch (e) {
            if (e.response) {
                dispatch(registerPartnerError(e.response.data))
            }
        }
    }
}
export function sendSmsClient(phone) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.post(`${baseUrlClient}/request-code`, phone)
            const { data } = response
            return data
        } catch (e) {
            if (e.response) {
                if (e.response.data.errorCode === 'shortBan') {
                    return e.response.data
                }
                dispatch(registerPartnerError(e.response.data.error))
            }
        }
    }
}

/** Метод для очищении ошибок валидации в храниилише */
export function ClearFieldError(field) {
    return {
        type: CLEAR_FIELD_ERROR,
        field: field
    }

}
/** Метод для диспатча ошибок валидации в храниилише */
export function setFieldError(error) {
    return {
        type: SET_FIELD_ERROR,
        error: error
    }

}
/**
 * Вызывается при авторизации с любой страницы,
 * либо при получении нового access токена
 * @returns {function(*): Promise<void>}
 */
export function refreshAuth() {
    return async (dispatch) => {
        const url = `/refresh-token`;

        try {
            const response = await axiosCustom.post(url);
            const { data } = response;
            dispatch(authSuccess(data.response));
        } catch (e) {
            if (e.response) {
                dispatch(authError(e.response.data));
            }
        }
    };
}
export function refreshAuthPartner() {
    return async (dispatch) => {
        const url = `/refresh-token`;

        try {
            const response = await axiosCustom.post(url);
            const { data } = response;
            dispatch(authSuccess(data.response));
        } catch (e) {
            if (e.response) {
                dispatch(authError(e.response.data));
            }
        }
    };
}

/**
 * Получение данных пользователя
 */
export function getInfoSuccess(userInfo) {
    return {
        type: GET_INFO_SUCCESS,
        payload: userInfo
    }
}
export function getInfoError(error) {
    localStorage.removeItem('exp')
    return {
        type: GET_INFO_ERROR,
        error: error
    }
}
export function getInfo() {
    return async (dispatch) => {
        try {
            // axiosCustom.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem("token")}`;

            const response = await axiosCustom(`${baseUrl}/info`)
            const { data } = response

            dispatch(getInfoSuccess(data))
        } catch (e) {
            if (e.response) {
                dispatch(getInfoError(e.response.data));
            }
        }
    }
}

/** Метод получения информации клиента */
export function getInfoClient() {
    return async (dispatch) => {
        try {
            // axiosCustom.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem("token")}`;

            const response = await axiosCustom(`${baseUrlClient}/info`)
            const { data } = response

            dispatch(getInfoSuccess(data))
            dispatch(checkFirstBooking())
        } catch (e) {
            if (e.response) {
                dispatch(getInfoError(e.response.data));
            }
        }
    }
}
/**Смена информации об пользователе*/
export function changeUserInfo(userInfo) {
    return async (dispatch) => {
        try {

            const response = await axiosCustom.post(`${baseUrl}/settings`, userInfo)
            const { data } = response

            dispatch(getInfoSuccess(data))
            return true
        } catch (e) {
            if (e.response) {
                dispatch(registerPartnerError(e.response.data));
            }
        }
    }
}
/**Смена информации об клиенте*/
export function changeClientInfo(userInfo) {
    return async (dispatch) => {
        try {

            const response = await axiosCustom.post(`${baseUrlClient}/settings`, userInfo)
            const { data } = response

            dispatch(getInfoSuccess(data))
            return true
        } catch (e) {
            if (e.response) {
                dispatch(registerPartnerError(e.response.data));
            }
        }
    }
}
/** Изменяем аватар пользователя */
export function changeUserAvatarSuccess(avatar) {
    return {
        type: CHANGE_USER_AVATAR_SUCCESS,
        payload: avatar
    }
}
export function changeUserAvatar(avatar) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.post(`${baseUrl}/upload-avatar`, avatar)
            const { data } = response

            dispatch(changeUserAvatarSuccess(data))
        } catch (e) {

        }
    }
}
export function changeClientAvatar(avatar) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.post(`${baseUrlClient}/upload-avatar`, avatar)
            const { data } = response

            dispatch(changeUserAvatarSuccess(data))
        } catch (e) {

        }
    }
}
/** Изменяем пороль пользователя */
export function changeUserPasswordSuccess(password) {
    return {
        type: CHANGE_USER_AVATAR_SUCCESS,
        payload: password
    }
}
export function changeUserPassword(password) {

    return async (dispatch) => {
        try {
            const response = await axiosCustom.post(`${baseUrl}/change-password`, password)
            dispatch(authSuccess(response.data))
            dispatch(changeUserPasswordSuccess(password))
            return true
        } catch (e) {
            dispatch(registerPartnerError(e.response.data));
        }
    }
}
/** Изменяем почту партнера */
export function changePartnerEmailSuccess(email) {
    return {
        type: "",
        payload: email
    }
}
export function changePartnerEmailError(email) {
    return {
        type: "",
        payload: email
    }
}
export function changePartnerEmail(email) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.post(`${baseUrl}/send-recovery-email`, email)
            const { data } = response

            dispatch(changePartnerEmailSuccess(email))
        } catch (e) {
            if (e.response) {
                dispatch(changePartnerEmailError(e.response.data))
            }
        }
    }
}

/** Метод проверки первого завершенного бронирования */
export const checkFirstBookingSuccess = (data) => {
    return {
        type: CHECK_FIRST_BOOKING,
        payload: data
    }
}

export const checkFirstBooking = () => {
    return async (dispatch) => {
        try {
            const response = await axiosCustom(`${baseURLBackend}/public/catalog/first-booking`)
            dispatch(checkFirstBookingSuccess(response.data))
        } catch (e) {

        }
    }
}