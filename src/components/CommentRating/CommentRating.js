import React from "react"
import classes from "./CommentRating.module.scss";
import { useTranslation } from "react-i18next";

function CommentRating({
    className,
    classNameTitle,
    commentRating,
    commentCount,
    showTextRating = false
}) {
    const { t } = useTranslation()
    const cls = [classes.wrap]

    if (className) cls.push(className)

    const clsTitle = [classes.text]

    if (classNameTitle) clsTitle.push(classNameTitle)

    let ratingText = ''

    if (commentRating >= 9) {
        ratingText = t("hotelCard.excellent")
    } else if (commentRating >= 8) {
        ratingText = t("hotelCard.perfect")
    }
    else if (commentRating >= 7) {
        ratingText = t("hotelCard.veryGood")
    }
    else if (commentRating >= 6) {
        ratingText = t("hotelCard.good")
    }
    else if (commentRating >= 5) {
        ratingText = t("hotelCard.notBad")

    }
    else if (commentRating < 5) {
        ratingText = t("hotelCard.bad")
    }

    const ratingTemplate =
        <>
            <div className={classes.info}>
                {commentCount > 9 && showTextRating && <div className={clsTitle.join(' ')}>{ratingText}</div>}
                {commentCount > 9 && <div className={classes.text}>{commentCount} {t("hotelCard.comment")}</div>}
            </div>
            <div className={[classes.label, commentRating > 0 ? classes.label_blue : classes.label_orange].join(" ")}>
                <div className={classes.number}>
                    {commentRating > 0 ? commentRating : "New"}
                </div>
                <div className={classes.popover}>
                    {commentRating > 0 ? "Рейтинг составлен на основе средних оценок на сторонних интернет-ресурсах" : "У объекта пока нет оценок"}
                </div>
            </div>
        </>

    return (
        <div className={cls.join(' ')}>
            {ratingTemplate}
        </div>
    )
}

export default CommentRating