import axiosCustom from "../../axios/axiosCustom";
import {
    CLEAR_HOTEL_INFO,
    CLEAR_FIELD_ERROR,
    CLEAR_FIELD_HOTEL_ERROR,
    CLEAR_ROOM_INFO,
    CLEAR_SERVICES,
    CREATE_BED_ERROR,
    CREATE_BED_SUCCESS,
    CREATE_TARIFF_ERROR,
    CREATE_TARIFF_SUCCESS,
    DELETE_HOTEL_ERROR,
    DELETE_HOTEL_ERROR_IMAGE,
    DELETE_HOTEL_IMAGE_SUCCESS,
    DELETE_HOTEL_SUCCESS,
    DELETE_ROOM_ERROR,
    DELETE_ROOM_IMAGE_SUCCESS,
    DELETE_ROOM_SUCCESS,
    DELETE_TARIFF_SUCCESS,
    EDIT_HOTEL_ROOM_ERROR,
    EDIT_HOTEL_ROOM_SUCCESS,
    EDIT_ROOM_TARIFF_SUCCESS,
    GET_HOTEL_INFO_ERROR,
    GET_HOTEL_INFO_SUCCESS,
    GET_LIST_TARIFF_SUCCESS,
    GET_OBJECTS_ERROR,
    GET_OBJECTS_SUCCESS,
    GET_ROOM_INFO_ERROR,
    GET_ROOM_INFO_SUCCESS,
    GET_ROOMS_LIST_PARTNER_ERROR,
    GET_ROOMS_LIST_PARTNER_SUCCESS,
    GET_SERVICE_ROOM_ERROR,
    GET_SERVICE_ROOM_SUCCESS,
    HOTEL_CREATE_ERROR,
    HOTEL_CREATE_SUCCESS,
    HOTEL_ROOM_CREATE_ERROR,
    HOTEL_ROOM_CREATE_SUCCESS,
    REVOKE_HOTEL_SUCCESS,
    REVOKE_HOTEL_ERROR,
    UPLOAD_HOTEL_IMAGE_ERROR,
    UPLOAD_HOTEL_IMAGE_SUCCESS,
    UPLOAD_ROOM_IMAGE_SUCCESS,
    CLEAR_ERRORS,
    CLEAR_HOTEL_ALL_ERROR,
    SAVE_MAIN_IMAGE_SUCCESS,
    HOTEL_TRAVELLINE_ERROR,
    GET_REPORTS_SUCCESS,
    GET_REQUISITES_ERROR,
    GET_REPORT_SUCCESS,
    GET_TYPE_HOTELS,
    GET_BED_TYPES,
    GET_REQUISITES_SECCESS,
    CHANGE_HOTEL_AMENITY,
    ARCHIVE_HOTEL_SUCCESS,
    GET_ARCHIVE_HOTELS,
    RESTORE_ARCHIVE_HOTEL,
    GET_OBJECTS_FOR_DOCUMENTS_SECCESS,
    SET_PAYMENT_TYPE_SUCCESS,
    CLEAR_HOTEL_IMAGE, GET_MEAL_TYPE, GET_HOTELS_REQUEST, START_REQUEST
} from "./actionsType";
import axios from "axios";
import serialize from "../../functions/serialize";
import { ymapsKey } from "../../apiKeys/apiKeys";
import { getInfo } from "./authActions";
import {getBookingArchiveHotels} from "./bookingActions";
import {saveErrorIntegration} from "./tablePriceActions";
import { startRequest } from "./routerActions";

const baseUrl = `${process.env.REACT_APP_BACKEND_ENDPOINT}/partner`
const publicBaseUrl = `${process.env.REACT_APP_BACKEND_ENDPOINT}/public`

