import React, {useEffect, useMemo} from "react"
import classes from "./AddNewObject.module.scss";
import {useTranslation} from "react-i18next";
import Breadcrumbs from "../../../../components/Breadcrumbs/Breadcrumbs";
import StepByStep from "../../../../components/StepByStep/StepByStep";
import {Route, Routes, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {clearHotelInfo, getHotelInfo} from "../../../../store/actions/partnerHotelsActions";
import useToggleVisibility from "../../../../hooks/useToggleVisibility";
import EmptyModal from "../../../../components/UI/modals/EmptyModal/EmptyModal";


function AddNewObject ({
    routes,
    completedSteps,
    edit
                       }){

    const {t} = useTranslation()
    const dispatcher = useDispatch()
    const userInfo = useSelector(state => state.auth.userInfo)
    const hotelInfo = useSelector(state=> state.objects.hotelInfo)
    const travellineError = useSelector((state)=>state.objects.travellineError)
    const [modal,setModal,closeModal] = useToggleVisibility()
    const hotelId = useParams()['*'].split("/")[0]


    useEffect(()=>{
        if(travellineError){
            setModal(true)
        } else {
            setModal(false)
        }
    },[travellineError])

    /**Получаем инфу об отеле*/
    useEffect(()=>{
        if(hotelId){
            dispatcher(getHotelInfo(hotelId))
        } else {
            dispatcher(clearHotelInfo())
        }
    },[])

    /** Формируем хлебные крошки */
    const BREADCRUMBS = useMemo(
        () => [
            {
                name: t("personalArea.breadCrumbsTitle"),
                url: '/personal-area'
            },
            {
                name: t("addNewObjects.breadCrumbs"),
                url: ''
            },
        ],
        []
    );
    /** Массив шагов */
    const templateSteps = useMemo(()=>{
        if(edit){
            return [
                {
                    name:t("addNewObjects.steps.firstStep"),
                    url:`/edit-object/${hotelInfo.id}/first-step`,
                    path:"first-step",
                    step:1
                },
                {
                    name:t("addNewObjects.steps.secondStep"),
                    url:`/edit-object/${hotelInfo.id}/second-step`,
                    path:"second-step",
                    step:2
                },
                {
                    name:t("addNewObjects.steps.thirdStep"),
                    url:`/edit-object/${hotelInfo.id}/third-step`,
                    path:"third-step",
                    step:3
                },
                {
                    name:t("addNewObjects.steps.fourthStep"),
                    url:`/edit-object/${hotelInfo.id}/fourth-step`,
                    path:"fourth-step",
                    step:4
                },
                {
                    name:t("addNewObjects.steps.fifthStep"),
                    url:`/edit-object/${hotelInfo.id}/fifth-step`,
                    path:"fifth-step",
                    step:5
                },
                {
                    name:t("addNewObjects.steps.sixthStep"),
                    url:`/edit-object/${hotelInfo.id}/sixth-step`,
                    path:"sixth-step",
                    step:6
                },
            ]
        }else {
            return [
                {
                    name:t("addNewObjects.steps.firstStep"),
                    url:"/add-object",
                    path:"",
                    step:1
                },
                {
                    name:t("addNewObjects.steps.secondStep"),
                    url:`/add-object/${hotelInfo.id}/second-step`,
                    path:"second-step",
                    step:2
                },
                {
                    name:t("addNewObjects.steps.thirdStep"),
                    url:`/add-object/${hotelInfo.id}/third-step`,
                    path:"third-step",
                    step:3
                },
                {
                    name:t("addNewObjects.steps.fourthStep"),
                    url:`/add-object/${hotelInfo.id}/fourth-step`,
                    path:"fourth-step",
                    step:4
                },
                {
                    name:t("addNewObjects.steps.fifthStep"),
                    url:`/add-object/${hotelInfo.id}/fifth-step`,
                    path:"fifth-step",
                    step:5
                },
                {
                    name:t("addNewObjects.steps.sixthStep"),
                    url:`/add-object/${hotelInfo.id}/sixth-step`,
                    path:"sixth-step",
                    step:6
                },
            ]
        }
    },[hotelInfo.id])



    const templateRoutes = routes.map(({path='',component,privateUrl,exact,routes,headerType,footerType,roles},key)=>{
        return (
            <Route
                path={path}
                exact={exact}
                element={component}
                key={key}
            />
        )
    })


    const templateModal = modal && <EmptyModal
        close={true}
        closeModal={closeModal}
        btnCancelClick={()=> {
            setModal(false)
        }}
        background="blue"
        width={294}
        typeModal="withoutBack"
    >
        <p className={classes.add_new_object_modal}>{travellineError?.message}</p>
    </EmptyModal>

    return (
        <div className={classes.add_new_object}>
            {/*<Breadcrumbs breadcrumbs={BREADCRUMBS}></Breadcrumbs>*/}
            <div className={classes.add_new_object_header}>
                <h2 className={classes.add_new_object_header_title}>{t("addNewObjects.welcome")} {userInfo.first_name} {userInfo.last_name}!</h2>
                <p className={classes.add_new_object_header_sub_title}>{edit?t("addNewObjects.editSubTitle"):t("addNewObjects.subTitle")}{hotelInfo.name && `: «${hotelInfo.name.ru}»`}</p>
            </div>
            <StepByStep
                className={classes.add_new_object_steps}
                steps={templateSteps}
                completedSteps={3}
                hotelId={hotelInfo.id}
                edit={edit}
            ></StepByStep>
            <div className={classes.add_new_object_forms}>
                <Routes>
                    {templateRoutes}
                </Routes>
            </div>
            {templateModal}
        </div>
    )
}


export default AddNewObject