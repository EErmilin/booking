import React, {useEffect, useRef, useState} from 'react';
import classes from './ModalWithoutBackground.module.scss';

const ModalWithoutBackground = ({
                                  id,
                                 children,
                                 width,
                                 height,
                                 close,
                                 onClick,
                                 noAutoMargin,
                                 display
                             }) => {
    const closeBtn = close && (
        <button className={classes.closeBtn} onClick={(event) => onClick(event)}><span className={classes.icon}></span></button>
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
            className={classes.Modal}
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

export default ModalWithoutBackground;