/** Метод получения инфы об отеле */
export function getHotelInfoSuccess(hotelInfo) {
    return {
        type: GET_HOTEL_INFO_SUCCESS,
        payload: hotelInfo
    }
}
export function getHotelInfoError(error) {
    return {
        type: GET_HOTEL_INFO_ERROR,
        error: error
    }
}
export function clearHotelInfo() {
    return {
        type: CLEAR_HOTEL_INFO,
    }
}
export function getHotelInfo(hotelId) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom(`${baseUrl}/hotel/view?id=${hotelId}&expand=requisites,rooms,rooms.weekData,region`)
            const { data } = response

            dispatch(getHotelInfoSuccess(data))
        } catch (e) {
            if (e.response) {
                dispatch(getHotelInfoError(e.response.data))
            }
        }
    }
}

/** Метод создания отеля */
export function createHotelSuccess(hotel) {
    return {
        type: HOTEL_CREATE_SUCCESS,
        payload: hotel
    }
}
export function createHotelError(error) {
    return {
        type: HOTEL_CREATE_ERROR,
        error: error
    }
}
export function createTravelLineError(error) {
    return {
        type: HOTEL_TRAVELLINE_ERROR,
        error: error
    }
}

export function createHotel(hotelInfo) {
    return async (dispatch) => {
        try {
            dispatch({type:START_REQUEST})
            const response = await axiosCustom.post(`${baseUrl}/hotel/create`, hotelInfo)
            const { data } = response

            dispatch(createHotelSuccess(data))
            return data.id
        } catch (e) {
            if (e.response) {
                dispatch(createHotelError(e.response.data))
                return false
            }
        }
    }
}
/** Метод редактирования отеля */
export function saveHotel(hotelInfo, hotelId) {
    return async (dispatch) => {
        try {
            await dispatch(getInfo())
            const response = await axiosCustom.put(`${baseUrl}/hotel/update?id=${hotelId}`, hotelInfo)
            const { data } = response

            dispatch(createHotelSuccess(data))
            return data.id
        } catch (e) {
            if (e.response) {
                dispatch(createHotelError(e.response.data))
                return e.response.data
            }
        }
    }
}
export function saveHotelPartial(hotelInfo, hotelId) {
    return async (dispatch) => {
        try {
            await dispatch(getInfo())
            const response = await axiosCustom.put(`${baseUrl}/hotel/update-partial?id=${hotelId}`, hotelInfo)
            const { data } = response

            dispatch(createHotelSuccess(data))
            return data.id
        } catch (e) {
            if (e.response) {
                dispatch(createHotelError(e.response.data))
            }
        }
    }
}
export function editHotel(hotelInfo, hotelId) {
    return async (dispatch) => {
        try {
            dispatch({type:START_REQUEST})
            await dispatch(getInfo())
            const response = await axiosCustom.put(`${baseUrl}/hotel/update-partial?id=${hotelId}`, hotelInfo)
            const { data } = response
            dispatch(createHotelSuccess(data))
            return data.id
        } catch (e) {
            if (e.response) {
                if (e.response.status == 403) {
                    dispatch(createTravelLineError(e.response.data))
                }
                else dispatch(createHotelError(e.response.data))
                return false
            }
        }
    }
}
export function setMainImageHotelSuccess(data) {
    return {
        type: SAVE_MAIN_IMAGE_SUCCESS,
        payload: data
    }
}
export function setMainImageHotel(hotelInfo, hotelId) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.put(`${baseUrl}/hotel/update-partial?id=${hotelId}`, hotelInfo)
            const { data } = response

            dispatch(setMainImageHotelSuccess(data))
            return data.main_image
        } catch (e) {
            if (e.response) {
                dispatch(createHotelError(e.response.data))
                return e.response.data
            }
        }
    }
}
/** Метод добавления изображений отеля */
export function uploadHotelImageSuccess(iamge) {
    return {
        type: UPLOAD_HOTEL_IMAGE_SUCCESS,
        payload: iamge
    }
}
export function uploadHotelImageError(error) {
    return {
        type: UPLOAD_HOTEL_IMAGE_ERROR,
        error: error
    }
}
export function uploadHotelImage(image, hotelId) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.post(`${baseUrl}/hotel/upload-image`, image.formData)
            const { data } = response
            // dispatch(uploadHotelImageSuccess(data))
            return {
                data:data,
                urlToDelete: data,
                url: data,
                id: image.id,
                isUpload:true
            }
        } catch (e) {
            if (e.response) {
                return { ...image, errors: { [e.response.data[0].field]: e.response.data[0].message },isUpload:false }
            }
        }
    }
}
export function clearErrors() {
    return {
        type: CLEAR_ERRORS,
    }
}
/** Метод добавления изображений номера */
export function uploadRoomImageSuccess(iamge) {
    return {
        type: UPLOAD_ROOM_IMAGE_SUCCESS,
        payload: iamge
    }
}
export function uploadRoomImage(image, hotelId) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.post(`${baseUrl}/room/upload-image`, image.formData)
            const { data } = response

            await dispatch(uploadRoomImageSuccess(data))

            return {
                data:data,
                urlToDelete: data,
                url: data,
                id: image.id,
                isUpload:true
            }
        } catch (e) {
            if (e.response && e.response.data) {
                return { ...image, errors: { [e.response.data[0].field]: e.response.data[0].message },isUpload:false }

            }
        }
    }
}
/** Метод удаления изображений отеля */
export function deleteHotelImageSuccess(iamge) {
    return {
        type: DELETE_HOTEL_IMAGE_SUCCESS,
        payload: iamge
    }
}
export function deleteHotelImageError(error) {
    return {
        type: UPLOAD_HOTEL_IMAGE_ERROR,
        error: error
    }
}
export function deleteErrorImage(idError) {
    return { type: DELETE_HOTEL_ERROR_IMAGE, payload: idError }
}
export function deleteHotelImage(image, hotelId) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.post(`${baseUrl}/hotel/delete-image`, {
                hotel_id: hotelId,
                image_path: image.urlToDelete
            })
            const { data } = response

            // dispatch(deleteHotelImageSuccess(image.url))
            return hotelId
        } catch (e) {
            if (e.response) {
                // dispatch(deleteHotelImageError(e.response.data))
            }
        }
    }
}
/** Метод удаления изображений номера */
export function deleteRoomImageSuccess(image) {
    return {
        type: DELETE_ROOM_IMAGE_SUCCESS,
        payload: image
    }
}

