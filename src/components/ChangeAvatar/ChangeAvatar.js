import React from "react";
import classes from "./ChangeAvatar.module.scss";
import {useTranslation} from "react-i18next";
import useToggleVisibility from "../../hooks/useToggleVisibility";
import ChangeAvatarModal from "../UI/modals/ChangeAvatarModal/ChangeAvatarModal";
import Button from "../UI/btns/Button/Button";
import Avatar from "../Avatar/Avatar";


const ChangeAvatar = ({
                          avatar,
                          className,
                          userRole
                      }) => {
    const { t } = useTranslation();

    /** Стили обертки */
    const cls = [];
    if (className) {
        cls.push(className);
    }

    /** Управление видимостью модалки и функция закрытия модалки при клике вне */
    const [showModal, toggleModal, closeModal] = useToggleVisibility();

    /** Отображение модалки с изменением аватара */
    const modalChangeAvatar = showModal && (
        <ChangeAvatarModal
            onClose={closeModal}
            avatarImg={avatar}
            btnClose={() => toggleModal(false)}
            userRole={userRole}
        />
    );



    return (
        <div className={cls.join(' ')}>
            <Avatar
                width={136}
                height={136}
                avatar={avatar}
            >
            </Avatar>
            <Button
                btnColor="outline_blue"
                className={classes.change_avatar_btn}
                typeButton={1}
                onClick={()=>toggleModal(true)}
            >{t("profile.uploadAvatar")}</Button>
            {modalChangeAvatar}
        </div>
    );
};

export default ChangeAvatar;