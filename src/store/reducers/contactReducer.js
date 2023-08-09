import {CALL_ERROR, CLEAR_CALL_ERROR, CLEAR_FIELD_CALL_ERROR} from "../actions/actionsType";


const initialValues = {
    errors:{},
}

export function contactReducer(state = initialValues, action) {
    switch (action.type) {
        case CLEAR_FIELD_CALL_ERROR :{
            let errorsObj = {...state.errors}
            delete errorsObj[action.field]
            return {
                ...state,
                errors: errorsObj
            }
        }
        case CALL_ERROR:{
            let errorObj = {}
            action.error.forEach((elem) => {
                errorObj[elem.field] = elem.message
            }) 
            return {
                ...state,
                errors: errorObj
            }
        }
        case CLEAR_CALL_ERROR:{
            return {
                ...state,
                errors: {}
            }
        }
        default: return state
    }
}