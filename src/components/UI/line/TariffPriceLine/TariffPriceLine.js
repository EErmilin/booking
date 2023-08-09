import React, {useMemo, useState} from "react"
import classes from "./TariffPriceLine.module.scss"
import ExpandBlock from "../../../ExpandBlock/ExpandBlock";
import {useTranslation} from "react-i18next";
import Checkbox from "../../areas/Checkbox/Checkbox";
import {ReactComponent as GuestIcon} from "../../../../assets/svg/icons/man-blue.svg"
import Input from "../../areas/Input/Input";
import {NavLink} from "react-router-dom";
import Button from "../../btns/Button/Button";
import {useDispatch} from "react-redux";
import {updatePrices} from "../../../../store/actions/pricesActions";
import useToggleVisibility from "../../../../hooks/useToggleVisibility";
import EmptyModal from "../../modals/EmptyModal/EmptyModal";



function TariffPriceLine ({
    className,
    rooms
}){
    const {t} = useTranslation()
    const cls = [classes.tariff_price]
    const dispatcher  = useDispatch()
    if(className)cls.push(className)
    const [priceState,setPriceState]=useState(rooms.weekData)
    const [modal,setModal,closeModal] = useToggleVisibility()

    function changePrice(tariffId,value,idPrice,idInArr){
        const newPrice = JSON.parse(JSON.stringify(priceState))
        newPrice[tariffId].weekPlans.forEach((elem)=>{
            if(elem.id==idPrice){
                elem.prices[idInArr] = value
            }
        })
        setPriceState(newPrice)
    }

    function changeAvailability(tariffId,checked,idInArr){
        const newPrice = JSON.parse(JSON.stringify(priceState))
        newPrice[tariffId].weekAvailability[idInArr] = checked
        setPriceState(newPrice)
    }

    function saveInfo(){
        for (let i in priceState){
            dispatcher(updatePrices({tariffId:i,roomId:rooms.id,...priceState[i]}))
        }
        setModal(true)
    }


    function clearChanges (){
        setPriceState(rooms.weekData)
    }



    const templateModal = modal && <EmptyModal
        background="blue"
        closeModal={closeModal}
        btnCancelClick={() => setModal(false)}
        width={296}
        typeModal="withoutBack"
        close={() => setModal(false)}
    >
        <div className={classes.success_modal}>
            <h2 className={classes.tariff_price_title}>{t("prices.modal.title")}</h2>
        </div>
    </EmptyModal>

    const roomTariffs = useMemo(()=>{
        let template = []

        if(typeof priceState === 'array')return template
        for(let i in priceState){
            const templateGuest =priceState[i].weekPlans.map((tariff,id)=>{
                return (
                    <div className={classes.tariff_price_item_availability}>
                        <div className={classes.tariff_price_item_icon}>{[...Array(tariff.adult_count)].map((elem,key)=><GuestIcon />)}</div>
                        {tariff.prices.map((price,id)=>{
                            return <Input
                                className={classes.tariff_price_item_input}
                                value={price}
                                onChange={(event)=>changePrice(i,event.target.value,tariff.id,id)}
                            ></Input>
                        })}
                    </div>
                )
            })
            template.push(
                <div className={classes.tariff_price_item} key={i}>
                    <h4 className={classes.tariff_price_item_title}>{rooms.weekData[i] && rooms.weekData[i].tariffName && rooms.weekData[i].tariffName.ru}</h4>
                    <div className={classes.tariff_price_item_availability}>
                        <span className={classes.tariff_price_item_subtitle}>{t("prices.availability")}</span>
                        {priceState[i].weekAvailability.map((day,id)=>{
                            return <Checkbox
                                text={t(`weekAvailability.${id+1}`)}
                                classNameLabel={classes.tariff_price_item_check}
                                classNameCheckBox={classes.tariff_price_item_check_box}
                                checked={day}
                                onChange={(event)=>changeAvailability(i,event.target.checked,id)}
                            ></Checkbox>
                        })}
                    </div>
                    {templateGuest}
                </div>
            )
        }
        return template
    },[rooms,priceState])

    return (
        <div className={cls.join(' ')}>
            {templateModal}
            <ExpandBlock title={rooms.name.ru}>
                <div className={classes.tariff_price_wrap}>
                    {roomTariffs}
                    <div className={classes.tariff_price_buttons}>
                        <NavLink className={classes.tariff_price_buttons_link} to={`/edit-object/${rooms.hotel_id}/second-step/edit-room/${rooms.id}`}>{t("prices.goTo")}</NavLink>
                        <div className={classes.tariff_price_buttons}>
                            <Button
                                typeButton={1}
                                type="button"
                                btnColor="green"
                                onClick={saveInfo}
                            >{t("prices.btnSave")}</Button>
                            <Button
                                typeButton={1}
                                btnColor="outline_blue"
                                className={classes.tariff_price_buttons_cancel}
                                onClick={()=>{clearChanges()}}
                            >{t("prices.btnCancel")}</Button>
                        </div>
                    </div>
                </div>
            </ExpandBlock>
        </div>
    )
}

export default TariffPriceLine