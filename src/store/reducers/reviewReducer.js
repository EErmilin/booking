import {
    ANSWER_PARTNER_SUCCESS, CLEAR_STATE,
    CREATE_REVIEW_CLIENT_SUCCESS,
    DELETE_REVIEW_SUCCESS,
    EDIT_REVIEW_SUCCESS,
    GET_REVIEWS_CLIENT_SUCCESS
} from "../actions/actionsType";


const initialState = {
    listReviews:[],
    totalCount:0,
    perPage:0,
    statusReview:{

    }
}

export function reviewsReducer (state=initialState,action){
    switch (action.type) {
        case GET_REVIEWS_CLIENT_SUCCESS:{
            return {
                ...state,
                listReviews: action.payload.items,
                totalCount: action.payload._meta.totalCount,
                statusReview: action.payload._meta
            }
        }
        case CREATE_REVIEW_CLIENT_SUCCESS:{
            return {
                ...state,
                listReviews: state.listReviews?[...state.listReviews,action.payload]:[action.payload]
            }
        }
        case EDIT_REVIEW_SUCCESS:{
            let indexReview = state.listReviews.findIndex(elem=>action.payload.id==elem.id)
            let arrReviews = [...state.listReviews]
            if(arrReviews.length){
                arrReviews.splice(indexReview,1,action.payload)
            }
            return {
                ...state,
                listReviews: arrReviews
            }
        }
        case DELETE_REVIEW_SUCCESS:{
            return {
                ...state,
                listReviews: state.listReviews.filter(elem=>elem.id!==action.payload)
            }
        }
        case ANSWER_PARTNER_SUCCESS:{
            const listPartnerReview = [...state.listReviews]
            listPartnerReview.forEach(elem=>{
                if(elem.id==action.payload.review_id){
                    elem.answers.push(action.payload)
                }
            })
            return {
                ...state,
                listReviews: listPartnerReview
            }

        }
        case CLEAR_STATE:{
            return initialState
        }
        default: return state
    }
}