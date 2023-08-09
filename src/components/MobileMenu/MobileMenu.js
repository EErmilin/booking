import React, { useState } from 'react'
import classes from './MobileMenu.module.scss'
import { useDispatch, useSelector } from "react-redux";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import Button from "../UI/btns/Button/Button";
import { NavLink, useNavigate } from "react-router-dom";
import { logOutPartner } from "../../store/actions/authActions";
import Avatar from "../Avatar/Avatar";
import numberFormat from '../../functions/numberFormat';
import { CLIENT_ROLE } from '../../roles/roles';
import numWord from '../../functions/numWord';

export default function MobileMenu() {

    const [menuOpened, setMenuOpened] = useState(false)
    const { t } = useTranslation()
    const isAuth = useSelector(state => state.auth.isAuth)
    const userInfo = useSelector(state => state.auth.userInfo)
    const roles = useSelector(state => state.auth.userInfo.user_type)
    const userRoles = useSelector(state => state.auth.userInfo.user_type)
    const dispatcher = useDispatch()
    const navigate = useNavigate()

    function clickHandler(e) {
        const targetClasses = e.target.className.split(" ");

        if (targetClasses.includes(classes.wrap) || targetClasses.includes(classes.close)) {
            setMenuOpened(false)
        }
    }

    function logOut() {
        dispatcher(logOutPartner())
        navigate("/auth/login")
    }

    const templateMenuList = roles === 2 ?
        (
            <div
                className={classes.list}
                onClick={() => { setMenuOpened(false) }}
            >
                <div className={classes.list_item}>
                    <NavLink className={classes.list_link} to={"/personal-area/profile"}>{t("profile.settings")}</NavLink>
                </div>
                <div className={classes.list_item}>
                    <NavLink className={classes.list_link} to={"/personal-area/objects/1"}>{t("profile.objects")}</NavLink>
                </div>
                {<div className={classes.list_item}>
                    <NavLink className={classes.list_link} to={"/personal-area/requisites/1"}>Реквизиты</NavLink>
                </div>}
                <div className={classes.list_item}>
                    <NavLink className={classes.list_link} to={"/personal-area/reports"}>{t("personalArea.navBar.reports")}</NavLink>
                </div>
                <div className={classes.list_item}>
                    <NavLink className={classes.list_link} to={"/personal-area/reservations"}>{t("profile.booking")}</NavLink>
                </div>
                <div className={classes.list_item}>
                    <NavLink className={classes.list_link} to={"/personal-area/comments"}>{t("profile.comments")}</NavLink>
                </div>
                <div className={classes.list_item}>
                    <NavLink className={classes.list_link} to={"/personal-area/notifications"}>{t("profile.notifications")}</NavLink>
                </div>
                <div className={classes.list_item}>
                    <NavLink className={classes.list_link} to={"/personal-area/support/1"}>{t("profile.support")}</NavLink>
                </div>
                <div className={classes.list_item}>
                    <NavLink className={classes.list_link} to={"/personal-area/archive/1"}>Архив объектов</NavLink>
                </div>
                <div className={classes.list_item}>
                    <a className={[classes.list_link, classes.list_link_blue].join(" ")} href='tel:88001011947'>8 (800) 101-19-47</a>
                </div>
            </div>
        ) : (
            <div
                className={classes.list}
                onClick={() => { setMenuOpened(false) }}
            >
                <div className={classes.list_item}>
                    <NavLink className={classes.list_link} to={"/personal-area/profile"}>{t("profile.settings")}</NavLink>
                </div>
                <div className={classes.list_item}>
                    <NavLink className={classes.list_link} to={"/personal-area/my-reservations/1"}>{t("personalArea.navBar.client.reservations")}</NavLink>
                </div>
                <div className={classes.list_item}>
                    <NavLink className={classes.list_link} to={"/personal-area/comments"}>{t("personalArea.navBar.comments")}</NavLink>
                </div>
                <div className={classes.list_item}>
                    <NavLink className={classes.list_link} to={"/personal-area/favorites"}>{t("personalArea.navBar.client.favorites")}</NavLink>
                </div>
                <div className={classes.list_item}>
                    <NavLink className={classes.list_link} to={"/personal-area/notifications"}>{t("personalArea.navBar.client.notifications")}</NavLink>
                </div>
                {/*<div className={classes.list_item}>*/}
                {/*    <NavLink className={classes.list_link} to={"/personal-area/support/1"}>{t("personalArea.navBar.client.support")}</NavLink>*/}
                {/*</div>*/}
            </div>
        )

    const keysTitles = ['ключ', 'ключа', 'ключей']

    return (
        <React.Fragment>
            <div
                className={classes.burger}
                onClick={() => { setMenuOpened(true) }}
            >
                <span></span>
            </div>
            {menuOpened &&
                <div
                    className={classes.wrap}
                    onClick={clickHandler}
                >
                    <div className={classes.panel}>
                        <div className={classes.close}></div>
                        <div className={classes.container}>
                            <div className={classes.header}>
                                {isAuth
                                    ?
                                    <div className={classes.user}>
                                        <Avatar
                                            avatar={`${userInfo.avatar}`}
                                            className={classes.user_avatar}
                                        />
                                        <div className={classes.user_info}>
                                            <div className={classes.user_name}> {userInfo.first_name} {userInfo.last_name} </div>
                                            <div className={classes.user_email}> {userInfo.email} </div>
                                            {userRoles == CLIENT_ROLE ? <p className={classes.user_keys}>У вас {numberFormat(userInfo.sailplay?.points?.confirmed)} {numWord(userInfo.sailplay?.points?.confirmed, keysTitles)}</p> : ""}
                                        </div>
                                    </div>
                                    :
                                    <div className={classes.auth_buttons}>
                                        <Button
                                            className={classes.login_button}
                                            withoutBorder={true}
                                            onClick={() => { setMenuOpened(false) }}
                                        >
                                            <NavLink to={"/auth/login"}>{t("header.login")}</NavLink>
                                        </Button>
                                        <Button
                                            className={classes.signup_button}
                                            btnColor="ButtonGradient"
                                            withoutBorder={true}
                                            onClick={() => { setMenuOpened(false) }}
                                        >
                                            <NavLink to={"/auth/register"}>{t("header.register")}</NavLink>
                                        </Button>
                                    </div>
                                }
                            </div>
                            <div className={classes.body}>
                                {isAuth && templateMenuList}
                            </div>
                            <div className={classes.footer}>
                                {isAuth &&
                                    <div onClick={logOut} className={classes.logout_button}>{t("personalArea.navBar.exit")}</div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            }
        </React.Fragment>
    )
}