import axiosCustom from "../../axios/axiosCustom";
import {
    CLEAR_HOTELS,
    GET_HOTELS_SUCCESS,
    GET_HOTELS_REQUEST,
    SET_CITY,
    GET_HOTEL_SUCCESS,
    SAVE_TARRIFF,
    SET_POPULAR,
    CLEAR_HOTEL,
    CLEAR_SIMILAR_HOTELS,
    SET_COORDINATES,
    CLEAR_COORDINATES,
    SET_LAST_HOTELS,
    GET_HOTEL_ERROR,
    CLEAR_HOTEL_ERROR,
    GET_TYPE_HOTELS,
    GET_COMMENTS_MODAL,
    GET_COMMENTS_ROOM,
    GET_SIMILAR_REQUEST, GET_SIMILAR_SUCCESS,
    GET_MAP_HOTELS, GET_CATALOG_FILTERS, GET_SIGHTS_FILTERS, CLEAR_CITY, GET_POPULAR_FILTERS, GET_SUBWAY_FILTERS, CLEAR_SUBWAY_FILTERS
} from "./actionsType";
import { ymapsKey } from "../../apiKeys/apiKeys";
import { dispatchObjectToUrl } from "../../functions/dispatchObjectToUrl";
import serialize from "../../functions/serialize";

const urlFilters = process.env.REACT_APP_BACKEND_ENDPOINT

const subwayUrl = process.env.REACT_APP_ENVIRONMENT === "production" ? "https://cdn.checkin.uno/subway_" : "https://back.testdomain23.ru/s3?path=subway_"

const baseURL = process.env.REACT_APP_BACKEND_ENDPOINT
const baseUrlPartner = `${process.env.REACT_APP_BACKEND_ENDPOINT}/partner`
export function getSearch(name) {
    return async () => {
        const url = baseURL + `/suggest${name?`?q=${name}`:""}`;
        try {
            const response = await axiosCustom.get(url);
            const { data } = response;
            return data
        } catch (e) {
            if (e.response) {
            }
        }
    };
}

export function getSimilarHotels(filters) {
    return async (dispatch) => {
        const url = baseURL + `/public/catalog/similar?${dispatchObjectToUrl(filters)}`
        try {
            dispatch({ type: GET_SIMILAR_REQUEST })
            const response = await axiosCustom.get(url);
            const { items } = response.data;
            dispatch({ type: GET_SIMILAR_SUCCESS, hotels: items.slice(0, 5) })
        } catch (e) {
            if (e.response) {
            }
        }
    };
}

export function getLastHotels(ids) {
    return async (dispatch) => {
        if (ids.length) {
            const url = baseURL + `/catalog?id=${ids}`
            try {
                const response = await axiosCustom.get(url);
                const { items } = response.data;
                dispatch({ type: SET_LAST_HOTELS, lastWatchHotels: items })
            } catch (e) {
                if (e.response) {
                }
            }
        } else {
            dispatch({ type: SET_LAST_HOTELS, lastWatchHotels: [] })
        }
    };

}

export function getPopularHotels(filters) {
    return async (dispatch) => {
        const url = baseURL + `/catalog?region_id=${6}&${dispatchObjectToUrl(filters)}&sort=-reviews_rating&per-page=4`
        const url2 = baseURL + `/catalog?region_id=${49}&${dispatchObjectToUrl(filters)}&sort=-reviews_rating&per-page=4`
        const url3 = baseURL + `/catalog?region_id=${11}&${dispatchObjectToUrl(filters)}&sort=-reviews_rating&per-page=4`
        try {
            let response = await axiosCustom.get(url);
            let response2 = await axiosCustom.get(url2);
            let response3 = await axiosCustom.get(url3);
            response = {
                title: "Популярное в Москве",
                background: require('../../assets/image/Moscaw.webp'),
                hotels: response.data.items,
            }
            response2 = {
                title: "Популярное в Симферополе",
                background: require('../../assets/image/simferopol.webp'),
                hotels: response2.data.items,
            }
            response3 = {
                title: "Популярное в Сочи",
                background: require('../../assets/image/Sochi.webp'),
                hotels: response3.data.items,
            }
            const array = [response, response2, response3]
            dispatch({ type: SET_POPULAR, hotels: array })
        } catch (e) {
            if (e.response) {
            }
        }
    };
}