/** Метод создания реквизитов*/
export function createRequisites(params) {
    delete params.value
    delete params.label
    return async (dispatch) => {
        try {
            const response = await axiosCustom.post(`${baseUrl}/requisites/create`,params)
            return true
        } catch (e) {
            if (e.response) {
                dispatch(sendRequesitesError(e.response.data))
            }
        }
    }
}

/** Метод получения реквизитов*/
export function getRequisites() {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.get(`${baseUrl}/requisites/get`)
            const { data } = response
            dispatch({ type: GET_REQUISITES_SECCESS, payload: data })
        } catch (e) {
            if (e.response) {
                dispatch(sendRequesitesError(e.response.data))
            }
        }
    }
}

/** Метод привязки реквизитов*/
export function bindRequisites(hotelId, id) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.get(`${baseUrl}/requisites/bind?hotel_id=${hotelId}&requisites_id=${id}`)
            return true
        } catch (e) {
            if (e.response) {
                dispatch(sendRequesitesError(e.response.data))
                return false
            }
        }
    }
}

/** Метод изменения реквизитов*/
export function updateRequisites(params) {
    delete params.value
    delete params.label
    return async (dispatch) => {
        try {
            const response = await axiosCustom.post(`${baseUrl}/requisites/update`,params)
            return true
        } catch (e) {
            if (e.response) {
                dispatch(sendRequesitesError(e.response.data))
                return false
            }
        }
    }
}

/** Метод изменения реквизитов*/
export function setRequisitesDelivery(params) {
    const formatParams = `?${serialize(params)}`
    return async (dispatch) => {
        try {
            const response = await axiosCustom.post(`${baseUrl}/requisites/set-delivery${formatParams}`)
            return true
        } catch (e) {
            if (e.response) {
                dispatch(sendRequesitesError(e.response.data))
            }
        }
    }
}

