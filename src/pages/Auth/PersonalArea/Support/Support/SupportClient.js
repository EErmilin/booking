import React, { useState } from "react"
import classes from "./Support.module.scss";
import { useTranslation } from "react-i18next";
import Button from "../../../../../components/UI/btns/Button/Button";
import SupportModal from "../../../../../components/UI/modals/SupportModal/SupportModal";
import EmptyModal from "../../../../../components/UI/modals/EmptyModal/EmptyModal";
import Requests from "./Requests";
import SupportLine from "../../../../../components/UI/line/SupportLine/SupportLine";


function SupportClient() {
    const { t } = useTranslation()

    const [isShowSupportModal, setIsShowSupportModal] = useState(false)
    const [isShowSendedModal, setIsShowSendedModal] = useState(false)


    const renderQuestion = () => {
        const questions = [
            'support.addObjects',
            'support.checkBookings',
            'support.badComments',
            'support.addNumberFund'
        ]

        return questions.map((question, id) => {
            return (
                <SupportLine
                    question={question}
                    key={id}>
                </SupportLine>
            )
        })
    };

    const sendedModal = <EmptyModal
        close={true}
        closeModal={() => setIsShowSendedModal(false)}
        background="blue"
        width={308}
        typeModal="withoutBack">
        <h2>{t("support.excellent")}!</h2>
        <p className={classes.support_modalText}>{t("support.sended")}</p>
    </EmptyModal>

    const supportModal = <SupportModal
        setIsShow={() => setIsShowSupportModal(false)}
        btnNextClick={() => setIsShowSendedModal(true)} />

    const supportWrite = <div className={classes.support_write}>
        <div className={classes.support_write_title}>{t("support.problems")}
            <Button btnColor="blueBorderButton"
                className={classes.support_write_button}
                typeButton={2}
                onClick={() => setIsShowSupportModal(true)}>
                {t('support.writeSupport')}
            </Button>
        </div>
    </div>

    return (
        <div>
            <h2 className={classes.support_title}>{t("personalArea.navBar.client.support")}</h2>
            {isShowSupportModal && supportModal}
            {isShowSendedModal && sendedModal}
            <h3>{t("support.faq")}</h3>
            {renderQuestion()}
            {supportWrite}
            <Requests />
        </div>
    )
}

export default SupportClient