import React, { useEffect, useCallback, useState, useMemo } from "react";
import classes from "../Reservations.module.scss";
import TransitionContainer from "../../../../../components/UI/other/TransitionContainer/TransitionContainer";
import AllClientReservations from "./Components/AllClientReservations/AllClientReservations";
import { useTranslation } from "react-i18next";
import usePagination from "../../../../../hooks/usePagination";
import { useDispatch, useSelector } from "react-redux";
import { getClientReservations } from "../../../../../store/actions/bookingActions";
import Preloader from "../../../../../components/Preloader/Preloader";
import Button from "../../../../../components/UI/btns/Button/Button";
import { NavLink, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import serialize from "../../../../../functions/serialize";


function ListClientReservations() {
    const { t } = useTranslation()
    const { page } = useParams()
    const dispatcher = useDispatch()
    /** Текущий блок */
    const [searchParams, setSearchParams] = useSearchParams()
    const activeBlock = +searchParams.get("block")
    const status = searchParams.get("status_id")
    const [otherParams, setOtherParams] = useState({ status_id: status })
    const navigate = useNavigate()
    const statusLength = useSelector(state => state.book.statusLength)
    /** Инфа для пагинации */
    const limit = useSelector(state => state.book.limit)
    const total = useSelector(state => state.book.total)
    const reservations = useSelector(state => state.book.reservation)
    const location = useLocation()
    /** Нету бронирования */
    const emptyReservations =
        <div className={classes.client_empty}>
            <h2 className={classes.client_empty_title}>
                {t('reservations.client.empty')}
            </h2>
            <Button
                className={classes.client_empty_btn}
                btnColor="green"
                typeButton={1} >
                <NavLink to={"/catalog/1?adults=1&name=Москва&id=6&type=region"}>{t('reservations.client.emptyButton')}</NavLink>
            </Button>
        </div>

    /** Обертка для получения инфы объектов партнера */
    const getInfo = useCallback(async (params) => {
        const formatParams = { expand: "region,reviews", sort: `-id`, ...params, page: page, }
        return await dispatcher(getClientReservations(formatParams))
    }, [page])

    const allReservationsCount = statusLength.newCount +
        statusLength.approvedCount +
        statusLength.cancelledCount +
        statusLength.rejectedCount +
        statusLength.completedCount +
        statusLength.guestNoShowCount +
        statusLength.waitingForPaymentCount

    const blocks = [
        {
            title: <div
                className={classes.support_blocks_wrap}
                onClick={() => {
                    navigate(`/personal-area/my-reservations/1?${serialize({ block: 0, status_id: '1,2,3,4,5,6,7' })}`)
                    setOtherParams({ status_id: '1,2,3,4,5,6,7' })

                }}
            >
                {t("reservations.all")}
                {allReservationsCount ?
                    <span className={classes.support_blocks_notification}>{allReservationsCount}</span> : ''}
            </div>,
            block: reservations && reservations.length ? <AllClientReservations filters={otherParams} /> : emptyReservations
        },
        {
            title: <div
                className={classes.support_blocks_wrap}
                onClick={() => {
                    navigate(`/personal-area/my-reservations/1?${serialize({ block: 1, status_id: '7' })}`)
                    setOtherParams({ status_id: '7' })
                }}
            >
                {t("reservations.payOnline")}
                {statusLength.waitingForPaymentCount ?
                    <span className={classes.support_blocks_notification}>{statusLength.waitingForPaymentCount}</span> : ''}
            </div>,
            block: reservations && reservations.length ? <AllClientReservations filters={otherParams} /> : emptyReservations
        },
        {
            title: <div
                className={classes.support_blocks_wrap}
                onClick={() => {
                    navigate(`/personal-area/my-reservations/1?${serialize({ block: 2, status_id: '2' })}`)
                    setOtherParams({ status_id: '2' })
                }}
            >
                {t("reservations.approved")}
                {statusLength.approvedCount ?
                    <span className={classes.support_blocks_notification}>{statusLength.approvedCount}</span> : ''}
            </div>,
            block: reservations && reservations.length ? <AllClientReservations filters={otherParams} /> : emptyReservations
        },
        {
            title: <div
                className={classes.support_blocks_wrap}
                onClick={() => {
                    navigate(`/personal-area/my-reservations/1?${serialize({ block: 3, status_id: '3' })}`)
                    setOtherParams({ status_id: '3' })
                }}
            >
                {t("reservations.canseledClient")}
                {statusLength.cancelledCount ?
                    <span className={classes.support_blocks_notification}>{statusLength.cancelledCount}</span> : ''}
            </div>,
            block: reservations && reservations.length ? <AllClientReservations filters={otherParams} /> : emptyReservations
        },
        {
            title: <div
                className={classes.support_blocks_wrap}
                onClick={() => {
                    navigate(`/personal-area/my-reservations/1?${serialize({ block: 4, status_id: '4,6' })}`)
                    setOtherParams({ status_id: '4,6' })
                }}
            >
                {t("reservations.canseledHotel")}
                {statusLength.rejectedCount + statusLength.guestNoShowCount ?
                    <span className={classes.support_blocks_notification}>{statusLength.rejectedCount + statusLength.guestNoShowCount}</span> : ''}
            </div>,
            block: reservations && reservations.length ? <AllClientReservations filters={otherParams} /> : emptyReservations
        },
        {
            title: <div
                className={classes.support_blocks_wrap}
                onClick={() => {
                    navigate(`/personal-area/my-reservations/1?${serialize({ block: 5, status_id: '5' })}`)
                    setOtherParams({ status_id: '5' })
                }}
            >
                {t("reservations.completed")}
                {statusLength.completedCount ?
                    <span className={classes.support_blocks_notification}>{statusLength.completedCount}</span> : ''}
            </div>,
            block: reservations && reservations.length ? <AllClientReservations filters={otherParams} /> : emptyReservations
        }
    ]

    let templateTransitionContainer = useMemo(() => {
        document.body.scrollIntoView({ block: "start", behavior: "smooth" })
        return <TransitionContainer
            classNameTitlesWrap={classes.filter_wrap}
            classNameTitle={classes.filter_titles}
            blocks={blocks}
            isScrollable={true}
            currentBlock={activeBlock ? activeBlock : 0}
        />
    }, [reservations])

    /** Пагинация */
    const [pagination] = usePagination({
        getInfo: getInfo,
        limit: limit,
        total: total,
        otherParams: otherParams,
        className: classes.pagination,
        urlParams: location.search.replaceAll("?", '')
    });

    if (!reservations) return <Preloader></Preloader>
    return (
        <div className={classes.reservations_wrap}>
            {templateTransitionContainer}
            {pagination}
        </div>
    )
}

export default ListClientReservations