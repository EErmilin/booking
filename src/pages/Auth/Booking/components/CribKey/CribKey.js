import React from "react"
import classes from "./CribKey.module.scss"
import { useTranslation } from "react-i18next";
import Button from "../../../../../components/UI/btns/Button/Button";
import Checkbox from "../../../../../components/UI/areas/Checkbox/Checkbox";
import numberFormat from "../../../../../functions/numberFormat";
import { useSelector } from "react-redux";


function CribKey({
    className,
    onChange,
    checked,
    keysCount = 1000
}) {
    const {firstBookingCompleted} = useSelector(state => state.auth.userInfo)
    const {t} = useTranslation()
    const cls = [classes.crib_key]
    if (className) cls.push(className)
    const isAuth = useSelector(state => state.auth.isAuth)
    if (!isAuth) return null
    return (
        <div className={cls.join(' ')}>
            <h2 className={classes.crib_key_title}>У вас {numberFormat(keysCount)} ключей</h2>
            <Checkbox
                text="Списать ключи в бронь"
                classNameLabel={classes.crib_key_label}
                classNameCheckBox={classes.crib_key_checkbox}
                className={classes.crib_key_checkbox_wrp}
                onChange={(event) => onChange(event.target.checked)}
                checked={checked}
                disabled={!firstBookingCompleted}
                hint={!firstBookingCompleted && `Начисленные бонусы будут доступны для списания после первого завершенного бронирования.`}
                classNameHintText={classes.hint_text}
                classNameHintWrap={classes.hint}
            >
            </Checkbox>
        </div>
    )
}

export default CribKey