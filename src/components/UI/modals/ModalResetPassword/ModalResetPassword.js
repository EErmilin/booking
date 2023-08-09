import React, {useState} from "react"
import classes from "./ModalResetPassword.module.scss";
import {useTranslation} from "react-i18next";
import Input from "../../areas/Input/Input";
import Button from "../../btns/Button/Button";


function ModalResetPassword({
    btnNextClick
}){
    const {t} = useTranslation()
    const [newPassword,setNewPassword]=useState("")
    const [confirmPassword,setConfirmPassword]=useState("")


    return (
        <div className={classes.reset_password}>
            <h2 className={classes.reset_password_title}>
                {t("auth.login.resetPasswordTitle")}
            </h2>
            <div className={classes.reset_password_wrp}>
                <Input
                    name="newPassword"
                    typeClsInput="field"
                    className={classes.reset_password_input}
                    label={t("auth.login.newPassword")}
                    type="password"
                    value={newPassword}
                    onChange={(event)=>setNewPassword(event.target.value)}
                ></Input>
                <Input
                    typeClsInput="field"
                    className={classes.reset_password_input}
                    label={t("auth.login.newPassword")}
                    type="password"
                    value={confirmPassword}
                    onChange={(event)=>setConfirmPassword(event.target.value)}
                ></Input>
            </div>
            <Button
                name="passwordConfirm"
                btnColor="ButtonGreen"
                typeButton={2}
                className={classes.reset_password_btn}
                onClick={()=>btnNextClick({password:newPassword,confirmPassword: confirmPassword})}
            >{t("auth.login.changePassword")}</Button>
        </div>
    )
}

export default ModalResetPassword