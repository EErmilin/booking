/* eslint-disable global-require */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import axiosCustom from '../axios/axiosCustom';

i18n.use(initReactI18next).init(
    {
        resources: {
            ...require('./languages/ru-RU.json'),
            ...require('./languages/en-US.json'),
        },
        lng: 'ru-RU',
        fallbackLng: 'ru-RU',

        interpolation: {
            escapeValue: false,
        },
    },
    () => {
        axiosCustom.defaults.headers.common['Accept-Language'] = i18n.language;
    }
);
