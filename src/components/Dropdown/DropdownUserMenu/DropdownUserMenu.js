import React, { useRef, useEffect } from "react"
import classes from "./DropdownUserMenu.module.scss"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import Button from "../../../components/UI/btns/Button/Button"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import Avatar from "../../../components/Avatar/Avatar"
import useOnClickOutside from "../../../hooks/useOnClickOutside"
import HeaderControls from "../../HeaderControls/HeaderControls"
import { logOutPartner } from "../../../store/actions/authActions"
import { getFavorites } from "../../../store/actions/favoriteActions"
import {CLIENT_ROLE} from "../../../roles/roles";

function DropdownUserMenu() {
    const { t } = useTranslation();
    const location = useLocation()
    const roles = useSelector(state => state.auth.userInfo.user_type)
    const userInfo = useSelector(state => state.auth.userInfo)
    const dispatcher = useDispatch()
    const navigate = useNavigate()
    const login = useSelector(state => state.auth.login);
    const email = useSelector(state => state.auth.email);
    const avatar = require("../../../assets/image/fakeAvatarLarge.png") //  useSelector(state => state.auth.avatar);

    const ref = useRef()
    const [showDropDown, toggleShowDropDown] = useOnClickOutside(ref)

    useEffect(() => {
        if(roles==CLIENT_ROLE){
            dispatcher(getFavorites())
        }
    }, [])

    const logOut = function () {
        dispatcher(logOutPartner())
        const path = roles === 2 ? "/auth/partner/login" : "/auth/login"
        navigate(path, { state: `${location.pathname}${location.search}` })
    }

    const templateDropDown = roles === 2
        ?
        (
            <div
                className={classes.dropdown}
                onClick={() => { toggleShowDropDown(false) }}
            >
                <NavLink className={classes.dropDownMenuButton} to={"/personal-area/profile"}>{t("profile.settings")}</NavLink>
                <NavLink className={classes.dropDownMenuButton} to={"/personal-area/objects/1"}>{t("profile.objects")}</NavLink>
                {<NavLink className={classes.dropDownMenuButton} to={"/personal-area/requisites/1"}>Реквизиты</NavLink>}
                <NavLink className={classes.dropDownMenuButton} to={"/personal-area/reports"}>{t("personalArea.navBar.reports")}</NavLink>
                {/*<NavLink className={classes.dropDownMenuButton} to={"/personal-area/prices/1"}>{t("profile.prices")}</NavLink>*/}
                <NavLink className={classes.dropDownMenuButton} to={"/personal-area/reservations"}>{t("profile.booking")}</NavLink>
                <NavLink className={classes.dropDownMenuButton} to={"/personal-area/comments"}>{t("profile.comments")}</NavLink>
                <NavLink className={classes.dropDownMenuButton} to={"/personal-area/notifications"}>{t("profile.notifications")}</NavLink>
                <NavLink className={classes.dropDownMenuButton} to={"/personal-area/support/1"}>{t("profile.support")}</NavLink>
                <NavLink className={classes.dropDownMenuButton} to={"/personal-area/archive/1"}>{t("profile.archive")}</NavLink>
                <a className={classes.phone} href='tel:88001011947'>8 (800) 101-19-47</a>
                <div onClick={logOut} className={classes.exitButton}>{t("personalArea.navBar.exit")}</div>
            </div>
        )
        :
        (
            <div
                className={classes.dropdown}
                onClick={() => { toggleShowDropDown(false) }}
            >
                <NavLink className={classes.dropDownMenuButton} to={"/personal-area/profile"}>{t("profile.settings")}</NavLink>
                <NavLink className={classes.dropDownMenuButton} to={"/personal-area/my-reservations/1"}>{t("profile.myBooking")}</NavLink>
                <NavLink className={classes.dropDownMenuButton} to={"/personal-area/comments"}>{t("personalArea.navBar.comments")}</NavLink>
                <NavLink className={classes.dropDownMenuButton} to={"/personal-area/notifications"}>{t("profile.notifications")}</NavLink>
                <NavLink className={classes.dropDownMenuButton} to={"/personal-area/favorites"}>{t("personalArea.navBar.favorites")}</NavLink>
                {/*<NavLink className={classes.dropDownMenuButton} to={"/personal-area/achievements"}>{t("personalArea.navBar.achievements")}</NavLink>*/}
                <div onClick={logOut} className={classes.exitButton}>{t("personalArea.navBar.exit")}</div>
            </div>
        )
    return (
        <div className={classes.area} ref={ref}>
            <HeaderControls
                className={classes.controls}
                favoriteCount={4}
                notification={'99+'}
                roles={roles}
            ></HeaderControls>
            <Avatar
                avatar={userInfo.avatar ? `${userInfo.avatar}` : ""}
                className={classes.avatar}
            ></Avatar>

            <div className={classes.name_area}
                onClick={() => toggleShowDropDown(!showDropDown)}
            >
                <div className={classes.name}> {userInfo.first_name} {userInfo.last_name} </div>
                <div className={classes.email}> {userInfo.email} </div>
            </div>

            <Button
                className={classes.dropDownButton}
                withoutBorder={true}
                onClick={() => toggleShowDropDown(!showDropDown)}
            ></Button>

            {showDropDown && templateDropDown}
        </div>

    )
}

export default DropdownUserMenu