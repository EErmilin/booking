import React,{useEffect} from "react"
import classes from "./Cookies.module.scss";
import Breadcrumbs from "../../../components/Breadcrumbs/Breadcrumbs";
import {useMemo} from "react";
import InfoPageUnit from "../../../components/InfoPageUnit/InfoPageUnit";
import {useDispatch, useSelector} from "react-redux";
import {getCookiesInfo, getTermsInfo} from "../../../store/actions/generalInfoAction";
import Preloader from "../../../components/Preloader/Preloader";
import { Helmet } from "react-helmet"
import siteLogo from "../../../assets/svg/logo.svg"

function Cookies() {
    const info = useSelector(state => state.general.info)
    const dispatcher = useDispatch()


    /** Подтягиваем инфу */
    useEffect(()=>{
        dispatcher(getCookiesInfo())
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
                <title>Согласие на обработку cookies | Check in</title>
                <meta name="description" content={'Согласие на обработку cookies. Check in — удобный сервис бронирования отелей и гостиниц. Включайся в путешествия'} />
                <meta property="og:title" content={'Согласие на обработку cookies | Check in'} />
                <meta property="og:description" content={'Согласие на обработку cookies. Check in — удобный сервис бронирования отелей и гостиниц. Включайся в путешествия'}/>
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

export default Cookies