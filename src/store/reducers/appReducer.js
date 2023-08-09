import {
    GET_APP_DOWNLOAD_URL
} from "../actions/actionsType";

const initialValues = {
    url: ''
}

export function appReducer(state = initialValues, action) {
    switch (action.type) {
        case GET_APP_DOWNLOAD_URL: {
            return {
                ...state,
                url: action.url,
            }
        }
        default: return state
    }
}