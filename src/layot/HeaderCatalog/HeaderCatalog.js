import React from "react";
import classes from "./HeaderCatalog.module.scss"
import { NavLink, useLocation } from "react-router-dom";
import LanguageSelect from "../../components/UI/areas/LanguageSelect/LanguageSelect";
import Button from "../../components/UI/btns/Button/Button";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { useSelector } from "react-redux";
import DropdownUserMenu from "../../components/Dropdown/DropdownUserMenu/DropdownUserMenu";
import MobileMenu from "../../components/MobileMenu/MobileMenu";
import ProgressBar from "../../pages/Auth/Booking/components/ProgessBar/ProgressBar";

function HeaderMain() {
    const { t } = useTranslation();
    const isAuth = useSelector(state => state.auth.isAuth)
    const progressVisible = useSelector(state => state.router.progressVisible);
    const location = useLocation()
    /** Опции для селекта языка */
    const languageOption = [
        { value: "RU", label: "RU" },
        { value: "EN", label: "EN" },
    ]

    /** Обработчик для смены языка */
    function handleChangeLanguage() {

    }

    const isSetFilters = () => {
        if (location.pathname.includes("catalog") || location.pathname.includes("hotel")) {
            return `/${location.search}`
        } else {
            return "/"
        }
    }

    return (
        <header className={classes.wrap}>
            <div className={classes.container}>
                <NavLink to={{ pathname: isSetFilters(), state: isSetFilters() }}>
                    <div className={classes.header_logo}></div>
                </NavLink>
                <div className={classes.controls}>
                    {isAuth
                        ?
                        <DropdownUserMenu />
                        :
                        <div className={classes.auth_buttons}>
                            <NavLink
                              id="button_header_guest_b2c_login"
                              className={[classes.login_button, "button_header_guest_b2c_login"].join(" ")}
                              to='/auth/login'>
                                {t("header.login")}
                            </NavLink>
                            <NavLink
                              id="button_header_guest_b2c_registration"
                              className={[classes.signup_button, "button_header_guest_b2c_registration"].join(" ")}
                              to='/auth/register'>
                                {t("header.register")}
                            </NavLink>
                        </div>
                    }
                    {/*<LanguageSelect
                        className={classes.language}
                        optionValues={languageOption}
                        defaultValue={languageOption[0]}
                        globeColor="blue"
                        placeholder={''}
                        isSearchable={false}
                        onChange={(value) => i18n.changeLanguage(value.value)}
                    />*/}
                    <MobileMenu />
                </div>
            </div>
            {progressVisible && <ProgressBar
                className={classes.preloader}
            ></ProgressBar>}
        </header>
    )
}

export default HeaderMain