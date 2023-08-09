import {SET_LAST_HOTELS} from "../actions/actionsType";

const initialState = {
    lastWatchHotels: [],
    hotels:[],
    hotelInfo:{

    },
    errors:{},
    total:null,
    limit:25
}

export default function hotelReducer (state=initialState,action){
    switch (action.type) {
        case SET_LAST_HOTELS: {
            return {
                ...state,
                lastWatchHotels: action.lastWatchHotels,
            }
        }
        default:{
            return state
        }
    }
}