import React from "react";
import {Route} from "react-router-dom";
import PrivateRoute from "./PrivateRoute/PrivateRoute";
import WrapperComponent from "../components/Wrappers/WrapperComponent/WrapperComponent";
import {useDispatch} from "react-redux";
import {getInfo, getInfoClient} from "../store/actions/authActions";



/**
 * На входе массив с инфой о роутах и список ролей юзера
 * на выходе список роутов
 * @param routes
 * @param userRoles
 * @param url
 * @param rest
 * @returns {*}
 */


export function getListRoute (routes, userRoles, url = '', ...rest){
    return routes.map(({path='',component,privateUrl,exact,routes,headerType,footerType,roles},key)=>{
        /** Если роли указаны, то это маршрут для ограниченного числа юзеров */
        if (roles) {
            const arrCoincidences = roles.filter((e) => e==userRoles);
            if (!arrCoincidences.length) return null;
        }

        return privateUrl
            ?
            (
                <Route
                    path={path}
                    exact={exact}
                    element={
                        <PrivateRoute
                            userRoles={userRoles}
                            exact={exact}
                            path={path}
                            key={key}
                        ><WrapperComponent headerType={headerType} footerType={footerType} >{component}</WrapperComponent></PrivateRoute>
                    }
                    key={key}
                />
            )
            : <Route
                path={path}
                exact={exact}
                element={(<WrapperComponent headerType={headerType} footerType={footerType} >{component}</WrapperComponent>)}
                key={key}
            />
    })
}