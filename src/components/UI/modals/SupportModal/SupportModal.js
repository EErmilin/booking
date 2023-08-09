import React, {useState} from "react"
import classes from "./SupportModal.module.scss";
import TwoButtonModal from "../TwoButtonModal/TwoButtonModal";
import { useTranslation } from "react-i18next";
import Input from "../../areas/Input/Input";
import CustomTextArea from "../../areas/CustomTextArea/CustomTextArea";
import Button from "../../btns/Button/Button";
import AddFile from "../../../AddFile/AddFile";


function SupportModal({
    setIsShow,
    btnNextClick,
    isNoAuth,
}) {
    const { t } = useTranslation()
    const [files,setFiles] = useState([])

    const onSend = () => {
        setIsShow(false);
        btnNextClick(true);
    }
    return (

        <TwoButtonModal
            close={true}
            btnCancelClick={() => setIsShow(false)}
            btnCancelText={t("support.cancel")}
            btnNextText={t("support.send")}
            btnNextClick={() => onSend()}
            width={980}
            background="blue"
            typeModal="withoutBack"
            classNameButtonWrap={classes.support_buttons}
        >
            <h2 className={classes.support_title}>{t("support.supportModalTitle")}</h2>

            {isNoAuth && <div className={classes.support_info}>
                <Input
                    className={classes.support_info_input}
                    typeClsInput="field"
                    label={'Имя*'}
                ></Input>
                <Input
                    className={classes.support_info_input}
                    typeClsInput="field"
                    label={'E-mail*'}
                ></Input>
            </div>}

            <Input
                typeClsInput="field"
                label={t("support.topic")}
            ></Input>

            <CustomTextArea
                className={classes.support_textarea}
                label={t("support.problem")} />

            <AddFile
                onChange={(arr)=>setFiles(arr)}
                state={files}
            ></AddFile>
            {isNoAuth && <p className={classes.support_textGray}>*обязательные поля для ввода</p>}
        </TwoButtonModal>
    )
}

export default SupportModal


