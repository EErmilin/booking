import {CLEAR_LIST_PRICES, GET_LIST_PRICES_SUCCESS} from "../actions/actionsType";

const initialState = {
    rooms:[]
}

export function pricesReducer (state=initialState,action){
    switch (action.type) {
        case CLEAR_LIST_PRICES:{
            return {
                ...state,
                rooms:[]
            }
        }
        case GET_LIST_PRICES_SUCCESS:{
            return {
                ...state,
                rooms: action.payload
            }
        }
        default: return state
    }
}