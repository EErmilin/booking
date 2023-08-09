import React from "react"
import classes from "./Channels.module.scss";
import { useTranslation } from "react-i18next";
import CustomSelect from "../../../../components/UI/areas/CustomeSelect/CustomSelect";
import Checkbox from "../../../../components/UI/areas/Checkbox/Checkbox";
import Button from "../../../../components/UI/btns/Button/Button";


function Channels({
    bookInfo,
}) {
    const { t } = useTranslation()

    const fakeOptions = [
        {
            label: "Bnovo",
        },
    ]

    const radioTemplate = [
        {
            text: t("Channel manager"),
            value: 1
        },

    ]

    return (
        <div className={classes.channels}>
            <h2 className={classes.channels_title}>{t('personalArea.navBar.channels')}</h2>
            <div className={classes.channels_status}>Не подключено</div>
            <div className={classes.panel}>
                <Checkbox
                    className={classes.channels_checkbox}
                    classNameLabel={classes.channels_checkbox_label}
                    text={t("Channel manager")}
                ></Checkbox>
                <CustomSelect
                    label={'Channel manager'}
                    className={classes.channels_select}
                    defaultValue={fakeOptions[0]}
                    options={fakeOptions}>
                </CustomSelect>
            </div>
            <div className={classes.channels_info}>
                <div className={classes.channels_img} />
                <div>
                    Для завершения подключения и синхронизации, перейдите в личный кабинет менеджера
                    каналов и выполните сопоставление номеров и тарифов
                </div>
            </div>
            <div className={classes.channels_btns}>
                <Button
                    btnColor="outline_blue"
                    typeButton={1}
                   className={classes.channels_btns_cancel}
                >Отмена</Button>
                <Button
                    btnColor="green"
                    typeButton={1}
                >{t("profile.save")}</Button>
            </div>
        </div >
    )
}

export default Channels