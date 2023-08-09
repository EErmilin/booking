
import classes from './NoComents.module.scss'
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Button from "../UI/btns/Button/Button";
import { getClientReservations } from "../../store/actions/bookingActions";
import { showAuthModal } from "../../store/actions/authActions";
import useToggleVisibility from "../../hooks/useToggleVisibility";
import EmptyModal from "../UI/modals/EmptyModal/EmptyModal";
import { useEffect } from "react";


export default function NoComents({ isBlue = false, hotelId, isShow }) {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const { t } = useTranslation()
    const [modalAuth, setModalAuth, closeModalAuth] = useToggleVisibility()
    const isAuth = useSelector(state => state.auth.isAuth)
    const dispatcher = useDispatch()
    const userInfo = useSelector(state => state.auth.userInfo)
    const location = useLocation()

    const onComment = async () => {
        const clientParams = { hotel_id: hotelId, status_id: 5, expand: "hotel,room" }
        if (!isAuth) {
            return setModalAuth(true)
        }
        if (isAuth && userInfo.user_type !== 2) {
            const reviews = await dispatcher(getClientReservations(clientParams))
            if (reviews && !reviews.length) {
                dispatcher(showAuthModal(false, true, false))
            } else {
                navigate(`/personal-area/comments?hotelId=${hotelId}&currentBlock=1`)
            }
        } else {
            dispatcher(showAuthModal(false, true, false))
        }
    }

    useEffect(() => {
        if (searchParams.get('isShowModal')) {
            onComment()
        }
    }, [])

    const modalNotAuth = modalAuth && <EmptyModal
        close={true}
        background="blue"
        closeModal={closeModalAuth}
        btnCancelClick={() => setModalAuth(false)}
        width={336}
        typeModal="withoutBack"
        className={classes.noComments_auth}
    >
        <h2 className={classes.noComments_auth_title}>Вы не авторизованы</h2>
        <div className={classes.noComments_auth_text}>Для добавления отзыва Вам необходимо авторизоваться</div>
        <Button btnColor="ButtonGreen"
            className={classes.noComments_auth_btn}
            typeButton={1}
            onClick={() => navigate('/auth/login', { state: location.pathname + `${location.search}&isShowModal=1` })}
        >
            Войти
        </Button>
    </EmptyModal>

    const addComentBtn = <Button btnColor="outline_blue"
        className={classes.noComments_btn}
        typeButton={1}
        onClick={onComment}
    >
        Оставить отзыв
    </Button>
    if (isShow) {
        return <div>{modalNotAuth}</div>
    }
    if (!isBlue) {
        return (
            <div className={classes.noComments}>
                <p className={classes.noComments_text}>
                    Пока никто не оставил отзыв об объекте. Будьте первым, поделитесь своими впечатлениями.
                </p>
                {addComentBtn}
                {modalNotAuth}
            </div>
        )
    } else return (
        <><h2 className={classes.noComments_block_title} >
            {t("hotelCard.titles.comment")}
        </h2>
            <div className={classes.noComments_bottom}>
                <div className={classes.noComments_bottom_text}>
                    <p>Пока никто не оставил отзыв об объекте.<br/>Будьте первым, поделитесь своими впечатлениями.</p>
                </div>
                {addComentBtn}
            </div>
            {modalNotAuth}
        </>
    )
}