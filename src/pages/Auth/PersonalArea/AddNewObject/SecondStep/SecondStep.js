import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import classes from "./SecondStep.module.scss";
import Button from "../../../../../components/UI/btns/Button/Button";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import Checkbox from "../../../../../components/UI/areas/Checkbox/Checkbox";
import useToggleVisibility from "../../../../../hooks/useToggleVisibility";
import EmptyModal from "../../../../../components/UI/modals/EmptyModal/EmptyModal";
import {
    clearAllHotelError,
    editHotel,
    saveHotel,
    saveHotelPartial
} from "../../../../../store/actions/partnerHotelsActions";
import { useDispatch, useSelector } from "react-redux";
import ErrorMessage from "../../../../../components/UI/message/ErrorMessage";
import HotelRequisites from "../../Requisites/HotelRequisites/HotelRequisites";


function SecondStep({ edit }) {
    const { t } = useTranslation()
    const dispatcher = useDispatch()
    const hotelInfo = useSelector(state => state.objects.hotelInfo)
    const errors = useSelector(state => state.objects.errors)
    const { id } = useParams()
    const navigate = useNavigate()



    const [showModalError, setShowModalError, closeModalError] = useToggleVisibility()
    const [selectedPayment, setSelectedPayment] = useState([])

    useEffect(() => {
        dispatcher(clearAllHotelError())
        if (Object.keys(hotelInfo).length) {
            setSelectedPayment(hotelInfo.payment_type_id ? hotelInfo.payment_type_id : [])
        }
    }, [hotelInfo])




    /** Массив типов оплаты */
    const arrTypePayment = [
        { text: t("addNewObjects.secondStep.cash"), value: 1 },
        { text: t("addNewObjects.secondStep.card"), value: 2 },
        { text: t("addNewObjects.secondStep.online"), value: 4 },
    ]
    /** Типы оплаты */
    const templatePayment = useMemo(() => arrTypePayment.map((elem, id) => {
        return (
            <Checkbox
                key={id}
                text={elem.text}
                classNameCheckBox={classes.second_step_form_checkbox}
                classNameLabel={classes.second_step_form_text}
                checked={selectedPayment.find(e => e == elem.value)}
                value={selectedPayment.find(e => e == elem.value)}
                onChange={(event) => {
                    if (event.target.checked) {
                        selectedPayment.push(elem.value)
                        setSelectedPayment(selectedPayment)
                    } else {
                        let arr = selectedPayment.filter(e => e !== elem.value)
                        setSelectedPayment(arr)
                    }
                }}
            ></Checkbox>
        )
    }), [selectedPayment])


    /** Кнопка назад */
    function back() {
        navigate(`/edit-object/${id}/first-step`)
    }



    async function save() {
        const hotelId = await dispatcher(saveHotelPartial({ payment_type_id: [...selectedPayment] }, id))
        if (hotelId) {
            navigate(`/edit-object/${id}/third-step`)
        }
    }

    /** Видимость сообщения об ошибке */
    const errMsg = errors.guest_time ? (
        <span className={classes.fifth_step_error}>{errors.guest_time || t('area-validation.default-message')}</span>
    ) : null;

    const validationError = errors.payment_type_id ? (
        <span className={classes.second_step_error}>{errors.payment_type_id}</span>
    ) : null;
    return (
        <div className={classes.second_step}>
            <h2 className={classes.second_step_title} >{t("addNewObjects.secondStep.title")}</h2>
            <p className={classes.second_step_subtitle}>{t("addNewObjects.secondStep.subTitle")}</p>
            <form className={classes.second_step_form}>
                <div className={classes.second_step_form_block}>
                    <h2 className={classes.second_step_form_title}>{t("addNewObjects.secondStep.typePayment")}</h2>
                    <h4 className={classes.second_step_form_sub_title}>Укажите доступные способы оплаты</h4>
                    <div className={classes.second_step_form_checkboxes}>
                        {templatePayment}
                    </div>
                    {errMsg}
                    {validationError}
                </div>
                <HotelRequisites isAddObject={true} save={save} back={back} />

            </form>

            {errors.payment_type_id ? <ErrorMessage error={"Есть незаполненные обязательные поля"} /> : null}
        </div>
    )
}

export default SecondStep