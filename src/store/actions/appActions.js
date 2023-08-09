import axiosCustom from "../../axios/axiosCustom";
import {
    GET_APP_DOWNLOAD_URL
} from "./actionsType";

const baseUrl = process.env.REACT_APP_BACKEND_ENDPOINT

export function getAppUrl() {
    return async (dispatch) => {
        const url = baseUrl + `/public/apk/last`
        try {
            const response = await axiosCustom.get(url);
            const { data } = response;
            dispatch({ type: GET_APP_DOWNLOAD_URL, url: data.link })
        } catch (e) {
            if (e.response) {
            }
        }
    };
}
