import React, { useState } from "react"
import classes from "./ModalAddTravelLine.module.scss"
import EmptyModal from "../../../../../../components/UI/modals/EmptyModal/EmptyModal";
import Input from "../../../../../../components/UI/areas/Input/Input";
import Checkbox from "../../../../../../components/UI/areas/Checkbox/Checkbox";
import Button from "../../../../../../components/UI/btns/Button/Button";
import Preloader from "../../../../../../components/Preloader/Preloader";
import { useDispatch, useSelector } from "react-redux";
import { createTravelLine } from "../../../../../../store/actions/partnerHotelsActions";
import useToggleVisibility from "../../../../../../hooks/useToggleVisibility";
import HotelRequisites from "../../HotelRequisites/HotelRequisites";


function ModalAddTravelLine({
    isShow,
    buttonCancelClick,
    closeModal
}) {
    const [modalSuccess, setModalSuccess, closeModalSuccess] = useToggleVisibility()
    const [modalError, setModalError, closeModalError] = useToggleVisibility()
    const [showRequisitesModal, setShowRequisitesModal, closeShowRequisitesModal] = useToggleVisibility()
    let [idTravel, setIdTravel] = useState()
    let [errorId, setErrorId] = useState()
    let [preloader, setPreloader] = useState(false)
    const dispatcher = useDispatch()
    const userInfo = useSelector(state => state.auth.userInfo)

    const connect = async () => {
        if (!idTravel) return setErrorId("Введите ID объекта из TravelLine")
        else {
            setErrorId('')
            setPreloader(true)
            let isSave = await dispatcher(createTravelLine({ propertyId: +idTravel, token: localStorage.getItem('refreshToken'), uuid: userInfo.uuid, fromAccount: 1 }))
            setPreloader(false)
            if (!isSave) {
                buttonCancelClick(false)
                setModalSuccess(true)
            } else {
                buttonCancelClick(false)
                setModalError(true)
            }

        }
    }

    const templateSuccess = modalSuccess && <EmptyModal
        className={classes.modal}
        width={315}
        close={true}
        closeModal={closeModalSuccess}
        btnCancelClick={setModalSuccess}
        background="blue"
        typeModal="withoutBack"
    >
        <h2 className={classes.modal_title}>Спасибо!</h2>
        <div className={classes.modal_text}>Объект из Travelline успешно добавлен.</div>
    </EmptyModal>

    const templateError = modalError && <EmptyModal
        className={classes.modal}
        width={315}
        close={true}
        closeModal={closeModalError}
        btnCancelClick={setModalError}
        background="blue"
        typeModal="withoutBack"
    >
        <h2 className={[classes.modal_title, classes.modal_title_error].join(' ')}>Ошибка!</h2>
        <div className={classes.modal_text}>Не получилось добавить объект! Вам нужно подключить канал Check in в кабинете Travelline</div>
    </EmptyModal>

    const requisitesModal = showRequisitesModal && <EmptyModal
        className={classes.modal}
        width={315}
        close={true}
        closeModal={closeShowRequisitesModal}
        btnCancelClick={closeShowRequisitesModal}
        background="blue"
        typeModal="withoutBack"
    >
        <HotelRequisites save={connect} />
    </EmptyModal>

    return (
        <>
            {isShow && <EmptyModal
                className={classes.modal}
                btnCancelClick={buttonCancelClick}
                close={true}
                closeModal={closeModal}
                background="blue"
                width={393}
                typeModal="withoutBack"
            >
                <h2 className={classes.modal_title}>Добавить объект из Travelline</h2>
                <Input
                    label="ID объекта Travelline"
                    value={idTravel}
                    onChange={(e) => setIdTravel(e.target.value)}
                    errorMessage={errorId}
                    touched={true}
                    valid={false}
                    shouldValidate
                    required
                    typeClsInput="field"
                    classNameInputWrap={classes.modal_input}
                    type="number"
                ></Input>
                <Checkbox
                    classNameCheckBox={classes.modal_checkbox}
                    classNameLabel={classes.modal_label}
                    className={classes.modal_checkbox_wrp}
                    text={<>
                        <p className={classes.modal_checkbox}>Прежде, чем добавить объект к нам, Вам нужно настроить
                            подключение к Check in в Travelline, см. пункты 2-3:</p>
                        <a target="_blank" className={classes.modal_link}
                            href="https://www.travelline.ru/support/knowledge-base/kak-podklyuchit-kanal-prodazh-rabotayushchiy-v-rezhime-onlayn-zaprosa/">https://www.travelline.ru/support/knowledge-base/kak-podklyuchit-kanal-prodazh-rabotayushchiy-v-rezhime-onlayn-zaprosa/</a>
                    </>}
                ></Checkbox>
                {preloader && <Preloader></Preloader>}
                <Button
                    btnColor="green"
                    className={classes.modal_button}
                    onClick={connect}
                    typeButton={1}>
                    Добавить
                </Button>
            </EmptyModal>}
            {requisitesModal}
            {templateSuccess}
            {templateError}
        </>
    )
}

export default ModalAddTravelLine