export function getHotels(filters) {
    const { city_region_id, station_ids, meal_type_ids, point_of_interest_ids, region, amenity_ids, adults, children, dateFrom, dateTo, minPrice, maxPrice, compliment, rating, page, sort, perPage, type_id, is_verified, stars, arrival_time_after, arrival_time_before, departure_time_after, departure_time_before } = filters
    const minRating = rating.length ? Math.min(...rating) : 0
    return async (dispatch) => {
        let url;
        if (filters.preview) {
            url = baseURL + `/public/catalog/content-index?${rating ? `reviews_rating_from=${rating}` : ''}${region.id
                ? '&region_id=' + region.id : ''}${compliment
                    ? '&has_compliment=' + compliment : ''}${page
                        ? '&page=' + page : ''}`
        } else {
            if (region.type === 'hotel') {
                url = baseURL + `/catalog?id=${region.id}${dateFrom
                    ? '&date_arrival=' + dateFrom : ''}${dateTo
                        ? '&date_departure=' + dateTo : ''}${adults
                            ? '&room_adult_count=' + adults : ''}${children
                                ? '&room_child_count=' + children : ''}&expand=rooms.amenities.group,rooms.tariffs`
            } else {
                url = baseURL + `/catalog?${city_region_id ? `&city_region_id=${city_region_id}` : ""}${region.id
                    ? 'region_id=' + region.id : ''}${compliment
                        ? '&has_compliment=' + compliment : ''}${'&price_from=' + (!!minPrice
                            ? minPrice : '0')}${maxPrice || maxPrice === 0
                                ? '&price_to=' + maxPrice : ''}${children
                                    ? '&room_child_count=' + children : ''}${minRating
                                        ? '&reviews_rating_from=' + minRating : ''}${stars
                                            ? '&star_rating=' + stars : ''}${dateFrom
                                                ? '&date_arrival=' + dateFrom : ''}${dateTo
                                                    ? '&date_departure=' + dateTo : ''}${adults
                                                        ? '&room_adult_count=' + adults : ''}${sort
                                                            ? '&sort=' + sort : ''}${page
                                                                ? '&page=' + page : ''}${perPage
                                                                    ? `&per-page=${perPage}` : ''}${type_id
                                                                        ? `&type_id=${type_id}` : ''}${is_verified
                                                                            ? `&is_verified=${is_verified}` : ''}${amenity_ids
                                                                                ? `&amenity_ids=${amenity_ids}` : ''}${arrival_time_after
                                                                                    ? `&arrival_time_after=${arrival_time_after}` : ''}${arrival_time_before
                                                                                        ? `&arrival_time_before=${arrival_time_before}` : ''}${departure_time_after
                                                                                            ? `&departure_time_after=${departure_time_after}` : ''}${departure_time_before
                                                                                                ? `&departure_time_before=${departure_time_before}` : ''}${point_of_interest_ids
                                                                                                    ? `&point_of_interest_ids=${point_of_interest_ids}` : ''}${meal_type_ids
                                                                                                        ? `&meal_type_ids=${meal_type_ids}` : ''}${station_ids
                                                                                                            ? `&station_ids=${station_ids}` : ''}${filters["actual_filters_click[value]"]
                                                                                                                ? `&actual_filters_click[value]=${filters["actual_filters_click[value]"]}` : ''}${filters["actual_filters_click[name]"]
                                                                                                                    ? `&actual_filters_click[name]=${filters["actual_filters_click[name]"]}` : ''}&expand=rooms.amenities.group,rooms.tariffs`;
            }
        }
        try {
            dispatch({ type: GET_HOTELS_REQUEST })
            clearHotels()
            const response = await axiosCustom.get(url);
            const { items, _links, _meta, aggregations } = response.data;
            dispatch(setHotels(items, _meta, aggregations))
        } catch (e) {
            if (e.response) {

            }
        }
    }
}

