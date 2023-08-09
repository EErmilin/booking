import axiosCustom from "../../axios/axiosCustom";
import {CREATE_ANSWER_MODERATION, GET_CURRENT_MODERATION, GET_LIST_MODERATION_SUCCESS} from "./actionsType";
import serialize from "../../functions/serialize";

const baseUrl = process.env.REACT_APP_BACKEND_ENDPOINT

export function getCurrentModeration(data){
    return {
        type:GET_CURRENT_MODERATION,
        payload:data
    }
}
export function getPartnerModerationSuccess(data){
    return {
        type:GET_LIST_MODERATION_SUCCESS,
        payload:data
    }
}
export function getPartnerModeration(id,params){
    const formatParams =params?`&${serialize(params)}`:''
    return async (dispatch)=>{
        try {
            const response = await axiosCustom(`${baseUrl}/partner/moderation/index?expand=hotel,hotel.rooms${formatParams}${id?`&hotel_id=${id}`:''}`)
            const {data} = response

            if(id){
                return dispatch(getCurrentModeration(data.items))
            }else{
                return dispatch(getPartnerModerationSuccess(data))
            }
        }catch (e) {

        }
    }
}
/** Создаем ответ */
export function createAnswerModerationSuccess(data){
    return {
        type:CREATE_ANSWER_MODERATION,
        payload:data
    }
}
export function createAnswerModeration (answer){
    return async (dispatch)=>{
        try {
            const response = await axiosCustom.post(`${baseUrl}/partner/moderation/create`,answer)
            const {data} = response

            return dispatch(getPartnerModeration(answer.hotel_id))
        }catch (e) {

        }
    }
}