export function getHotelsForDocunentsSuccess(hotels) {
    return {
        type: GET_OBJECTS_FOR_DOCUMENTS_SECCESS,
        payload: hotels
    }
}


export function sendRequesitesError(errors) {
    return {
        type: GET_REQUISITES_ERROR,
        errors: errors
    }
}

export function deleteRoomImage(image, roomId) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.post(`${baseUrl}/room/delete-image`, {
                room_id: roomId,
                image_path: image.urlToDelete
            })

            dispatch(deleteRoomImageSuccess(image))
            return roomId
        } catch (e) {
            if (e.response) {
                dispatch(deleteHotelImageError(e.response.data))
            }
        }
    }
}
/**
 * Метод получения подсказок город для формы
 * @return @array
 */
export function getCity(city) {
    return async () => {
        try {
            const response = await axios(`${process.env.REACT_APP_BACKEND_ENDPOINT}/public/region/index?country=Россия&type=City&name=${city}`)
            const { data } = response

            return data.items
        } catch (e) {

        }
    }
}
/**
 * Метод получения геоданых о новом отеле
 * @return @array
 */
export function getGeoData(address) {
    return async () => {
        try {
            const response = await axiosCustom.get(`https://geocode-maps.yandex.ru/1.x/?lang=ru_RU&apikey=${ymapsKey}&geocode=${address}&format=json`)
            const { data } = response

            return data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos
        } catch (e) {

        }
    }
}
/**
 * Метод очистки ошибок валидации
 */
export function clearHotelError(field) {
    return {
        type: CLEAR_FIELD_HOTEL_ERROR,
        field: field
    }

}
export function clearAllHotelError() {
    return {
        type: CLEAR_HOTEL_ALL_ERROR,
    }

}
/**
 * Метод получения списка всех объектов партнера
 */
export function getHotelListPartnerSuccess(hotels) {
    return {
        type: GET_OBJECTS_SUCCESS,
        payload: hotels
    }
}
export function getHotelListPartnerError(error) {
    return {
        type: GET_OBJECTS_ERROR,
        error: error
    }
}
export function getHotelListPartner(params) {
    let isObjectsForDocuments = false
    if (params) {
        isObjectsForDocuments = params.isObjectsForDocuments
        delete params.isObjectsForDocuments
    }

    const formatParams = `?${serialize(params)}`
    return async (dispatch) => {
        try {
            dispatch(startRequest())
            const response = await axiosCustom.get(`${baseUrl}/hotel/index${formatParams}`)
            const { data } = response

            if (isObjectsForDocuments) return dispatch(getHotelsForDocunentsSuccess(data))

            dispatch(getHotelListPartnerSuccess(data))
        } catch (e) {
            if (e.response) {
                dispatch(getHotelListPartnerError(e.response.data))
            }
        }
    }
}
/** Метод получения списка номеров отеля */
export function getListRoomsPartnerSuccess(rooms) {
    return {
        type: GET_ROOMS_LIST_PARTNER_SUCCESS,
        payload: rooms
    }
}
export function getListRoomsPartnerError(error) {
    return {
        type: GET_ROOMS_LIST_PARTNER_ERROR,
        error: error
    }
}
export function getListRoomsPartner(hotelId) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.get(`${baseUrl}/room/index?hotel_id=${hotelId}&expand=tariffs,beds`)
            const { data } = response

            dispatch(getListRoomsPartnerSuccess(data.items))
        } catch (e) {
            if (e.response) {
                dispatch(getListRoomsPartnerError(e.response.data))
            }
        }
    }
}

export function getReportsSuccess(reports) {
    return {
        type: GET_REPORTS_SUCCESS,
        payload: reports
    }
}
export function getReportSuccess(reports) {
    return {
        type: GET_REPORT_SUCCESS,
        payload: reports
    }
}

export function getReports(id, year, month) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.get(`${baseUrl}/report/get-partner-reports?hotel_id=${id}&year=${year}${month?`&month=${month}`:''}`)
            const { data } = response
            dispatch(getReportsSuccess(data.items))
        } catch (e) {
            if (e.response) {

            }
        }
    }
}

