import React from "react";
import classes from "./NavigationBtn.module.scss";
import {ReactComponent as ArrowRight} from "../../../../assets/svg/icons/arrow-rigth-blue.svg";




/**
 * @param className
 * @param onClick
 * @param type Тип кнопки вперед/назад
 * @returns {JSX.Element}
 * @constructor
 *
 */

function NavigationBtn ({
    className,
    onClick,
    type="next"||"prev",
}){
    const cls = [classes.navigation_btn]
    if(className)cls.push(className)

    const typeArrow = type=="next"?<ArrowRight />:<ArrowRight className={classes.left} />

    return (
        <button
            className={cls.join(' ')}
            onClick={onClick}
        >
            {typeArrow}
        </button>
    )
}

export default NavigationBtn