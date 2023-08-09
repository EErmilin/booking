import React from "react";
import classes from "./HeaderMain.module.scss"
import { NavLink } from "react-router-dom";
import LanguageSelect from "../../components/UI/areas/LanguageSelect/LanguageSelect";
import Button from "../../components/UI/btns/Button/Button";
import { useTranslation } from "react-i18next";
import FavoriteBtn from "../../components/UI/btns/FavoriteBtn/FavoriteBtn";
import i18n from "i18next";
import { useSelector } from "react-redux";
import DropdownUserMenu from "../../components/Dropdown/DropdownUserMenu/DropdownUserMenu";
import MobileMenu from "../../components/MobileMenu/MobileMenu";


function HeaderMain() {
    const { t } = useTranslation();

    const isAuth = useSelector(state => state.auth.isAuth);

    /** Опции для селекта языка */
    const languageOption = [
        { value: "ru-Ru", label: "RU" },
        { value: "en-En", label: "EN" },
    ]

    /** Обработчик для смены языка */
    function handleChangeLanguage() {

    }

    return (
        <header className={classes.wrap}>
            <div className={classes.container}>
                <NavLink to={'/'}>
                    <div className={classes.header_logo}></div>
                </NavLink>
                <div className={classes.controls}>
                    {isAuth
                        ?
                        <>
                            <DropdownUserMenu />
                        </>
                        :
                        <div className={classes.auth_buttons}>
                            <NavLink
                                id="button_header_guest_b2c_login"
                                className={[classes.login_button, "button_header_guest_b2c_login"].join(" ")}
                                to={"/auth/login"}>
                                {t("header.login")}
                            </NavLink>
                            <NavLink
                                id="button_header_guest_b2c_registration"
                                className={[classes.signup_button, "button_header_guest_b2c_registration"].join(" ")}
                                to={"/auth/register"}>
                                {t("header.register")}
                            </NavLink>
                        </div>
                    }
                    {/*<LanguageSelect
                        className={classes.language}
                        optionValues={languageOption}
                        defaultValue={languageOption[0]}
                        onChange={handleChangeLanguage}
                        placeholder={''}
                        isSearchable={false}
                        //Todo поменять на нормальное изменение языка
                        onChange={(value) => i18n.changeLanguage(value.value)}
                    />*/}
                    <MobileMenu />
                </div>
            </div>
        </header >
    )
}

export default HeaderMain