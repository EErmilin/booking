import React from "react";
import classes from "./Page404.module.scss";
import { useTranslation } from "react-i18next";
import {NavLink} from "react-router-dom";

function PageNotFound (){
    const { t } = useTranslation();

    return (
        <div className={classes.wrap}>
            <div className={classes.content}>
                <div className={classes.num}>404</div>
                <div className={classes.title}>{t("errorPages.404.title")}</div>
                <div className={classes.description}>{t("errorPages.404.description")}</div>
                <div className={classes.button}>
                    <NavLink className={classes.link} to={'/'}>{t("errorPages.404.backButtonText")}</NavLink>
                </div>
            </div>
        </div>
    )
}

export default PageNotFound