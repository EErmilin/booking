import React, { useEffect } from "react"
import classes from "./ListRequisites.module.scss";
import Requisites from "../Requisites/Requisites";
import { getHotelListPartner } from "../../../../../store/actions/partnerHotelsActions";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";


function ListRequisites() {
    const dispatcher = useDispatch()
    const { t } = useTranslation()
    const listHotel = useSelector(state => state.objects.hotels)



    useEffect(() => {
        dispatcher(getHotelListPartner({'per-page': 6, expand: "requisites", page: 1 }))
    }, [])

    if (listHotel.length) {
        return (
            <div className={classes.objects}>
                <h2 className={classes.objects_title}>Реквизиты и документооборот</h2>
                <Requisites />
            </div>
        )
    } else {
        return (
            <div className={classes.empty_wrap}>
                <h2 className={classes.objects_title}>Реквизиты и документооборот</h2>
                <div className={classes.empty}>
                    <p className={classes.empty_text}>{t("requisites.emptyTitle")}</p>
                </div>
            </div>
        )
    }

}

export default ListRequisites