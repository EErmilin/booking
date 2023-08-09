import React, { useRef } from "react";
import classes from "./DropdownList.module.scss"
import Button from "../../../components/UI/btns/Button/Button";
import { useTranslation } from "react-i18next";
import useOnClickOutside from "../../../hooks/useOnClickOutside";

function DropdownList({ children, title, isOpen = false, className, titleClassName, titleActiveClassName }) {
    const { t } = useTranslation();

    const ref = useRef()
    const [show, toggleShow] = useOnClickOutside(ref, isOpen)


    const handleList = (event) => {
        toggleShow(!show)
        event.preventDefault();
      };


    return (
        <>
            <Button onClick={handleList} className={[(titleClassName? titleClassName: classes.title),show?(titleActiveClassName?titleActiveClassName:''):''].join(' ')}>
                <h2>{title}</h2>
                <div className={[classes.button,(show?classes.button_active:'')].join(' ')}/>
            </Button>
            {show && <div className={className}>{children}</div>}
        </>

    )
}

export default DropdownList