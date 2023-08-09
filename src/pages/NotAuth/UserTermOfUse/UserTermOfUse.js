import React,{useEffect} from "react"
import classes from "./UserTermOfUse.module.scss";
import Breadcrumbs from "../../../components/Breadcrumbs/Breadcrumbs";
import {useMemo} from "react";
import InfoPageUnit from "../../../components/InfoPageUnit/InfoPageUnit";
import {useDispatch, useSelector} from "react-redux";
import {getUserTermOfUseInfo} from "../../../store/actions/generalInfoAction";
import Preloader from "../../../components/Preloader/Preloader";
import { Helmet } from "react-helmet"
import siteLogo from "../../../assets/svg/logo.svg"

function UserTermOfUse() {
    const info = useSelector(state => state.general.info)
    const dispatcher = useDispatch()


    /** Подтягиваем инфу */
    useEffect(()=>{
        dispatcher(getUserTermOfUseInfo())
    },[])

    const breadcrumbs = useMemo(
        () => [
            {
                name: 'Политика и условия',
                url: ''
            }
        ],
        []
    );

    function getMetaTags() {
        return(
            <Helmet>
                <title>Пользовательское соглашение | Check in</title>
                <meta name="description" content={'Пользовательское соглашение об использовании сайта. Check in — удобный сервис бронирования отелей и гостиниц. Включайся в путешествия'} />
                <meta property="og:title" content={'Пользовательское соглашение | Check in'} />
                <meta property="og:description" content={'Пользовательское соглашение об использовании сайта. Check in — удобный сервис бронирования отелей и гостиниц. Включайся в путешествия'}/>
                {<meta property="og:image" content={siteLogo} />}
            </Helmet>
        )
    }

    if(!info)return <Preloader></Preloader>

    return (
        <div className={classes.wrapper}>
            {getMetaTags()}
            <div className={classes.content}>
                <InfoPageUnit  title={info.name.ru}>
                    <div dangerouslySetInnerHTML={{ __html: info.text.ru }}></div>
                </InfoPageUnit>
            </div>
        </div>
    )
}

export default UserTermOfUse