import React from "react"
import "./InputWithSelect.scss";
import {useTranslation} from "react-i18next";
import Input from "../Input/Input";
import CustomSelect from "../CustomeSelect/CustomSelect";


function InputWithSelect ({
  className,
  classNameInputWrap,
  classNameInput,
  classNameSelect,
  nameInput,
  nameSelect,
  onChangeInput,
  onChangeSelect,
  valueInput,
  valueSelect,
  optionsSelect,
  required,
  label,
  errorMessage
}){
    const {t} = useTranslation()

    /** Формируем стили */
    const cls = ["input_with_select"]
    if(className)cls.push(className)
    /** Стили врапера инпута */
    const clsInputWrap = ["input_wrap"];
    if (classNameInputWrap) {
        clsInputWrap.push(classNameInputWrap);
    }
    if (required) {
        cls.push("required");
    }
    /** Стили инпута */
    const clsInput = ["input_wrap_input"]
    if(classNameInput)clsInput.push(classNameInput)

    /** Стили селекта */
    const clsSelect = ["input_wrap_select"]
    if(classNameSelect)clsSelect.push(classNameSelect)


    /** Создаем уникальный id */
    const id = `input-${Math.random()}`;
    /** Отображение label */
    const labelTemplate = label ? <label htmlFor={id}>{label}</label> : null;


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
                <Input
                    id={id}
                    name={nameInput}
                    onChange={onChangeInput}
                    value={valueInput}
                    className={clsInput.join(' ')}
                ></Input>
                <CustomSelect
                    selected={valueSelect}
                    onChange={onChangeSelect}
                    name={nameSelect}
                    defaultValue={optionsSelect[0]}
                    options={optionsSelect}
                    className={clsSelect}
                ></CustomSelect>
            </div>
            {errorMassage}
        </div>
    )
}


export default InputWithSelect