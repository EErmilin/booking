import axiosCustom from "../../axios/axiosCustom";
import { GET_FAVORITES_SUCCESS } from "./actionsType";

const baseUrl = process.env.REACT_APP_BACKEND_ENDPOINT

export function getFavoritesSuccess(favorites) {
    return {
        type: GET_FAVORITES_SUCCESS,
        payload: favorites
    }
}
export function getFavorites() {
    return async (dispatch) => {
        try {
            const response = await axiosCustom(`${baseUrl}/client/favorites/index?expand=hotel,hotel.region,hotel.room`)
            const { data } = response
            return dispatch(getFavoritesSuccess(data.items))
        } catch (e) {

        }
    }
}

export function addFavorites(hotelId) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.post(`${baseUrl}/client/favorites/add`, { hotel_id: hotelId })
            await (dispatch(getFavorites()))
        } catch (e) {

        }
    }
}
export function deleteFavorites(hotelId) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.delete(`${baseUrl}/client/favorites/delete?id=${hotelId}`)
            await (dispatch(getFavorites()))
        } catch (e) {

        }
    }
}