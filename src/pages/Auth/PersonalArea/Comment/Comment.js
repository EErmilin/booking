import React, {useEffect, useMemo, useState} from "react";
import classes from "./Comment.module.scss";
import {useTranslation} from "react-i18next";
import TransitionContainer from "../../../../components/UI/other/TransitionContainer/TransitionContainer";
import CommentItem from "./CommentItem/CommentItem";
import {useDispatch, useSelector} from "react-redux";
import {clearState, getReviewsPartner} from "../../../../store/actions/ReviewActions";
import Button from "../../../../components/UI/btns/Button/Button";




function Comment(){
    const {t} = useTranslation()
    const reviews = useSelector(state=>state.reviews.listReviews)
    const statusReview = useSelector((state)=>state.reviews.statusReview)
    const dispatcher = useDispatch()
    const [params,setParams] = useState({perPage:2, currentBlock:0, review_answer_status: 1})
    useEffect(()=>{
        dispatcher(clearState())
    },[])
    useEffect(()=>{
         dispatcher(getReviewsPartner({perPage:params.perPage,review_answer_status:params.review_answer_status}))
    },[params])
    const templateEmpty = <div className={classes.comment_empty}>
        <h2 className={classes.comment_empty_title}>
            {t('comment.emptyPartner')}
        </h2>
    </div>
    const templateCommentsNew = useMemo(()=>{
        return reviews && reviews.filter(elem=>elem.review_answer_status==1).map((elem,id)=>{
            return (
                <CommentItem reviewInfo={elem} key={id}></CommentItem>
            )
        })
    },[reviews])
    const templateCommentsPublished = useMemo(()=>{
        return reviews && reviews.filter(elem=>elem.review_answer_status==3).map((elem,id)=>{
            return (
                <CommentItem noBtn={true} reviewInfo={elem} key={id}></CommentItem>
            )
        })
    },[reviews])
    const templateCommentsModerated = useMemo(()=>{
        return reviews && reviews.filter(elem=>((elem.review_answer_status==2) ||( elem.review_answer_status==4))).map((elem,id)=>{
            return (
                <CommentItem reviewInfo={elem} editBtn={true} noBtn={true} disabled={true} key={id}></CommentItem>
            )
        })
    },[reviews])

    const blocksComments = useMemo(()=>{
        return [
            {
                title:
                    (<div className={classes.comment_blocks_wrap} onClick={()=>setParams({
                        review_answer_status:1,
                        currentBlock:0,
                        perPage: 2,
                        total:statusReview.newCount
                    })}>
                        {t("comment.titles.new")}
                        {statusReview.newCount?<span className={classes.comment_blocks_notification}>{statusReview.newCount}</span>:''}
                    </div>),
                block:()=>(
                    <div className={classes.comment_blocks_list}>
                        {templateCommentsNew && templateCommentsNew.length?templateCommentsNew:templateEmpty}
                    </div>
                )
            },
            {
                title:(<div className={classes.comment_blocks_wrap} onClick={()=>setParams({
                    review_answer_status:3,
                    currentBlock:1,
                    perPage: 2,
                    total:statusReview.approvedAnswerCount
                })}>
                    {t("comment.titles.published")}
                    {statusReview.approvedAnswerCount?<span className={classes.comment_blocks_notification}>{statusReview.approvedAnswerCount}</span>:""}
                </div>),
                block:()=>(
                    <div className={classes.comment_blocks_list}>
                        {templateCommentsPublished && templateCommentsPublished.length?templateCommentsPublished:templateEmpty}
                    </div>
                )
            },
            {
                title:(<div className={classes.comment_blocks_wrap}  onClick={()=>setParams({
                    review_answer_status:'2,4',
                    currentBlock:2,
                    perPage: 2,
                    total:statusReview.rejectedAnswerCount+statusReview.onModerationAnswerCount})}>
                    {t("comment.titles.responsesOnModeration")}
                    {statusReview.rejectedAnswerCount+statusReview.onModerationAnswerCount?<span
                        className={classes.comment_blocks_notification}>{statusReview.rejectedAnswerCount + statusReview.onModerationAnswerCount}</span>:""}
                </div>),
                block:()=>(
                    <div className={classes.comment_blocks_list}>
                        {templateCommentsModerated && templateCommentsModerated.length?templateCommentsModerated:templateEmpty}
                    </div>
                )
            }
        ]
    },[
        templateCommentsPublished,
        templateCommentsModerated,
        templateCommentsNew
    ])

    return (
        <div className={classes.comment}>
            <h2 className={classes.comment_title}>{t("comment.title")}</h2>
            <TransitionContainer
                classNameTitlesWrap={classes.comment_blocks}
                classNameTitle={classes.comment_blocks_title}
                currentBlock={params.currentBlock}
                blocks={blocksComments}></TransitionContainer>
            {params.total>params.perPage&& <Button
                typeButton={2}
                btnColor={"ButtonWhite"}
                className={classes.comment_show_more}
            >{t("comment.showMore")}</Button>}
        </div>
    )
}

export default Comment