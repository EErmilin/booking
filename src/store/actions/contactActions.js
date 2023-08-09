import { CALL_ERROR, CLEAR_CALL_ERROR, CLEAR_FIELD_CALL_ERROR} from "./actionsType";
import axiosCustom from "../../axios/axiosCustom";


const baseUrl = process.env.REACT_APP_BACKEND_ENDPOINT

export function setContactError (error){
    return{
        type:CALL_ERROR,
        error:error
    }
}

export function clearContactFieldError(field){
    return {
        type:CLEAR_FIELD_CALL_ERROR,
        field:field
    }
}

export function clearContactError (){
    return{
        type:CLEAR_CALL_ERROR,
    }
}

export function send(values) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.post(`${baseUrl}/public/backcall/send`, values)
            const { data } = response
            return true
        } catch (e) {
            if(e.response){
                dispatch(setContactError(e.response.data))
            }
        }
    }
}
