import React, {useCallback, useEffect, useMemo, useState} from "react"
import classes from "./ListObjects.module.scss";
import { useTranslation } from "react-i18next";
import Button from "../../../../../components/UI/btns/Button/Button";
import {NavLink, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import Object from "./Object";
import usePagination from "../../../../../hooks/usePagination";
import {getHotelListPartner, getTypeHotels} from "../../../../../store/actions/partnerHotelsActions";
import useToggleVisibility from "../../../../../hooks/useToggleVisibility";
import ModalAddTravelLine from "../components/ModalAddTraveLline/ModalAddTravelLine";
import EmptyModal from "../../../../../components/UI/modals/EmptyModal/EmptyModal";


function ListObjects() {
    const { t } = useTranslation()
    const [otherParams,setOtherParams] = useState({'per-page':6,expand:"rooms"})
    const {page} = useParams()
    const dispatcher = useDispatch()
    const listHotel = useSelector(state => state.objects.hotels)
    const limit = useSelector(state => state.objects.limit)
    const total = useSelector(state => state.objects.total)
    /** Модалка подключения тревеллайн */
    const [modal,setModal,closeModal] = useToggleVisibility()
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
        <h2 className={classes.modal_archive_title}>{t("objects.archiveSuccess")}</h2>
        <p className={classes.modal_archive_text}>{t("objects.archiveSuccessText")}</p>
    </EmptyModal>
    /** Модалка не успешной архивации объекта */
    const [modalArchiveError,setModalArchiveError,closeModalArchiveError] = useToggleVisibility()
    const templateModalError = modalArchiveError && <EmptyModal
        close={true}
        background="blue"
        btnCancelClick={() => setModalArchiveError(false)}
        closeModal={closeModalArchiveError}
        width={420}
        typeModal="withoutBack"
        className={classes.modal_archive}
    >
        <h2 className={classes.modal_archive_title}>{t("objects.archiveError")}</h2>
        <p className={classes.modal_archive_text}>{t("objects.archiveErrorText")}</p>
    </EmptyModal>


    useEffect(()=>{
        dispatcher(getTypeHotels())
    },[])

    /** Обертка для получения инфы объектов партнера */
    const getInfo = useCallback(async (params)=>{
        return await dispatcher(getHotelListPartner({...params,page:page}))
    },[page])

    const templateHotels = useMemo(()=>{
        return listHotel.map((elem,id)=>{
            return <Object object={elem} archiveError={setModalArchiveError} archiveSuccess={setModalArchiveSuccess} key={id} />
        })
    },[listHotel])

    const modalTravel = <ModalAddTravelLine
        isShow={modal}
        closeModal={closeModal}
        buttonCancelClick={()=>setModal(false)}
    ></ModalAddTravelLine>

    const addButton = <Button
        btnColor="green"
        className={classes.add_object_button}
        typeButton={1} >
        <NavLink
            to="/add-object">   +  {t("objects.addNewObject")}
        </NavLink>
    </Button>

    const connectTravelLineButton = <Button
        btnColor="blue"
        className={classes.add_travel_object_button}
        onClick={()=>setModal(true)}
        typeButton={1} >
            + Добавить объект из Travelline
    </Button>


    const titles = ["objects.name", "objects.id"]
    const titlesSmall = ["objects.type", "objects.rating", "objects.status"]

    const renderTitles = titles.map((elem,id) => {
        return <div
            key={id}
            className={classes.object_props}
            >{t(elem)}
            <div className={classes.sort} />
        </div>
    })

    const renderTitlesSmall = titlesSmall.map((elem,id) => {
        return <div
            key={id}
            className={classes.object_props_small}
            >{t(elem)}
            <div className={classes.sort} />
        </div>
    })

    const [pagination] = usePagination({
        getInfo: getInfo,
        limit: 6,
        total: total,
        otherParams:otherParams,
        className: classes.pagination,
    });

    return (
        <div className={classes.objects}>
            <h2 className={classes.objects_title}>{t('objects.title')}</h2>
            {listHotel.length ? <>
                {addButton}
                {connectTravelLineButton}
                <div className={classes.object_area}>
                    <div className={classes.objects_props_titles}>
                        {renderTitles}
                        {renderTitlesSmall}
                    </div>
                    {templateHotels}
                    {pagination}
                </div>
            </> :
                <div className={classes.objects_empty}>
                    <h2 className={classes.objects_empty_title}>
                        {t('objects.nonObjects')}
                    </h2>
                    {addButton}
                    {connectTravelLineButton}
                </div>
            }
            {modalTravel}
            {templateModalSuccess}
            {templateModalError}
        </div>
    )
}

export default ListObjects