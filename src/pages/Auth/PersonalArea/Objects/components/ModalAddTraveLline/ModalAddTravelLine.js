import React, { useEffect, useState } from "react"
import classes from "./ModalAddTravelLine.module.scss"
import EmptyModal from "../../../../../../components/UI/modals/EmptyModal/EmptyModal";
import Input from "../../../../../../components/UI/areas/Input/Input";
import Checkbox from "../../../../../../components/UI/areas/Checkbox/Checkbox";
import Button from "../../../../../../components/UI/btns/Button/Button";
import Preloader from "../../../../../../components/Preloader/Preloader";
import { useDispatch, useSelector } from "react-redux";
import { checkTravelLine, createTravelLine } from "../../../../../../store/actions/partnerHotelsActions";
import useToggleVisibility from "../../../../../../hooks/useToggleVisibility";
import HotelRequisites from "../../../Requisites/HotelRequisites/HotelRequisites";


function ModalAddTravelLine({
    isShow,
    buttonCancelClick,
    closeModal
}) {
    const [modalSuccess, setModalSuccess, closeModalSuccess] = useToggleVisibility()
    const [modalAlreadyAdded, setAlreadyAdded, closeAlreadyAdded] = useToggleVisibility()
    const [modalError, setModalError, closeModalError] = useToggleVisibility()
    const [modalRequisites, setModalRequisites, closeModalRequisites] = useToggleVisibility()
    let [idTravel, setIdTravel] = useState()
    let [travellineConnection, setTravellineConnection] = useState(false)
    let [errorId, setErrorId] = useState({})
    const [hotelId, setHotelId] = useState(null)
    let [preloader, setPreloader] = useState(false)
    let [isConnect, setIsConnect] = useState(false)
    const dispatcher = useDispatch()
    const userInfo = useSelector(state => state.auth.userInfo)


    const connect = async (requisites) => {
        let isError = false
        if (!idTravel) {
            setErrorId(prevState => ({ ...prevState, errorId: "Введите ID объекта из TravelLine" }))
            isError = true
        }
        if (!travellineConnection) {
            setErrorId(prevState => ({ ...prevState, travellineConnection: "Для добавления объекта TravellLine необходимо подтвердить подключение канала" }))
            isError = true
        }
        if (isError) return
        else {
            setErrorId({})
            setPreloader(true)
            let response
            if (!hotelId) {
                if (modalRequisites) {
                    const obj = {
                        ...requisites,
                        propertyId: +idTravel,
                        token: localStorage.getItem('refreshToken'),
                        uuid: userInfo.uuid,
                        fromAccount: 1
                    }
                    response = await dispatcher(createTravelLine(obj))
                } else {
                    response = await dispatcher(checkTravelLine(+idTravel))
                }
                setPreloader(false)
                if (response.status == 200 || response.status == 201) {
                    buttonCancelClick(false)
                    setModalRequisites(true)
                } else if (response.status == 422) {
                    buttonCancelClick(false)
                    setModalError(true)
                } else if (!modalRequisites) {
                    buttonCancelClick(false)
                    setAlreadyAdded(true)
                }
                return response
            }
        }
    }

    useEffect(() => {
        if (isConnect) {
            setModalRequisites(false)
            setModalSuccess(true)
            setIsConnect(false)
        }

    }, [isConnect])


    const templateAlreadyAdded = modalAlreadyAdded && <EmptyModal
        className={classes.modal}
        width={315}
        close={true}
        closeModal={closeAlreadyAdded}
        btnCancelClick={() => setAlreadyAdded(false)}
        background="blue"
        typeModal="withoutBack"
    >
        <h2 className={classes.modal_title}>Объект уже добавлен!</h2>
        <div className={classes.modal_text}>Данный объект из Travelline уже добавлен на Check in.</div>
    </EmptyModal>

    const templateSuccess = modalSuccess && <EmptyModal
        className={classes.modal_success}
        width={333}
        close={true}
        closeModal={closeModalSuccess}
        btnCancelClick={() => setModalSuccess(false)}
        background="blue"
        typeModal="withoutBack"
    >
        <h2 className={classes.modal_success_title}>Отлично!</h2>
        <div className={classes.modal_text}>Объект и реквизиты отправлены на модерацию.</div>
    </EmptyModal>


    const templateSRequisitesModal = modalRequisites && <EmptyModal
        className={classes.modal}
        close={true}
        width={812}
        closeModal={closeModalRequisites}
        btnCancelClick={() => setModalRequisites(false)}
        background="blue"
        typeModal="withoutBack"
    >
        <h2 className={classes.modal_title}>Добавить объект из Travelline</h2>
        <div className={classes.modal_step_wrp}>
            <span className={classes.modal_step}>Шаг: 2 из 2</span>
        </div>
        <HotelRequisites isAddObject={true}
            isTl={true}
            save={connect}
            setIsConnect={setIsConnect}
            setHotelId={setHotelId}
            hotelId={hotelId}
        />
    </EmptyModal>

    const templateError = modalError && <EmptyModal
        className={classes.modal}
        width={315}
        close={true}
        closeModal={closeModalError}
        btnCancelClick={() => setModalError(false)}
        background="blue"
        typeModal="withoutBack"
    >
        <h2 className={[classes.modal_title, classes.modal_title_error].join(' ')}>Ошибка!</h2>
        <div className={classes.modal_text}>Не получилось добавить объект! Вам нужно подключить канал Check in в кабинете Travelline</div>
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
                <div className={classes.modal_step}>Шаг: 1 из 2</div>
                <Input
                    label="ID объекта Travelline"
                    value={idTravel}
                    onChange={(e) => setIdTravel(e.target.value)}
                    errorMessage={errorId.errorId}
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
                    checked={travellineConnection}
                    onChange={() => setTravellineConnection(!travellineConnection)}
                    text={<>
                        <p className={classes.modal_checkbox}>Прежде, чем добавить объект к нам, Вам нужно настроить
                            подключение к Check in в Travelline, см. пункты 2-3:</p>
                        <a target="_blank" className={classes.modal_link}
                            href="https://www.travelline.ru/support/knowledge-base/kak-podklyuchit-kanal-prodazh-rabotayushchiy-v-rezhime-onlayn-zaprosa/">https://www.travelline.ru/support/knowledge-base/kak-podklyuchit-kanal-prodazh-rabotayushchiy-v-rezhime-onlayn-zaprosa/</a>
                    </>}
                ></Checkbox>
                {errorId.travellineConnection ? <p className={classes.modal_valid}>{errorId.travellineConnection}</p> : ""}
                {preloader && <Preloader></Preloader>}
                <Button
                    btnColor="green"
                    className={classes.modal_button}
                    onClick={connect}
                    typeButton={1}>
                    Добавить
                </Button>
            </EmptyModal>}
            {templateSRequisitesModal}
            {templateSuccess}
            {templateError}
            {templateAlreadyAdded}
        </>
    )
}

export default ModalAddTravelLine