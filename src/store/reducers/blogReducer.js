import {
    GET_TITLES,
    GET_TITLE,
    GET_TEGS
} from "../actions/actionsType";


const initialValues = {
    title: null,
    _meta: null,
    tags: [],
    titles: [],
    errors: {},

}

export function blogReducer(state = initialValues, action) {
    switch (action.type) {
        case GET_TITLES: {
            return {
                ...state,
                titles: action.titles,
                _meta: action._meta,
            }
        }
        case GET_TITLE: {
            return {
                ...state,
                title: action.title,
            }
        }
        case GET_TEGS: {
            return {
                ...state,
                tags: action.tags,
            }
        }
        default: return state
    }
}