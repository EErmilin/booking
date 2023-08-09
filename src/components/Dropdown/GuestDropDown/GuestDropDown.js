import React, {useRef, useState} from "react"
import {useTranslation} from "react-i18next";
import useOnClickOutside from "../../../hooks/useOnClickOutside";
import NumberInput from "../../UI/areas/NumberInput/NumberInput";
import Button from "../../UI/btns/Button/Button";
import numWord from "../../../functions/numWord"
import classes from "./GuestDropDown.module.scss"

function GuestDropDown({
    className,
    state,
    onChange,
    noLabel,
    classNameDropdown,
    icon = false
}){
    const cls = [classes.wrap]
    if(className)cls.push(className)
    const clsDropdown = [classes.dropdown]
    if(classNameDropdown)clsDropdown.push(classNameDropdown)
    const {t} = useTranslation()
    const ref = useRef()
    const [showDropDown,toggleShowDropDown] = useOnClickOutside(ref)
    const [stateGuest,setStateGuest] = useState({...state})
    /** Выпадашка */
    const dropDownGuest = showDropDown &&
        <div className={clsDropdown.join(' ')}>
            <div className={classes.dropdown_wrp}>
                <div className={classes.guest_range}>
                    <p className={classes.dropdown_txt}>{t('filters.adults')}</p>
                    <span className={classes.guest_range_txt}>{t('filters.adultsRange')}</span>
                </div>
                <NumberInput value={Number(state.adults)} onChange={(value)=>onChange({...state,adults:value})} disabled={true}/>
                {/*<div className={classes.guest_range}>*/}
                {/*    <p className={classes.dropdown_txt}>{t('filters.children')}</p>*/}
                {/*    <span className={classes.guest_range_txt}>{t('filters.childrenRange')}</span>*/}
                {/*</div>*/}
                {/*<NumberInput value={stateGuest.children} onChange={(value)=>setStateGuest(prevState => ({...prevState,children:value}))}/>*/}
                <Button
                    onClick={handleSaveGuest}
                    className={classes.apply_btn}
                    btnColor="ButtonGreen"
                >{t('filters.apply')}</Button>
            </div>
        </div>


    function handleSaveGuest (){
        onChange({...state})
        toggleShowDropDown(false)
    }
    
    return (
        <div
            ref={ref}
            className={cls.join(' ')}
        >
            <div className={classes.head} onClick={() => {toggleShowDropDown(!showDropDown)}}>
                {icon && <div className={classes.head_icon}></div>}
                <div className={classes.head_data} >
                    {noLabel?"":<label className={classes.head_label}>{t('filters.guest')}</label>}
                    <div className={classes.head_filter}>
                        {state.adults} {numWord(state.adults, ["взрослый", "взрослых", "взрослых"])}
                        {/*∙ {state.children} {t('filters.children')}*/}
                    </div>
                </div>
            </div>
            {dropDownGuest}
        </div>
    )
}

export default GuestDropDown