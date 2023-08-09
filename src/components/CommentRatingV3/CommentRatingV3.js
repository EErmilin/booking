import React from "react";
import classes from "./CommentRatingV3.module.scss";
import {useTranslation} from "react-i18next";

function CommentRatingV3 ({
    rating,
    maxRating,
                          }){
    const {t} = useTranslation()

    let ratingText =''
    if(rating>=9){
        ratingText = t("hotelCard.excellent")
    }else if(rating>=8) {
        ratingText = t("hotelCard.perfect")
    }
    else if(rating>=7) {
        ratingText = t("hotelCard.veryGood")
    }
    else if(rating>=6) {
        ratingText = t("hotelCard.good")

    }
    else if(rating>=5) {
        ratingText = t("hotelCard.notBad")

    }
    else if(rating<5) {
        ratingText = t("hotelCard.bad")

    }

    return (
        <div className={classes.comment_rating}>
            <div className={classes.comment_rating_number}>{rating}/{maxRating}</div>
            <div className={classes.comment_rating_txt}>{ratingText}</div>
        </div>
    )
}

export default CommentRatingV3