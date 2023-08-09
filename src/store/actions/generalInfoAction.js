import axiosCustom from "../../axios/axiosCustom";
import {
    GET_CONTACTS_SUCCESS,
    GET_GENERAL_INFO_SUCCESS,
    GET_FOOTER_LINKS,
    GET_SOCIAL_MEDIAS_SUCCESS, GET_PAYMENTS, GET_TERMS_RESEARCH
} from "./actionsType";


const baseUrl = process.env.REACT_APP_BACKEND_ENDPOINT

export function getGeneralInfoSuccess(data) {
    return {
        type: GET_GENERAL_INFO_SUCCESS,
        payload: data
    }
}

/** Получаем инфу страницы о правилах проведения акции */
export function getPromoRulesInfo() {
    return async (dispatch) => {
        try {
            const response = await axiosCustom(`${baseUrl}/public/footer-section/promo`)
            const { data } = response
            return dispatch(getGeneralInfoSuccess(data))
        } catch (e) {
            console.log(e)
        }
    }
}

/** Получаем инфу страницы о нас */
export function getAboutInfo() {
    return async (dispatch) => {
        try {
            const response = await axiosCustom(`${baseUrl}/public/footer-section/about`)
            const { data } = response

            return dispatch(getGeneralInfoSuccess(data))
        } catch (e) {

        }
    }
}
/** Получаем условия пользования */
export function getTermsInfo() {
    return async (dispatch) => {
        try {
            const response = await axiosCustom(`${baseUrl}/public/footer-section/terms`)
            const { data } = response

            return dispatch(getGeneralInfoSuccess(data))
        } catch (e) {

        }
    }
}

export function getCookiesInfo() {
    return async (dispatch) => {
        try {
            const response = await axiosCustom(`${baseUrl}/public/footer-section/consent-cookies`)
            const { data } = response

            return dispatch(getGeneralInfoSuccess(data))
        } catch (e) {

        }
    }
}

export function getPolicyInfo() {
    return async (dispatch) => {
        try {
            const response = await axiosCustom(`${baseUrl}/public/footer-section/policy`)
            const { data } = response
            return dispatch(getGeneralInfoSuccess(data))
        } catch (e) {

        }
    }
}
export function getUserTermOfUseInfo() {
    return async (dispatch) => {
        try {
            const response = await axiosCustom(`${baseUrl}/public/footer-section/user-term-of-use`)
            const { data } = response
            return dispatch(getGeneralInfoSuccess(data))
        } catch (e) {

        }
    }
}
export function getRequisites() {
    return async (dispatch) => {
        try {
            const response = await axiosCustom(`${baseUrl}/public/footer-section/requisites`)
            const { data } = response
            return dispatch(getGeneralInfoSuccess(data))
        } catch (e) {

        }
    }
}
export function getOfferInfo() {
    return async (dispatch) => {
        try {
            const response = await axiosCustom(`${baseUrl}/public/footer-section/offer`)
            const { data } = response
            return dispatch(getGeneralInfoSuccess(data))
        } catch (e) {

        }
    }
}
export function getRulesPartnerInfo() {
    return async (dispatch) => {
        try {
            const response = await axiosCustom(`${baseUrl}/public/footer-section/rules`)
            const { data } = response
            return dispatch(getGeneralInfoSuccess(data))
        } catch (e) {

        }
    }
}

export function getServiceRulesInfo() {
    return async (dispatch) => {
        try {
            const response = await axiosCustom(`${baseUrl}/public/footer-section/service-rules`)
            const { data } = response
            return dispatch(getGeneralInfoSuccess(data))
        } catch (e) {

        }
    }
}

export function getPlatformRulesInfo() {
    return async (dispatch) => {
        try {
            const response = await axiosCustom(`${baseUrl}/public/footer-section/platform-rules`)
            const { data } = response
            return dispatch(getGeneralInfoSuccess(data))
        } catch (e) {

        }
    }
}

export function getFooterLinksSuccess(data) {
    return {
        type: GET_FOOTER_LINKS,
        payload: data
    }
}

export function getFooterLinks() {
    return async (dispatch) => {
        try {
            const response = await axiosCustom(`${baseUrl}/public/link/get-link?description=competition_results`)
            const { data } = response
            dispatch(getFooterLinksSuccess(data))
        } catch (e) {
            console.error(e)
        }
    }
}

/** Получаем социальные сети */
export function getSocialMediasSuccess(data) {
    return {
        type: GET_SOCIAL_MEDIAS_SUCCESS,
        payload: data
    }
}
export function getSocialMedias() {
    return async (dispatch) => {
        try {
            const response = await axiosCustom(`${baseUrl}/public/social-webs/index`)
            const { data } = response

            return dispatch(getSocialMediasSuccess(data.items[0]))
        } catch (e) {

        }
    }
}
/** Получаем инфу страницы контакты */
export function getContactInfoSuccess(contacts) {
    return {
        type: GET_CONTACTS_SUCCESS,
        payload: contacts
    }
}

export function getContactInfo() {
    return async (dispatch) => {
        try {
            const response = await axiosCustom(`${baseUrl}/public/contacts/index`)
            const { data } = response

            return dispatch(getContactInfoSuccess(data.items[0]))
        } catch (e) {

        }
    }
}
/** Получаем инфу страницы оплаты */
export function getPaymentInfoSuccess(payments) {
    return {
        type: GET_PAYMENTS,
        payload: payments
    }
}

export function getPaymentInfo() {
    return async (dispatch) => {
        try {
            const response = await axiosCustom(`${baseUrl}/public/footer-section/payment`)
            const { data } = response

            return dispatch(getPaymentInfoSuccess(data))
        } catch (e) {

        }
    }
}
/** Получаем условия иследования */
export function getTermsResearchSuccess(payments) {
    return {
        type: GET_TERMS_RESEARCH,
        payload: payments
    }
}

export function getTermsResearch(){
    return async (dispatch) => {
        try {
            const response = await axiosCustom(`${baseUrl}/public/footer-section/research-agreement?per-page=100`)
            const { data } = response

            return dispatch(getTermsResearchSuccess(data))
        } catch (e) {

        }
    }
}