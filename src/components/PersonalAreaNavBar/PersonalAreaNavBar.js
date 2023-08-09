import React, {useEffect, useMemo} from "react";
import classes from "./PersonalAreaNavBar.module.scss";
import Avatar from "../Avatar/Avatar";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {NavLink, useLocation, useNavigate, useParams} from "react-router-dom";
import {logOutPartner} from "../../store/actions/authActions";
import {CLIENT_ROLE, PARTNER_ROLE} from "../../roles/roles";
import numberFormat from "../../functions/numberFormat";
import {
    getBookingArchiveHotels,
    getCountActiveBooking,
} from "../../store/actions/bookingActions";
import QuestionHint from "../QuestionHint/QuestionHint";
import HelpNotation from "../UI/other/HelpNotation/HelpNotation"

function PersonalAreaNavBar(){
    const {t} = useTranslation()
    const location = useLocation()
    const roles = useSelector(state => state.auth.userInfo.user_type)
    const userInfo = useSelector(state => state.auth.userInfo)
    const {firstBookingCompleted} = userInfo
    const isAuth = useSelector(state => state.auth.isAuth)
    const dispatcher = useDispatch()
    const navigate =  useNavigate()
    const page = useParams();
    const userRoles = useSelector(state => state.auth.userInfo.user_type)
    const countBooking = useSelector(state => state.book.countBooking)
    const countActiveBook = useSelector(state => state.book.countActiveBook)

    useEffect(()=>{
        if(roles == PARTNER_ROLE) {
            dispatcher(getBookingArchiveHotels())
            dispatcher(getCountActiveBooking())
        }
    },[])

    function logOut() {
        dispatcher(logOutPartner())
        const path = roles === 2 ? "/auth/partner/login" : "/auth/login"
        navigate(path, {state:`${location.pathname}${location.search}`})
    }

    /** Масив ссылок */
    const templateLinks = useMemo(() => {
        let arrLinks = []

        if (userInfo.user_type === PARTNER_ROLE) {
            arrLinks = [
                "profile",
                "objects/1",
                "requisites/1",
                "reports",
                // "prices/1",
                "reservations",
                "comments",
                "notifications",
                "support/1",
                // "channels",
                "archive/1"
            ]
        } else {
            arrLinks = [
                "profile",
                "my-reservations/1",
                "comments",
                "favorites",
                "notifications",
                // "achievements"
                // "support-client/1"
            ]
        }

        return arrLinks.map((elem, id) => {
            let activePage = page['*']
            activePage = activePage.split("/")[0]
            let currentRoute = elem.split('/')[0]
            if(elem==="archive/1"){
                return (
                    <li
                        className={[classes.list_item,(currentRoute===activePage?classes.list_item_active:'')].join(' ')}
                        key={id}
                    >
                        <div className={classes.book_wrap}>
                            <NavLink
                                className={classes.link}
                                to={`/personal-area/${elem}`}
                            >
                                {t(`personalArea.navBar.${currentRoute}`)}
                            </NavLink>
                            {countBooking?<div className={classes.book}>{countBooking} <QuestionHint count={countBooking}></QuestionHint>
                            </div>:''}
                        </div>
                    </li>
                )
            }if(elem==="reservations"){
                return (
                    <li
                        className={[classes.list_item,(currentRoute===activePage?classes.list_item_active:'')].join(' ')}
                        key={id}
                    >
                        <div className={classes.book_wrap}>
                            <NavLink
                                className={classes.link}
                                to={`/personal-area/${elem}`}
                            >
                                {t(`personalArea.navBar.${currentRoute}`)}
                            </NavLink>
                            {countActiveBook?<div className={classes.active_book}>{countActiveBook}</div>:''}
                        </div>
                    </li>
                )
            }else{
                return (
                    <li
                        className={[classes.list_item,(currentRoute===activePage?classes.list_item_active:'')].join(' ')}
                        key={id}
                    >
                        <NavLink
                            className={classes.link}
                            to={`/personal-area/${elem}`}
                        >
                            {t(`personalArea.navBar.${currentRoute}`)}
                        </NavLink>
                    </li>
                )
            }
        })
    }, [page['*'],userInfo])

    return (
        <div className={classes.wrap}>
            <div className={classes.header}>
                <Avatar
                    width={68}
                    height={68}
                    avatar={userInfo.avatar?`${userInfo.avatar}`:""}
                    className={classes.avatar}
                ></Avatar>
                <div className={classes.info}>
                    <p className={classes.name}>{userInfo.first_name} {userInfo.last_name}</p>
                    <p className={classes.email}>{userInfo.email}</p>
                    {userRoles === CLIENT_ROLE &&
                      <div className={[classes.key, !firstBookingCompleted && classes.key_disabled].join(" ")}>
                          <span>У вас {numberFormat(userInfo.sailplay?.points?.confirmed)} ключей</span>
                          {!firstBookingCompleted && <HelpNotation className={classes.key_hint} classNameText={classes.key_hint_text} icon={`white`} text={`Начисленные бонусы будут доступны для списания после первого завершенного бронирования.`}/>}
                      </div>
                    }
                </div>
            </div>
            <div className={classes.links}>
                <ul className={classes.list}>
                    {templateLinks}
                </ul>
            </div>
            <div className={classes.bottom}>
                {isAuth &&
                  <div onClick={logOut} className={classes.logout_button}>{t("personalArea.navBar.exit")}</div>
                }
            </div>
        </div>
    )
}

export default PersonalAreaNavBar