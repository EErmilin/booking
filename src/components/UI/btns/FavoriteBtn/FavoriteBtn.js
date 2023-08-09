import React from "react";
import classes from "./FavoriteBtn.module.scss";
import Button from "../Button/Button";
import { useTranslation } from "react-i18next";


function FavoriteBtn({
    className,
    children,
    btnColor,
    onClick,
    favoriteCount,
    notification,
    ...rest
}) {
    const { t } = useTranslation()
    const cls = []

    if (className) {
        cls.push(className)
    }

    return (
        <div className={cls.join(' ')}>
            <Button className={classes.btn_style}>
                <div className={classes.notification}>{favoriteCount}</div>
            </Button>
            <Button className={classes.bell_btn}>
                <div className={classes.notification}>8</div>
            </Button>
        </div>
    )
}

export default FavoriteBtn