import React from "react"
import classes from "./TableCustomCell.module.scss"
import {ReactComponent as GuestIcon} from "../../../../../../assets/svg/icons/man-blue.svg";
import ErrorMessage from "../../../../../../components/UI/message/ErrorMessage";
import HelpNotation from "../../../../../../components/UI/other/HelpNotation/HelpNotation";
import useToggleVisibility from "../../../../../../hooks/useToggleVisibility";
import ModalChangeRoom from "../ModalChangeRoom/ModalChangeRoom";
import se from "react-datepicker";
import ModalChangePrice from "../ModalChangePrice/ModalChangePrice";
import EmptyModal from "../../../../../../components/UI/modals/EmptyModal/EmptyModal";
import {useSelector} from "react-redux";


function TableCustomCell({plansInfo,plan,isActive,infoRoom, hotelId,filters}){
    const [modalRoom,setModalRoom,closeModalRoom] = useToggleVisibility()
    const [modalPrice,setModalPrice,closeModalPrice] = useToggleVisibility()
    const [modalError,setModalError,closeModalError] = useToggleVisibility()
    const errorIntegration = useSelector((state)=>state.table.errorIntegration)
    const templateModalRoom = modalRoom && (
        <ModalChangeRoom
            filters={filters}
            closeModal={closeModalRoom}
            roomInfo={infoRoom}
            planInfo={plansInfo}
            btnCancelClick={setModalRoom}
            hotelId={hotelId}
            setModalError={setModalError}
        ></ModalChangeRoom>
    )

    const templateModalPrice = modalPrice && (
        <ModalChangePrice
            filters={filters}
            closeModal={closeModalPrice}
            roomInfo={infoRoom}
            planInfo={plansInfo}
            btnCancelClick={setModalPrice}
            hotelId={hotelId}
            setModalError={setModalError}
        ></ModalChangePrice>
    )


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
        <>
            {
                plan?
                    <div className={plan.isMinStay ? classes.cell_default_noback : classes.cell_default}>
                        {plan.isMinStay ?
                            <>
                                <p className={classes.cell_price}>Мин. срок проживания</p>
                                <HelpNotation
                                    text="Гость, останавливающийся в данном номере, должен забронировать его на указанный минимум ночей"
                                ></HelpNotation>
                            </> : (() => plan.roomsOnSale ?
                            <>
                                <p className={classes.cell_room}>{plan.title}</p>
                                <p className={classes.cell_room_free}>{plan.subTitle}</p>
                            </>:
                            <div className={classes.meal}>
                                <div>
                                    <p className={classes.cell_price}>{plan.tariffName.ru}</p>
                                    <div className="tariff_item_iconGuest">{[...Array(plan.guests)].map((elem, key) =>
                                        <GuestIcon/>)}</div>
                                </div>
                                <HelpNotation
                                    icon={`restaurant_green`}
                                    text={plan.mealTypeName.ru}
                                    classNameText={classes.hint_text}
                                ></HelpNotation>
                            </div>
                        )()}
                    </div>
                    : (() => plansInfo.isMinStay ?
                        <div className={[classes.cell_min, isActive ? classes.green : classes.red].join(' ')}
                             onClick={() => setModalRoom(true)}>
                            <p className={classes.cell_price}>{plansInfo.minStay}</p>
                        </div>
                        : (() => plansInfo.roomsOnSale ?
                                <div className={[classes.cell, isActive ? classes.green : classes.red].join(' ')}
                                     onClick={() => setModalPrice(true)}>
                                    {isActive?<><p className={classes.cell_price}>{plansInfo.roomsCount}</p>
                                        <p className={classes.cell_currency}>{plansInfo.roomsFree}</p></>:""}
                                </div>
                                : <div className={[classes.cell, isActive ? classes.green : classes.red].join(' ')}
                                       onClick={() => setModalRoom(true)}>
                                    <p className={classes.cell_price}>{plansInfo.price}</p>
                                    <p className={classes.cell_currency}>руб</p>
                                </div>
                        )())()
            }
            {templateModalRoom}
            {templateModalPrice}
            {templateError}
        </>
    )
}

export default TableCustomCell