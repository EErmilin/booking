import React, {  useEffect, useState } from "react";
import classes from "./BtnIcon.module.scss";
import { ReactComponent as ShareIcon } from "../../../../assets/svg/icons/share.svg";
import { ReactComponent as BlackHeartIcon } from "../../../../assets/svg/icons/heart-black.svg";
import { ReactComponent as RedHeartIcon } from "../../../../assets/svg/icons/heart-red.svg";
import { useDispatch, useSelector } from "react-redux";
import { addFavorites, deleteFavorites, getFavorites } from "../../../../store/actions/favoriteActions";
import {showAuthModal} from "../../../../store/actions/authActions";
import {CLIENT_ROLE} from "../../../../roles/roles";
/**
 * Подключать новые иконки через import и добавления нового условия в switch-case
 * @param icon
 * @param className
 * @param onClick
 * @returns {JSX.Element}
 * @constructor
 */

function BtnIcon({
    id,
    icon,
    className,
    hotelId,
    isActive,
    modal
}) {
    const cls = [classes.btn_icon]
    if (className) cls.push(className)
    const [active, setActive] = useState(isActive)
    const userInfo = useSelector(state => state.auth.userInfo)
    const roles = useSelector(state => state.auth.userInfo.user_type)
    const isAuth = useSelector(state => state.auth.isAuth)
    const favorites = useSelector(state => state.favorites.favorites)
    let iconTemplate;
    const dispatcher = useDispatch()

    useEffect(() => {
        if(roles == CLIENT_ROLE && isAuth){
            dispatcher(getFavorites())
        }

    }, [])

    useEffect(() => {
        if (favorites && favorites.length && hotelId) {
            if (favorites.find((item) => item.hotel_id === hotelId)) {
                setActive(true)
            }

        }
    }, [favorites])

    const favoriteHandler = function () {
        if (!isAuth || userInfo.user_type === 2) {
            return dispatcher(showAuthModal(true, false, true))
        }

        if (!active) {
            dispatcher(addFavorites(hotelId))
        } else {

            dispatcher(deleteFavorites(hotelId))
        }
        setActive(!active)
    }
    switch (icon) {
        case 'share': {
            iconTemplate = <ShareIcon></ShareIcon>
            break;
        }
        case 'black-heart': {
            if (active) cls.push(classes.active)
            iconTemplate = <>{active ?
                <RedHeartIcon></RedHeartIcon> :
                <BlackHeartIcon></BlackHeartIcon>
            }</>
            break;
        }
    }

    return (
        <button
            id={id}
            onClick={icon === 'black-heart' ? ()=>favoriteHandler() : () => modal(true)}
            className={cls.join(' ')}
        >
            {iconTemplate}
        </button>
    )
}

export default BtnIcon