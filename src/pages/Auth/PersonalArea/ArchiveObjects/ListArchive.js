import React, {useCallback, useMemo, useState,useEffect} from "react"
import classes from "./ListArchive.module.scss"
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {getListArchiveHotels, getTypeHotels} from "../../../../store/actions/partnerHotelsActions";
import {useParams} from "react-router-dom";
import usePagination from "../../../../hooks/usePagination";
import ArchiveItem from "./components/ArchiveItem";
import useToggleVisibility from "../../../../hooks/useToggleVisibility";
import EmptyModal from "../../../../components/UI/modals/EmptyModal/EmptyModal";



function ListArchive ({

}){
    const [otherParams,setOtherParams] = useState({'per-page':6,expand:"rooms"})
    const {t} = useTranslation()
    const dispatcher = useDispatch()
    const listHotel = useSelector(state => state.objects.archiveHotels)

    /** Модалка успешной архивации объекта */
    const [modalArchiveSuccess,setModalArchiveSuccess,closeModalArchiveSuccess] = useToggleVisibility()
    const templateModalSuccess = modalArchiveSuccess && <EmptyModal
        close={true}
        background="blue"
        btnCancelClick={() => setModalArchiveSuccess(false)}
        closeModal={closeModalArchiveSuccess}
        width={420}
        typeModal="withoutBack"
        className={classes.modal_archive}
    >
        <h2 className={classes.modal_archive_title}>{t("objects.restoreTitle")}</h2>
        <p className={classes.modal_archive_text}>{t("objects.restoreText")}</p>
    </EmptyModal>

    const total = useSelector(state => state.objects.archiveTotal)
    const {page} = useParams()
    const titles = [
        t("archive.titles.name"),
        t("archive.titles.location"),
        t("archive.titles.type"),
        t("archive.titles.book"),
        t("archive.titles.stars"),
        t("archive.titles.status"),
        t("")
    ]
    console.log(total)
    /** Обертка для получения инфы объектов партнера */
    const getInfo = useCallback(async (params)=>{
        return await dispatcher(getListArchiveHotels({...params,page:page}))
    },[page])


    const [pagination] = usePagination({
        getInfo: getInfo,
        limit: 6,
        total: total,
        otherParams:otherParams,
        className: classes.pagination,
    });

    const renderTitles = ()=>{
        return titles.map((elem,id)=>{
            return (<div
                key={id}
                className={classes.list_archive_props}
            >{t(elem)}
                <div className={classes.sort} />
            </div>)
        })
    }

    useEffect(()=>{
        dispatcher(getTypeHotels())
    },[])

    const templateHotels = useMemo(()=>{
        return listHotel.map((elem,id)=>{
            return <ArchiveItem setModal={setModalArchiveSuccess} hotelInfo={elem} key={id}></ArchiveItem>
        })
    },[listHotel])

    return (
        <div className={classes.list_archive}>
            {templateModalSuccess}
            <h2 className={classes.list_archive_title}>{t('archive.title')}</h2>
            <div className={classes.list_archive_wrap}>
                {listHotel.length?<div className={classes.list_archive_area}>
                    <div className={classes.list_archive_props_titles}>
                        {renderTitles()}
                    </div>
                    {templateHotels}
                    {pagination}
                </div>:<div className={classes.empty}>
                    <h2 className={classes.empty_title}>
                        {t('archive.emptyTitle')}
                    </h2>
                </div>}
            </div>
        </div>
    )
}


export default ListArchive