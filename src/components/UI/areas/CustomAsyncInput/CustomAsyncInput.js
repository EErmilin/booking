import React from "react"
import "./CustomAsyncInput.scss";
import AsyncSelect from "react-select/async";
import classes from "./CustomAsyncInput.module.scss"
import {useTranslation} from "react-i18next";

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        border: "1px solid #FF7F7F !important;",
    }),
}


function isInvalid(valid, touched, shouldValidate) {
    return !valid && shouldValidate && touched;
}

function CustomAsyncInput({
    onInputChange,
    value,
    onChange,
    loadOptions,
    defaultValue,
    className,
    label,
    classesWrap,
    inputWrapClass,
    required,
    valid,
    shouldValidate,
    touched,
    noMessage,
    errorMessage,
    id,
    classNamePrefix,
    defaultOptions,
    noOptionsMessage,
    typeField,
    ...rest
}){
    const { t } = useTranslation();
    const cls = [inputWrapClass ? inputWrapClass : classes.custom_async_input];
    if (required) {
        cls.push(classes.required);
    }
    /** Видимость сообщения об ошибке */
    const errMsg = isInvalid(valid, touched, shouldValidate) ? (
        <span className={classes.err_msg}>{errorMessage || t('area-validation.default-message')}</span>
    ) : null;
    const errClasses = isInvalid(valid, touched, shouldValidate) && customStyles


    if(classesWrap)cls.push(classesWrap)

    return (
        <div className={cls.join(' ')}>
            <label className={classes.label} htmlFor={id}>
                {label}
            </label>
            
            <AsyncSelect
                noOptionsMessage={noOptionsMessage}
                loadOptions={loadOptions}
                onInputChange={onInputChange}
                className={className?className:"CustomAsyncInput"}
                styles={errClasses}
                classNamePrefix={classNamePrefix?classNamePrefix:"custom-async-input"}
                onChange={onChange}
                defaultOptions={defaultOptions}
                value={defaultValue}
                maxMenuHeight={typeField === 2 && 207}
                {...rest}
            />
            {!noMessage?errMsg:''}
        </div>
    )
}


export default CustomAsyncInput