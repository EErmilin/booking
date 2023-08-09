import React, {useEffect} from "react"
import classes from "./ModalPolitic.module.scss"
import EmptyModal from "../../../../../components/UI/modals/EmptyModal/EmptyModal";
import {useDispatch, useSelector} from "react-redux";
import {getTermsInfo} from "../../../../../store/actions/generalInfoAction";
import InfoPageUnit from "../../../../../components/InfoPageUnit/InfoPageUnit";
import Preloader from "../../../../../components/Preloader/Preloader";


function ModalPolitic({
    closeModal,
    setModal,
}){
    const info = useSelector(state => state.general.info)
    const dispatcher = useDispatch()


    /** Подтягиваем инфу */
    useEffect(()=>{
        dispatcher(getTermsInfo())
    },[])

    return (
        <EmptyModal
            close={true}
            background="blue"
            closeModal={closeModal}
            btnCancelClick={() => setModal(false)}
            width={1020}
            typeModal="withoutBack"
            className={classes.modal_politic}
        >
            {info?<InfoPageUnit className={classes.modal_politic_item} title={info.name.ru}>
                <div dangerouslySetInnerHTML={{__html: info.text.ru}}></div>
            </InfoPageUnit>:<Preloader></Preloader>}
        </EmptyModal>
    )
}


export default ModalPolitic