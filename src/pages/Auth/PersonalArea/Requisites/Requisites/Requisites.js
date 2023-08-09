import React, { useCallback, useEffect, useMemo, useState } from "react"
import classes from "./Requisites.module.scss";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import usePagination from "../../../../../hooks/usePagination";
import { clearHotelInfo, getHotelListPartner, getTypeHotels } from "../../../../../store/actions/partnerHotelsActions";
import RequisiteItem from "./RequisiteItem";


function ListRequisites() {
    const { t } = useTranslation()
    const [otherParams, setOtherParams] = useState({ 'per-page': 6, expand: "requisites" })
    const dispatcher = useDispatch()
    const {page} = useParams()
    const listHotel = useSelector(state => state.objects.hotels)
    const total = useSelector(state => state.objects.total)

    useEffect(() => {
        dispatcher(clearHotelInfo())
    }, [])

    /** Обертка для получения инфы объектов партнера */
    const getInfo = useCallback(async (params) => {
        return await dispatcher(getHotelListPartner({ ...params,page:page }))
    }, [page])

    const templateHotels = useMemo(() => {
        return listHotel.map((elem, id) => {
            return <RequisiteItem object={elem} key={id} />
        })
    }, [listHotel])


    const titles = ["Название", "Статус проверки привязки к объекту", "Статус проверки реквизитов"]

    const renderTitles = titles.map((elem, id) => {
        return <div
            key={id}
            className={classes.object_props}
        ><span>{t(elem)}</span>
        </div>
    })

    const [pagination] = usePagination({
        getInfo: getInfo,
        limit: 6,
        total: total,
        otherParams: otherParams,
        className: classes.pagination,
    });

    return (
        <div className={classes.objects}>
            <div className={classes.object_area}>
                <div className={classes.objects_props_titles}>
                    {renderTitles}
                </div>
                {templateHotels}
                {pagination}
            </div>
        </div>
    )
}

export default ListRequisites