export function getMapHotels(filters, config) {
    const { city_region_id, station_ids, meal_type_ids, point_of_interest_ids, region, amenity_ids, adults, children, dateFrom, dateTo, minPrice, maxPrice, compliment, rating, sort, type_id, is_verified, stars, arrival_time_after, arrival_time_before, departure_time_after, departure_time_before } = filters

    const minRating = rating.length ? Math.min(...rating) : 0
    return async (dispatch) => {
        let url;
        url = baseURL + `/public/catalog/on-map?${city_region_id ? `city_region_id=${city_region_id}` : ""}${region.id
            ? `${region.type === "hotel" ? 'id=' : 'region_id='}` + region.id : ''}${compliment
                ? '&has_compliment=' + compliment : ''}${minPrice || minPrice === 0
                    ? '&price_from=' + minPrice : ''}${maxPrice || maxPrice === 0
                        ? '&price_to=' + maxPrice : ''}${minRating
                            ? '&reviews_rating_from=' + minRating : ''}${stars
                                ? '&star_rating=' + stars : ''}${children
                                    ? '&room_child_count=' + children : ''}${minRating
                                        ? '&reviews_rating_from=' + minRating : ''}${dateFrom
                                            ? '&date_arrival=' + dateFrom : ''}${dateTo
                                                ? '&date_departure=' + dateTo : ''}${adults
                                                    ? '&room_adult_count=' + adults : ''}${sort
                                                        ? '&sort=' + sort : ''}${type_id
                                                            ? `&type_id=${type_id}` : ''}${is_verified
                                                                ? `&is_verified=${is_verified}` : ''}${amenity_ids
                                                                    ? `&amenity_ids=${amenity_ids}` : ''}${arrival_time_after
                                                                        ? `&arrival_time_after=${arrival_time_after}` : ''}${arrival_time_before
                                                                            ? `&arrival_time_before=${arrival_time_before}` : ''}${departure_time_after
                                                                                ? `&departure_time_after=${departure_time_after}` : ''}${departure_time_before
                                                                                    ? `&departure_time_before=${departure_time_before}` : ''}${point_of_interest_ids
                                                                                        ? `&point_of_interest_ids=${point_of_interest_ids}` : ''}${meal_type_ids
                                                                                            ? `&meal_type_ids=${meal_type_ids}` : ''}${station_ids
                                                                                                ? `&station_ids=${station_ids}` : ''}&expand=rooms.amenities.group,rooms.tariffs`;
        try {
            const configRequest = {
                url: url,
                ...config
            }
            const response = await axiosCustom(configRequest);
            dispatch({ type: GET_MAP_HOTELS, mapHotels: response.data })
            return true
        } catch (e) {
            if (e.response) {
                return false
            }
        }
    }
}

export function getHotelPage(filters) {
    const { region, dateFrom, dateTo, minPrice, maxPrice } = filters
    return async (dispatch) => {
        dispatch(clearHotelError())
        let url;
        if (filters.preview) {
            url = baseURL + `/public/hotel/preview?id=${region.id}`
        } else {
            if (region.type === 'hotel' || region.type === null) {
                url = baseURL + `/public/hotel/view?id=${region.id}${dateFrom
                    ? '&date_arrival=' + dateFrom : ''}${dateTo
                        ? '&date_departure=' + dateTo : ''}${filters.adults && filters.adults
                            ? '&room_adult_count=' + filters.adults : ''}${filters.children
                                ? '&room_child_count=' + filters.children : ''}${minPrice
                                    ? '&price_from=' + minPrice : ''}${maxPrice
                                        ? '&price_to=' + maxPrice : ''}&expand=hotel.room.tariff.mealType`
            }
        };
        try {
            const response = await axiosCustom.get(url);
            let hotel = response.data
            const hotelComments = await dispatch(getHotelComments(region.id))
            dispatch({ type: GET_HOTEL_SUCCESS, hotel, hotelComments })
            return hotel
        } catch (e) {
            if (e.response) {
                dispatch({ type: GET_HOTEL_ERROR, errors: e.response })
                dispatch(clearHotel())
                return false
            }
        }
    }
}

export function getHotelPageEdit(id) {
    return async (dispatch) => {
        dispatch(clearHotelError())
        let url;
        url = baseURL + `/partner/hotel/preview?id=${id}`
        try {
            const response = await axiosCustom.get(url);
            let hotel = response.data
            dispatch({ type: GET_HOTEL_SUCCESS, hotel })
        } catch (e) {
            if (e.response) {
                dispatch({ type: GET_HOTEL_ERROR, errors: e.response })
            }
        }
    }
}

