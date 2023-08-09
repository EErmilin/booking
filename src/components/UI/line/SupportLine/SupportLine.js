import React, { useRef, useState } from "react"
import classes from "./SupportLine.module.scss";
import StatusHotel from "../../../StatusHotel/StatusHotel";
import { useTranslation } from "react-i18next";
import Avatar from "../../../Avatar/Avatar";
import Button from "../../btns/Button/Button";
import avatar from "../../../../assets/image/fakeAvatarLarge.png";

function SupportLine({
    question,
    className,
    request
}) {
    const { t } = useTranslation()
    const [isClick, setIsClick] = useState(false)
    const cls = [classes.support_line]
    const SupportWrpRef = useRef()
    const avatar = require("../../../../assets/image/fakeAvatarLarge.png")

    if (className) cls.push(className)

    const questions = <div className={classes.support_line_elem_item}>
        <div className={classes.support_line_rooms_name}>{t(question)}</div>
    </div>

    const blueArrow = <div className={classes.blueArrow} style={{ transform: isClick && "rotate(0.75turn)" }} />

    const renderQuestion = () => {
        return <>
            <div className={classes.support_line_header} onClick={expandBlock}>
                <div className={classes.support_line_header_wrap}>
                    <div className={classes.support_line_header_text}>{t(question)}</div>
                </div>
                {blueArrow}
            </div>
            <div className={classes.support_line_content} ref={SupportWrpRef}>
                <div className={classes.support_line_elem}>
                    {questions}
                </div>
            </div>
        </>
    }

    const renderRequest = (request) => {
        const { title, status } = request;
        return <>
            <div className={classes.support_line_header} onClick={expandBlock}>
                <div className={classes.support_line_header_wrap}>
                    <div className={classes.support_line_header_text}>{title}</div>
                    <div className={classes.support_line_header_status}>
                        <StatusHotel status={status}></StatusHotel>
                    </div>
                </div>
                {blueArrow}
            </div>
            <div className={classes.support_line_content} ref={SupportWrpRef}>
                {request.messages.message.map((message, id) => {
                    return (
                        <div className={classes.support_line_elem}>
                            <div className={classes.support_line_elem_item} key={id}>
                                <div className={classes.support_line_elem_user}>
                                    <Avatar
                                        className={classes.avatar}
                                        width={40}
                                        height={40}
                                        avatar={avatar}
                                    ></Avatar>
                                    <div className={classes.support_line_elem_user_props}>
                                        <div className={classes.support_line_elem_user_props_name}>{message.login}</div>
                                        <div className={classes.support_line_elem_user_props_date}>
                                            {message.isSupport && t("support.support") + ' ∙ '}{message.date}
                                        </div>
                                    </div>
                                </div>
                                <div className={classes.support_line_elem_content}>
                                    <div className={classes.support_line_elem_text}>{message.text}</div>
                                </div>
                            </div>
                        </div>
                    )
                })}
                <div className={classes.support_line_elem}>
                    <div className={classes.support_line_elem_buttons}>
                        <Button
                            className={classes.support_line_elem_button}
                            btnColor="ButtonGreen"
                        >{t('support.reply')}
                        </Button>
                        <Button
                            className={classes.support_line_elem_button}
                            btnColor="blueBorderButton"
                        >{t('support.closeRequest')}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    }

    function expandBlock() {
        if (!isClick) {
            const scrollHeight = SupportWrpRef.current.scrollHeight
            SupportWrpRef.current.style.height = `${scrollHeight}px`
            setIsClick(!isClick)
        } else {
            SupportWrpRef.current.style.height = `0`
            setIsClick(!isClick)
        }
    }

    return (
        <div className={cls.join(" ")}>
            {request ? renderRequest(request) : renderQuestion()}
        </div>
    )
}

export default SupportLine