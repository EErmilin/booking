import React, {useState} from "react"
import classes from "./ChangeAvatarModal.module.scss";
import {useTranslation} from "react-i18next";
import dataURItoBlob from "../../../../functions/dataUriToBlob";
import Avatar from "react-avatar-edit"
import TwoButtonModal from "../TwoButtonModal/TwoButtonModal";
import {useDispatch} from "react-redux";
import changeAvatar from "../../../ChangeAvatar/ChangeAvatar";
import {changeClientAvatar, changeUserAvatar} from "../../../../store/actions/authActions";

const ChangeAvatarModal = ({
   avatarImg,
   onClose,
   btnClose,
   userRole
}) => {
    const { t } = useTranslation();
    const dispatcher = useDispatch()
    /** Превью в base64 и ссылка на загруженную картинку */
    const [avatar, toggleAvatar] = useState({
        preview: null,
        src: avatarImg,
        name: '',
        crop: true,
    });

    // /** Устанавливаем аватар (если он есть) в кроппер */
    // if (accountInfo.photo && accountInfo.photo.name && !avatar.src) {
    //     toggleAvatar({
    //         ...avatar,
    //         src: accountInfo.photo.name,
    //         name: accountInfo.photo.originalName,
    //     });
    // }

    /** Обрезаем аватар и в preview помещаем base64 полученного объекта */
    const onCrop = (preview) => {
        const obj = {
            ...avatar,
            preview,
        };

        toggleAvatar(obj);
    };

    /** Очищаем поле превьюшки */
    const onCloseCrop = () => {
        const obj = {
            ...avatar,
            preview: null,
            src: null,
            crop: false,
        };

        toggleAvatar(obj);
    };

    /** Сохраняем изменения */
    const saveAvatar = async () => {
        const blob = dataURItoBlob(avatar.preview);
        const files = new FormData();
        files.append('avatar', blob, avatar.name);
        if(userRole==2){
            dispatcher(changeUserAvatar(files))
        }else{
            dispatcher(changeClientAvatar(files))
        }

        btnClose();
    };

    return (
        <TwoButtonModal
            closeModal={onClose}
            btnCancelText={t('profile.modalChangeAvatar.cancel')}
            btnCancelClick={btnClose}
            btnNextText={t('profile.modalChangeAvatar.cut')}
            btnNextClick={saveAvatar}
            disabled={!avatar.crop}
            typeModal="withoutBack"
            background="blue"
            width={500}
        >
            <h2 className={classes.title}>
                {t('profile.modalChangeAvatar.title')}
            </h2>
            <div className={classes.change_avatar_modal}>
                <Avatar
                    src={avatarImg}
                    width={400}
                    height={300}
                    onCrop={onCrop}
                    onClose={onCloseCrop}
                    src={avatar.src}
                    minCropRadius={5}
                    shadingColor="black"
                    label={t('profile.modalChangeAvatar.selectFile')}
                    labelStyle={{
                        color: '#113656',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: 20,
                        cursor:"pointer"
                    }}
                    borderStyle={{
                        backgroundColor: '#c4c4c4',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onFileLoad={(file) =>
                        toggleAvatar({ ...avatar, name: file.name, crop: true })
                    }
                />
            </div>
        </TwoButtonModal>
    );
};

export default ChangeAvatarModal
