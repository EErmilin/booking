import {GET_CURRENT_MODERATION, GET_LIST_MODERATION_SUCCESS} from "../actions/actionsType";

const initialState = {
    list:null,
    moderation:null,
    total:0
}


export function moderationReducer (state=initialState,action){
    switch (action.type){
        case GET_LIST_MODERATION_SUCCESS:{
            return {
                ...state,
                list:action.payload.items,
                total:action.payload._meta.totalCount
            }
        }
        case GET_CURRENT_MODERATION:{
            return {
                ...state,
                moderation: action.payload
            }
        }
        default:return state
    }
}