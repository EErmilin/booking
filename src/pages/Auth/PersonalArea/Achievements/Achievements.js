import React from "react"
import classes from "./Achievements.module.scss";
import {useTranslation} from "react-i18next";
import TransitionContainer from "../../../../components/UI/other/TransitionContainer/TransitionContainer";
import {useSelector} from "react-redux";
import ProgressBar from "./components/ProgressBar/ProgressBar";



/** Блок данных Аккаунта */

/** Блок персональных данных */


function Profile(){
    const {t} = useTranslation()
    const userInfo = useSelector(state=>state.auth.userInfo)
    const resetPassword = useSelector((state)=>state.auth)

    const blocks = [
        {
            title:"Достижения",
            block:<div className={classes.progress}>
                <h2 className={classes.progress_title}>Прогресс открытия достижений: <span className={classes.progress_procent}>30%</span></h2>
                <ProgressBar></ProgressBar>
                <h2 className={classes.progress_title}>Ваши достижения будут отображаться здесь уже сегодня. Загружаем информацию.</h2>
            </div>
        }
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