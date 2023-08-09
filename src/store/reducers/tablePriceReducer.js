import {
    CLEAR_ERROR_CALENDAR,
    ERROR_CALENDAR,
    GET_CALENDAR_PRICES_SUCCESS,
    SAVE_ERROR_INTEGRATION
} from "../actions/actionsType";


const initialState = {
    calendar:null,
    errors: {},
    errorIntegration:null
}


export function tablePriceReducer(state=initialState,action){
    switch (action.type){
        case GET_CALENDAR_PRICES_SUCCESS:{
            return {
                ...state,
                calendar: action.payload
            }
        }
        case ERROR_CALENDAR:{
            let errorObj = {}
            if(action.error.length)action.error.forEach((elem) => {
                errorObj[elem.field] = elem.message
            })
            return {
                ...state,
                errors: errorObj
            }
        }
        case CLEAR_ERROR_CALENDAR:{
            return {
                ...state,
                errors: {}
            }
        }
        case SAVE_ERROR_INTEGRATION:{
            return {
                ...state,
                errorIntegration: action.payload
            }
        }
        default:{
            return state
        }
    }
}
