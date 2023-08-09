import React from "react";
import {Navigate, useLocation} from "react-router-dom"
import { useSelector} from "react-redux";
import {PARTNER_ROLE} from "../../roles/roles";
import TokenService from "../../services/token.service";

/**
 * Промежуточный компонент отслеживания приватных маршрутов
 * @param path
 * @param exact
 * @param element
 * @param rest
 * @returns {JSX.Element}
 * @constructor
 */

function PrivateRoute ({
    path,
    exact,
    element,
    children,
    userRoles,
    ...rest
}){
    const isAuth = useSelector(state => state.auth.isAuth)
    let userType = localStorage.getItem('userType')
    const location = useLocation()

    if (location.pathname.indexOf('auth=partner') > 0) {
        if (isAuth) {
           return <Navigate to="/personal-area/objects/1" />
        }
        return <Navigate to="/auth/partner/login" state={`${location.pathname}${location.search}`} />
    }

    if (!isAuth && !TokenService.getPendingRefresh()) {
        if(userType == PARTNER_ROLE){
            return <Navigate to="/auth/partner/login" state={`${location.pathname}${location.search}`} />
        }else{
            return <Navigate to="/auth/login" state={`${location.pathname}${location.search}`} />
        }
    }

    return children

}

export default PrivateRoute