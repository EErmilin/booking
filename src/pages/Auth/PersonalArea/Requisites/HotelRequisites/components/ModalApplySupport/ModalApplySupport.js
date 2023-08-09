import React from "react"
import classes from "./ModalApplySupport.module.scss"
import EmptyModal from "../../../../../../../components/UI/modals/EmptyModal/EmptyModal";


function ModalApplySupport({
    setModal,
    closeModal
}){
    return (
        <EmptyModal
            close={true}
            closeModal={closeModal}
            btnCancelClick={() => setModal(false)}
            width={347}
            background="blue"
            typeModal={"withoutBack"}
            className={classes.modal_apply_support}
        >
            <h2 className={classes.modal_apply_support_title}>Ошибка при обновлении данных!</h2>
            <p className={classes.modal_apply_support_text}>У одобренных реквизитов не хватает обязательных полей. Чтобы привести реквизиты в соответствие с новой формой, требуется обратиться в службу технической поддержки для добавления данных.</p>
        </EmptyModal>
    )
}

export default ModalApplySupport