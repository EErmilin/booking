/**
 * Чтобы заполнить массив с формами склонений, нужно ответить на три вопроса:
 *
 * Каким будет слово для одной единицы?
 * Каким будет слово для двух единиц?
 * Каким будет слово для пяти единиц?
 * */

export default function numWord(value, words) {
    value = Math.abs(value) % 100;
    const num = value % 10;
    if (value > 10 && value < 20) return words[2];
    if (num > 1 && num < 5) return words[1];
    if (num === 1) return words[0];
    return words[2];
}