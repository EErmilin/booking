import React, {useEffect, useMemo, useState} from "react"
import classes from "./TablePrice.module.scss"
import {NavLink, useParams} from "react-router-dom";
import {getHotelInfo, getListRoomsPartner} from "../../../../store/actions/partnerHotelsActions";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import Calendar from "./components/Calendar/Calendar";
import {getCalendarPrices} from "../../../../store/actions/tablePriceActions";
import ExpandBlock from "../../../../components/ExpandBlock/ExpandBlock";
import TableCustom from "./components/TableCustom/TableCustom";
import moment from "moment";
import Preloader from "../../../../components/Preloader/Preloader";




function TablePrice() {
    const {t} = useTranslation()
    const dispatcher = useDispatch()
    const {hotelId} = useParams()
    const table = useSelector((state)=>state.table.calendar)
    const errors = useSelector((state)=>state.table.errors)
    const [dateFilter,setDateFilter] = useState(getDaysRange(new Date(), true))
    const [currDate, setCurrDate] = useState(moment(new Date()))

    useEffect(()=>{
        if(hotelId){
            dispatcher(getCalendarPrices(hotelId,{dateFrom:dateFilter[0].format("YYYY-MM-DD"),dateTo:dateFilter[1].add(1,"day").format("YYYY-MM-DD")}))
        }
    },[dateFilter])

    const templateRooms = useMemo(() => {
        return table && table.rooms.map((elem,id) => {
            return (
              <ExpandBlock
                key={id}
                title={elem.name.ru}
                className={classes.expand_block}
              >
                  <TableCustom
                    filters={{dateFrom:dateFilter[0].format("YYYY-MM-DD"),dateTo:dateFilter[1].format("YYYY-MM-DD")}}
                    hotelId={hotelId}
                    tableInfo={elem}
                  ></TableCustom>
              </ExpandBlock>
            )
        })
    },[table])

    const handleChangeDate = (date) => {

        let selectedDate = {}

        if (!date) {
            selectedDate = new Date()
        } else {
            selectedDate = moment(date).toDate()
        }

        const today = new Date()
        const isCurrMonth = (today.getFullYear() === selectedDate.getFullYear()) && (today.getMonth() === selectedDate.getMonth()) || false

        setCurrDate(moment(selectedDate))
        setDateFilter(getDaysRange(selectedDate, isCurrMonth))
    }

    function getDaysRange(date, isCurrentMonth = false) {

        const firstDay = isCurrentMonth ? moment(new Date()) : moment(new Date(date.getFullYear(), date.getMonth(), 1))
        const lastDay = moment(new Date(date.getFullYear(), date.getMonth() + 1, 0))

        return [
            firstDay,
            lastDay
        ]
    }

    useEffect(() => {
        if(errors.dateTo){
            setTimeout(()=>{
                setDateFilter(getDaysRange(new Date()))
            },5000)

        }
    },[errors])

    if (!table) return <Preloader></Preloader>

    return (
      <div className={classes.table_price}>
          <div className={classes.table_price_wrap}>
              <div className={classes.table_price_back}>
                  <NavLink
                    className={classes.table_price_back_link}
                    to="/personal-area/objects/1">{t("addNewObjects.secondStep.buttons.back")}
                  </NavLink>
              </div>
              <h2 className={classes.table_price_title}>{t("tablePrice.title")}</h2>
              <h4 className={classes.table_price_hotel_title}>{t("rooms.hotel")} «{table.name.ru}»</h4>
              <p className={classes.table_price_quanity}>Всего номеров:</p>
              <div className={classes.table_price_legend}>
                  <Calendar
                    value={dateFilter}
                    onChange={handleChangeDate}
                    curDateValue={currDate}
                    disableDatesCount={360}
                    errorMessage={errors.dateTo}
                  ></Calendar>
                  <div className={classes.table_price_legend_block}>Бронирование открыто</div>
                  <div className={classes.table_price_legend_block}>Бронирование закрыто/нет данных</div>
              </div>
          </div>
          <div className={classes.table_price_container}>
              {templateRooms}
          </div>
      </div>
    )
}

export default TablePrice