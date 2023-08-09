import React, { useRef, useEffect } from "react"
import classes from "./CustomDatePicker.module.scss"
import "./CustomDatePicker.scss"
import DatePicker, { registerLocale } from "react-datepicker"
import { useTranslation } from "react-i18next";
import { ru, enGB } from 'date-fns/esm/locale';
import InputMask from 'react-input-mask'

registerLocale('ru-RU', ru);
registerLocale('en-US', enGB);



function isInvalid(valid, touched, shouldValidate) {
    return !valid && shouldValidate && touched;
}


const CustomDatePicker = ({
    label,
    accountInfo,
    className,
    classNameLabel,
    id,
    valid,
    required,
    touched,
    shouldValidate,
    errorMessage,
    borderNeed,
    value,
    maxDate,
    mask,
    ...rest }) => {
    const { t } = useTranslation();

    /** Формируем cтили обертки */
    const cls = [];
    const clsLabel=[classes.label]
    if (className) {
        cls.push(className);
    }
    if (required) {
        cls.push(classes.required);
    }
    if (classNameLabel) {
        clsLabel.push(classNameLabel);
    }
    /**
     * Если поле инвалидно
     * то добавляем классы для инвалидного поля,
     * иначе, если поле было тронуто добавляем классы для валидного
     */
    if (borderNeed) {
        if (isInvalid(valid, touched, shouldValidate)) {
            cls.push(classes.invalid);
        } else if (touched) {
            cls.push(classes.valid);
        }
    }


    /** Видимость сообщения об ошибке */
    const errMsg = isInvalid(valid, touched, shouldValidate) ? (
        <span className={classes.err_msg}>{errorMessage || t('area-validation.default-message')}</span>
    ) : null;

    const pickerRef = useRef(null)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    useEffect(() => {
        if (isMobile && pickerRef.current !== null) {
            pickerRef.current.input.readOnly = true;
        }
    }, [isMobile, pickerRef]);

    const calendar = mask ? <DatePicker
        locale={"ru-RU"}
        dateFormat={['dd.MM.yyyy', 'dd/MM/yyyy', 'ddMMyyyy', 'dd MM yyyy']}
        className={classes.CustomDatePicker}
        id={id}
        showMonthDropdown
        showYearDropdown
        yearDropdownItemNumber={100}
        inputProps={{ readOnly: true }}
        scrollableYearDropdown
        selected={value}
        ref={pickerRef}
        maxDate={maxDate}
        {...rest}
        customInput={<InputMask
            mask={"99.99.9999"}
        ></InputMask>}
    /> : <DatePicker
        locale={"ru-RU"}
        dateFormat={['dd.MM.yyyy', 'dd/MM/yyyy', 'ddMMyyyy', 'dd MM yyyy']}
        className={classes.CustomDatePicker}
        id={id}
        showMonthDropdown
        showYearDropdown
        yearDropdownItemNumber={100}
        inputProps={{ readOnly: true }}
        scrollableYearDropdown
        selected={value}
        ref={pickerRef}
        maxDate={maxDate}
        {...rest}
    />


    return (
        <div className={cls.join(' ')}>
            <label className={clsLabel.join(' ')} htmlFor={id}>
                {label}{required && '*'}
            </label>
            {calendar}
            {errMsg}
        </div>
    );
};



export default CustomDatePicker