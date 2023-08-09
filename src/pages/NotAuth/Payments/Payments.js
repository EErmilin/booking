import React,{useEffect} from "react"
import classes from "./Payments.module.scss";
import Breadcrumbs from "../../../components/Breadcrumbs/Breadcrumbs";
import {useMemo} from "react";
import InfoPageUnit from "../../../components/InfoPageUnit/InfoPageUnit";
import {useDispatch, useSelector} from "react-redux";
import {getPaymentInfo} from "../../../store/actions/generalInfoAction";
import Preloader from "../../../components/Preloader/Preloader";
import { Helmet } from "react-helmet"
import siteLogo from "../../../assets/svg/logo.svg"

function Payments() {
    const payments = useSelector(state => state.general.payments)
    const dispatcher = useDispatch()


    /** Подтягиваем инфу */
    useEffect(()=>{
        dispatcher(getPaymentInfo())
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
                <title>Оплата | Check in</title>
                {<meta property="og:image" content={siteLogo} />}
            </Helmet>
        )
    }

    if(!Object.keys(payments).length)return <Preloader></Preloader>

    return (
        <div className={classes.wrapper}>
            {getMetaTags()}
            <div className={classes.content}>
                <InfoPageUnit  title={payments.name?.ru}>
                    <div dangerouslySetInnerHTML={{ __html: payments.text?.ru }}></div>
                </InfoPageUnit>
                <InfoPageUnit title={payments.name_1?.ru}>
                    <div dangerouslySetInnerHTML={{ __html: payments.text_1?.ru }}></div>
                </InfoPageUnit>
            </div>
        </div>
    )
}

export default Payments