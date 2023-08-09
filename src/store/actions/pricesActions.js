import axiosCustom from "../../axios/axiosCustom";
import {CLEAR_LIST_PRICES, GET_LIST_PRICES_SUCCESS} from "./actionsType";

const baseUrl = process.env.REACT_APP_BACKEND_ENDPOINT

export function getListPricesSuccess(list){
    return{
        type:GET_LIST_PRICES_SUCCESS,
        payload:list
    }
}
export function clearListPrices(){
    return{
        type:CLEAR_LIST_PRICES,
    }
}
export function getListPrices (hotelId){
    return async (dispatch)=>{
        try {
            const response = await axiosCustom(`${baseUrl}/partner/room/index?hotel_id=${hotelId}&expand=weekData`)
            const {data} = response

            return dispatch(getListPricesSuccess(data.items))
        }catch (e) {

        }
    }
}
export function updatePrices(price){
    return async (dispatch)=>{
        try {
            const response = await axiosCustom.post(`${baseUrl}/partner/room/set-plans`,price)
        }catch (e) {

        }
    }
}