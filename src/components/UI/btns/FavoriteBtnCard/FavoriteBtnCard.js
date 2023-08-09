import React, { useEffect, useState } from "react"
import classes from "./FavoriteBtnCard.module.scss";
import { useDispatch, useSelector, } from "react-redux";
import { addFavorites, deleteFavorites, getFavorites, } from "../../../../store/actions/favoriteActions";
import useToggleVisibility from "../../../../hooks/useToggleVisibility";
import AuthModal from "../../modals/AuthModal/AuthModal";
import {useTranslation} from "react-i18next";
import {showAuthModal} from "../../../../store/actions/authActions";

function FavoriteBtnCard({
    id,
    className,
    onClick,
    isActive,
    hotelId,
    hotel,
    isFavoritePage
}) {
    const favorites = useSelector(state => state.favorites.favorites)
    const userInfo = useSelector(state => state.auth.userInfo)
    const isAuth = useSelector(state => state.auth.isAuth)
    const [active, setActive] = useState(isActive)
    
    useEffect(() => {
        if(isFavoritePage){
            setActive(true)
        } else{
            setActive(isActive)
        }
    }, [])

    useEffect(() => {
        setActive(isActive)
    }, [isActive])

    const dispatcher = useDispatch()
    const cls = [classes.favorite_btn_card]

    if (className) cls.push(className)

    function handleClick(event) {
        if (!isAuth || userInfo.user_type === 2) {
            return dispatcher(showAuthModal(true, false, true))
        }

        if (!active) {
            dispatcher(addFavorites(hotelId))
        } else {
            dispatcher(deleteFavorites(hotelId))
        }

        setActive(!active)
        event.preventDefault()
    }

    useEffect(() => {
        if (favorites && favorites.length && hotelId) {
            if(favorites.find((item) => item.hotel_id === hotelId)){
                setActive(true)
            }

        }
    }, [favorites])

    return (
        <div
            id={id}
            className={cls.join(' ')}
            onClick={handleClick}
        >
            <span className={active ? classes.heart : classes.default_heart}></span>
        </div>
    )
}

export default FavoriteBtnCard