import React, { Fragment } from "react";
import {NavLink} from "react-router-dom";
import classes from "./Breadcrumbs.module.scss";


const Breadcrumbs = ({ className, breadcrumbs }) => {
    /** Формируем стили обертки */
    const cls = [classes.Breadcrumbs];
    if (className) {
        cls.push(className);
    }

    /** Рендерим массив хлебных крошек */
    const breadcrumbsTemplate = breadcrumbs.map(({ name, url }) => (
        <Fragment key={name}>
            <NavLink to={url} className={classes.item}>
                {name}
            </NavLink>
        </Fragment>
    ));

    return 
    <div className={cls.join(' ')}>{breadcrumbsTemplate}</div>;
};

export default Breadcrumbs;

