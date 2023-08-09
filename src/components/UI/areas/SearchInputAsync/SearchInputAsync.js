import React from "react"
import classes from "./SearchInputAsync.module.scss"
import './SearchSelect.scss'
import CustomAsyncInput from "../CustomAsyncInput/CustomAsyncInput";
import { useTranslation } from "react-i18next";

function SearchInputAsync({
    onInputChange,
    value,
    onChange,
    placeholder,
    className,
    icon,
    inputWrapClass,
    typeField = 1,
    loadOptions,
    defaultOptions,
    getOptionValue,
    ...rest
}) {

    const { t } = useTranslation()
    /** Стили для инпута и иконки*/
    const cls = [classes.search_input]
    if (className) cls.push(className)
    const clsPrefix = typeField == 1 ? "search-async-input" : "search-async-input-field"
    const clsInput = typeField == 1 ? "SearchAsyncInput" : "SearchAsyncInputField"
    const iconStyle = icon ? icon : classes.search_icon

    return (
        <div className={cls.join(" ")}>
            <span className={iconStyle}></span>
            <CustomAsyncInput
                typeField={typeField}
                onChange={onChange}
                noOptionsMessage={(value) => (!value.inputValue && !defaultOptions.length)? null : t('filters.noOptionsMessage')}
                classesWrap={classes.input_wrap}
                className={clsInput}
                classNamePrefix={clsPrefix}
                inputWrapClass={inputWrapClass}
                placeholder={placeholder}
                onInputChange={onInputChange}
                loadOptions={loadOptions}
                defaultOptions={defaultOptions}
                getOptionValue={getOptionValue}
                defaultValue={value}
                {...rest}
            >
            </CustomAsyncInput>
        </div>

    )
}

export default SearchInputAsync