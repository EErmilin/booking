import React, {useEffect, useMemo,useCallback, useState} from "react"
import classes from "./ListModeration.module.scss";
import ModerationLine from "../../../../../components/UI/line/ModerationLine/ModerationLine";
import {useTranslation} from "react-i18next";
import usePagination from "../../../../../hooks/usePagination";
import {useDispatch, useSelector} from "react-redux";
import {getPartnerModeration} from "../../../../../store/actions/moderationActions";
import {useParams} from "react-router-dom";


function ListModeration ({

}){
    const {t} = useTranslation()
    const moderation = useSelector(state => state.moderation.list)
    const total = useSelector(state=>state.moderation.total)
    const [otherParams,setOtherParams] = useState({'per-page':6})
    const dispatcher = useDispatch()
    const {page} = useParams()

    /** Обертка для получения инфы объектов партнера */
    const getInfo = useCallback(async (params)=>{
        return await dispatcher(getPartnerModeration(null,{...params,page:page}))
    },[page])
    const templateModeration = useMemo(()=>{
        return moderation && moderation.reduce((unique,item)=>unique.find(elem=>elem.hotel_id==item.hotel_id)?unique:[...unique,item],[]).map((elem,id)=>{
            return (
                <ModerationLine
                    moderation={elem}
                    key={id}
                >
                </ModerationLine>
            )
        })
    },[moderation])
    const titlesArr = [
        t("support.moderationList.name"),
        t("support.moderationList.status"),
        t("support.moderationList.accepted"),
    ]

    const paginaion = usePagination({
        getInfo:getInfo,
        limit:6,
        total:total,
        otherParams:otherParams
    })
    const templateTitles = titlesArr.map((elem,id)=>{
        return (
            <div
                key={id}
                className={classes.list_moderation_title}
            >
                {elem}
                <div className={classes.list_moderation_sort} />
            </div>
        )
    })
    return (
        <div className={classes.list_moderation}>
            {moderation && moderation.length?
                <>
                    <div className={classes.list_moderation_header}>
                        {templateTitles}
                    </div>
                    <div className={classes.list_moderation_list}>
                        {templateModeration}
                    </div>
                    <div className={classes.list_moderation_pagination}>
                        {paginaion}
                    </div>
                </>:
                <div className={classes.list_moderation_empty}>
                    <h2 className={classes.list_moderation_empty_title}>
                        {t('support.hotelModeration.empty')}
                    </h2>
                </div>
            }
        </div>
    )
}

export default ListModeration