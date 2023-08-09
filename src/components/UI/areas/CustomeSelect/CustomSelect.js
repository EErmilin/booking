import React from 'react';
import './CustomSelect.scss';
import Select from 'react-select';
import classes from '../Input/Input.module.scss';
import { useTranslation } from 'react-i18next';

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        border: "1px solid #FF7F7F !important;",
    }),
}


function isInvalid(valid, touched, shouldValidate) {
    return !valid && shouldValidate && touched;
}

const CustomSelect = ({
    label,
    className,
    required,
    valid,
    touched,
    shouldValidate,
    errorMessage,
    noMessage,
    typeArrow,
    placeholder,
    disabled,
    isSearchable=false ,
    ...rest }) => {

    const { t } = useTranslation();
    const cls = [classes.Input];
    if (required) {
        cls.push(classes.required);
    }
    /** Видимость сообщения об ошибке */
    const errMsg = isInvalid(valid, touched, shouldValidate) ? (
        <span className={classes.err_msg}>{errorMessage || t('area-validation.default-message')}</span>
    ) : null;
    const errClasses = isInvalid(valid, touched, shouldValidate) && customStyles

    return(
        <div className={`custom-select-wrap ${className} ${errClasses}`}>
            {label && (
                <label className="custom-select-label">
                    {label}
                    {required ? '*' : ''}
                </label>
            )}
            <Select
                className="CustomSelect"
                classNamePrefix={"custom-select"}
                styles={errClasses}
                isSearchable={ isSearchable }
                placeholder={placeholder}
                isDisabled={disabled}
                {...rest}
            />
            {!noMessage?errMsg:''}
        </div>
    );
}

export default CustomSelect;
