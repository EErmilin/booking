import React from "react"
import classes from "./CardPay.module.scss"
import { useTranslation } from "react-i18next";
import Input from "../UI/areas/Input/Input";
import Checkbox from "../UI/areas/Checkbox/Checkbox";

function CardPay() {
    const { t } = useTranslation()

    return (
        <div className={classes.cardPay}>
            <div className={classes.cardPay_data}>
                <Input
                    typeClsInput="field"
                    label={t("booking.cardPay.number")}
                    placeholder={"1234 5678 9123 4567"}
                ></Input>
                <div className={classes.cardPay_row}>
                    <Input
                        className={classes.cardPay_input}
                        typeClsInput="field"
                        label={t("booking.cardPay.date")}
                        mask={"99/99"}
                        placeholder={"12 / 25"}
                    ></Input>
                    <Input
                        className={classes.cardPay_input}
                        typeClsInput="field"
                        label={t("CVC/CVV")}
                        placeholder={123}
                    ></Input>
                </div>
                <Input
                    typeClsInput="field"
                    label={t("booking.cardPay.name")}
                    placeholder={"IVAN IVANOV"}
                ></Input>
                <Checkbox
                    className={classes.cardPay_checkbox}
                    text={t('booking.cardPay.save')}
                />
            </div>
            <div className={classes.cardPay_lock} />
        </div>
    )
}

export default CardPay