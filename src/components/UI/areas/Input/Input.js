import React, { useState } from "react";
import classes from "./Input.module.scss";
import { useTranslation } from "react-i18next";
import InputMask from 'react-input-mask'
import HelpNotation from "../../other/HelpNotation/HelpNotation";
/**
 * Кастомный инпут
 * @param className
 * @param shouldValidate
 * @param required
 * @param errors
 * @param onChange
 * @param value
 * @param touched
 * @constructor
 */

function isInvalid(valid, touched, shouldValidate, errorMessage) {
    return !valid && shouldValidate && touched && errorMessage;
}


function Input({
    isShow = true,
    typeClsInput = 'default',
    name,
    className,
    classNameInputWrap,
    shouldValidate,
    required,
    errorMessage,
    placeholder,
    disabled,
    onChange,
    onPaste,
    mask,
    value,
    valid,
    touched,
    type,
    label,
    autoFocus,
    autoComplete,
    inputmode,
    hint,
    classNameHintText,
    classNameHintWrap,
    readonly
}){
    const { t } = useTranslation();
    /** Состояние для показа пороля */
    const [passwordShow, setPasswordShow] = useState(true)
    /** Устанавливаем тип поля */
    const inputType = type || 'text';

    /** Формируем css классы */
    const cls = [classes.Input];
    if (className) {
        cls.push(className);
    }
    if (required) {
        cls.push(classes.required);
    }

    /** Создаем уникальный id */
    const id = `${inputType}-${Math.random()}`;

    /**
     * Если поле инвалидно
     * то добавляем классы для инвалидного поля,
     * иначе, если поле было тронуто добавляем классы для валидного
     */
    if (isInvalid(valid, touched, shouldValidate, errorMessage)) {
        cls.push(classes.invalid);
    } else if (touched) {
        cls.push(classes.valid);
    }

    /** Отображение label */
    const labelTemplate = label ?
        <div className={classes.labelWrap}>
            <label htmlFor={id}>{label}</label>
            {hint && <HelpNotation classNameHintWrap={classNameHintWrap} classNameText={classNameHintText} text={hint}/>}
        </div> : null;
    /** Видимость сообщения об ошибке */
    const errMsg = isInvalid(valid, touched, shouldValidate, errorMessage) ? (
        <span>{errorMessage}</span>
    ) : null;

    const clsInputWrap = [classes.InputWrap];
    if (classNameInputWrap) {
        clsInputWrap.push(classNameInputWrap);
    }
    const eyeButton = inputType === "password" && <span className={classes.password} onClick={() => setPasswordShow(!passwordShow)}></span>
    const typePassword = inputType === "password" ? (passwordShow ? 'password' : "text") : inputType

    /** Шаблоны инпутов. С маской и без */
    const input = mask ? (
        <InputMask
            id={id}
            name={name}
            mask={mask}
            maskChar=""
            required={required}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={typeClsInput == "field" && classes.InputField}
            onPaste={onPaste}
            autoFocus={autoFocus}
            autoComplete={autoComplete}
            inputmode={inputmode}
            readOnly={readonly}
        />
    ) : (
        !isShow ?
        null:
        <input
            id={id}
            name={name}
            type={typePassword}
            required={required}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={typeClsInput=="field"?classes.InputField:''}
            onPaste={onPaste}
            autoFocus={autoFocus}
            autoComplete={autoComplete}
            inputMode={inputmode}
            readOnly={readonly}
        />
    );

    return (
        <div className={cls.join(' ')}>
            {labelTemplate}
            <div className={clsInputWrap.join(' ')}>
                {input}
                {eyeButton}
            </div>
            {errMsg}
        </div>
    );
}

export default Input