import React, {useEffect} from 'react'
import { Routes, useLocation, useSearchParams } from "react-router-dom"
import { getListRoute } from "./routes/getListRoute";
import { routes } from "./routes/routes";
import { useDispatch, useSelector } from "react-redux";
import { getInfo, getInfoClient, setUserType } from "./store/actions/authActions";
import { useTranslation } from "react-i18next";
import AuthModal from "./components/UI/modals/AuthModal/AuthModal";
import { getAppUrl } from './store/actions/appActions';
import { useCookies } from "react-cookie"
import { CLIENT_ROLE, PARTNER_ROLE } from './roles/roles';


function App() {
    const roles = useSelector(state => state.auth.userInfo.user_type)
    const isAuth = useSelector(state => state.auth.isAuth)
    const refreshToken = useSelector(state => state.auth.userInfo.refreshToken)
    const dispatcher = useDispatch()
    const url = useLocation()
    const [searchParams, setSearchParams] = useSearchParams()
    const [cookies, setCookie, removeCookie] = useCookies()

    useEffect(() => {
        const admitadUidParam = "admitad_uid"
        const admitadUid = searchParams.get(admitadUidParam)
        const utmSource = searchParams.get("utm_source")
        const daysToStore = 90
        const period = daysToStore * 60 * 60 * 24 * 1000
        const expiresDate = new Date((period) + +new Date())

        const hostName = window.location.hostname
        const domain = hostName === "localhost" ? hostName : `.${hostName}`

        if (!utmSource || utmSource === "admitad" || utmSource === "Admitad") {
            if (admitadUid) {
                setCookie(admitadUidParam, admitadUid, {path: "/", expires: expiresDate, domain})
            }
        } else {
            removeCookie(admitadUidParam, {path: "/", domain})
        }

    }, [searchParams, setCookie, removeCookie])


    /**
     * Вызывается один раз за сессию при обращении к приватной странице
     * Для отрисовки данных пользователя
     */
    const { t } = useTranslation()
    useEffect(() => [
        dispatcher(getAppUrl())
    ], [dispatcher])

    useEffect(()=>{
        if(isAuth){
            if (roles == 2) {
                dispatcher(getInfo())
            } else {
                dispatcher(getInfoClient())
            }
        }
    },[dispatcher, roles,refreshToken,isAuth])


    const templateModalAuth = <AuthModal />

    const hotelId = searchParams.get("id")

    const listRoutes = getListRoute(routes, roles)

    useEffect(() => {
        if (url.pathname.includes("auth") && url.pathname.includes("partner")) {
            dispatcher(setUserType(PARTNER_ROLE))
        } else if (url.pathname.includes("auth")) {
            dispatcher(setUserType(CLIENT_ROLE))
        }
        if (url.pathname !== '/hotel') {
            document.body.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
        }
    }, [url.pathname])

    useEffect(() => {
        if (url.pathname === '/hotel') {
            document.body.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
        }
    }, [hotelId, url.pathname])

    return (
        <div className="App">
            {templateModalAuth}
            <Routes>
                {listRoutes}
            </Routes>
        </div>
    );
}

export default App;
