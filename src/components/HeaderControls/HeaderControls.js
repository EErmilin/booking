import React, { useEffect } from 'react'
import Button from "../UI/btns/Button/Button";
import classes from "./HeaderControls.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { getCountUnreadNotifications } from "../../store/actions/notificationActions";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CLIENT_ROLE } from "../../roles/roles"

export default function HeaderControls({
    className,
    children,
    btnColor,
    onClick,
    favoriteCount,
    notification,
    roles,
    ...rest
}) {

    const cls = []
    const dispatcher = useDispatch()
    const count = useSelector(state => state.notifications.count)
    const favorites = useSelector(state => state.favorites.favorites)
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (!searchParams.get("email")) {
            dispatcher(getCountUnreadNotifications())
        }
    }, [count])

    if (className) {
        cls.push(className)
    }

    return (
        <div className={cls.join(' ')}>
            {roles === CLIENT_ROLE && !!favorites?.length &&
                <Button className={[classes.btn, classes.btn_favorite].join(" ")} onClick={() => navigate('/personal-area/favorites')}>
                    <div className={classes.notification}>{favorites.length}</div>
                </Button>
            }
            <Button className={[classes.btn, classes.btn_bell].join(" ")} onClick={() => navigate('/personal-area/notifications')}>
                {!!count && <div className={classes.notification}>{count}</div>}
            </Button>
        </div>
    )
}