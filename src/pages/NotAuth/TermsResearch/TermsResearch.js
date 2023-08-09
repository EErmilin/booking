import React, {useEffect} from 'react'
import classes from './TermsResearch.module.scss'
import {useDispatch, useSelector} from "react-redux"
import {getPlatformRulesInfo, getTermsResearch} from "../../../store/actions/generalInfoAction"
import Preloader from "../../../components/Preloader/Preloader"
import InfoPageUnit from "../../../components/InfoPageUnit/InfoPageUnit"
import { Helmet } from "react-helmet"
import siteLogo from "../../../assets/svg/logo.svg"

export default function TermsResearch() {

    const info = useSelector(state => state.general.termsResearch)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getTermsResearch())
    }, [])

    function getMetaTags() {
        return(
            <Helmet>
                <title>Соглашения об исследованиях | Check in</title>
                {<meta property="og:image" content={siteLogo} />}
            </Helmet>
        )
    }

    if(!Object.keys(info).length)return <Preloader></Preloader>

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