import axiosCustom from "../../axios/axiosCustom";
import {
    SUBSCRIBE_FALIED,
    SUBSCRIBE_ERROR_CLEAR,
    SUBSCRIBE_SECCESS
} from "./actionsType";

const baseUrl = process.env.REACT_APP_BACKEND_ENDPOINT

export function subscribe(email) {

    return async (dispatch) => {
        const url = baseUrl + `/public/subscription/subscribe`
        try {
            const response = await axiosCustom.post(url, { email: email })
            dispatch(clearSubscribeError())
            dispatch(setSubscribeSeccess(true))
        } catch (e) {
            dispatch({ type: SUBSCRIBE_FALIED, error:  e.response.data[0].message})
        }
    };
}

export function unsubscribe(email) {
    return async (dispatch) => {
        const url = baseUrl + `/public/subscription/unsubscribe`
        try {
            const response = await axiosCustom.post(url, { email: email })

        } catch (e) {
            if (e.response) {
            }
        }
    };
}


export function clearSubscribeError() {
    return {
        type: SUBSCRIBE_ERROR_CLEAR
    }
}

export function setSubscribeSeccess(value) {
    return {
        type: SUBSCRIBE_SECCESS,
        value
    }
}
