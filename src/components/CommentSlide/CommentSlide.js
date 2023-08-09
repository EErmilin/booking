import React from "react"
import classes from "./CommentSlide.module.scss";
import Avatar from "../Avatar/Avatar";
import CommentRatingV3 from "../CommentRatingV3/CommentRatingV3";


function CommentSlide({
    className,
    commentInfo,
    commentType
}) {

    const cls = [commentType == 2 ? classes.comment_slide2 : classes.comment_slide]
    if (className) cls.push(className)

    return (
        <div className={cls.join(' ')}>
            <div className={commentType == 2 ? classes.comment_slide2_header : classes.comment_slide_header}>
                <Avatar
                    avatar={commentInfo.avatar}
                    height={40}
                    width={40}
                ></Avatar>
                <div className={classes.comment_slide_header_rating}>
                    <div className={classes.comment_slide_header_title}>
                        {commentInfo.client_first_name} {commentInfo.country}
                    </div>
                    {
                        commentType == 2 &&
                        <CommentRatingV3
                            rating={commentInfo.rating * 1}
                            maxRating={10}
                        ></CommentRatingV3>
                    }
                </div>
            </div>
            <div className={[classes.comment_slide_body, commentInfo.text.length > 227 ? classes.comment_slide_hidden : ''].join(' ')}>
                {commentType == 1 && <div className={classes.comment_slide_footer}>
                    <CommentRatingV3
                        rating={commentInfo.rating * 1}
                        maxRating={10}
                    ></CommentRatingV3>
                </div>}
                {commentInfo.text}
            </div>

        </div>
    )
}

export default CommentSlide