import React, {useEffect} from 'react'
import classes from "./ServiceRules.module.scss"
import InfoPageUnit from "../../../components/InfoPageUnit/InfoPageUnit"
import {useDispatch, useSelector} from "react-redux"
import {getServiceRulesInfo} from "../../../store/actions/generalInfoAction"
import Preloader from "../../../components/Preloader/Preloader"
import { Helmet } from "react-helmet"
import siteLogo from "../../../assets/svg/logo.svg"

export default function ServiceRules() {

    const info = useSelector(state => state.general.info)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getServiceRulesInfo())
    }, [])

    function getMetaTags() {
        return(
            <Helmet>
                <title>Правила оказания услуг | Check in</title>
                <meta name="description" content={'Правила оказания услуг клиентам платформы. Check in — удобный сервис бронирования отелей и гостиниц. Включайся в путешествия'} />
                <meta property="og:title" content={'Правила оказания услуг | Check in'}/>
                <meta property="og:description" content={'Правила оказания услуг клиентам платформы. Check in — удобный сервис бронирования отелей и гостиниц. Включайся в путешествия'}/>
                {<meta property="og:image" content={siteLogo} />}
            </Helmet>
        )
    }

    if (!info) return <Preloader/>

    return (
        <div className={classes.wrapper}>
            {getMetaTags()}
            <div className={classes.content}>
                <InfoPageUnit title={info.name.ru}>
                    <div dangerouslySetInnerHTML={{ __html: info.text.ru }}></div>
                </InfoPageUnit>
            </div>
        </div>
    )
}