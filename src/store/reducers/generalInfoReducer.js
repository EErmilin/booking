import {
  GET_CONTACTS_SUCCESS,
  GET_GENERAL_INFO_SUCCESS,
  GET_FOOTER_LINKS,
  GET_SOCIAL_MEDIAS_SUCCESS, GET_PAYMENTS, GET_TERMS_RESEARCH
} from "../actions/actionsType";


const initialState = {
  info: null,
  errors: null,
  socialMedias: null,
  contacts: null,
  footerLinks: [],
  payments: {},
  termsResearch:{}
}

export function generalInfoReducer(state = initialState, action) {
  switch (action.type) {
    case GET_GENERAL_INFO_SUCCESS: {
      return {
        ...state,
        info: action.payload
      }
    }
    case GET_PAYMENTS:{
      return {
        ...state,
        payments: action.payload
      }
    }
    case GET_SOCIAL_MEDIAS_SUCCESS: {
      return {
        ...state,
        socialMedias: action.payload
      }
    }
    case GET_CONTACTS_SUCCESS: {
      return {
        ...state,
        contacts: action.payload
      }
    }
    case GET_FOOTER_LINKS: {
      return {
        ...state,
        footerLinks: action.payload
      }
    }
    case GET_TERMS_RESEARCH:{
      return {
        ...state,
        termsResearch: action.payload
      }
    }
    default: {
      return state
    }
  }
}