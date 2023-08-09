import React from "react";
import classes from "./CommentRatingV2.module.scss";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

function CommentRatingV2({
    rating,
    commentCount,
    size,
    withComment
}) {
    const { t } = useTranslation()
    const isLoadingSimilar = useSelector(state => state.catalog.isLoadingSimilar)

    let ratingText = ''
    if (rating >= 9) {
        ratingText = t("hotelCard.excellent")
    } else if (rating >= 8) {
        ratingText = t("hotelCard.perfect")
    }
    else if (rating >= 7) {
        ratingText = t("hotelCard.veryGood")
    }
    else if (rating >= 6) {
        ratingText = t("hotelCard.good")

    }
    else if (rating >= 5) {
        ratingText = t("hotelCard.notBad")

    }
    else if (rating < 5) {
        ratingText = t("hotelCard.bad")

    }
    
    if(isLoadingSimilar)return <div className={classes.comment_rating_loading} />

    return (
        <div className={classes.comment_rating}>
            <div className={classes.number}>
                {rating > 0 ? <div className={size === "small" ?
                    classes.comment_rating_number_small : classes.comment_rating_number}>{rating}</div> :
                    <p className={classes.comment_rating_new}>New</p>}
            </div>
            {withComment && <div
                className={size === "small" ? classes.comment_rating_txt_small : classes.comment_rating_txt}>{commentCount} отзывов</div>}

        </div>
    )
}

export default CommentRatingV2