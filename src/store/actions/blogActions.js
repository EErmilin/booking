import axiosCustom from "../../axios/axiosCustom";
import {
    GET_TITLES,
    GET_TITLE,
    GET_TEGS
} from "./actionsType";

const baseUrl = process.env.REACT_APP_BACKEND_ENDPOINT

export function getTitles(id, page) {

    return async (dispatch) => {
        const url = baseUrl + `/public/blog/index?per-page=12${id && id !=='0' ? `&tag_id=${id}` : ''}&published=true${page ? `&page=${page}` : ''}&expand=tags.tag`
        try {
            const response = await axiosCustom.get(url);
            const { items, _meta } = response.data;
            dispatch({ type: GET_TITLES, titles: items, _meta: _meta })
        } catch (e) {
            if (e.response) {
            }
        }
    };
}

export function getTegs() {
    return async (dispatch) => {
        const url = baseUrl + `/public/tags/index?per-page=100`
        try {
            const allTeg = {
                name: { ru: 'Все статьи' },
                id: 0
            }
            const response = await axiosCustom.get(url);
            const { items, _meta } = response.data;
            items.unshift(allTeg)
            dispatch({ type: GET_TEGS, tags: items })
        } catch (e) {
            if (e.response) {
            }
        }
    };
}

export function getTitle(id) {

    return async (dispatch) => {
        const url = baseUrl + `/public/blog/view?id=${id}&expand=tags.tag`
        try {
            const response = await axiosCustom.get(url);
            dispatch({ type: GET_TITLE, title: response.data })
        } catch (e) {
            if (e.response) {
            }
        }
    };
}
