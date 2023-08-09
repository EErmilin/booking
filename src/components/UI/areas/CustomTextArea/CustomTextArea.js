import React from "react";
import classes from "./CustomTextArea.module.scss";

function isInvalid(valid, touched, shouldValidate,errorMessage) {
    return !valid && shouldValidate && touched && errorMessage;
}

function CustomTextArea ({
    onChange,
    name,
    className,
    classNameInputWrap,
    value,
    placeholder,
    label,
    errorMessage,
    valid,
    touched,
    shouldValidate,
    disabled,
    required
}){
    /** Создаем уникальный id */
    const id = `textarea-${Math.random()}`;

    /** Формируем css классы */
    const cls = [classes.TextArea];
    if (className) {
        cls.push(className);
    }
    const clsInputWrap = [classes.TextArea_wrap]
    if(classNameInputWrap)clsInputWrap.push(classNameInputWrap)

    /** Отображение label */
    const labelTemplate = label ? <label htmlFor={id}>{label}{required && `*`}</label> : null;
    /**
     * Если поле инвалидно
     * то добавляем классы для инвалидного поля,
     * иначе, если поле было тронуто добавляем классы для валидного
     */
    if (isInvalid(valid, touched, shouldValidate,errorMessage)) {
        cls.push(classes.invalid);
    } else if (touched) {
        cls.push(classes.valid);
    }

    /** Видимость сообщения об ошибке */
    const errMsg = isInvalid(valid, touched, shouldValidate,errorMessage) ? (
        <span>{errorMessage}</span>
    ) : null;

    return (
        <div className={cls.join(' ')}>
            {labelTemplate}
            <div className={clsInputWrap.join(' ')}>
                <textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                ></textarea>
            </div>
            {errMsg}
        </div>
    )
}

export default CustomTextArea