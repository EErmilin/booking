import React, { useRef, useState } from "react";
import classes from "./CommentItem.module.scss";
import Avatar from "../../../../../components/Avatar/Avatar";
import BookInfo from "../../../../../components/BookInfo/BookInfo";
import CommentRating from "../../../../../components/CommentRating/CommentRating";
import { useTranslation } from "react-i18next";
import GridPhoto from "../../../../../components/GridPhoto/GridPhoto";
import AnimatedContainer from "../../../../../components/AnimatedContainer/AnimatedContainer";
import Button from "../../../../../components/UI/btns/Button/Button";
import useToggleVisibility from "../../../../../hooks/useToggleVisibility";
import EmptyModal from "../../../../../components/UI/modals/EmptyModal/EmptyModal";
import CustomTextArea from "../../../../../components/UI/areas/CustomTextArea/CustomTextArea";
import CommentLine from "../../../../../components/UI/line/CommentLine/CommentLine";
import { useDispatch, useSelector } from "react-redux";
import { answerPartner, getReviewsPartner } from "../../../../../store/actions/ReviewActions";




function CommentItem({
    comment,
    reviewInfo,
    response,
    disabled,
    noBtn,
    editBtn,
    noEmail,
    isPartner,
    isHotelPage,
}) {
    const { t } = useTranslation()
    const [showModalReply, setShowModalReply, closeModalReply] = useToggleVisibility()
    const [showModalSuccess, setShowModalSuccess, closeModalSuccess] = useToggleVisibility()
    const userInfo = useSelector(state => state.auth.userInfo)
    const [answer, setAnswer] = useState('')
    const dispatcher = useDispatch()
    let [errors, setErrors] = useState({})

    const textRef = useRef(null)

    async function SubmitReply() {
        const response = await dispatcher(answerPartner(reviewInfo.id, { text: answer }))
        if (response.isSend) {
            setShowModalReply(false)
            setShowModalSuccess(true)
            setAnswer('')
        } else {
            let errorObj = {}
            response.data.length ? response.data.forEach((elem) => {
                errorObj[elem.field] = elem.message
            }) : errorObj = { phone: response.data.message }
            setErrors(errorObj)
        }

    }

    const templateModalReply = showModalReply && (
        <EmptyModal
            close={true}
            closeModal={closeModalReply}
            btnCancelClick={() => setShowModalReply(false)}
            width={980}
            background={"blue"}
            typeModal={"withoutBack"}
        >
            <div className={classes.comment_item_modal}>
                <h2 className={classes.comment_item_modal_title}>{t("comment.modal.title")}</h2>
                <CustomTextArea
                    className={classes.comment_item_modal_textarea}
                    label={t("comment.modal.label")}
                    value={answer}
                    touched={true}
                    valid={!errors.text}
                    errorMessage={errors.text}
                    required
                    shouldValidate
                    onChange={(event) => setAnswer(event.target.value)}
                ></CustomTextArea>
                <div className={classes.comment_item_modal_wrap}>
                    <Button
                        btnColor="green"
                        typeButton={1}
                        onClick={SubmitReply}
                    >{t("comment.modal.send")}</Button>
                    <Button
                        btnColor="outline_blue"
                        typeButton={1}
                        className={classes.comment_item_modal_wrap_cancel}
                        onClick={() => setShowModalReply(false)}
                    >{t("comment.modal.cancel")}</Button>
                </div>
            </div>
        </EmptyModal>
    )

    const onReviewSuccess = () => {
        setShowModalSuccess(false)
        dispatcher(getReviewsPartner())
    }

    const templateSuccessModal = showModalSuccess && (
        <EmptyModal
            close={true}
            closeModal={() => onReviewSuccess()}
            btnCancelClick={() => onReviewSuccess()}
            typeModal={"withoutBack"}
            background="blue"
            width={296}
        >
            <h2 className={classes.comment_item_modal_titleSuccess}>{t("comment.modal.success")}</h2>
            <p className={classes.comment_item_modal_text}>{t("comment.modal.moderation")}</p>
        </EmptyModal>
    )
    const templateResponse = reviewInfo.answers && reviewInfo.answers.map((elem, id) => {
        if (elem.moderation_answer) {
            return <>
                <CommentLine noStatus={elem.status == 3} className={classes.comment_item_line} userInfo={userInfo} status={elem.status} comment={elem.text} key={id}></CommentLine>
                <CommentLine noStatus={elem.status == 3} className={classes.comment_item_line} moderation={true} isError={true} status={elem.status} comment={elem.moderation_answer} key={id}></CommentLine>
            </>
        }
        else return (<CommentLine noStatus={elem.status == 3} className={classes.comment_item_line} partner={isPartner ? elem : null} userInfo={userInfo} status={elem.status} comment={elem.text} key={id}></CommentLine>)
    })


    return (
        <div className={classes.comment_item_wrap}>
            <div className={classes.comment_item}>
                <div className={classes.comment_item_left}>
                    <div className={classes.comment_item_left_header}>
                        <Avatar width={58} height={58} avatar={`${reviewInfo.avatar}`}></Avatar>
                        <div className={classes.comment_item_left_header_right}>
                            <p className={classes.comment_item_left_header_name}>{reviewInfo.client_first_name}</p>
                            {!noEmail && <p className={classes.comment_item_left_header_email}>{reviewInfo.client_email}</p>}
                        </div>
                    </div>
                    <BookInfo
                        isHotelPage={isHotelPage}
                        className={classes.comment_item_left_book_info}
                        bookInfo={reviewInfo}></BookInfo>
                </div>
                <div className={classes.comment_item_right}>
                    <div className={classes.comment_item_right_wrap}>
                        <AnimatedContainer
                            btnText={t("comment.collapseComment")}
                            btnTextActive={t("comment.expandComment")}
                            classNameButton={classes.comment_item_right_expand_btn}
                            textRef={textRef}
                            photos={reviewInfo.images}
                        >
                            <div ref={textRef}>
                                <CommentRating
                                    className={classes.comment_item_right_rating}
                                    classNameTitle={classes.comment_item_right_rating_title}
                                    commentRating={reviewInfo.rating}
                                    showTextRating={true}
                                ></CommentRating>
                                <div className={classes.comment_item_right_comment} >
                                    {reviewInfo.text}
                                </div>
                            </div>
                            {reviewInfo.images && reviewInfo.images.length &&
                                <div className={classes.comment_item_right_photo}>
                                    <p className={classes.comment_item_right_photo_title}>{t("comment.photoTitle")}</p>
                                    <GridPhoto
                                        photos={reviewInfo.images.map(elem => ({ url: elem }))}
                                        viewType={2}
                                    ></GridPhoto>
                                </div>}
                        </AnimatedContainer>
                    </div>
                    {!noBtn && (<Button
                        btnColor="green"
                        typeButton={1}
                        className={classes.comment_item_right_btn}
                        onClick={() => setShowModalReply(true)}
                    >
                        {t("comment.reply")}
                    </Button>)}
                </div>
                {templateModalReply}
                {templateSuccessModal}
                {disabled ? <div className={classes.comment_item_disabled}></div> : ''}
            </div>
            {reviewInfo.answers && (<div className={classes.comment_item_list}>
                {templateResponse}
            </div>)}
            {editBtn && <div className={classes.comment_item_button}>
                <Button
                    btnColor="ButtonGreen"
                    typeButton={2}
                    onClick={() => setShowModalReply(true)}
                >
                    {t("comment.edit")}
                </Button>
            </div>}
        </div>
    )
}

export default CommentItem