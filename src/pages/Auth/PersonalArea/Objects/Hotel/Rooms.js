import React, { useEffect, useMemo } from "react";
import classes from "./Rooms.module.scss";
import RoomLine from "../../../../../components/UI/line/RoomLine/RoomLine";
import { useTranslation } from "react-i18next";
import {NavLink, useLocation, useParams} from "react-router-dom";
import TransitionContainer from "../../../../../components/UI/other/TransitionContainer/TransitionContainer";
import Button from "../../../../../components/UI/btns/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { getHotelInfo, getListRoomsPartner } from "../../../../../store/actions/partnerHotelsActions";
import Preloader from "../../../../../components/Preloader/Preloader";
import moment from "moment";



function Rooms() {
    const { t } = useTranslation()
    const rooms = useSelector(state => state.objects.rooms)
    const hotelInfo = useSelector(state => state.objects.hotelInfo)
    const dispatcher = useDispatch()
    const { id } = useParams()
    const location = useLocation()

    useEffect(() => {
        if (id) {
            dispatcher(getHotelInfo(id))
            dispatcher(getListRoomsPartner(id))
        }
    }, [])

    /** Блок с активными элементами */
    const templateActive = useMemo(() => {
        const templateRooms = rooms.map((elem, id) => {
            return (<RoomLine hotelId={hotelInfo.id} status={"placed"} roomInfo={elem} type={2} key={id} isShowMenu={false}></RoomLine>)
        })
        return (
            <React.Fragment>
                <div className={classes.rooms_list}>
                    {templateRooms}
                </div>
            </React.Fragment>
        )
    }, [rooms])

    /** Блок с не активными элементами */
    const templateNonActive = useMemo(() => {
        const templateRooms = rooms.map((elem, id) => {
            return (<RoomLine hotelId={hotelInfo.id} status={"withdraw"} roomInfo={elem} type={2} key={id} isShowMenu={false}></RoomLine>)
        })
        return (
            <React.Fragment>
                <div className={classes.rooms_list}>
                    {templateRooms}
                </div>
            </React.Fragment>
        )
    }, [rooms])

    const blocksRooms = useMemo(() => {
        return [
            {
                title: t("rooms.active"),
                block: templateActive
            },
            // {
            //     title:t("rooms.nonActive"),
            //     block:templateNonActive
            // }
        ]
    }, [rooms])

    if (!rooms.length || !Object.keys(hotelInfo).length) return <Preloader></Preloader>
    return (
        <div className={classes.rooms}>
            <h2 className={classes.rooms_title}>{t("rooms.title")}</h2>
            <NavLink
                className={classes.rooms_link}
                to={`/personal-area/objects/${location.state?.page?location.state?.page:"1"}`}>{t("addNewObjects.secondStep.buttons.back")}
            </NavLink>
            <h4 className={classes.rooms_hotel_title}>{t("rooms.hotel")} «{hotelInfo.name.ru}»</h4>
            <Button
                typeButton={1}
                btnColor="outline_blue"
                className={classes.rooms_buttons_cancel}
            >
                <NavLink
                    className={classes.rooms_buttons_cancel_link}
                    to={`/table-price/${id}`}
                >
                    Открыть календарь тарифов и цен
                </NavLink>
            </Button>
            {(hotelInfo.status_id == 5 && hotelInfo.is_free_period_activated) && <div className={classes.period}>
                <div className={classes.period_text}>Бесплатный период для Отель «{hotelInfo.name?.ru}» без комиссии действует до {moment.unix(hotelInfo.free_end_at).format('DD.MM.YYYY')} </div>
            </div>}
            <TransitionContainer
                classNameTitle={classes.rooms_blocks_title}
                classNameTitlesWrap={classes.rooms_blocks}
                blocks={blocksRooms}
                className={classes.rooms_block}
            ></TransitionContainer>
            {/* <Button
                typeButton={1}
                btnColor="outline_blue"
                className={classes.rooms_buttons_cancel}
            ><NavLink
                className={classes.rooms_buttons_cancel_link}
                to={`/edit-object/${id}/second-step/add-room`}
            >+ {t("addNewObjects.secondStep.buttons.addRoom")}
                 </NavLink>                   
            </Button>**/}  
        </div>
    )
}

export default Rooms