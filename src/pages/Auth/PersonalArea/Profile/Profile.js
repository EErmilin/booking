import React, {useState} from "react"
import classes from "./Profile.module.scss";
import {useTranslation} from "react-i18next";
import TransitionContainer from "../../../../components/UI/other/TransitionContainer/TransitionContainer";
import Avatar from "../../../../components/Avatar/Avatar";
import ChangeAvatar from "../../../../components/ChangeAvatar/ChangeAvatar";
import Input from "../../../../components/UI/areas/Input/Input";
import CustomRadio from "../../../../components/UI/areas/CustomRadio/CustomRadio";
import Button from "../../../../components/UI/btns/Button/Button";
import CustomSelect from "../../../../components/UI/areas/CustomeSelect/CustomSelect";
import CustomDatePicker from "../../../../components/UI/areas/CustomDatePicker/CustomDatePicker";
import auth from "../../../NotAuth/Auth/Auth";
import Account from "./Account";
import PersonalData from "./PersonalData";
import {useSelector} from "react-redux";
import {useLocation} from "react-router-dom";



/** Блок данных Аккаунта */

/** Блок персональных данных */


function Profile(){
    const {t} = useTranslation()
    const userInfo = useSelector(state=>state.auth.userInfo)
    const resetPassword = useSelector((state)=>state.auth)

    const blocks = [
        {
            title:t("profile.personalData"),
            block:<PersonalData userInfo={userInfo}></PersonalData>
        },
        {
            title:t("profile.account"),
            block: <Account userInfo={userInfo}></Account>
        },
    ]

    return (
        <div className={classes.wrap}>
            <h2 className={classes.title}>{t("profile.title")}</h2>
            <TransitionContainer
                classNameBody={classes.body}
                className={classes.container}
                classNameTitle={classes.profile_subtitle}
                classNameTitlesWrap={classes.profile_subtitle_wrap}
                blocks={blocks}
                currentBlock={resetPassword.recoveryToken?1:0}
            ></TransitionContainer>
        </div>
    )
}

export default Profile