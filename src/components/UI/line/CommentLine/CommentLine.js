import React from "react"
import classes from "./CommentLine.module.scss";
import StatusHotel from "../../../StatusHotel/StatusHotel";
import Avatar from "../../../Avatar/Avatar";
import {useTranslation} from "react-i18next";
import StatusReview from "../../../StatusReview/StatusReview";


const moderatorImage = require("../../../../assets/image/moderatorImage.png")

function CommentLine ({
    className,
    comment,
    status,
    userInfo,
    author,
    moderation,
    isError,
    noStatus=false,
    partner
}){
    const {t} = useTranslation()
    const cls = [classes.comment_line]
    if(className)cls.push(className)

    return (
        <div className={cls.join(' ')}>
            <div className={classes.comment_line_left}>
                <Avatar width={40} height={40} avatar={moderation?moderatorImage:(partner?partner.partner_avatar:userInfo.avatar)}></Avatar>
                <div className={classes.comment_line_left_wrap}>
                    <p className={classes.comment_line_left_name}>{moderation?'Денис':(partner?partner.partner_first_name:userInfo.first_name)}</p>
                    <p className={classes.comment_line_left_email}>{moderation?'Модератор':(partner?"":userInfo.email)}</p>
                </div>
            </div>
            <div className={classes.comment_line_right}>
                {(!moderation && !noStatus)?(<div className={classes.comment_line_right_wrap}><StatusReview status={status}></StatusReview></div>):""}
                {isError?(<div className={classes.comment_line_error}>{t("comment.error")}</div>):""}
                <p>{comment}</p>
            </div>
        </div>
    )
}

export default CommentLine