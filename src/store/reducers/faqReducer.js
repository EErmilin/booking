import {GET_GROUP_FAQ_SUCCESS, GET_LIST_FAQ_SUCCESS} from "../actions/actionsType";


const initialState = {
    list:null,
    groupList:null
}


export function faqReducer(state=initialState,action){
    switch (action.type) {
        case GET_LIST_FAQ_SUCCESS:{
            return {...state,list: action.payload}
        }
        case GET_GROUP_FAQ_SUCCESS:{
            return {...state,groupList: action.payload}
        }
        default:{
            return state
        }
    }
}