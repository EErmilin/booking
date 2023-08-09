import {
    COUNT_NOTIFICATIONS_SUCCESS,
    DELETE_UNREAD_NOTIFICATION,
    GET_NOTIFICATION_PARTNER_SUCCESS
} from "../actions/actionsType";

const initialValues = {
    notifications: null,
    count: '',
    total: 0
}

export function notificationsReducer(state = initialValues, action) {
    switch (action.type) {
        case GET_NOTIFICATION_PARTNER_SUCCESS: {
            return {
                ...state,
                notifications: !Array.isArray(action.payload) ? action.payload.items : [],
                total: !Array.isArray(action.payload) ? action.payload._meta.totalCount : 0
            }
        }
        case COUNT_NOTIFICATIONS_SUCCESS: {
            return {
                ...state,
                count: action.payload
            }
        }
        case DELETE_UNREAD_NOTIFICATION: {
            let arr = [...state.notifications]
            arr.forEach(elem => {
                if (elem.id == action.payload) {
                    elem.is_read = true
                }
            })
            return {
                ...state,
                notifications: arr
            }
        }
        default: return state
    }
}