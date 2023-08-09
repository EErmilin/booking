import axiosCustom from "../../axios/axiosCustom";
import {CLEAR_ERROR_CALENDAR, ERROR_CALENDAR, GET_CALENDAR_PRICES_SUCCESS, SAVE_ERROR_INTEGRATION} from "./actionsType";
import serialize from "../../functions/serialize";


const baseUrl = process.env.REACT_APP_BACKEND_ENDPOINT


export function getCalendarPricesSuccess(data){
    return {
        type:GET_CALENDAR_PRICES_SUCCESS,
        payload:data
    }
}
export function getCalendarPrices(hotelId,filters){
    const filtersUrl = `&${serialize(filters)}`
    return async (dispatch)=>{
        try {
            const response = await axiosCustom(`${baseUrl}/partner/price-calendar/view?id=${hotelId}${filtersUrl}`)
            const {data} = response

            dispatch(clearCalendarError())
            return dispatch(getCalendarPricesSuccess(data))
        }catch (e) {
            if(e.response.data){
                dispatch(saveError(e.response.data))
            }
        }
    }
}

export function saveError(error){
    return{
        type:ERROR_CALENDAR,
        error:error
    }
}
export function saveErrorIntegration(message){
    return {
        type:SAVE_ERROR_INTEGRATION,
        payload:message
    }
}
export function saveRoom(room,filters,hotelId){
    return async (dispatch)=>{
        try {
            const response = await axiosCustom.post(`${baseUrl}/partner/price-calendar/save-room`,room)
            const {data} = response

            dispatch(getCalendarPrices(hotelId,filters))
            return {status:200}
        }catch (e) {
            if(e.response.status==422){
                dispatch(saveError(e.response.data))
                return {status:422}
            }else if(e.response.status==403){
                dispatch(saveErrorIntegration(e.response.data.message))
                return {status:403}
            }
        }
    }
}

export function savePrice(plan,filters,hotelId){
    return async (dispatch)=>{
        try {
            const response = await axiosCustom.post(`${baseUrl}/partner/price-calendar/save-plan`,plan)
            const {data} = response

            dispatch(getCalendarPrices(hotelId,filters))
            return {status:200}
        }catch (e) {
            if(e.response.status==422){
                dispatch(saveError(e.response.data))
                return {status:422}
            }else if(e.response.status==403){
                dispatch(saveErrorIntegration(e.response.data.message))
                return {status:403}
            }
        }
    }
}

export function clearCalendarError(){
    return {
        type:CLEAR_ERROR_CALENDAR,
    }
}
