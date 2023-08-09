import React from "react"
import classes from "./Rating.module.scss"
import {useTranslation} from "react-i18next";


function Rating ({
                     commentRating,
                     commentCount,
                     className
}){
    const {t} = useTranslation()
    const cls = [classes.rating]
    if(className)cls.push(className)

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
                {commentRating > 0 ?<div className={classes.rating_text}>{ratingText}</div>:''}
                {commentCount && <div className={classes.rating_commentCount}>{t("hotelCard.comment")}: {commentCount}</div>}
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

export default Rating