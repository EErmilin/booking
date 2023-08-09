import React from "react"
import classes from "./IntegrationIcon.module.scss";
import {useTranslation} from "react-i18next";

function IntegrationIcon ({
    integrationType,
    className
}){
    const {t} = useTranslation()
    const clsWrap = [classes.integration_type]
    if(className)clsWrap.push(className)
    let cls;
    switch (integrationType) {
        case 0:{
            cls = classes.checkIn
            break;
        }
        case 1:{
            cls = classes.bnovo
            break;
        }
        case 2:
        case 4:
            cls = classes.travelLine
            break;
    }

    return <div className={clsWrap.join(" ")}>
        {integrationType!==0?<div className={classes.integration_type_hint}>{t(`objects.integration.${integrationType}`)}</div>:''}
        <div className={[classes.integration_type_icon,cls].join(' ')}></div>
    </div>
}

export default IntegrationIcon