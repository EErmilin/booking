import React, {useRef, useState} from "react"
import classes from "./ModerationRoomLine.module.scss"
import {useTranslation} from "react-i18next";
import StatusHotel from "../../../StatusHotel/StatusHotel";
import MenuLine from "../Mnuline/MenuLine";
import ModerationHotelLine from "../ModerationHotelLine/ModerationHotelLine";


function ModerationRoomLine ({
    className,
    moderation
}){
    const {t} = useTranslation()
    const [isClick,setIsClick] = useState(false)
    const cls = [classes.moderation_room_line]
    if(className)cls.push(className)
    const RoomsWrpRef = useRef()
    const listMenu = [
        {
            text:t("support.moderationList.edit")
        },
        {
            text:t("support.moderationList.withdraw")
        },
        {
            text:t("support.moderationList.delete"),
            type:'del'
        },
    ]
    function expandBlock(){
        if(!isClick){
            const scrollHeight = RoomsWrpRef.current.scrollHeight
            RoomsWrpRef.current.style.height = `${scrollHeight}px`
            setIsClick(!isClick)
        }else{
            RoomsWrpRef.current.style.height = `48px`
            setIsClick(!isClick)
        }

    }
    return (
        <div className={cls.join(' ')} ref={RoomsWrpRef}>
            <div className={classes.moderation_room_line_header} onClick={expandBlock}>
                <p className={classes.moderation_room_line_header_name}>{moderation.name}</p>
                <div className={classes.moderation_room_line_wrap}>
                    <StatusHotel status={moderation.status}></StatusHotel>
                </div>
                <div className={classes.moderation_room_line_wrp}>
                    <MenuLine className={classes.moderation_room_line_wrp_menu} list={listMenu}></MenuLine>
                </div>
            </div>
            <div className={classes.moderation_room_line_content}>
                <ModerationHotelLine moderation={moderation}></ModerationHotelLine>
            </div>
        </div>
    )
}

export default ModerationRoomLine