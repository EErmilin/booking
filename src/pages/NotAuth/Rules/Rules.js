import React,{useEffect} from "react"
import classes from "./Rules.module.scss";
import Breadcrumbs from "../../../components/Breadcrumbs/Breadcrumbs";
import {useMemo} from "react";
import InfoPageUnit from "../../../components/InfoPageUnit/InfoPageUnit";
import {useDispatch, useSelector} from "react-redux";
import {getRulesPartnerInfo} from "../../../store/actions/generalInfoAction";
import Preloader from "../../../components/Preloader/Preloader";


function Rules() {
    const info = useSelector(state => state.general.info)
    const dispatcher = useDispatch()


    /** Подтягиваем инфу */
    useEffect(()=>{
        dispatcher(getRulesPartnerInfo())
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
    if(!info)return <Preloader></Preloader>
    return (
        <div className={classes.wrapper}>
            {/*<Breadcrumbs breadcrumbs={breadcrumbs}/>*/}
            <div className={classes.content}>
                <InfoPageUnit  title={info.name.ru}>
                    <div dangerouslySetInnerHTML={{ __html: info.text.ru }}></div>
                </InfoPageUnit>
            </div>
        </div>
    )
}

export default Rules