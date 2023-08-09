import { useState } from 'react';
import validateControl from '../functions/validateControl';

/**
 * Валидация полей
 * @param areas
 * @param errors
 * @param fnDelError
 * @returns {[{}, boolean, onChangeHandler]}
 */
export default function useValidateForm(areas, errors, fnDelError) {
    /** Формируем объект состояния полей */
    const objAreas = {};
    areas.forEach((area) => {
        objAreas[area.name] = {
            touched: false,
            valid: false,
            value: area.value || '',
            validation: area.rules,
            errorMessage: '',
        };
    });
    const [localState, changeLocalState] = useState(objAreas);

    /** Валидность формы */
    const [isFormValid, changeFormValid] = useState(true);

    /** Если ошибки есть и форма была валидна - инвалидируем форму */
    if (errors && isFormValid) {
        const newLocalState = JSON.parse(JSON.stringify(localState));
        Object.keys(newLocalState).forEach((key) => {
            newLocalState[key].touched = true;
        });

        changeFormValid(false);
        changeLocalState(newLocalState);
    }

    /** Если ошибки есть - инвалидируем поле и добавляем сообщение об ошибке */
    if (errors) {
        Object.keys(localState).forEach((name) => {
            if (errors[name] && localState[name].valid) {
                const newLocalState = JSON.parse(JSON.stringify(localState));

                newLocalState[name].valid = false;
                newLocalState[name].errorMessage = errors[name];

                changeLocalState(newLocalState);
            }
        });
    }

    /** Функция изменения поля */
    const onChangeHandler = (event, controlName, value) => {
        if (fnDelError) {
            fnDelError();
        }

        const newLocalState = JSON.parse(JSON.stringify(localState));

        const control = newLocalState[controlName];
        control.errorMessage = '';
        control.value = event ? event.target.value : value;
        control.touched = true;
        control.valid =
            !control.validation.required && !control.value.length
                ? true
                : validateControl(control.value, control.validation);

        newLocalState[controlName] = control;

        let isFormValid = true;

        Object.keys(localState).forEach((name) => {
            isFormValid = newLocalState[name].valid && isFormValid;
        });

        changeLocalState({ ...newLocalState });
        changeFormValid(isFormValid);
        return newLocalState;
    };

    return [
        localState,
        isFormValid,
        onChangeHandler,
        changeLocalState,
        changeFormValid,
    ];
}
