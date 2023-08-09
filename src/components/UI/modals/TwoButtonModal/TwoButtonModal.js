import React from 'react';
import classes from './TwoButtonModal.module.scss';

import Button from '../../btns/Button/Button';
import EmptyModal from '../EmptyModal/EmptyModal';

const TwoButtonModal = ({
    className,
    classNameTitle,
    title,
    titleCenter,
    text,
    textCenter,
    width,
    closeModal,
    btnCancelText,
    btnCancelClick,
    btnNextText,
    btnNextClick,
    btnCancelClassName,
    btnNextClassName,
    children,
    disabled,
    display,
    typeModal,
    background,
    classNameButtonWrap,
    isRedBtn,
}) => {
    /** Делаем заголовок по центру */
    const clsTitle = [classes.modalTitle];
    if (titleCenter) {
        clsTitle.push(classes.modalTitleCenter);
    }
    if (classNameTitle) clsTitle.push(classNameTitle)

    /** Делаем текст по центру */
    const clsText = [classes.modal_text];
    if (textCenter) {
        clsText.push(classes.modalTextCenter);
    }

    /** Дополнительный классы для кнопки cancel */
    const clsBtnCancel = [classes.btn_cancel];
    if (btnCancelClassName) {
        clsBtnCancel.push(btnCancelClassName);
    }
    const clsBtnWrap = [classes.btn_wrap]
    if (classNameButtonWrap) clsBtnWrap.push(classNameButtonWrap)

    const clsBtnNext = [classes.btn_next]
    if (btnNextClassName) clsBtnNext.push(btnNextClassName)

    const modalWidth = width || 420

    if (modalWidth > 500) {
        clsBtnWrap.push(classes.btn_wrap_wide)
    } else {
        clsBtnWrap.push(classes.btn_wrap_narrow)
    }

    return (
        <EmptyModal
            center
            width={modalWidth}
            close
            closeModal={closeModal}
            btnCancelClick={btnCancelClick}
            display={display}
            typeModal={typeModal}
            background={background}
            className={className}
        >
            {title && <h3 className={clsTitle.join(' ')}>{title}</h3>}

            {text && <p className={clsText.join(' ')}>{text}</p>}

            {children}

            <div className={clsBtnWrap.join(' ')}>
                {isRedBtn ? <Button
                    typeButton={2}
                    btnColor="ButtonRed"
                    onClick={btnNextClick}
                    disabled={disabled}
                >{btnNextText}</Button> :
                    <Button
                        typeButton={1}
                        btnColor="green"
                        className={clsBtnNext.join(' ')}
                        onClick={btnNextClick}
                        disabled={disabled}
                    >{btnNextText}</Button>}
                <Button
                    typeButton={1}
                    btnColor="outline_blue"
                    className={clsBtnCancel.join(' ')}
                    onClick={btnCancelClick}
                >{btnCancelText}</Button>
            </div>
        </EmptyModal>
    );
};

export default TwoButtonModal;

