import {GET_FAVORITES_SUCCESS} from "../actions/actionsType";

const initialState = {
    favorites:null,
    error:null
}


export function favoriteReducer(state=initialState,action){
    switch (action.type) {
        case GET_FAVORITES_SUCCESS:{
            return {
                ...state,
                favorites: action.payload
            }
        }
        default:{
            return state
        }
    }
}