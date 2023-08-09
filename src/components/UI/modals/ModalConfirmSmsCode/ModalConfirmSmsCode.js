import React, { useEffect, useRef, useState } from "react";
import classes from "./ModalConfirmSmsCode.module.scss";
import { useTranslation } from "react-i18next";
import Button from "../../btns/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { sendSmsClient, sendSmsPartner } from "../../../../store/actions/authActions";
import { clearErrors } from "../../../../store/actions/partnerHotelsActions";
import { PARTNER_ROLE } from "../../../../roles/roles";


function ModalConfirmSmsCode({
    value,
    onChange,
    btnNextClick,
    phone,
    reSendFunction,
    errorCode,
    setErrorCode,
    timerCount,
    setTimerCount
}) {
    const { t } = useTranslation()
    const [code, setCode] = useState({
        "0": '',
        "1": '',
        "2": '',
        "3": '',
        "4": '',
        "5": '',
    })


    const [values, setValues] = React.useState(Array(6).fill(''));
    const dispatcher = useDispatch()
    const [isSend, setSend] = useState(false)
    const [currentInputIndex, setCurrentInputIndex] = useState(0)
    const errors = useSelector(state => state.auth.errors)
    const roles = useSelector(state => state.auth.userInfo.user_type)

    const onChangeInput = e => {
        const index = +e.target.dataset.index;
        const value = e.target.value;
        if (!/[0-9]/.test(value) && value !== '') {
            return
        }
        setValues(values.map((n, i) => i === index ? value : n));
        if (index < values.length && value) {
            let newCode = JSON.parse(JSON.stringify(code))
            newCode[index] = e.target.value
            setCode(newCode)
        }
        if (index < values.length - 1 && value) {
            inputRefs[index + 1].select();
            inputRefs[index + 1].focus();
        }
        if (value) {
            setCurrentInputIndex(index + 1)
        }
    };
    const inputRefs = [];

    function pasteHandler(event) {
        let codeFromBuffer = event.clipboardData.getData('Text').toString()
        let newCode = JSON.parse(JSON.stringify(code))
        codeFromBuffer.split('').forEach((elem, id) => {
            newCode[id] = elem
        })
        setCode(newCode)
    }

    const timer = useRef();



    useEffect(() => {

        if (!isSend) return
        let i = timerCount > 0 ? -timerCount : timerCount
        timer.current = setInterval(() => {
            if (i < 0) {
                setTimerCount(prevState => {
                    let number = prevState > 0 ? - prevState : prevState
                    return number + 1
                })
                i++
            } else {
                setSend(false)
                clearInterval(timer.current);
            }
        }, 1000)
        return () => {
            clearInterval(timer.current);
            setSend(false)
        }
    }, [isSend]);


    const reSend = async () => {
        setSend(false)
        let time;
        if (reSendFunction) {
            time = await reSendFunction(Object.values(code).join(''))
        } else {
            if (roles !== PARTNER_ROLE) {
                const response = await dispatcher(sendSmsClient({ phone }))
                time = new Date(new Date().getTime() / 1000 - response.nextAttemptAt).getTime()
            } else {
                const response = await dispatcher(sendSmsPartner({ phone: phone }))
                time = new Date(new Date().getTime() / 1000 - response.nextAttemptAt).getTime()
            }
        }
        setTimerCount(time)
        setSend(true)
    }

    /** Таймер */
    useEffect(() => {
        dispatcher(clearErrors())
        inputRefs[0].focus();
        setSend(true)
        return () => {
            setSend(false)
            clearInterval(timer.current);
            setErrorCode && setErrorCode(null)
        }
    }, [])

    useEffect(() => {
        document.body.onkeydown = (event) => {
            if (event.key === "Enter") {
                event.preventDefault()
                return btnNextClick(Object.values(code).join(''))
            }
            if (event.key === "Backspace") {

                setCurrentInputIndex(currentInputIndex - 1)
                inputRefs[currentInputIndex].select();
                inputRefs[currentInputIndex].focus();
            }
        }
    })

    /** Видимость сообщения об ошибке */
    const errMsg = (errors.recoveryCode || errors.code || errors.phone) ? (
        <span className={classes.confirm_code_error}>{errors.recoveryCode || errors.code || errors.phone}</span>
    ) : null;
    return (
        <div className={classes.confirm_code}>
            <h2 className={classes.confirm_code_title}>{t('auth.login.enterSmsCode')}</h2>
            <p className={classes.confirm_code_txt}>{errorCode ? errorCode.error[0].message : t("auth.login.typeCodeSms")}</p>
            <div className={classes.confirm_code_wrp}>
                {values.map((n, i) => (
                    <div className={classes.confirm_code_input_withLine}>
                        {i === 3 && <div key={i} className={classes.confirm_code_line}>—</div>}
                        <input
                            value={values[i]}
                            data-index={i}
                            onClick={() => setCurrentInputIndex(i)}
                            onChange={onChangeInput}
                            className={[classes.confirm_code_input, (errors.recoveryCode || errors.code || errors.phone) ? classes.confirm_code_input_err_input : ''].join(' ')}
                            ref={input => inputRefs[i] = input}
                            maxLength="1"
                            inputMode={"numeric"}
                        />
                    </div>
                ))}
            </div>
            {errMsg}
            {timerCount ? <div className={classes.confirm_code_timer}>
                {t("auth.login.reSendCode")}
                {(timerCount < 0 ? -timerCount : timerCount) + " "}
                {t("auth.login.sec")}
            </div> : <div className={classes.confirm_code_timer} onClick={() => reSend()}>
                {t("auth.login.reSend")}
            </div>}
            <Button
                typeButton={2}
                btnColor="ButtonGreen"
                className={classes.confirm_code_btn}
                onClick={() => btnNextClick(Object.values(code).join(''))}
            >{t("auth.login.sendSmsCode")}</Button>
        </div>
    )
}

export default ModalConfirmSmsCode