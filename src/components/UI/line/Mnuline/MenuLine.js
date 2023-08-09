import React, { useRef } from 'react';
import classes from './MenuLine.module.scss';
import useOnClickOutside from '../../../../hooks/useOnClickOutside';

const MenuLine = ({ className, menuTop, list, stopPropagation, isRotateButton }) => {
    /** Формируем классы обертки */
    const cls = [];
    if (className) {
        cls.push(className);
    }

    /** Реф на обертку меню */
    const menuLine = useRef();

    /** Управление видимостью меню и функция закрытия меню при клике вне */
    const [showMenu, toggleMenu] = useOnClickOutside(menuLine);

    if (showMenu)
        cls.push(classes.active)

    /** Пункты меню */
    const menuList = list.map(({ type, onClick, text }) => {
        const cls = [classes.item];

        switch (type) {
            case 'edit':
                cls.push(classes.edit);
                break;
            case 'del':
                cls.push(classes.delete);
                break;
            case 'sub':
                cls.push(classes.subscribe)
                break;
            case 'share':
                cls.push(classes.share)
                break;
            case 'copy':
                cls.push(classes.copy)
                break;
            default:
                break;
        }

        const handleClick = (e) => {
            if (stopPropagation) e.stopPropagation();
            onClick();
            toggleMenu(false);
        };

        return (
            <span
                className={cls.join(' ')}
                onClick={handleClick}
                onKeyPress={handleClick}
                role="menuitem"
                tabIndex="-1"
                key={text}
            >
                {text}
            </span>
        );
    });

    const menuWrap = showMenu && <div className={classes.menu + " " + menuTop}>{menuList}</div>;

    return (
        <div className={cls.join(' ')} ref={menuLine}>
            <button
                type="button"
                style={{ transform: isRotateButton && "rotate(90deg)" }}
                className={classes.btn}
                onClick={(e) => {
                    if (stopPropagation) e.stopPropagation();
                    toggleMenu((showMenu) => !showMenu);
                }}
            >
                <span/>
                <span/>
                <span/>
            </button>

            {menuWrap}
        </div>
    );
};

export default MenuLine;
