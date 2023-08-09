
import React from "react"
import { useTranslation } from "react-i18next";
import SupportLine from "../../../../../components/UI/line/SupportLine/SupportLine";
import { useSelector } from "react-redux";
import classes from "./Support.module.scss";

function Requests() {
    const { t } = useTranslation()

    const requests = useSelector(state => state.support.requests);

    const renderRequests = () => {
        return requests.map((request, id) => {
            return (
                <SupportLine
                    request={request}
                    key={id}
                >
                </SupportLine>
            )
        })
    }


    return (
        <>
            <h3 className={classes.subtitle}>{t("support.requests")}</h3>
            {renderRequests()}
        </>
    )
}

export default Requests