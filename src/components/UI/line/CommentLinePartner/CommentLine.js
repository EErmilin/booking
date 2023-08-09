import React from "react"
import classes from "./CommentLine.module.scss";
import StatusHotel from "../../../StatusHotel/StatusHotel";
import Avatar from "../../../Avatar/Avatar";

const img = require("../../../../assets/image/FakeAvatarCommnet.png")
const moderatorImage = require("../../../../assets/image/moderatorImage.png")

function CommentLine ({
    className,
    comment,
    author,
    moderation,
    typeLine,
    moderationError
}){
    const cls = [classes.comment_line]
    if(className)cls.push(className)

    return (
        <div className={cls.join(' ')}>
            <div className={classes.comment_line_left}>
                <Avatar width={40} height={40} avatar={moderation?moderatorImage:img}></Avatar>
                <div className={classes.comment_line_left_wrap}>
                    <p className={classes.comment_line_left_name}>{moderation?'Денис':""}</p>
                    <p className={classes.comment_line_left_email}>{moderation?'Модератор':""}</p>
                </div>
            </div>
            <div className={classes.comment_line_right}>
                {!moderation?(<div className={classes.comment_line_right_wrap}><StatusHotel status={comment.status}></StatusHotel></div>):""}
                {comment.moderationError?(<p className={classes.comment_line_error}>{comment.moderationError}</p>):""}
                <p>{comment.moderation_answer}</p>
            </div>
        </div>
    )
}

export default CommentLine