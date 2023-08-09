import React, { useEffect, useState } from "react"
import classes from "./FilterCatalogRooms.module.scss";
import "./FilterCatalogRooms.scss"
import CalendarDropdownV2 from "../Dropdown/CalendarDropdownV2/CalendarDropdownV2";
import moment from "moment";
import GuestDropDown from "../Dropdown/GuestDropDown/GuestDropDown";
import Button from "../UI/btns/Button/Button";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { getHotelPage, getHotels, getRoomTariff, getSimilarHotels } from "../../store/actions/catalogActions";
import * as ReactRouterDOM from "react-router-dom";
import { useLocation } from "react-router-dom";
import useWindowSize from "../../hooks/useWindowSize"

function FilterCatalogRooms({
    className,
    buttonName,
    startFilters
}) {
    const { t } = useTranslation()
    const cls = [classes.filter_catalog]
    if (className) cls.push(className)
    const useSearchParams = ReactRouterDOM.useSearchParams;
    const [searchParams, setSearchParams] = useSearchParams();
    const windowSize = useWindowSize()

    const [filters, setFilters] = useState({
        adults: searchParams.get("adults") ?? 1,
        children: searchParams.get("children") ?? 0,
        dateFrom: moment(startFilters.dateFrom, "YYYY-MM-DD"),
        dateTo: moment(startFilters.dateTo, "YYYY-MM-DD"),
        type: 'hotel',
        minPrice: 0,
        maxPrice: 999999,
        scroll: searchParams.get("children") ?? '',
    })

    const searchHandler = () => {
        if (filters.dateTo) {
            if (filters.region) {
                const filtersObg = {
                    id: filters.region.id,
                    adults: filters.adults ?? 2,
                    children: filters.children ?? 0,
                    dateFrom: filters.dateFrom.format("YYYY-MM-DD"),
                    dateTo: filters.dateTo.format("YYYY-MM-DD"),
                    minPrice: filters.minPrice ?? 0,
                    maxPrice: filters.maxPrice ?? 999999,
                    scroll: searchParams.get("scroll") ?? 0,
                }
                if (searchParams.get('isShowModal')) {
                    filtersObg.isShowModal = searchParams.get('isShowModal')
                }
                if (searchParams.get("preview")) {
                    Object.assign(filtersObg, { preview: true })
                }
                setSearchParams(filtersObg, { replace: true });
            }
        }
    }

    useEffect(() => {
        searchHandler()
    }, [filters])


    let urlFilters = {
        region: { id: searchParams.get("id"), type: 'hotel' },
        adults: searchParams.get("adults"),
        children: searchParams.get("children"),
        dateFrom: searchParams.get("dateFrom"),
        dateTo: searchParams.get("dateTo"),
        minPrice: searchParams.get("minPrice"),
        maxPrice: searchParams.get("maxPrice"),
    }

    const dispatcher = useDispatch()

    const location = useLocation();

    useEffect(() => {
        setFilters(prevState => ({
            ...prevState,
            region: {
                id: startFilters.region.id,
                type: 'hotel',
            },
            dateFrom: moment(startFilters.dateFrom, "YYYY-MM-DD"),
            dateTo: moment(startFilters.dateTo, "YYYY-MM-DD"),
        }))

    }, [startFilters])

    const getSimilars = () => {
        const filtersObg = {
            room_adult_count: filters.adults,
            date_arrival: filters.dateFrom.format("YYYY-MM-DD"),
            date_departure: filters.dateTo.format("YYYY-MM-DD"),
            id: filters.region.id
        }
        dispatcher(getSimilarHotels(filtersObg))
    }

    useEffect(() => {
        if (filters.region) {
            getSimilars()
        }
    }, [filters.region])

    useEffect(() => {
        const filtersObg = {
            ...urlFilters,
            region: { id: searchParams.get("id"), type: 'hotel' },
            dateFrom: urlFilters.dateFrom ? moment(urlFilters.dateFrom.replace(/-/g, '')) : filters.dateFrom,
            dateTo: urlFilters.dateTo ? moment(urlFilters.dateTo.replace(/-/g, '')) : filters.dateTo,
        }
        setFilters(filtersObg)
        urlFilters = {};
    }, [])

    const search = () => {
        let filtersObg = {
            ...filters,
            dateFrom: filters.dateFrom.format('YYYY-MM-DD'),
            dateTo: filters.dateTo.format('YYYY-MM-DD'),
        }
        if (location.pathname.indexOf('room') === -1) {
            dispatcher(getHotelPage(filtersObg))
        } else {
            dispatcher(getRoomTariff(filtersObg))
        }
        getSimilars()
    }

    function handleChangeDate({ startDate, endDate }) {
        setFilters(prevState => ({
            ...prevState,
            minPrice: 0,
            maxPrice: 999999,
            dateFrom: startDate,
            dateTo: endDate
        }))
    }

    /**Обработчик гостей*/
    function handleChangeGuest(value) {
        setFilters(prevState => ({
            ...prevState,
            minPrice: 0,
            maxPrice: 999999,
            adults: value.adults,
            children: value.children
        }))
    }

    return (
        <div className={cls.join(' ')}>
            <div className={classes.filter_catalog_wrap}>
                <CalendarDropdownV2
                    state={filters}
                    className={"FilterCatalogRooms"}
                    onChange={handleChangeDate}
                    verticalSpacing={windowSize.width >= 768 ? 10 : 70}
                />
                <GuestDropDown
                    noLabel={true}
                    className={classes.filter_catalog_guest}
                    classNameDropdown={classes.filter_catalog_guest_dropdown}
                    state={filters}
                    onChange={handleChangeGuest}
                ></GuestDropDown>
            </div>
            <Button
                onClick={() => search()}
                className={classes.filter_catalog_button}
            >{buttonName ? buttonName : t("common.submit")}</Button>
        </div>
    )
}

export default FilterCatalogRooms