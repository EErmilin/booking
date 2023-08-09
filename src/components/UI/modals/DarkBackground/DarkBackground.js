import React from "react";
import classes from "./DarkBackground.module.scss";


function DarkBackground ({ children, className, onClick,background='dark' }){
    /** Формируем классы стилей */
    const cls = [background==="dark"?classes.DarkBackground:classes.BlueBackground];
    if (className) {
        cls.push(className);
    }


    return (
        <div
            onMouseDown={onClick}
            onKeyPress={onClick}
            className={cls.join(' ')}
            role="button"
            tabIndex="0"
        >
            {children}
        </div>
    )
}

export default DarkBackground