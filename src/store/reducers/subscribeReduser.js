import {
    SUBSCRIBE_FALIED,
    SUBSCRIBE_SECCESS,
    SUBSCRIBE_ERROR_CLEAR
} from "../actions/actionsType";


const initialValues = {
    error: '',
    success: false,

}

export function subscribeReduser(state = initialValues, action) {
    switch (action.type) {
        case SUBSCRIBE_SECCESS: {
            return {
                success: action.value,
            }
        }
        case SUBSCRIBE_FALIED: {
            return {
                error: action.error,
            }
        }
        case SUBSCRIBE_ERROR_CLEAR: {
            return {
                error: '',
            }
        }
        default: return state
    }
}