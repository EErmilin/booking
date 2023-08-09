import React,{useEffect, useMemo} from "react"
import classes from "./Requisite.module.scss";
import InfoPageUnit from "../../../components/InfoPageUnit/InfoPageUnit";
import {useDispatch, useSelector} from "react-redux";
import {getRequisites} from "../../../store/actions/generalInfoAction";
import Preloader from "../../../components/Preloader/Preloader";
import { Helmet } from "react-helmet"
import siteLogo from "../../../assets/svg/logo.svg"

function Requisite(){
    const info = useSelector(state => state.general.info)
    const dispatcher = useDispatch()


    /** Подтягиваем инфу */
    useEffect(()=>{
        dispatcher(getRequisites())
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
                <title>Реквизиты компании | Check in</title>
                <meta name="description" content={'Реквизиты и юридический адрес. Check in — удобный сервис бронирования отелей и гостиниц. Включайся в путешествия'} />
                <meta property="og:title" content={'Реквизиты компании | Check in'} />
                <meta property="og:description" content={'Реквизиты и юридический адрес. Check in — удобный сервис бронирования отелей и гостиниц. Включайся в путешествия'}/>
                {<meta property="og:image" content={siteLogo} />}
            </Helmet>
        )
    }

    if(!info)return <Preloader></Preloader>

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

export default Requisite