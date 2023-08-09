import {GET_GROUP_FAQ_SUCCESS, GET_LIST_FAQ_SUCCESS} from "./actionsType";
import axiosCustom from "../../axios/axiosCustom";
import serialize from "../../functions/serialize";


const baseUrl = process.env.REACT_APP_BACKEND_ENDPOINT

export function getListFAQSuccess(list){
    return {
        type:GET_LIST_FAQ_SUCCESS,
        payload:list
    }
}
/** Список вопросов */
export function getListFAQ(query){
    return async dispatch=>{
        const params = query?`?${serialize({...query,expand:"group"})}`:''
        try {
            const response = await axiosCustom(`${baseUrl}/public/faq/index${params}?expand=questions`)
            const {data} = response

            return dispatch(getListFAQSuccess(data.items))
        }catch (e) {

        }
    }
}
/** Вопросы по группам */

export function getGroupFAQSuccess(list){
    return {
        type:GET_GROUP_FAQ_SUCCESS,
        payload:list
    }
}

export function getGroupFAQ(){
    return async dispatch=>{
        try {
            const response = await axiosCustom(`${baseUrl}/public/faq-group/index?expand=questions`)
            const {data} = response
            return dispatch(getGroupFAQSuccess(data.items))
        }catch (e) {

        }
    }
}