export function getHotelComments(id) {
    return async () => {
        const url = baseURL + `/public/reviews/index?per-page=100&hotel_id=${id}`
        try {
            const response = await axiosCustom.get(url);
            const { items } = response.data
            return items
        } catch (e) {
            if (e.response) {
            }
        }
    }
}
export function getHotelCommentsRoom(id) {
    return async (dispatch) => {
        const url = baseURL + `/public/reviews/index?hotel_id=${id}&expand=booking,hotel&per-page=100`
        try {
            const response = await axiosCustom.get(url);
            const { data } = response
            dispatch({ type: GET_COMMENTS_ROOM, payload: data.items })
        } catch (e) {
            if (e.response) {
            }
        }
    }
}
export function getHotelCommentsModal(id, params) {
    const formatParams = `&${serialize(params)}`
    return async (dispatch) => {
        const url = baseURL + `/public/reviews/index?hotel_id=${id}&expand=booking,answers${formatParams}`
        try {
            const response = await axiosCustom.get(url);
            const { data } = response
            dispatch({ type: GET_COMMENTS_MODAL, payload: data })
        } catch (e) {
            if (e.response) {
            }
        }
    }
}

export function getRoomTariff(filters) {
    const { region, adults, children, dateFrom, dateTo } = filters
    return async (dispatch) => {
        let url;
        if (region.type === 'hotel' || region.type === null) {
            url = baseURL + `public/room/view?id=${region.id}${dateFrom
                ? '&date_arrival=' + dateFrom : ''}${dateTo
                    ? '&date_departure=' + dateTo : ''}${adults
                        ? '&room_adult_count=' + adults : ''}${children
                            ? '&room_child_count=' + children : ''}&expand=tariffs`
            try {
                const response = await axiosCustom.get(url);
                let tariff = response.data
                dispatch({ type: SAVE_TARRIFF, tariff })
            } catch (e) {
                if (e.response) {

                }
            }
        };
    }
}


export function saveHotelInfo(filters, isPreview) {
    return async (dispatch) => {
        try {
            let hotel
            if (isPreview) {
                hotel = dispatch(getRoomPreview(filters))
            } else {
                hotel = dispatch(getHotelInfo(filters))
            }
            Promise.resolve(hotel).then(function (hotel) {
                dispatch({ type: GET_HOTEL_SUCCESS, hotel })
            });
        } catch (e) {
            if (e.response) {

            }
        }
    };
}

export function getHotelInfo(filters) {
    return async (dispatch) => {
        let url;
        if (filters.preview === 'true') {
            url = baseURL + `/public/room/preview?${dispatchObjectToUrl(filters)}`;
        } else {
            url = baseURL + `/public/room/view?${serialize(filters)}`;
        }
        try {
            const response = await axiosCustom.get(url);
            const { data } = response;
            return data
        } catch (e) {
            if (e.response) {

            }
        }
    };
}

export function getRoomPreview(filters) {
    return async () => {
        const url = baseUrlPartner + `/room/preview?${dispatchObjectToUrl(filters)}`
        try {
            const response = await axiosCustom.get(url);
            const { data } = response;
            return data

        } catch (e) {
            if (e.response) {

            }
        }
    };
}

export function getCityNameById(id) {
    return async (dispatch) => {
        try {
            const response = await axiosCustom.get(`${baseURL}/public/region/index?per-page=100&fields=id%2Cname&id=${id}&type=City`)
            const { data } = response
            dispatch(setCity(data.items[0].name.ru))
        } catch (e) {

        }
    }
}

export function getGeoData(cityId, type) {
    if (!cityId) {
        return { type: SET_COORDINATES, coordinates: ['55.755289', '37.622632'] }
    }

    return async (dispatch) => {
        let url;
        if (type === "city-region") {
            url = baseURL + `/public/city-region/view?id=${cityId}`;
        } else {
            url = baseURL + `/public/region/view?id=${cityId}`;
        }


        try {
            const response = await axiosCustom.get(url);
            const { data } = response;

            dispatch(setCity(data.name.ru))
            dispatch({ type: SET_COORDINATES, coordinates: [data.lat, data.lon] })
            return data
        } catch (e) {
            if (e.response) {
            }
        }
        // try {
        //     const response = await axiosCustom.get(`https://geocode-maps.yandex.ru/1.x/?lang=ru_RU&apikey=${ymapsKey}&geocode=${city}&format=json`)
        //     const { data } = response
        //     const cords = data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ');
        //     dispatch({ type: SET_COORDINATES, coordinates: [cords[1], cords[0]] })
        // } catch (e) {
        // }
    }
}

