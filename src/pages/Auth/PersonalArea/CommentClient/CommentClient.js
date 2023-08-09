import React, { useEffect, useMemo, useState } from "react";
import classes from "./CommentClient.module.scss";
import { useTranslation } from "react-i18next";
import TransitionContainer from "../../../../components/UI/other/TransitionContainer/TransitionContainer";
import CommentItem from "./CommentItemClient/CommentItem";
import { useDispatch, useSelector } from "react-redux";
import { clearState, getReviewsClient } from "../../../../store/actions/ReviewActions";
import HotelCardComment from "../../../../components/HotelCardComment/HotelCardComment";
import { getClientReservations } from "../../../../store/actions/bookingActions";
import {useLocation, useSearchParams} from "react-router-dom";
import useToggleVisibility from "../../../../hooks/useToggleVisibility";
import EmptyModal from "../../../../components/UI/modals/EmptyModal/EmptyModal";
import Button from "../../../../components/UI/btns/Button/Button";




function CommentClient() {
    const { t } = useTranslation()
    const reviews = useSelector(state => state.reviews.listReviews)
    const completedReservations = useSelector(state => state.book.reservation)
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatcher = useDispatch()
    const [params, setParams] = useState({currentBlock:searchParams.get("currentBlock") ?? 0})
    const [modal,setModal,closeModal] = useToggleVisibility()
    const location = useLocation()
    const templateEmpty = <div className={classes.comment_empty}>
        <h2 className={classes.comment_empty_title}>
            {t('comment.empty')}
        </h2>
    </div>

    const templateModal = modal && <EmptyModal
        close={true}
        background="blue"
        closeModal={closeModal}
        btnCancelClick={() => setModal(false)}
        width={336}
        typeModal="withoutBack"
        className={classes.noComments_auth}
    >
        <h2 className={classes.noComments_auth_title}>Отлично!</h2>
        <div className={classes.noComments_auth_text}>Ваш отзыв отправлен на модерацию</div>
    </EmptyModal>

    useEffect(() => {
        dispatcher(clearState())
        let clientParams = {}
        const hotelId = searchParams.get("hotelId")
        if (hotelId && hotelId.length) {
            clientParams = { hotel_id: hotelId };
        }
        clientParams = Object.assign(clientParams, { status_id: 5, expand: "region,reviews",sort:`-id` })
        dispatcher(getClientReservations(clientParams))
        dispatcher(getReviewsClient())
    }, [location.search])

    const templateCommentsNew = useMemo(() => {
        return reviews && reviews.filter(elem => elem.status == 3).map((elem, id) => {
            return (
                <CommentItem reviewInfo={elem} key={id}></CommentItem>
            )
        })
    }, [reviews])
    const templateCommentsPublished = useMemo(() => {
        return completedReservations && completedReservations.filter(elem=>!elem.reviews || !elem.reviews.length).map((elem, id) => {
            return (
                <HotelCardComment hotelId={searchParams.get("hotelId")} setModal={setModal} bookInfo={elem} key={id}></HotelCardComment>
            )
        })
    }, [completedReservations])
    const templateCommentsModerated = useMemo(() => {
        return reviews && reviews.filter(elem => (elem.status == 1) || (elem.status == 2)).map((elem, id) => {
            return (
                <CommentItem reviewInfo={elem} editBtn={true} noBtn={true} response={elem} disabled={true} key={id}></CommentItem>
            )
        })
    }, [reviews])

    const blocksComments = useMemo(() => {
        return [
            {
                title:
                    (<div className={classes.comment_blocks_wrap} onClick={() => setParams({ currentBlock: 0 })}>
                        {t("comment.clientTitles.my")}
                        {templateCommentsNew && templateCommentsNew.length?<span
                            className={classes.comment_blocks_notification}>{templateCommentsNew && templateCommentsNew.length}</span>:""}
                    </div>),
                block: () => (
                    <div className={classes.comment_blocks_list}>
                        {(templateCommentsNew && templateCommentsNew.length) ? templateCommentsNew : templateEmpty}
                    </div>
                )
            },
            {
                title: (<div className={classes.comment_blocks_wrap} onClick={() => setParams({ currentBlock: 1 })}>
                    {t("comment.clientTitles.orderOnComment")}
                    {templateCommentsPublished && templateCommentsPublished.length?<span
                        className={classes.comment_blocks_notification}>{templateCommentsPublished && templateCommentsPublished.length}</span>:""}
                </div>),
                block: () => (
                    <div className={classes.comment_blocks_list} >
                        {(templateCommentsPublished && templateCommentsPublished.length) ? templateCommentsPublished : templateEmpty}
                    </div>
                )
            },
            {
                title: (<div className={classes.comment_blocks_wrap} onClick={() => setParams({ currentBlock: 2 })}>
                    {t("comment.clientTitles.moderation")}
                    {templateCommentsModerated && templateCommentsModerated.length?<span
                        className={classes.comment_blocks_notification}>{templateCommentsModerated && templateCommentsModerated.length}</span>:""}
                </div>),
                block: () => (
                    <div className={classes.comment_blocks_list}>
                        {(templateCommentsModerated && templateCommentsModerated.length) ? templateCommentsModerated : templateEmpty}
                    </div>
                )
            }
        ]
    }, [
        templateCommentsPublished,
        templateCommentsModerated,
        templateCommentsNew
    ])

    return (
        <div className={classes.comment}>
            <h2 className={classes.comment_title}>{t("comment.title")}</h2>
            <TransitionContainer
                currentBlock={params.currentBlock}
                classNameTitlesWrap={classes.comment_blocks}
                classNameTitle={classes.comment_blocks_title}
                blocks={blocksComments}

            ></TransitionContainer>
            {templateModal}
        </div>
    )
}

export default CommentClient