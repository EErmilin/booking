import axios from 'axios';
import {authSuccess, logOutPartner, refreshAuth} from "../store/actions/authActions";
import store from "../store/store";
import TokenService from "../services/token.service";
import tokenService from "../services/token.service";

const baseUrlClient = process.env.REACT_APP_CLIENT_ENDPOINT
const baseUrlPartner = process.env.REACT_APP_PARTNER_ENDPOINT




const axiosCustom = axios.create({
    baseURL:process.env.REACT_APP_PARTNER_ENDPOINT
})
/**
 * Заголовок разрешающий устанавливать куки от сервера
 * Нужен только для рефреша
 */
axios.defaults.withCredentials = true;
axiosCustom.defaults.headers.post['Content-Type'] = 'application/json';


const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


/**
 * Перехват запросов для проверки валидности access токена
 * если токен устарел, то рефрешим его
 */
axiosCustom.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    config.headers.Authorization =token ? `Bearer ${token}` : null;
    return config;
});
/**
 * Перехват ответов для проверки авторизации
 * если токен устарел, то рефрешим его
 */
axiosCustom.interceptors.response.use(  (response) => response,
    async (error) => {
        const originalConfig = error.config;
        const refreshToken = localStorage.getItem("refreshToken")
        const userType = +localStorage.getItem("userType")
        const isRefreshing = TokenService.getPendingRefresh()

        if (error.response.status === 401 && refreshToken && userType && originalConfig && !isRefreshing) {
            TokenService.setPendingRefresh(true)
            try {
                let rs;
                if(userType == 2){
                    rs = await axiosCustom.post(`${baseUrlPartner}/user/refresh-token`, {
                        refreshToken: refreshToken
                    });
                    store.dispatch(authSuccess(rs.data));
                }else {
                    rs = await axiosCustom.post(`${baseUrlClient}/user/refresh-token`, {
                        refreshToken: refreshToken
                    });
                    store.dispatch(authSuccess(rs.data,true));
                }
                localStorage.setItem('token',rs.data.token)
                await delay(1000)
                TokenService.setPendingRefresh(false)

                return await axiosCustom(originalConfig);
            } catch (_error) {
                store.dispatch(logOutPartner())
                return Promise.reject(_error);
            }
    }else if (error.response.status === 401 && refreshToken && originalConfig){

        await delay(2000)
        return axiosCustom(originalConfig);
    }

    /**
     * перехватываем ответ и если пользователь не авторизован выбрасываем его с приватных роутов
     */
    if(error.response.status == 401  && !isRefreshing){
        TokenService.setPendingRefresh(false)
        store.dispatch(logOutPartner())
    }
    return Promise.reject(error);
});
export default axiosCustom;

