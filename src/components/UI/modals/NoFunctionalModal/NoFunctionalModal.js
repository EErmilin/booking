import React from 'react'
import EmptyModal from "../EmptyModal/EmptyModal";


function NoFunctionalModal({
    isShowNoFunctionalModal,
    setIShowNoFunctionalModal
}) {
    if (isShowNoFunctionalModal) {
        return (
            <EmptyModal
                close={true}
                btnCancelClick={() => setIShowNoFunctionalModal(false)}
                typeModal={"withoutBack"}
                background="blue"
                width={328}
            >
                <p>Данный функционал находится в разработке</p>
            </EmptyModal>
        )
    }
}

export default NoFunctionalModal