import React from 'react';
/** Сброс стилей */
import 'normalize.css';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import ReactDOM from 'react-dom';
import App from './App';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
/**Хранилище*/
import store from './store/store';

/** Конфиг для интернационализации */
import './i18n/i18n-config';

/** Общие стили */
import './commonStyle/_index.scss';
import 'antd/dist/antd.variable.min.css';

import { ErrorBoundary } from 'react-error-boundary';
import { ConfigProvider } from 'antd';
import ErrorFallback from './ErrorBoundery/ErrorFallback';
import { YMaps } from 'react-yandex-maps';
import { ymapsKey } from './apiKeys/apiKeys';
import { COLORS_VARIABLES } from './constants/colors';

/** Перехват ошибок на уровне продакшана */

// /** Отслеживание ошибок сервисом Sentry */
// Sentry.init({
//     dsn: "https://d8ac9149f1214bd481e9b97dac52e62b@o1296018.ingest.sentry.io/6522284",
//     integrations: [new BrowserTracing()],
//
//     beforeSend(event) {
//         return event.request.url.indexOf('localhost') !== -1 ? null : event;
//     },
//
//     tracesSampleRate: 1.0,
// });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <ConfigProvider>
        <YMaps query={{ apikey: ymapsKey, lang: 'ru_RU' }}>
            <Router>
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <App />
              </ErrorBoundary>
            </Router>
        </YMaps>
    </ConfigProvider>
  </Provider>
);

ConfigProvider.config({
  theme: {
    primaryColor: COLORS_VARIABLES.primaryColor,
  },
});
