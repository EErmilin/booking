import axiosCustom from "../../axios/axiosCustom";
import {
    ANSWER_PARTNER_SUCCESS, CLEAR_STATE,
    CREATE_REVIEW_CLIENT_SUCCESS,
    EDIT_REVIEW_SUCCESS,
    GET_REVIEWS_CLIENT_SUCCESS
} from "./actionsType";
import serialize from "../../functions/serialize";
import { startRequest } from "./routerActions";

const baseUrl = process.env.REACT_APP_BACKEND_ENDPOINT

export function getReviewsClientSuccess(data){
  return{
      type:GET_REVIEWS_CLIENT_SUCCESS,
      payload:data
  }
}

export function getReviewsClient (){
    return async (dispatch)=>{
        try {
            dispatch(startRequest())
            const response = await axiosCustom(`${baseUrl}/client/reviews/index?expand=booking,answer,booking.region`)
            const {data} = response

            return dispatch(getReviewsClientSuccess(data))
        }catch (e) {

        }
    }
}


/** Создаем отзыв */
export function createReviewSuccess(review){
    return {
        type:CREATE_REVIEW_CLIENT_SUCCESS,
        payload:review
    }
}
export function createReview(review){
    return async (dispatch)=>{
        try {
            const response = await axiosCustom.post(`${baseUrl}/client/reviews/create?expand=hotel,room,booking,reviews`,review)
            const {data} = response

            dispatch(getReviewsClient())

            return {isSend:true,data:data}
        }catch (e) {
            if(e.response){
                return {isSend:false,data:e.response.data}
            }
        }
    }
}
export function uploadReviewImage (formData,id){
    return async (dispatch)=>{
        try{
            const response = await axiosCustom.post(`${baseUrl}/client/reviews/upload-image`,formData)
        }catch(e){

        }
    }
}
export function deleteReviewImage (url,id){
    return async (dispatch)=>{
        try{
            const response = await axiosCustom.post(`${baseUrl}/client/reviews/delete-image`,{
                review_id: id,
                image_path: url
            })
        }catch(e){

        }
    }
}
/** Редактируем отзыв */
export function editReviewSuccess(review){
    return{
        type:EDIT_REVIEW_SUCCESS,
        payload:review
    }
}
export function editReview(review,id){
    return async (dispatch)=>{
        try {
            const response = await axiosCustom.put(`${baseUrl}/client/reviews/update?expand=hotel,room,booking&id=${id}`,review)
            const {data} = response

            dispatch(getReviewsClient({...data,id:id}))

            return {isSend:true,data:data}
        }catch (e) {
            if(e.response){
                return {isSend:false,data:e.response.data}
            }
        }
    }
}
/** Удаляем отзыв */
export function deleteReviewSuccess(review){
    return{
        type:EDIT_REVIEW_SUCCESS,
        payload:review
    }
}
export function deleteReview(id){
    return async (dispatch)=>{
        try {
            const response = await axiosCustom.put(`${baseUrl}/client/reviews/revoke?id=${id}`)

            return dispatch(deleteReviewSuccess(id))
        }catch (e) {

        }
    }
}
/** Для партнера */
export function getReviewsPartner (params){
    const formatParams = `?${serialize({expand:"hotel.region,booking,answers,client",...params})}`
    return async (dispatch)=>{
        try {
            dispatch(startRequest())
            const response = await axiosCustom(`${baseUrl}/partner/reviews/index${formatParams}`)
            const {data} = response

            return dispatch(getReviewsClientSuccess(data))
        }catch (e) {

        }
    }
}
export function answerPartnerSuccess (answer){
    return {
        type:ANSWER_PARTNER_SUCCESS,
        payload:answer
    }
}
export function answerPartner(id,review){
    return async (dispatch)=>{
        try {
            const response = await axiosCustom.put(`${baseUrl}/partner/reviews/answer?id=${id}&expand=booking,answer,client`,review)
            const {data} = response

            dispatch(answerPartnerSuccess(data))
            return {isSend:true}
        }catch (e) {
            if(e.response){
                return {isSend:false,data:e.response.data}
            }
        }
    }
}
export function clearState(){
    return {
        type:CLEAR_STATE,
    }
}