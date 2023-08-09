import React, {useMemo} from "react";
import classes from "./RoomLine.module.scss";
import MenuLine from "../Mnuline/MenuLine";
import {useTranslation} from "react-i18next";
import StatusHotel from "../../../StatusHotel/StatusHotel";
import useToggleVisibility from "../../../../hooks/useToggleVisibility";
import TwoButtonModal from "../../modals/TwoButtonModal/TwoButtonModal";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {deleteRoom} from "../../../../store/actions/partnerHotelsActions";
import moment from "moment";
import {copyRoom} from "../../../../functions/copyRoom";
import EmptyModal from "../../modals/EmptyModal/EmptyModal"

function RoomLine ({
    roomInfo,
    type=1,
    status,
    hotelId, 
    isShowMenu = true,
    setModalErrorIntegration
}){
    const {t} =useTranslation()
    const dispatcher = useDispatch()
    const [showModalPost,setShowModalPost,closeModalPost] = useToggleVisibility()
    const [showModalDelete,setShowModalDelete,closeModalDelete] = useToggleVisibility()
    const [showDeleteErrorModal,setShowDeleteErrorModal,closeDeleteErrorModal] = useToggleVisibility()
    const navigate = useNavigate()

    const minPrice = useMemo(()=>{
        let price =0
        let i = 0
        if(!roomInfo.base_price)return 0
        if(!Object.keys(roomInfo.base_price).length)return 0
        for (let tariffId in roomInfo.base_price) {
            for (let priceKey in roomInfo.base_price[tariffId]) {
                if(+roomInfo.base_price[tariffId][priceKey]<price){
                    price = +roomInfo.base_price[tariffId][priceKey]
                }else if(i==0){
                    price = +roomInfo.base_price[tariffId][priceKey]
                }
                i++
            }
        }
        return price
    },[roomInfo.base_price])

    async function deleteRoomHandler() {
        const response = await dispatcher(deleteRoom(roomInfo.id))

        if (response.status === 422) {
            setShowDeleteErrorModal(true)
            setShowModalDelete(false)
        }else if(response.status == 403){
            setModalErrorIntegration(true)
            setShowModalDelete(false)
        }
    }

    const modalDelete = showModalDelete && (
        <TwoButtonModal
            classNameTitle={classes.room_line_modal_title}
            title={t("addNewObjects.secondStep.roomModal.titleDelete")}
            btnCancelClick={()=>setShowModalDelete(false)}
            btnCancelText={t("addNewObjects.secondStep.roomModal.cancel")}
            btnNextClick={()=>{deleteRoomHandler().then()}}
            btnNextText={t("addNewObjects.secondStep.roomModal.yes")}
            closeModal={closeModalDelete}
            width={300}
            background="blue"
            typeModal="withoutBack"
        ></TwoButtonModal>
    )
    const modalPost = showModalPost && (
        <TwoButtonModal
            classNameTitle={classes.room_line_modal_title}
            title={t("addNewObjects.secondStep.roomModal.titlePost")}
            btnCancelClick={()=>setShowModalPost(false)}
            btnCancelText={t("addNewObjects.secondStep.roomModal.cancel")}
            btnNextClick={()=>{}}
            btnNextText={t("addNewObjects.secondStep.roomModal.yes")}
            closeModal={closeModalPost}
            width={300}
            background="blue"
            typeModal="withoutBack"
        ></TwoButtonModal>
    )

    const deleteErrorModal = showDeleteErrorModal && <EmptyModal
        close={true}
        closeModal={closeDeleteErrorModal}
        btnCancelClick={()=> {
            setShowDeleteErrorModal(false)
        }}
        background="blue"
        width={420}
        typeModal="withoutBack"
    >
        <h2>Ошибка удаления номера</h2>
        <p>Невозможно удалить номер, по которому имеются бронирования.</p>
        <p>Для удаления номера обратитесь в службу поддержки сервиса Check in.</p>
    </EmptyModal>

    const menuList= type==1?[
        {
            text:t("addNewObjects.secondStep.menu.edit"),
            onClick:()=>navigate(`edit-room/${roomInfo.id}`)
        },
        {
            text:t("addNewObjects.secondStep.menu.add"),
            onClick:()=>navigate(`edit-room/${roomInfo.id}`)
        },
        {
            text:t("addNewObjects.secondStep.menu.duplicate"),
            onClick:()=>copyRoom(dispatcher,roomInfo)
        },
        {
            text:t("addNewObjects.secondStep.menu.delete"),
            type:"del",
            onClick:()=>deleteRoomHandler()
        },
    ]:[
        (status==5?{
            text:t("addNewObjects.secondStep.menu.preWatch"),
            onClick:()=>navigate(`/hotel/room?id=${hotelId}&roomId=${roomInfo.id}&dateFrom=${moment(new Date()).format("YYYY-MM-DD")}&dateTo=${moment(new Date()).add(2,"days").format("YYYY-MM-DD")}&adults=1&children=0`)
        }:null),
        {
            text:t("addNewObjects.secondStep.menu.edit"),
            onClick:()=>navigate(`/edit-object/${hotelId}/second-step/edit-room/${roomInfo.id}`)
        },
        {
            text:t("addNewObjects.secondStep.menu.add"),
            onClick:()=>navigate(`/edit-object/${hotelId}/second-step/edit-room/${roomInfo.id}`)
        },
        {
            text:t("addNewObjects.secondStep.menu.duplicate"),
            onClick:()=>copyRoom(dispatcher,roomInfo)
        },
        //(status!=='withdraw'?
        //{
        //    text:t("addNewObjects.secondStep.menu.nonPosted"),
        //    onClick:nonPosted
        //}:''),
        {
            text:t("addNewObjects.secondStep.menu.delete"),
            type:"del",
            onClick:deleteRoomModal
        },
    ].filter(elem=>elem)

    function deleteRoomModal (){
        setShowModalDelete(true)
    }

    function nonPosted (){
        setShowModalPost(true)
    }



    return (
        <div className={classes.room_line}>
            <div className={classes.room_line_name_bar}>
                <p className={classes.room_line_name}>{roomInfo.name.ru}</p>
                <p className={classes.room_line_date}>Обновлено: {moment.unix(roomInfo.updated_at).format("DD MMMM YYYY")}</p>
            </div>
            <div className={[classes.room_line_graph, classes.room_line_allotment].join(" ")}>
                <p className={classes.room_line_graph_title}>Кол-во:</p>
                <p className={classes.room_line_graph_text}>{roomInfo.allotment}</p>
            </div>
            <div className={[classes.room_line_graph, classes.room_line_price].join(" ")}>
                <p className={classes.room_line_graph_title}>Стоимость:</p>
                <p className={classes.room_line_graph_text}>от {minPrice} руб.</p>
            </div>
            {/*{type==2?<StatusHotel status={status}></StatusHotel>:''}*/}
            {isShowMenu && <MenuLine
                list={menuList}
                className={classes.room_line_menu}
            />}
            {modalDelete}
            {modalPost}
            {deleteErrorModal}
        </div>
    )
}

export default RoomLine