import React, { useEffect, useMemo, useState } from "react"
import classes from "./ReviewModal.module.scss"
import EmptyModal from "../../../../../components/UI/modals/EmptyModal/EmptyModal";
import Button from "../../../../../components/UI/btns/Button/Button";
import { getClientReservations } from "../../../../../store/actions/bookingActions";
import { showAuthModal } from "../../../../../store/actions/authActions";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import useToggleVisibility from "../../../../../hooks/useToggleVisibility";
import CommentRating from "../../../../../components/CommentRating/CommentRating";
import CommentItem from "../../../../Auth/PersonalArea/Comment/CommentItem/CommentItem";
import { getHotelCommentsModal } from "../../../../../store/actions/catalogActions";
import Preloader from "../../../../../components/Preloader/Preloader";
import Rating from "../Rating/Rating";
import { useTranslation } from "react-i18next";


function ReviewModal({
    closeModal,
    btnCancelCLick,
    getInfo,
    hotelId,
    hotelInfo
}) {
    const isAuth = useSelector(state => state.auth.isAuth)
    const dispatcher = useDispatch()
    const userInfo = useSelector(state => state.auth.userInfo)
    const location = useLocation()
    const navigate = useNavigate()
    const [modalAuth, setModalAuth, closeModalAuth] = useToggleVisibility()
    const [modalEmpty, setModalEmpty, closeModalEmpty] = useToggleVisibility()
    const hotelComments = useSelector(state => state.catalog.hotelCommentsModal)
    const hotelCommentsTotal = useSelector(state => state.catalog.hotelCommentsModalTotal)
    const [params, setParams] = useState({ 'per-page': 5 })
    const { t } = useTranslation()
    useEffect(() => {
        dispatcher(getHotelCommentsModal(hotelId, params))
    }, [params])

    const templateComments = useMemo(() => {
        return hotelComments && hotelComments.map((elem, id) => {
            return (
                <CommentItem isPartner={true} isHotelPage={true} noEmail={true} noBtn={true} reviewInfo={elem} key={id}></CommentItem>
            )
        })
    }, [hotelComments])
    useEffect(() => {
        document.body.style.position = 'fixed';
        return () => {
            document.body.style.position = 'static'

        };
    }, []);

    const modalNotAuth = modalAuth && <EmptyModal
        close={true}
        background="blue"
        closeModal={closeModalAuth}
        btnCancelClick={() => setModalAuth(false)}
        width={336}
        typeModal="withoutBack"
        className={classes.review_modal_auth}
    >
        <h2 className={classes.review_modal_auth_title}>Вы не авторизованы</h2>
        <div className={classes.review_modal_auth_text}>Для добавления отзыва Вам необходимо авторизоваться</div>
        <Button btnColor="ButtonGreen"
            className={classes.review_modal_auth_btn}
            typeButton={1}
            onClick={() => navigate('/auth/login', { state: location.pathname + `${location.search}&isShowModal=1` })}
        >
            Войти
        </Button>
    </EmptyModal>

    const modalEmptyReservations = modalEmpty && <EmptyModal
        close={true}
        background="blue"
        closeModal={closeModalEmpty}
        btnCancelClick={() => setModalEmpty(false)}
        width={336}
        typeModal="withoutBack"
        className={classes.review_modal_auth}
    >
        <h2>{userInfo.user_type === 2 ? t("comment.authToAddComment") : t("comment.noReviews")}</h2>
    </EmptyModal>

    const onComment = async () => {
        const clientParams = { hotel_id: hotelId, status_id: 5 }
        if(!isAuth) {
            return setModalAuth(true)
        }
        const reviews = await dispatcher(getClientReservations(clientParams))

        if (userInfo.user_type === 2 || (reviews && !reviews.length)) {
            return setModalEmpty(true)
        } else {
            navigate(`/personal-area/comments?hotelId=${hotelId}&currentBlock=1`)
        }
    }
    return (
    <>
            <EmptyModal
                width={960}
                className={classes.review_modal}
                btnCancelClick={() => btnCancelCLick(false)}
                close={true}
                closeModal={closeModal}
                background="blue"
                typeModal="withoutBack"
            >
            {hotelComments?<>
                    <h2 className={classes.review_modal_title}>Все отзывы</h2>
                    <div className={classes.review_modal_rating}>
                        <div className={classes.review_modal_rating_top}>
                            <Rating
                                commentCount={hotelCommentsTotal}
                                commentRating={hotelInfo.reviews_rating}
                                className={classes.review_modal_rating_block}
                            ></Rating>
                        </div>
                        <div className={classes.review_modal_rating_bottom}>
                            <h3 className={classes.review_modal_rating_bottom_title}>Написать отзыв о проживании</h3>
                            <p className={classes.review_modal_rating_bottom_text}>Оставьте отзыв и поделитесь своим мнением, чтобы помочь другим пользователям сделать свой выбор.</p>
                            <Button btnColor="outline_blue"
                                className={classes.review_modal_btn}
                                typeButton={1}
                                onClick={() => onComment()}
                            >
                                Оставить отзыв
                            </Button>
                        </div>
                    </div>
                {hotelComments && <div className={classes.review_modal_body}>
                    {templateComments}
                    {(hotelCommentsTotal>2 && params["per-page"] < hotelCommentsTotal)?<div className={classes.show_more_wrap}>
                        <Button btnColor="outline_blue"
                                className={classes.show_more}
                                typeButton={1}
                                onClick={() => {
                                    const obj = JSON.parse(JSON.stringify(params))
                                    obj['per-page'] += 5
                                    setParams(obj)
                                }}
                            >
                                Показать еще
                            </Button>
                        </div> : ''}
                    </div>}
                </> : <Preloader></Preloader>}
            </EmptyModal>
            {modalNotAuth}
            {modalEmptyReservations}
    </>
    )
}


export default ReviewModal