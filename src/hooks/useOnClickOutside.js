import { useEffect, useState } from 'react';

/**
 * Управление видимостью элемента и скрытие элемента при клике вне него по любому элементу
 * @param ref
 * @param initialState
 * @returns {[boolean, (value: (((prevState: boolean) => boolean) | boolean)) => void]}
 */
export default function useOnClickOutside(ref, initialState = false) {
    /** Видимость элемента */
    const [show, toggleShow] = useState(initialState);

    /** Скрываем элемент при клике вне */
    useEffect(() => {
        const closeClickOutside = (event) => {
            if (!ref.current || ref.current.contains(event.target)) return;
            toggleShow(false);
        };

        window.addEventListener('click', closeClickOutside);

        return () => window.removeEventListener('click', closeClickOutside);
    }, [ref]);

    return [show, toggleShow];
}
