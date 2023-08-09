/**
 * Следует применять хук если есть конкретный родительский элемент по которому отловим клик
 * например темный фон под модалкой
 * если такого элемента нет, то используйте хук useOnClickOutside
 */

import { useState } from 'react';
import classes from "../components/UI/modals/DarkBackground/DarkBackground.module.scss";

/**
 * Управление видимостью элемента и скрытие элемента при клике по какому либо родительскому элементу
 */
export default function useToggleVisibility(
    selector = '[data-wrap="modal"]',
    initialState = false
) {
    /** Видимость элемента */
    const [show, toggleVisibility] = useState(initialState);

    /** Если клик внутри, то не закрываем */
    const close = (event) => {
        if (!(event.type=='keypress') && (event.target.classList.contains(classes.DarkBackground)||event.target.classList.contains(classes.BlueBackground))) {
            const ctx = event.target.closest(selector);
            if (!ctx) {
                toggleVisibility(false);
            }
        }
    };

    return [show, toggleVisibility, close];
}