export function clearCoordinates() { return { type: CLEAR_COORDINATES } }

export function setHotels(hotels, _meta, aggregations) {
    return {
        type: GET_HOTELS_SUCCESS,
        hotels,
        _meta,
        aggregations
    }
}

export function clearCity() {
    return {
        type: CLEAR_CITY
    }
}

export function setCity(city) {
    return {
        type: SET_CITY,
        city
    }
}

export function clearHotels() {
    return {
        type: CLEAR_HOTELS
    }
}

export function clearSimilarHotels() {
    return {
        type: CLEAR_SIMILAR_HOTELS
    }
}

export function clearHotel() {
    return {
        type: CLEAR_HOTEL
    }
}

export function clearHotelError() {
    return {
        type: CLEAR_HOTEL_ERROR
    }
}
/** Подтягиваем фильтры из админки */
export function getFiltersCatalogSuccess(filters) {
    return {
        type: GET_CATALOG_FILTERS,
        payload: filters
    }
}

export function getFiltersCatalog(filters) {
    const formatParams = `?${serialize(filters)}`
    return async (dispatch) => {
        try {
            const url = urlFilters + `/public/catalog-filters/index${formatParams}`
            const response = await axiosCustom(url)
            const { data } = response

            dispatch(getFiltersCatalogSuccess(data.items))
        } catch (e) {

        }
    }
}
/** Получаем типы отелей */
export function getTypeHotels() {
    return async (dispatch) => {
        try {
            const response = await axiosCustom(`${urlFilters}/public/hotel-types/index`)
            const { data } = response

            dispatch({ type: GET_TYPE_HOTELS, payload: data.items })
        } catch (e) {

        }
    }
}

/** Подтягиваем достопремичательности */
export function getSightsSuccess(items) {
    return {
        type: GET_SIGHTS_FILTERS,
        payload: items
    }
}
export function getSights(params) {
    let query = ''
    if (params.type === "region") {
        query = `?city_id=${params.id}`
    } else {
        query = `?region_id=${params.city_region_id}`
    }
    return async (dispatch) => {
        try {
            const response = await axiosCustom(`${urlFilters}/public/point-of-interest/index${query}`)
            const { data } = response

            dispatch(getSightsSuccess(data.items))
        } catch (e) {

        }
    }
}
/** Подтягиваем метро */
export function getSubwaySuccess(items) {
    return {
        type: GET_SUBWAY_FILTERS,
        payload: items
    }
}
export function getSubway(params) {
    return async (dispatch) => {
        try {
            let query = ''
            if (params.type === "region") {
                query = `?city_id=${params.id}&expand=station`
            } else return dispatch({ type: CLEAR_SUBWAY_FILTERS })
            const response = await axiosCustom(`${urlFilters}/public/subway/index${query}`)
            const { data } = response

            dispatch(getSubwaySuccess(data.items))
        } catch (e) {

        }
    }
}
export function clearSubway() {
    return {
        type: CLEAR_SUBWAY_FILTERS,
    }
}
export function getConfigSubway(params) {
    return async (dispatch) => {
        try {
            let query = ''
            const response = await axiosCustom(`${subwayUrl}${params.id}`)
            const { data } = response

            dispatch(getSubwaySuccess(data.station))
        } catch (e) {

        }
    }
}
/** Подтягиваем популярные фильтры */
export function getPopularFiltersSuccess(items) {
    return {
        type: GET_POPULAR_FILTERS,
        payload: items
    }
}
export function getPopularFilters(params) {
    let query = ''
    if (params.type === "region") {
        query = `?region_id=${params.id}`
    } else {
        query = `?city_region_id=${params.city_region_id}`
    }
    return async (dispatch) => {
        try {
            const response = await axiosCustom(`${urlFilters}/public/catalog-filters/popular-filters${query}`)
            const { data } = response

            dispatch(getPopularFiltersSuccess(data))
        } catch (e) {

        }
    }
}