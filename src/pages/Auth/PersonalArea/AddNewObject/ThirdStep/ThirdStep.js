import React, {useEffect, useMemo} from "react"
import classes from "./ThirdStep.module.scss";
import {useTranslation} from "react-i18next";
import RoomLine from "../../../../../components/UI/line/RoomLine/RoomLine";
import Button from "../../../../../components/UI/btns/Button/Button";
import {NavLink, Route, useParams, Routes, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getListRoomsPartner, getListTariff, getMealType} from "../../../../../store/actions/partnerHotelsActions";
import TariffLine from "../../../../../components/UI/line/TariffLine/TariffLine";
import useToggleVisibility from "../../../../../hooks/useToggleVisibility";
import ModalAddTariff from "../../../../../components/UI/modals/ModalAddTariff/ModalAddTariff";
import EmptyModal from "../../../../../components/UI/modals/EmptyModal/EmptyModal";



function ThirdStep ({
    routes,
    edit
}){
    const {t} = useTranslation()
    const dispatcher = useDispatch()
    const rooms = useSelector(state => state.objects.rooms)
    const tariffs = useSelector(state => state.objects.tariff)
    const navigate = useNavigate()
    const paramsRoute = useParams()['*']
    const {id} = useParams()
    const [modalTariff,setModalTariff,closeModalTariff] = useToggleVisibility()
    const [modalRoom,setModalRoom,closeModalRoom] = useToggleVisibility()
    const [modalError,setModalError,closeModalError] = useToggleVisibility()
    const errorIntegration = useSelector((state)=>state.table.errorIntegration)

    const templateRooms = useMemo(()=>{
        return rooms.map((elem,id)=>{
            return (
                <RoomLine  setModalErrorIntegration={setModalError} roomInfo={elem} key={id}></RoomLine>
            )
        })
    },[rooms])

    const templateTariffs = useMemo(()=>{
        return tariffs && tariffs.map((elem,id)=>{
            return (
                <TariffLine setModalErrorIntegration={setModalError} tariff={elem} key={id}></TariffLine>
            )
        })
    },[tariffs])
    function save(){
        if(tariffs && tariffs.length){
            //if(rooms.length){
                    navigate(`/edit-object/${id}/fourth-step`)
           // }
        }else{
            setModalRoom(true)
        }

    }


    const templateRoutes = routes.map((elem,id)=>(
        <Route
            key={id}
            name={elem.name}
            path={elem.path}
            element={elem.component}
        ></Route>
    ))


    useEffect(()=>{
        dispatcher(getMealType())
        if(id){
            dispatcher(getListRoomsPartner(id))
            dispatcher(getListTariff(id))
        }
    },[])

    function emptyTemplate(type){
        return  (
            <div className={classes.second_step_empty}>
                <h2 className={classes.second_step_empty_title}>
                    {type==="room"?t('addNewObjects.secondStep.emptyRoom'):t('addNewObjects.secondStep.emptyTariff')}
                </h2>
                <Button
                    btnColor={type==="room"?"ButtonWhite":"ButtonGreen"}
                    className={type==="room"?classes.second_step_empty_whiteBtn:""}
                    typeButton={2}
                    onClick={()=>{
                        if(type==="room"){
                            if(tariffs.length){
                                navigate("add-room")
                            }else{
                                setModalRoom(true)
                            }
                        }else {
                            setModalTariff(true)
                        }
                    }}
                >
                    <span
                        className={type==="room"?classes.second_step_empty_whiteBtn_link:classes.second_step_empty_btn_link}
                        > + {type==="room"?t("objects.addNewRoom"):t("addNewObjects.secondStep.buttons.addTariff")}
                    </span>
                </Button>
            </div>
        )
    }

    const tariffModal = modalTariff && <ModalAddTariff
        closeModal={closeModalTariff}
        btnCancelClick={setModalTariff}
        hotelId={id}
    ></ModalAddTariff>

    const modalEmptyTariff = modalRoom && <EmptyModal
        close={true}
        closeModal={closeModalRoom}
        btnCancelClick={()=> {
            setModalRoom(false)
        }}
        background="blue"
        width={294}
        typeModal="withoutBack"
    >
        <h2 className={classes.second_step_empty_title}>Отсутствуют тарифы</h2>
        <p className={classes.second_step_subtitle}>Для добавления номерного фонда должен быть создан хотя бы один тариф</p>
    </EmptyModal>

    const templateError = modalError && <EmptyModal
        close={true}
        background="blue"
        closeModal={closeModalError}
        btnCancelClick={() => setModalError(false)}
        width={334}
        typeModal="withoutBack"
        className={classes.modal}
    >
        <h2 className={classes.modal_title}>{errorIntegration}</h2>
    </EmptyModal>



    return (
        <div className={classes.second_step}>
            {!paramsRoute?
                <div>
                    {modalEmptyTariff}
                    {tariffModal}
                    {templateError}
                    <h2 className={classes.second_step_title}>{t("addNewObjects.secondStep.titlePrice")}</h2>
                    <p className={classes.second_step_subtitle}>{t("addNewObjects.secondStep.subtitlePrice")}</p>
                    {(tariffs && tariffs.length ?
                        <div className={classes.second_step_list}>
                            {templateTariffs}
                            <div className={classes.second_step_buttons}>
                                <Button
                                    typeButton={1}
                                    btnColor="outline_blue"
                                    onClick={()=>setModalTariff(true)}
                                ><span
                                    className={classes.second_step_buttons_cancel_link}
                                >+ {t("addNewObjects.secondStep.buttons.addNewTariff")}
                                </span>
                                </Button>
                            </div>
                        </div> :
                        emptyTemplate('tariff'))}
                    <h2 className={classes.second_step_title}>{t("addNewObjects.secondStep.titleRoom")}</h2>
                    <p className={classes.second_step_subtitle}>{t("addNewObjects.secondStep.subTitle")}</p>
                    {(rooms.length ?
                        <div className={classes.second_step_list}>
                            {templateRooms}
                            <div className={classes.second_step_buttons}>
                                <Button
                                    typeButton={1}
                                    btnColor="outline_blue"
                                    onClick={()=>{
                                        if(tariffs.length){
                                            navigate("add-room")
                                        }else{
                                            setModalRoom(true)
                                        }
                                    }}
                                >
                                    <span
                                        className={classes.second_step_buttons_cancel_link}
                                    >+ {t("addNewObjects.secondStep.buttons.addRoom")}
                                    </span>
                                </Button>
                            </div>
                        </div> :
                       emptyTemplate('room'))}
                    <div className={classes.second_step_buttons_right}>
                        <Button
                            typeButton={1}
                            btnColor="outline_blue back"
                        >
                            <NavLink to={`/edit-object/${id}/second-step`}>{t("addNewObjects.secondStep.buttons.back")}</NavLink>
                        </Button>
                        <Button
                            typeButton={1}
                            btnColor="green"
                            onClick={save}
                        >{t("addNewObjects.secondStep.buttons.save")}</Button>
                    </div>
                </div>:
                <div>
                    <h2 className={classes.second_step_title}>{t("addNewObjects.secondStep.title")}</h2>
                    <p className={classes.second_step_subtitle}>{t("addNewObjects.secondStep.subTitle")}</p>
                    <Routes>
                        {templateRoutes}
                    </Routes>
                </div>

            }
        </div>
    )
}

export default ThirdStep