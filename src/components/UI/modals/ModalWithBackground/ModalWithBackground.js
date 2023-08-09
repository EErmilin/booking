import React, {useEffect, useRef, useState} from 'react';
import classes from './ModalWithBackground.module.scss';

const ModalWithBackground = ({
    id,
    children,
    width,
    height,
    close,
    onClick,
    noAutoMargin,
    display,
    className
}) => {
    const cls = [classes.Modal]
    if(className)cls.push(className)

    const closeBtn = close && (
        <button className={classes.closeBtn} onClick={(event) => onClick(event)} />
    );

    const styleNoMargin = noAutoMargin
        ? {
            marginTop: 'initial',
            marginBottom: 'initial',
        }
        : {};

    return (
        <div
            id={id}
            className={cls.join(' ')}
            style={{
                display:display || '',
                maxWidth: width || '',
                maxHeight: height || '',
                ...styleNoMargin,
            }}
            data-wrap="modal"
        >
            {closeBtn}
            {children}
        </div>
    );
};

export default ModalWithBackground;

