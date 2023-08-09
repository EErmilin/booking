import axiosCustom from "../../axios/axiosCustom";
import {
    GET_DIRECTIONS,
    GET_DIRECTIONS_INFO,
    GET_PARTNERS,
    GET_PARTNERS_PAGE_INFO,
    GET_DIRECTIONS_PAGE_TITLE, GET_IMAGES_MAIN
} from "./actionsType";




const baseUrl = process.env.REACT_APP_BACKEND_ENDPOINT

export function getDirectionCities() {
    return async (dispatch) => {
        const url = baseUrl + `/public/direction-cities/index`
        try {
            const response = await axiosCustom.get(url);
            const { items } = response.data;
            dispatch({ type: GET_DIRECTIONS, directions: items })
        } catch (e) {
            if (e.response) {
            }
        }
    };
}
export function getImagesMain(){
    return async (dispatch)=>{
        const url = baseUrl + `/public/slider/index`
        try {
            const response = await axiosCustom.get(url);
            const { data } = response;
            dispatch({ type: GET_IMAGES_MAIN, payload: data })
        }catch (e) {

        }
    }
}
export function getDirectionPageTitle() {
    return async (dispatch) => {
        const url = baseUrl + `/public/direction/index`
        try {
            const response = await axiosCustom.get(url);
            const { items } = response.data;
             dispatch({ type: GET_DIRECTIONS_PAGE_TITLE, pageTitle: items[0] })
        } catch (e) {
            if (e.response) {
            }
        }
    };
}

export function getDirectionPageInfo() {
    return async (dispatch) => {
        const url = baseUrl + `/public/partner-block/index`
        try {
            const response = await axiosCustom.get(url);
            const { items } = response.data;
            dispatch({ type: GET_DIRECTIONS_INFO, directionsInfo: items })
        } catch (e) {
            if (e.response) {
            }
        }
    };
}

export function getPatners() {
    return async (dispatch) => {
        const url = baseUrl + `/public/partner-logo/index`
        try {
            const response = await axiosCustom.get(url);
            const { items } = response.data;
            dispatch({ type: GET_PARTNERS, partners: items })
        } catch (e) {
            if (e.response) {
            }
        }
    };
}

export function getPatnersPageInfo() {
    return async (dispatch) => {
        const url = baseUrl + `/public/partner/index`
        try {
            const response = await axiosCustom.get(url);
            const { items } = response.data;
            dispatch({ type: GET_PARTNERS_PAGE_INFO, info: items[0] })
        } catch (e) {
            if (e.response) {
            }
        }
    };
}
