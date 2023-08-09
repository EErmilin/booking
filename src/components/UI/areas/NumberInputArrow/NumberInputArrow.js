import React from "react"
import classes from "./NumberInputArrow.module.scss"

/**
 * Инпут type="number" с кастомными стрелочками
 * @param className
 * @param value
 * @param onChange
 * @param classNameInput
 * @param classNameInputWrap
 * @param label
 * @returns {JSX.Element}
 * @constructor
 */

function NumberInputArrow({
    id,
    name,
    className,
    value,
    onChange,
    classNameInput,
    classNameInputWrap,
    label,
    errorMessage
}){
    /**Стили главного блока*/
    const cls = [classes.number_input_arrow]
    if(className)cls.push(className)

    /** Стили врапера инпута */
    const clsInputWrap = [classes.number_input_arrow_wrap]
    if(classNameInputWrap)clsInputWrap.push(classNameInputWrap)

    /** Создаем уникальный id */
    const uniqId = `number-input-${Math.random()}`;

    /** Стили инпута */
    const clsInput = [classes.number_input_arrow_input]
    if(classNameInput)clsInput.push(classNameInput)


    /** Отображение label */
    const labelTemplate = label ? <label htmlFor={uniqId}>{label}</label> : null;

    /**
     * Если поле инвалидно
     * то добавляем классы для инвалидного поля,
     * иначе, если поле было тронуто добавляем классы для валидного
     */
    if (errorMessage) {
        cls.push("input_with_select_invalid");
    }
    const errorMassage = errorMessage && <span>{errorMessage}</span>

    return (
        <div className={cls.join(' ')}>
            {labelTemplate}
            <div className={clsInputWrap.join(' ')}>
                <input
                    className={clsInput.join(' ')}
                    onChange={(event)=>onChange(event.target.value)}
                    value={value}
                    type="number"
                    id={id}
                    name={name}
                />
                <div className={classes.number_input_arrow_bar}>
                    <span className={classes.number_input_arrow_up} onClick={()=>onChange(+value+1)}></span>
                    <span className={classes.number_input_arrow_down} onClick={()=> {
                        if(value==0)return
                        onChange(value - 1)
                    }}></span>
                </div>
            </div>
            {errorMassage}
        </div>
    )
}


export default NumberInputArrow