export function getReportsJson(id) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.get(`${baseUrl}/report/json?id=${id}&expand=hotel`)
            const { data } = response
            dispatch(getReportSuccess(data))
        } catch (e) {
            if (e.response) {

            }
        }
    }
}

export function confirmReport(id) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.post(`${baseUrl}/report/update-partner-report-confirmation`, { id })
        } catch (e) {
            if (e.response) {

            }
        }
    }
}
export function downloadReportXlsx(id) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom({
                url: `${baseUrl}/report/xlsx?id=${id}`,
                responseType: 'blob',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("refreshToken")}`
                },
            })
            return response
        } catch (e) {
            if (e.response) {

            }
        }
    }
}
export function downloadActXlsx(id) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom({
                url: `${baseUrl}/report/act?id=${id}`,
                responseType: 'blob',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("refreshToken")}`
                },
            })
            return response
        } catch (e) {
            if (e.response) {

            }
        }
    }
}
export function downloadBillXlsx(id) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom({
                url: `${baseUrl}/report/bill?id=${id}`,
                responseType: 'blob',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("refreshToken")}`
                },
            })
            return response
        } catch (e) {
            if (e.response) {

            }
        }
    }
}
/** Метод создания номера отеля */
export function createHotelRoomSuccess(rooms) {
    return {
        type: HOTEL_ROOM_CREATE_SUCCESS,
        payload: rooms
    }
}
export function createHotelRoomError(error) {
    return {
        type: HOTEL_ROOM_CREATE_ERROR,
        error: error
    }
}
export function createHotelRoom(roomInfo, hotelId) {
    return async (dispatch) => {
        try {
            await dispatch(getInfo())
            const response = await axiosCustom.post(`${baseUrl}/room/create?expand=tariffs`, { ...roomInfo, hotel_id: hotelId })
            const { data } = response

            dispatch(createHotelRoomSuccess(data))
            return data.id
        } catch (e) {
            if (e.response) {
                dispatch(createHotelRoomError(e.response.data))
            }
        }
    }
}
/** Создаем тревел лайн */
export function createTravelLine(obj) {
    return async () => {
        try {
            const response = await axiosCustom.post(`${baseUrl}/hotel/create-travel-line`, obj)
            return response
        } catch (e) {
            if (e.response) {
                return e.response.status
            }
        }
    }
}

export function checkTravelLine(id) {
    return async () => {
        try {
            const response = await axiosCustom.post(`${baseUrl}/hotel/check-travel-line-property-id`, {propertyId: id})
            return response
        } catch (e) {
            if (e.response) {
                return e.response.status
            }
        }
    }
}

/** Метод редактирования номера отеля */
export function editHotelRoomSuccess(rooms) {
    return {
        type: EDIT_HOTEL_ROOM_SUCCESS,
        payload: rooms
    }
}
export function editHotelRoom(roomId, roomInfo, hotelId) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.put(`${baseUrl}/room/update?id=${roomId}&expand=tariffs`, { ...roomInfo, hotel_id: hotelId })
            const { data } = response

            dispatch(editHotelRoomSuccess(data))
            return data.id
        } catch (e) {
            if (e.response) {
                dispatch(createHotelRoomError(e.response.data))
            }
        }
    }
}

/** Задать тип интеграции объекта */
export function setHotelIntegrationType(id, integration_type) {
    return async () => {
        try {
            await axiosCustom.put(`${baseUrl}/hotel/set-integration-type `, {id, integration_type})
            return true
        } catch (e) {

        }
    }
}

/** Добавление типов оплаты для отелей travell line */
export function setPaymentTypeSuccess (obj){
    return {
        type:SET_PAYMENT_TYPE_SUCCESS,
        payload:obj
    }
}
export function setPaymentType (obj){
    return async (dispatch)=>{
        try {
            const response = await axiosCustom.put(`${baseUrl}/hotel/set-payment-types`,obj)
            const {data} = response


            dispatch(setPaymentTypeSuccess(data.hotel))
            return {status:200}
        }catch (e) {
            if(e.response){
                return {status:e.response.status,data:e.response.data}
            }
        }
    }
}
/** Метод создания тарифа номера */
export function createRoomTariffSuccess(rooms) {
    return {
        type: CREATE_TARIFF_SUCCESS,
        payload: rooms
    }
}
export function createRoomTariffError(error) {
    return {
        type: CREATE_TARIFF_ERROR,
        error: error
    }
}
export function createRoomTariff(tariff) {
    return async (dispatch) => {
        try {
            await dispatch(getInfo())
            const response = await axiosCustom.post(`${baseUrl}/tariff/create?expand=mealType`, tariff)
            const { data } = response

            dispatch(createRoomTariffSuccess(data))
            return {status:200}
        } catch (e) {
            if (e.response) {
                dispatch(createRoomTariffError(e.response.data))
                return {status:404,errors:e.response.data}
            }
        }
    }
}
/** Получаем список тарифов */
export function getListTariffSuccess(list) {
    return {
        type: GET_LIST_TARIFF_SUCCESS,
        payload: list
    }
}
export function getListTariff(hotelId) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom(`${baseUrl}/tariff/index?hotel_id=${hotelId}&expand=mealType`)
            const { data } = response

            return dispatch(getListTariffSuccess(data.items))
        } catch (e) {

        }

    }
}
/** Удаляем тарифф */
export function deleteRoomTariffSuccess(id) {
    return {
        type: DELETE_TARIFF_SUCCESS,
        payload: id
    }
}
export function deleteRoomTariffError() {
    return {

    }
}
export function deleteRoomTariff(tariffId) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.delete(`${baseUrl}/tariff/delete?id=${tariffId}`)
            dispatch(deleteRoomTariffSuccess(tariffId))
        } catch (e) {
            if (e.response) {
                if(e.response.status == 403)dispatch(saveErrorIntegration(e.response.data.message))
                return e.response
            }
        }
    }
}
/** Удаляем комнату */
export function deleteBedSuccess(id) {
    return {
        type: DELETE_TARIFF_SUCCESS,
        payload: id
    }
}
export function deleteBedError() {
    return {

    }
}
export function deleteRoomBed(bedId) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.delete(`${baseUrl}/bed/delete?id=${bedId}`)
            const { data } = response

            dispatch(deleteBedSuccess(bedId))
        } catch (e) {
            if (e.response) {
                dispatch(createRoomTariffError(e.response.data))
            }
        }
    }
}
/** Метод для редактирования тарифа */
export function editRoomTariffSuccess(rooms) {
    return {
        type: EDIT_ROOM_TARIFF_SUCCESS,
        payload: rooms
    }
}
export function editRoomTariffError(error) {
    return {
        type: CREATE_TARIFF_ERROR,
        error: error
    }
}
export function editRoomTariff(tariff, tariffId) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.put(`${baseUrl}/tariff/update?id=${tariffId}&expand=mealType`, tariff)
            const { data } = response

            dispatch(editRoomTariffSuccess(data))
            return {status:200}
        } catch (e) {
            if (e.response) {
                dispatch(editRoomTariffError(e.response.data))
                return {status:404,errors:e.response.data}
            }
        }
    }
}
/** Метод добавления кровати в номер отеля */
export function сreateBedSuccess(rooms) {
    return {
        type: CREATE_BED_SUCCESS,
        payload: rooms
    }
}
export function сreateBedError(error) {
    return {
        type: CREATE_BED_ERROR,
        error: error
    }
}
export function сreateBed(bed) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.post(`${baseUrl}/bed/create`, bed)
            const { data } = response

            dispatch(сreateBedSuccess(data))
        } catch (e) {
            if (e.response) {
                dispatch(сreateBedError(e.response.data))
            }
        }
    }
}
/** Метод редактирования кровати в номер отеля */
export function editBedSuccess(rooms) {
    return {
        type: CREATE_BED_SUCCESS,
        payload: rooms
    }
}
export function editBedError(error) {
    return {
        type: CREATE_BED_ERROR,
        error: error
    }
}
export function editBed(bed, bedId) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.put(`${baseUrl}/bed/update?id=${bedId}`, bed)
            const { data } = response

            dispatch(editBedSuccess(data.items))
        } catch (e) {
            if (e.response) {
                dispatch(editBedError(e.response.data))
            }
        }
    }
}

export function getBedTypesAction(data) {
    return {
        type: GET_BED_TYPES,
        payload: data
    }
}

/** Получение типов кроватей */
export function getBedTypes() {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.get(`${publicBaseUrl}/bed-type/index`)
            const { data } = response
            dispatch(getBedTypesAction(data.items))
        } catch (e) {
            if (e.message) {
                throw new Error(e.message)
            }
        }
    }
}

/** Чистим услуги */
export function clearServices() {
    return {
        type: CLEAR_SERVICES
    }
}
/** Поулчение услуг номера */
export function getServicesSuccess(rooms) {
    return {
        type: GET_SERVICE_ROOM_SUCCESS,
        payload: rooms
    }
}
export function getServicesError(error) {
    return {
        type: GET_SERVICE_ROOM_ERROR,
        error: error
    }
}
export function getServices(params) {
    let formatParams = ''
    if (params) formatParams = `?${serialize(params)}`;
    return async (dispatch) => {
        try {
            const response = await axiosCustom.get(`${process.env.REACT_APP_BACKEND_ENDPOINT}/public/amenity/index${formatParams}`)
            const { data } = response

            dispatch(getServicesSuccess(data.items))
        } catch (e) {
            if (e.response) {
                dispatch(getServicesError(e.response.data))
            }
        }
    }
}
export function clearRoomInfo() {
    return {
        type: CLEAR_ROOM_INFO,
    }
}
/** Поулчение информации о номере */
export function getRoomInfoSuccess(rooms) {
    return {
        type: GET_ROOM_INFO_SUCCESS,
        payload: rooms
    }
}
export function getRoomInfoError(error) {
    return {
        type: GET_ROOM_INFO_ERROR,
        error: error
    }
}
export function getRoomInfo(roomId) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.get(`${baseUrl}/room/view?id=${roomId}&expand=tariffs,beds`)
            const { data } = response

            dispatch(getRoomInfoSuccess(data))
        } catch (e) {
            if (e.response) {
                dispatch(getRoomInfoError(e.response.data))
            }
        }
    }
}
/** Удаление номера отеля */
export function deleteRoomSuccess(roomId) {
    return {
        type: DELETE_ROOM_SUCCESS,
        payload: roomId
    }
}
export function deleteRoomError(error) {
    return {
        type: DELETE_ROOM_ERROR,
        error: error
    }
}
export function deleteRoom(roomId) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.delete(`${baseUrl}/room/delete?id=${roomId}`)
            dispatch(deleteRoomSuccess(roomId))
        } catch (e) {
            if (e.response) {
                if(e.response.status == 403)dispatch(saveErrorIntegration(e.response.data.message))
                return e.response
            }
        }
    }
}
/** Удаление отеля */
export function deleteHotelSuccess(roomId) {
    return {
        type: DELETE_HOTEL_SUCCESS,
        payload: roomId
    }
}
export function deleteHotelError(error) {
    return {
        type: DELETE_HOTEL_ERROR,
        error: error
    }
}
export function deleteHotel(hotelId) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.delete(`${baseUrl}/hotel/delete?id=${hotelId}`)

            dispatch(deleteHotelSuccess(hotelId))
        } catch (e) {
            if (e.response) {
                dispatch(deleteHotelError(e.response.data))
            }
        }
    }
}
/** Отзываем отель */
export function revokeHotelSuccess(hotel) {
    return {
        type: REVOKE_HOTEL_SUCCESS,
        payload: hotel
    }
}

export function revokeHotelError(data) {
    return {
        type: REVOKE_HOTEL_ERROR,
        error: data
    }
}

export function revokeHotel(values) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.put(`${baseUrl}/hotel/update?id=${values.id}`, { status_id: 7, revoke_reason_by_partner: values.revoke_reason_by_partner })
            const { data } = response

            dispatch(revokeHotelSuccess(data))
            return {revokeError:false,id:data.id,status:response.status}
        } catch (e) {
            if (e.response) {
                dispatch(revokeHotelError(e.response.data))
                if(e.response.data?.find(elem=>elem.field==="status_id")){
                    return {revokeError:true,status:e.response.status}
                }else if(e.response.data?.find(elem=>elem.field==="revoke_reason_by_partner")){
                    return {validation:true}
                }else{
                    return {revokeError:false,status:e.response.status}
                }
            }
        }
    }
}

/** Получаем типы отелей */
export function getTypeHotelsSuccess(types) {
    return {
        type: GET_TYPE_HOTELS,
        payload: types
    }
}
export function getTypeHotels() {
    return async (dispatch) => {
        try {
            const response = await axiosCustom(`${process.env.REACT_APP_BACKEND_ENDPOINT}/public/hotel-types/index`)
            const { data } = response

            dispatch(getTypeHotelsSuccess(data.items))
        } catch (e) {

        }
    }
}

/** Обновляем услуги */
export function changeHotelAmenitySuccess(hotel) {
    return {
        type: CHANGE_HOTEL_AMENITY,
        payload: hotel
    }
}
export function changeHotelAmenity(id, amenity) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.put(`${process.env.REACT_APP_BACKEND_ENDPOINT}/partner/hotel/update-amenities?id=${id}`, amenity)
            const { data } = response

            dispatch(changeHotelAmenitySuccess(data))
            return true
        } catch (e) {
            return false
        }
    }
}
/** Архивация отеля */
export function archiveHotelSuccess(id){
    return {
        type:ARCHIVE_HOTEL_SUCCESS,
        payload:id
    }
}
export function archiveHotel(id){
    return async (dispatch)=>{
        try{
            const response = await axiosCustom.put(`${process.env.REACT_APP_BACKEND_ENDPOINT}/partner/hotel/archive?id=${id}`)
            const {data} = response

            dispatch(archiveHotelSuccess(data))
            dispatch(getBookingArchiveHotels())
            return true
        }catch (e) {
            if(e.response){
                return false
            }
        }
    }
}

/** Получение списка архивированых отелей */
export function getListArchiveHotelsSuccess(archives){
    return {
        type:GET_ARCHIVE_HOTELS,
        payload:archives
    }
}
export function getListArchiveHotels(params){
    const formatParams = `?${serialize(params)}`
    return async (dispatch)=>{
        try {
            const response = await axiosCustom(`${process.env.REACT_APP_BACKEND_ENDPOINT}/partner/hotel/index-archive${formatParams}`)
            const {data} = response

            dispatch(getListArchiveHotelsSuccess(data))
        }catch (e) {
            
        }
    }
}

/** Востановление отеля */
// export function restoreHotelSuccess(id){
//     return {
//         type:RESTORE_ARCHIVE_HOTEL,
//         payload:id
//     }
// }
export function restoreArchiveHotel(id){
    return async (dispatch)=>{
        try{
            const response = await axiosCustom.put(`${process.env.REACT_APP_BACKEND_ENDPOINT}/partner/hotel/restore?id=${id}`)
            const {data} = response

            dispatch(getListArchiveHotels())
            return true
        }catch (e) {
            if(e.response){
                return false
            }
        }
    }
}
export function clearHotelImage (){
    return {
        type:CLEAR_HOTEL_IMAGE,
    }
}
/** Получаем типы питания */
export function getMealTypeSuccess(meals){
    return {
        type:GET_MEAL_TYPE,
        payload:meals
    }
}
export function getMealType (){
    return async (dispatch)=>{
        try {
            const response = await axiosCustom(`${process.env.REACT_APP_BACKEND_ENDPOINT}/public/meal-type/index`)
            const {data} = response

            dispatch(getMealTypeSuccess(data.items))
        }catch (e) {
            
        }
    }
}