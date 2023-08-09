import React from 'react'
import DarkBackground from "../DarkBackground/DarkBackground";
import ModalWithBackground from "../ModalWithBackground/ModalWithBackground";
import ModalWithoutBackground from "../ModalWithoutBackground/ModelWithoutBackground";


function EmptyModal ({
    id,
    className,
    background,
    width,
    height,
    close,
    closeModal,
    btnCancelClick,
    children,
    display,
    typeModal="withBack"
}){
    return (
        <DarkBackground
            background={background}
            onClick={closeModal}
        >
            {typeModal==="withoutBack"?
            <ModalWithBackground
                id={id}
                className={className}
                width={width}
                height={height}
                close={close}
                onClick={btnCancelClick}
                display={display}
            >
                {children}
            </ModalWithBackground>:
            <ModalWithoutBackground
                id={id}
                width={width}
                height={height}
                close={close}
                onClick={btnCancelClick}
                display={display}
            >
                {children}
            </ModalWithoutBackground>
            }
        </DarkBackground>
    )
}

export default EmptyModal