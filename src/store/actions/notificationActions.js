import axiosCustom from "../../axios/axiosCustom";
import { COUNT_NOTIFICATIONS_SUCCESS, DELETE_UNREAD_NOTIFICATION, GET_NOTIFICATION_PARTNER_SUCCESS } from "./actionsType";
import serialize from "../../functions/serialize";
import store from "../store";
import { startRequest } from "./routerActions";

const baseUrlPartner = process.env.REACT_APP_PARTNER_ENDPOINT
const baseUrlClient = process.env.REACT_APP_CLIENT_ENDPOINT


/** Уведомления партнера */
export function getPartnerNotificationSuccess(notifications) {
    return {
        type: GET_NOTIFICATION_PARTNER_SUCCESS,
        payload: notifications
    }
}
export function getPartnerNotification(params, filter) {
    const formatParams = `&${serialize(params)}`
    return async (dispatch) => {
        try {
            dispatch(startRequest())
            const url = filter.value === 'noReaded' ?
            `${baseUrlPartner}/user/get-new-notifications?expand=booking.hotel${formatParams}` :
            `${baseUrlPartner}/user/get-notifications?expand=booking.hotel${formatParams}`
            const response = await axiosCustom(url)
            const { data } = response

            return dispatch(getPartnerNotificationSuccess(data))
        } catch (e) {

        }
    }
}
export function getClientNotification(params, filter) {
    const formatParams = `&${serialize(params)}`
    return async (dispatch) => {
        try {
            dispatch(startRequest())
            const url = filter.value === 'noReaded' ?
                `${baseUrlClient}/user/get-new-notifications?expand=booking.hotel${formatParams}` :
                `${baseUrlClient}/user/get-notifications?expand=booking.hotel${formatParams}`
            const response = await axiosCustom(url)
            const { data } = response

            return dispatch(getPartnerNotificationSuccess(data))
        } catch (e) {

        }
    }
}
/** Помечаем уведомление прочитаным */
export function deleteUnreadNotificationPartnerSuccess(id) {
    return {
        type: DELETE_UNREAD_NOTIFICATION,
        payload: id
    }
}
export function deleteUnreadNotificationPartner(id) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.delete(`${baseUrlPartner}/public/unread-notification/delete?id=${id}`)
            const { data } = response
            dispatch(getCountUnreadNotifications())
            return dispatch(deleteUnreadNotificationPartnerSuccess(id))
        } catch (e) {

        }
    }
}
export function deleteUnreadNotificationClient(id) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.delete(`${baseUrlClient}/public/unread-notification/delete?id=${id}`)
            const { data } = response
            dispatch(getCountUnreadNotifications())
            return dispatch(deleteUnreadNotificationPartnerSuccess(id))
        } catch (e) {

        }
    }
}
/** Колличество не прочитаных уведомлений */
export function getCountUnreadNotificationsSuccess(count) {
    return {
        type: COUNT_NOTIFICATIONS_SUCCESS,
        payload: count
    }
}
export function getCountUnreadNotifications() {
    return async (dispatch) => {
        const userRole = store.getState().auth.userInfo.user_type
        const url = userRole == 2 ? baseUrlPartner : baseUrlClient
        try {
            const response = await axiosCustom(`${url}/user/count-unread-notifications`)
            const { data } = response

            return dispatch(getCountUnreadNotificationsSuccess(data))
        } catch (e) {

        }
    }
}