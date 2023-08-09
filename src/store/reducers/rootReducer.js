import { combineReducers } from 'redux';
import hotelReducer from "./hotelReducer";
import {authReducer} from "./authReducer";
import {reservationsReducer} from "./reservationsReducer";
import {objectsReducer} from "./objectsReducer";
import {supportReducer} from "./supportReducer ";
import {notificationsReducer} from "./notificationsReducer";
import catalogReducer from './catalogReducer';
import routerReducer from './routerReducer';
import {bookingReducer} from "./bookingReducer";
import {commentReducer} from "./commentReducer";
import {generalInfoReducer} from "./generalInfoReducer";
import {faqReducer} from "./faqReducer";
import {favoriteReducer} from "./favoriteReducer";
import {reviewsReducer} from "./reviewReducer";
import {blogReducer} from "./blogReducer";
import {directionsReducer} from "./directionsReducer";
import {pricesReducer} from "./pricesReducer";
import {moderationReducer} from "./moderationReducer";
import {subscribeReduser} from "./subscribeReduser";
import {contactReducer} from "./contactReducer";
import {tablePriceReducer} from "./tablePriceReducer";
import { appReducer } from './appReducer';

export default combineReducers({
    hotels:hotelReducer,
    auth:authReducer,
    notifications: notificationsReducer,
    reservations: reservationsReducer,
    objects: objectsReducer,
    support: supportReducer,
    catalog: catalogReducer,
    router: routerReducer,
    book:bookingReducer,
    comments:commentReducer,
    general:generalInfoReducer,
    faq:faqReducer,
    favorites:favoriteReducer,
    reviews:reviewsReducer,
    blog: blogReducer,
    directions:directionsReducer,
    prices:pricesReducer,
    moderation:moderationReducer,
    subscribe:subscribeReduser,
    contact:contactReducer,
    table:tablePriceReducer,
    app: appReducer,
})