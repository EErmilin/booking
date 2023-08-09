import validateEmail from './validateEmail';

/**
 * Валидирует поля
 * @param value
 * @param validation
 * @returns {boolean}
 */
export default function validateControl(value, validation) {
    /** Если правил нет - выходим */
    if (!validation) return true;

    /** Начальное состояние валидации */
    let isValid = true;

    /** Проверка на не пустое поле */
    if (validation.required) {
        isValid = value.trim() !== '' && isValid;
    }

    /** Проверка валидности email */
    if (validation.email) {
        isValid = validateEmail(value) && isValid;
    }

    /** Проверка длины значения */
    if (validation.minLength) {
        isValid = value.trim().length >= validation.minLength && isValid;
    }

    return isValid;
}
