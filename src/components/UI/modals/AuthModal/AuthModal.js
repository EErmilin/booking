import React from 'react'
import { useLocation, useNavigate } from "react-router-dom";
import EmptyModal from "../EmptyModal/EmptyModal";
import Button from "../../btns/Button/Button";
import { useTranslation } from "react-i18next";
import { logOutPartner, showAuthModal } from "../../../../store/actions/authActions";
import { useDispatch, useSelector } from "react-redux";
import classes from "./AuthModal.module.scss";
import useToggleVisibility from "../../../../hooks/useToggleVisibility";
import classesModal from "../DarkBackground/DarkBackground.module.scss";

function AuthModal() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const dispatcher = useDispatch()
    const isShowAuthModal = useSelector(state => state.auth.isShowAuthModal)
    const isAunthModalComment = useSelector(state => state.auth.isAunthModalComment)
    const isAunthModalFavorite = useSelector(state => state.auth.isAunthModalFavorite)
    const userInfo = useSelector(state => state.auth.userInfo)
    const [modal,setModal,closeModal] = useToggleVisibility()
    const location = useLocation()
    const onClick = () => {
        dispatcher(logOutPartner())
        navigate(`/auth/login`, { state: `${window.location.pathname}${window.location.search}` })
        dispatcher(showAuthModal(false, false, false))
    }

    if (isShowAuthModal || isAunthModalComment || isAunthModalFavorite) {
        return (
            <EmptyModal
                close={true}
                btnCancelClick={() => {
                    return dispatcher(showAuthModal(false, false, false))
                }}
                width={400}
                background="blue"
                closeModal={(event)=>{
                    if (!(event.type=='keypress') && (event.target.classList.contains(classesModal.DarkBackground)||event.target.classList.contains(classesModal.BlueBackground))) {
                        const ctx = event.target.closest("[data-wrap=\"modal\"]");
                        if (!ctx) {
                            return dispatcher(showAuthModal(false, false, false))
                        }
                    }
                }}
                typeModal={"withoutBack"}
                className={classes.auth_modal}
            >
                <h2>{isAunthModalComment ? userInfo.user_type === 2 ? t("comment.authToAddComment") : t("comment.noReviews") :
                    isAunthModalFavorite ? t('favorites.notAuth') :
                        t("lockRoom.partnerTitle")}</h2>
                {!isAunthModalComment && <Button
                    typeButton={2}
                    btnColor="ButtonGreen"
                    onClick={() => onClick()}
                >{t("lockRoom.btnPartner")}</Button>}
            </EmptyModal>
        )
    } else {
        return null
    }
}
export default AuthModal