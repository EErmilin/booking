import React, {useState} from "react"
import classes from "./FIlterDateFromTo.module.scss";
import {useTranslation} from "react-i18next";
import CalendarDropdown from "../../../Dropdown/CalendarDropdown/CalendarDropdown";
import GuestDropDown from "../../../Dropdown/GuestDropDown/GuestDropDown";


function FilterDateFromTo ({
    type,
    className,
    state,
    onChange
}){
    const {t} = useTranslation()
    const cls = [classes.field]

    if (className) cls.push(className)

    const template = type === "date"
        ?<div className={classes.field_date}>
            <span className={[classes.icon,classes.date_icon].join(' ')}></span>
            <CalendarDropdown state={state} onChange={onChange}/>
        </div>
        :<div className={classes.field_guest}>
            <GuestDropDown icon={true} state={state} onChange={onChange} />
        </div>


    return (
        <div className={cls.join(' ')}>
            {template}
        </div>
    )
}

export default FilterDateFromTo