import React, {useMemo, useState} from "react"
import classes from "./ModerationHotelLIne.module.scss";
import Avatar from "../../../Avatar/Avatar";
import GridPhoto from "../../../GridPhoto/GridPhoto";
import Button from "../../btns/Button/Button";
import {useTranslation} from "react-i18next";
import useToggleVisibility from "../../../../hooks/useToggleVisibility";
import EmptyModal from "../../modals/EmptyModal/EmptyModal";
import CustomTextArea from "../../areas/CustomTextArea/CustomTextArea";
import AddPhotoV2 from "../../../AddPhotoV2/AddPhotoV2";
import AddPhotos from "../../../AddPhotos/AddPhotos";
import {useDispatch, useSelector} from "react-redux";
import moment from "moment";
import {createAnswerModeration} from "../../../../store/actions/moderationActions";

const moderatorImage = require("../../../../assets/image/moderatorImage.png")


function ModerationHotelLine ({
    className,
    moderation
}){
    const {t} = useTranslation()
    const [answer,setAnswer] = useState()
    const dispatcher = useDispatch()
    const cls = [classes.moderation_hotel_line]
    if(className)cls.push(className)

    const mainModeration = useMemo(()=>{
       return moderation && moderation.filter(elem=>elem.type==1)[0]
    },[moderation])



    /** Модалки ответа */
    const [showModalReply,setShowModalReply,closeModalReply] = useToggleVisibility()
    const [showModalSuccess,setShowModalSuccess,closeModalSuccess] = useToggleVisibility()

    function SubmitReply(){
        dispatcher(createAnswerModeration({hotel_id:mainModeration.hotel_id,answer:answer}))
        setShowModalReply(false)
        setShowModalSuccess(true)
    }

    const templateModalReply = showModalReply && (
        <EmptyModal
            close={true}
            closeModal={closeModalReply}
            btnCancelClick={()=>setShowModalReply(false)}
            width={980}
            background={"blue"}
            typeModal={"withoutBack"}
        >
            <div className={classes.moderation_hotel_line_modal}>
                <h2 className={classes.moderation_hotel_line_modal_title}>{t("support.hotelModeration.modalTitle")}</h2>
                <CustomTextArea
                    className={classes.moderation_hotel_line_modal_textarea}
                    label={t("support.hotelModeration.label")}
                    value={answer}
                    onChange={(event)=>setAnswer(event.target.value)}
                ></CustomTextArea>
                {/*<AddPhotoV2 className={classes.moderation_hotel_line_photos}></AddPhotoV2>*/}
                <div className={classes.moderation_hotel_line_modal_wrap}>
                    <Button
                        btnColor="green"
                        typeButton={1}
                        onClick={SubmitReply}
                    >{t("comment.modal.send")}</Button>
                    <Button
                        btnColor="outline_blue"
                        typeButton={1}
                        className={classes.moderation_hotel_line_modal_wrap_cancel}
                        onClick={()=>setShowModalReply(false)}
                    >{t("comment.modal.cancel")}</Button>
                </div>
            </div>
        </EmptyModal>
    )

    const templateSuccessModal = showModalSuccess && (
        <EmptyModal
            close={true}
            closeModal={closeModalSuccess}
            btnCancelClick={()=>setShowModalSuccess(false)}
            typeModal={"withoutBack"}
            background="blue"
            width={328}
        >
            <h2 className={classes.moderation_hotel_line_modal_titleSuccess}>{t("support.hotelModeration.successTitle")}</h2>
            <p className={classes.moderation_hotel_line_modal_text}>{t("support.hotelModeration.successMessage")}</p>
        </EmptyModal>
    )


    const templateResponse = moderation.filter(elem=>elem.id!==mainModeration.id).map((elem,id)=>{
        return (
            <div className={classes.moderation_hotel_line_wrap} key={id}>
                <div className={classes.moderation_hotel_line_user}>
                    <Avatar width={40} height={40} avatar={elem.avatar?`${elem.avatar}`:moderatorImage}></Avatar>
                    <div className={classes.moderation_hotel_line_user_info}>
                        <p className={classes.moderation_hotel_line_user_info}>{elem.type==2?"Вы":"Модератор"}</p>
                        <p className={classes.moderation_hotel_line_user_date}>{moment.unix(mainModeration.created_at).format("DD MMMM YYYY")}</p>
                    </div>
                </div>
                <div className={classes.moderation_hotel_line_content}>
                    <div className={classes.moderation_hotel_line_content_text}>
                        {elem.answer}
                    </div>
                </div>
            </div>
        )
    })



    return (
        <div className={cls.join(' ')}>
            <div className={classes.moderation_hotel_line_wrap}>
                <div className={classes.moderation_hotel_line_user}>
                    <Avatar width={40} height={40} avatar={moderatorImage}></Avatar>
                    <div className={classes.moderation_hotel_line_user_info}>
                        <p className={classes.moderation_hotel_line_user_info}>Денис</p>
                        <p className={classes.moderation_hotel_line_user_date}>Модератор ∙ {moment.unix(mainModeration.created_at).format("DD MMMM YYYY")}</p>
                    </div>
                </div>
                <div className={classes.moderation_hotel_line_content}>
                    <p className={classes.moderation_hotel_line_content_error}>Замечание от модератора</p>
                    <div className={classes.moderation_hotel_line_content_text}>
                        {mainModeration.answer}
                    </div>
                    {/*<GridPhoto className={classes.moderation_hotel_line_content_photos} viewType={2}></GridPhoto>*/}
                </div>
            </div>
            {templateResponse && templateResponse}
            <div className={classes.moderation_hotel_line_wrap}>
                <Button
                    typeButton={1}
                    btnColor="green"
                    onClick={() => setShowModalReply(true)}
                >{t("support.hotelModeration.reply")}</Button>
            </div>
            {templateModalReply}
            {templateSuccessModal}
        </div>
    )
}

export default ModerationHotelLine