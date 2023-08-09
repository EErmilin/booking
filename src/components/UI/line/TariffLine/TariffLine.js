import React from "react"
import classes from "./TariffLine.module.scss";
import moment from "moment";
import MenuLine from "../Mnuline/MenuLine";
import {deleteRoom, deleteRoomTariff} from "../../../../store/actions/partnerHotelsActions";
import {useTranslation} from "react-i18next";
import ModalAddTariff from "../../modals/ModalAddTariff/ModalAddTariff";
import useToggleVisibility from "../../../../hooks/useToggleVisibility";
import {useDispatch} from "react-redux";
import EmptyModal from "../../modals/EmptyModal/EmptyModal"


function TariffLine ({
    tariff,
    setModalErrorIntegration
}){
    const {t} = useTranslation()
    const [modalTariff,setModalTariff,closeModalTariff] = useToggleVisibility()
    const [showDeleteErrorModal, setShowDeleteErrorModal, closeDeleteErrorModal] = useToggleVisibility()
    const dispatcher = useDispatch()
    const menuList= [
        {
            text:t("addNewObjects.secondStep.menu.edit"),
            onClick:()=>{setModalTariff(true)}
        },
        {
            text:t("addNewObjects.secondStep.menu.delete"),
            type:"del",
            onClick:() => deleteRoomTariffHandler()
        },
    ]

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
        <h2>Ошибка удаления тарифа</h2>
        <p>Невозможно удалить тариф, по которому имеются бронирования.</p>
        <p>Для удаления тарифа обратитесь в службу поддержки сервиса Check in.</p>
    </EmptyModal>

    async function deleteRoomTariffHandler() {
        const response = await dispatcher(deleteRoomTariff(tariff.id))
        if (response.status === 422) {
            setShowDeleteErrorModal(true)
        }else if(response.status ==403){
            setModalErrorIntegration(true)
        }
    }

    const tariffModal = modalTariff && <ModalAddTariff
        closeModal={closeModalTariff}
        btnCancelClick={setModalTariff}
        hotelId={tariff.hotel_id}
        tariff={tariff}
    ></ModalAddTariff>

    return (
        <div className={classes.room_line}>
            <div className={classes.room_line_name_bar}>
                <p className={classes.room_line_name}>{tariff.name && tariff.name.ru}</p>
            </div>
            <div className={[classes.room_line_graph, classes.room_line_price].join(" ")}>
                <p className={classes.room_line_graph_title}>Тип питания</p>
                {/*<p className={classes.room_line_graph_text}>{tariff.is_breakfast_included?"Включено":"Не включено"}</p>*/}
                <p className={classes.room_line_graph_text}> {tariff.mealType?tariff.mealType.name.ru:"Стандарт"}</p>
            </div>
            <MenuLine
                list={menuList}
                className={classes.room_line_menu}
            />
            {tariffModal}
            {deleteErrorModal}
        </div>
    )
}

export default TariffLine