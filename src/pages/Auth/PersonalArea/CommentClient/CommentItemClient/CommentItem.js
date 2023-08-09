import React from "react";
import classes from "./CommentItem.module.scss";
import CommentRating from "../../../../../components/CommentRating/CommentRating";
import { useTranslation } from "react-i18next";
import GridPhoto from "../../../../../components/GridPhoto/GridPhoto";
import AnimatedContainer from "../../../../../components/AnimatedContainer/AnimatedContainer";
import Button from "../../../../../components/UI/btns/Button/Button";
import useToggleVisibility from "../../../../../hooks/useToggleVisibility";
import EmptyModal from "../../../../../components/UI/modals/EmptyModal/EmptyModal";
import CommentLine from "../../../../../components/UI/line/CommentLine/CommentLine";
import StatusHotel from "../../../../../components/StatusHotel/StatusHotel";
import moment from "moment";
import MenuLine from "../../../../../components/UI/line/Mnuline/MenuLine";
import { useDispatch } from "react-redux";
import ReviewModal from "../../../../../components/UI/modals/ReviewModal/ReviewModal";
import { deleteReview } from "../../../../../store/actions/ReviewActions";




function CommentItem({
    reviewInfo,
    response,
    noBtn,
}) {
    const { t } = useTranslation()
    const [showModalReply, setShowModalReply, closeModalReply] = useToggleVisibility()
    const [showModalSuccess, setShowModalSuccess, closeModalSuccess] = useToggleVisibility()
    const dispatcher = useDispatch()

    const menuList = [
        {
            text: t("objects.edit"),
            onClick: () => setShowModalReply(true)
        },
        {
            text: t("objects.delete"),
            onClick: () => dispatcher(deleteReview(reviewInfo.id)),
            type: "del"
        },
    ]

    const templateModalReply = showModalReply && <ReviewModal
        reviewInfo={reviewInfo}
        bookingInfo={{ ...reviewInfo, ...reviewInfo.booking }}
        onClose={closeModalReply}
        btnClose={setShowModalReply}
        btnNextClick={setShowModalSuccess}
    ></ReviewModal>

    const templateSuccessModal = showModalSuccess && (
        <EmptyModal
            close={true}
            closeModal={closeModalSuccess}
            btnCancelClick={() => setShowModalSuccess(false)}
            typeModal={"withoutBack"}
            background="blue"
            width={296}
        >
            <h2 className={classes.comment_item_modal_titleSuccess}>{t("comment.modal.success")}</h2>
            <p className={classes.comment_item_modal_text}>{t("comment.modal.moderation")}</p>
        </EmptyModal>
    )
    const status = reviewInfo.status == 1 ? { status: 4, text: t("comment.status.moderation") } :(reviewInfo.status == 2?{ status: "canceled", text: t("comment.status.noPassModeration") } :{ status: 5, text: t("comment.status.published") })
    const templateModerationResponse = reviewInfo.moderation_answer && <CommentLine moderation={true} status={reviewInfo.status} comment={reviewInfo.moderation_answer}></CommentLine>
    /** Отзывы партнера */
    const templateResponse = reviewInfo.answer && reviewInfo.answer ? <CommentLine noStatus={reviewInfo.answer.status == 3} userInfo={{
        avatar: reviewInfo.answer.partner_avatar,
        first_name: reviewInfo.answer.partner_first_name,
        email: reviewInfo.answer.partner_email
    }} status={reviewInfo.answer.status} comment={reviewInfo.answer.text}></CommentLine> : ''
    if (reviewInfo && reviewInfo.booking) {
        return (
            <div className={classes.comment_item_wrap}>
                <div className={classes.comment_item}>
                    <div className={classes.comment_item_left}>
                        <div className={classes.comment_item_img}>
                            <img src={`${reviewInfo.booking.hotel_main_image}`} alt={reviewInfo.booking.hotel_name.ru} />
                        </div>
                    </div>
                    <div className={classes.comment_item_right}>
                        <MenuLine
                            className={classes.comment_item_menu}
                            list={menuList}
                        ></MenuLine>
                        <div className={classes.comment_item_right_wrap}>
                            <div className={classes.comment_item_status}><StatusHotel status={status.status} text={status.text}></StatusHotel></div>
                            <h2 className={classes.comment_item_hotel}>{reviewInfo.booking.hotel_name.ru}</h2>
                            <h2 className={classes.comment_item_room}>{reviewInfo.booking.room_name ? reviewInfo.booking.room_name.ru : ''}</h2>
                            <div className={classes.comment_item_date}>{moment(reviewInfo.booking.arrival_date).format("DD.MM.YY")}-{moment(reviewInfo.booking.departure_date).format("DD.MM.YY")} {reviewInfo.booking.additional_guests.length + 1} взр.</div>
                            <div className={classes.comment_item_address}>{!reviewInfo.booking.integration_data ? `г. ${reviewInfo.booking.region?.name.ru}, ` : ''}{reviewInfo.booking.hotel_address}</div>
                            <CommentRating
                                className={classes.comment_item_right_rating}
                                classNameTitle={classes.comment_item_right_rating_title}
                                commentRating={+reviewInfo.rating}
                                showTextRating={true}
                            ></CommentRating>
                            <div className={classes.comment_item_right_comment}>
                                {reviewInfo.text}
                            </div>
                            {reviewInfo.images && reviewInfo.images.length && <div className={classes.comment_item_right_photo}>
                                <p className={classes.comment_item_right_photo_title}>{t("comment.photoTitle")}</p>
                                <GridPhoto
                                    photos={reviewInfo.images.map(elem => ({ url: elem }))}
                                    viewType={2}
                                ></GridPhoto>
                            </div>
                            }
                        </div>
                    </div>
                    {templateModalReply}
                    {templateSuccessModal}
                </div>
                {response && (<div className={classes.comment_item_list}>
                    {templateModerationResponse}
                </div>)}
                {templateResponse && (<div className={classes.comment_item_list}>
                    {templateResponse}
                </div>)}
            </div>
        )
    }
}

export default CommentItem