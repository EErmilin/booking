import React, { useEffect, useMemo } from "react"
import classes from "./PersonalArea.module.scss";
import PersonalAreaNavBar from "../../../components/PersonalAreaNavBar/PersonalAreaNavBar";
import Breadcrumbs from "../../../components/Breadcrumbs/Breadcrumbs";
import { useTranslation } from "react-i18next";
import { Route, Routes, useNavigate, useParams, useLocation } from "react-router-dom"
import {useSelector} from "react-redux";


function PersonalArea({ routes }) {
    const userRoles =  useSelector(state => state.auth.userInfo.user_type)
    const { t } = useTranslation()
    const navigate = useNavigate()
    const urlParams = useParams()
    const location = useLocation();

    /** Формируем хлебные крошки */
    const BREADCRUMBS = useMemo(
        () => [
            {
                name: t("personalArea.breadCrumbsTitle"),
                url: ''
            },
        ],
        []
    );

    useEffect(() => {
        if (!urlParams['*'].length) {
            navigate("profile")
        }
    })

    const templateRoutes = routes.map(({ path = '', component, privateUrl, exact, routes, headerType, footerType, roles }, key) => {
        if (roles) {
            const arrCoincidences = roles.filter((e) => e==userRoles);
            if (!arrCoincidences.length) return null;
        }
        return (
            <Route
                path={path}
                exact={exact}
                key={key}
                element={component}
            />
        )
    })

    const isShowNavBar = location.pathname !== '/personal-area/reservations/reservation' && !location.pathname.includes('/personal-area/reports/') //Поправить тут страницу

    if (!isShowNavBar) {
        return <Routes>
            {templateRoutes}
        </Routes>
    }



    return (
        <div className={classes.wrap}>
            {/*<Breadcrumbs breadcrumbs={BREADCRUMBS}></Breadcrumbs>*/}
            <div className={classes.container}>
                <div className={classes.navbar}>
                    {isShowNavBar && <PersonalAreaNavBar />}
                </div>
                <div className={classes.content}>
                    <Routes>
                        {templateRoutes}
                    </Routes>
                </div>
            </div>
        </div>
    )
}

export default PersonalArea