import React, {useEffect, useMemo} from "react";
import classes from "./HotelModeration.module.scss"
import {useTranslation} from "react-i18next";
import {NavLink, useParams} from "react-router-dom";
import StatusHotel from "../../../../../components/StatusHotel/StatusHotel";
import TransitionContainer from "../../../../../components/UI/other/TransitionContainer/TransitionContainer";
import ModerationHotelLine from "../../../../../components/UI/line/ModerationHotelLine/ModerationHotelLine";
import ModerationRoomLine from "../../../../../components/UI/line/ModerationRoomLine/ModerationRoomLine";
import {useDispatch, useSelector} from "react-redux";
import {createAnswerModeration, getPartnerModeration} from "../../../../../store/actions/moderationActions";
import Preloader from "../../../../../components/Preloader/Preloader";


function HotelModeration (){
    const {t} = useTranslation()
    const moderation = useSelector(state => state.moderation.moderation)
    const dispatcher = useDispatch()
    const {id} = useParams()


    useEffect(()=>{
        dispatcher(getPartnerModeration(id))
    },[])






    // const templateModerationRoom = [
    //     {name:"Двухместный номер с 2 отдельными кроватями",status:"placed",response:[{message:"Все исправил, спасибо!"}]},
    //     {name:"Свадебный люкс с балконом",status:"onModeration",response:[{message:"Все исправил, спасибо!"}]},
    //     {name:"Спа номер с гостинной",status:"canceled",response:[{message:"Все исправил, спасибо!"}]},
    //     {name:"Номер студия",status:"withdraw",response:[{message:"Все исправил, спасибо!"}]}].map((elem,id)=>{
    //     return (<ModerationRoomLine moderation={elem} key={id}></ModerationRoomLine>)
    // })


    const blocks = [
        {
            title:<div className={classes.hotel_moderation_wrap}>
                {t("support.hotelModeration.hotelTitle")}
                <span className={classes.hotel_moderation_notification}>{moderation && moderation.length}</span>
            </div>,
            block:()=>(<div className={classes.hotel_moderation_list}>
                <ModerationHotelLine moderation={moderation} key={id}></ModerationHotelLine>
            </div>)
        },
        // {
        //     title:<div className={classes.hotel_moderation_wrap}>
        //         {t("support.hotelModeration.rooms")}
        //         <span className={classes.hotel_moderation_notification}>3</span>
        //     </div>,
        //     block:()=>(<div className={classes.hotel_moderation_list}>
        //         {templateModerationRoom}
        //     </div>)
        // },
    ]
    if(!moderation)return <Preloader></Preloader>
    return (
        <div className={classes.hotel_moderation}>
            <h2 className={classes.hotel_moderation_title}>
                {t('support.hotelModeration.title')}
            </h2>
            <NavLink
                className={classes.hotel_moderation_link}
                to="/personal-area/support/1">{t("addNewObjects.secondStep.buttons.back")}
            </NavLink>
            <h3 className={classes.hotel_moderation_hotel}>{moderation[0].hotel.name.ru}</h3>
            <div className={classes.hotel_moderation_wrap}>
                <StatusHotel status={moderation[0].hotel.status_id}></StatusHotel>
            </div>
            {/*<div className={classes.hotel_moderation_accepted}>*/}
            {/*    {`${t("support.hotelModeration.acceptedRooms")} 1 ${t("support.hotelModeration.from")} 4`}*/}
            {/*</div>*/}
            <TransitionContainer
                classNameTitlesWrap={classes.hotel_moderation_titles}
                classNameTitle={classes.hotel_moderation_titles_item}
                blocks={blocks}
            ></TransitionContainer>
        </div>
    )
}


export default HotelModeration