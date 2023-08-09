import React from "react"
import classes from "./ArchiveItem.module.scss"
import StatusHotel from "../../../../../components/StatusHotel/StatusHotel";
import MenuLine from "../../../../../components/UI/line/Mnuline/MenuLine";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {restoreArchiveHotel} from "../../../../../store/actions/partnerHotelsActions";
import QuestionHint from "../../../../../components/QuestionHint/QuestionHint";


function ArchiveItem({
    hotelInfo,
    setModal
}){
    const {t} = useTranslation()
    const typeHotels = useSelector(state => state.catalog.typeHotels)
    const typeHotel = typeHotels.find(elem => elem.id == hotelInfo.type_id) ? typeHotels.find(elem => elem.id == hotelInfo.type_id).name : "Объект"
    const dispatcher = useDispatch()
    const menuList = [
        {
            text: t("archive.revoke"),
            onClick: async () => {
                let isRestore = dispatcher(restoreArchiveHotel(hotelInfo.id))
                if(isRestore){
                    setModal(true)
                }
            }
        },
    ]
    return (
        <div className={classes.archive_item}>
            <div className={classes.archive_item_name}>
                <div className={[classes.archive_item_props_name].join(" ")}>{hotelInfo.name.ru}</div>
            </div>
            <div className={[classes.archive_item_props, classes.archive_item_props_address].join(" ")}>{hotelInfo.address}</div>
            <div className={classes.archive_item_props_small}>{typeHotel}</div>
            <div className={[classes.archive_item_props, classes.archive_item_props_booking].join(" ")}>
                {hotelInfo.active_bookings}
                {hotelInfo.active_bookings ?<QuestionHint count={hotelInfo.active_bookings}></QuestionHint>:''}
            </div>
            <div className={classes.archive_item_props_small}>
                <div className={classes.archive_item_rating}>
                    <span>{hotelInfo.star_rating}</span>
                    <div className={classes.star} />
                </div>
            </div>
            <div className={[classes.archive_item_props_small, classes.archive_item_props_status].join(" ")}>
                <StatusHotel status={hotelInfo.status_id} />
            </div>
            <MenuLine className={classes.menu} list={menuList} />
        </div>
    )
}

export default ArchiveItem