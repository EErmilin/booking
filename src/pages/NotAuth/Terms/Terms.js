import React,{useEffect} from "react"
import classes from "./Terms.module.scss";
import Breadcrumbs from "../../../components/Breadcrumbs/Breadcrumbs";
import {useMemo} from "react";
import InfoPageUnit from "../../../components/InfoPageUnit/InfoPageUnit";
import {useDispatch, useSelector} from "react-redux";
import {getTermsInfo} from "../../../store/actions/generalInfoAction";
import Preloader from "../../../components/Preloader/Preloader";
import { Helmet } from "react-helmet"
import siteLogo from "../../../assets/svg/logo.svg"

function Terms() {
    const info = useSelector(state => state.general.info)
    const dispatcher = useDispatch()


    /** Подтягиваем инфу */
    useEffect(()=>{
        dispatcher(getTermsInfo())
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
                <title>Согласие на обработку персональных данных | Check in</title>
                <meta name="description" content={'Согласие на обработку персональных данных. Check in — удобный сервис бронирования отелей и гостиниц. Включайся в путешествия'} />
                <meta property="og:title" content={'Согласие на обработку персональных данных | Check in'}/>
                <meta property="og:description" content={'Согласие на обработку персональных данных. Check in — удобный сервис бронирования отелей и гостиниц. Включайся в путешествия'}/>
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

export default Terms