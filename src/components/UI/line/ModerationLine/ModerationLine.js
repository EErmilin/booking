import React, {useRef, useState} from "react"
import classes from "./ModerationLine.module.scss";
import {NavLink, useNavigate} from "react-router-dom";
import StatusHotel from "../../../StatusHotel/StatusHotel";
import {useTranslation} from "react-i18next";
import MenuLine from "../Mnuline/MenuLine";
import {deleteHotel, deleteRoom} from "../../../../store/actions/partnerHotelsActions";
import {useDispatch} from "react-redux";


function ModerationLine ({
    className,
    moderation
}){
    const {t} = useTranslation()
    const [isClick,setIsClick] = useState(false)
    const dispatcher = useDispatch()
    const cls = [classes.moderation_line]
    const RoomsWrpRef = useRef()
    const navigate = useNavigate()
    if(className)cls.push(className)


    const listMenu = [
        {
            text:t("support.moderationList.edit"),
            onClick:()=>navigate(`/edit-object/${moderation.hotel.id}/first-step`)
        },
        // {
        //     text:t("support.moderationList.delete"),
        //     type:'del',
        //     onClick:()=>dispatcher(deleteHotel(moderation.hotel.id)),
        // },
    ]

    const templateRooms = moderation.hotel.rooms && moderation.hotel.rooms.map((elem,id)=>{
        const listMenuRoom = [
            {
                text:t("support.moderationList.edit"),
                onClick:()=>navigate(`/edit-object/${moderation.hotel.id}/second-step/edit-room/${elem.id}`)
            },
            // {
            //     text:t("support.moderationList.delete"),
            //     type:'del',
            //     onClick:()=>dispatcher(deleteRoom(elem.id))
            // },
        ]
        return (
            <div className={classes.moderation_line_rooms_item} key={id}>
                <div className={classes.moderation_line_rooms_name}>{elem.name.ru}</div>
                <div></div>
                {/*<div className={classes.moderation_line_header_wrap}><StatusHotel status={elem.status} text={t(`statusHotel.${elem.status}`)}></StatusHotel></div>*/}
                <div></div>
                <MenuLine className={classes.moderation_line_menu} list={listMenuRoom} />
            </div>
        )
    })

    function expandBlock() {
        if(!isClick){
            const scrollHeight = RoomsWrpRef.current.scrollHeight
            RoomsWrpRef.current.style.height = `${scrollHeight}px`
            RoomsWrpRef.current.style.overflow = `visible`
            setIsClick(!isClick)
        }else{
            RoomsWrpRef.current.style.height = `0`
            RoomsWrpRef.current.style.overflow = `hidden`
            setIsClick(!isClick)
        }
    }

    return (
        <div className={cls.join(" ")}>
            <div className={classes.moderation_line_header} onClick={expandBlock}>
                <div className={classes.moderation_line_header_name}>
                    <NavLink
                        to={`/personal-area/support/hotel/${moderation.hotel.id}`}
                        className={[classes.moderation_line_link,(isClick?classes.moderation_line_link_active:'')].join(' ')}
                    >{moderation.hotel.name.ru}</NavLink>
                </div>
                <div className={classes.moderation_line_header_wrap}>
                    <StatusHotel status={moderation.hotel.status_id}></StatusHotel>
                </div>
                <div></div>
                {/*<div*/}
                {/*    className={[*/}
                {/*        classes.moderation_line_room,*/}
                {/*        moderation.totalRoom==moderation.roomsAccepted?classes.moderation_line_room_active:''*/}
                {/*    ].join(' ')}>*/}
                {/*    {`${moderation.roomsAccepted} ${t("support.moderationList.from")} ${moderation.totalRoom}`}*/}
                {/*</div>*/}
                <MenuLine className={classes.moderation_line_menu} list={listMenu} />
            </div>
            <div className={classes.moderation_line_rooms} ref={RoomsWrpRef}>
                {templateRooms}
            </div>
        </div>
    )
}

export default ModerationLine