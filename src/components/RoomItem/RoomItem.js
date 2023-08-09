import React, { useState } from "react";
import classes from "./RoomItem.module.scss";
import Button from "../UI/btns/Button/Button";
import { useTranslation } from "react-i18next";
import CustomRadio from "../UI/areas/CustomRadio/CustomRadio";
import HotelConditions from "../HotelConditions/HotelConditions";
import RoomItemPrice from "../RoomItemPrice/RoomItemPrice";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { dispatchObjectToUrl } from "../../functions/dispatchObjectToUrl";
import { useSelector } from "react-redux"
import moment from "moment"
const noImg = require("../../assets/image/noRoomImg.png")

function RoomItem({ isBooking, headerClassName, room, hotel, setModal, amenity = [], hotelId, noTariff }) {
    const { t } = useTranslation()
    const { tariffs } = room
    const clsHeader = [classes.room_item_header]
    if (headerClassName) clsHeader.push(headerClassName)
    const [searchParams, setSearchParams] = useSearchParams();
    const roomImgUrl = room.main_image ?room.main_image :noImg
    const city = useSelector(state => state.catalog.city)

    const urlFilters = {
        dateFrom: searchParams.get("dateFrom"),
        dateTo: searchParams.get("dateTo"),
        adults: searchParams.get("adults"),
        children: searchParams.get("children"),
        minPrice: searchParams.get("minPrice"),
        maxPrice: searchParams.get("maxPrice"),
        edit: searchParams.get("edit"),
        preview: searchParams.get("preview")
    }

    const filtersUrl = dispatchObjectToUrl(urlFilters)

    const renderBedSelect = () => {
        return <div className={classes.room_item_footer}>
            <CustomRadio
                label={t("hotelCard.prices.selectTypeBed")}
                listRadio={[{ text: t("hotelCard.prices.singleBed") }, { text: t("hotelCard.prices.doubleBed") }]}
                name={"bed-type"}
            ></CustomRadio>
        </div>
    }
    const navigate = useNavigate()
    const renderTariffs = () => {
        return tariffs.map((item, id) => {
            return (
                <RoomItemPrice
                    key={id}
                    room={room}
                    hotel={hotel}
                    tariff={item}
                    breakfastTitle={t("hotelCard.prices.breakfastNonInPrice")}
                    isBooking={isBooking}
                    filterGuest={urlFilters}
                    setModal={setModal}
                />
            )
        })
    }

    function gaEvent() {
        const bookingNightsCount = moment(urlFilters.dateTo, "YYYY-MM-DD").diff(moment(urlFilters.dateFrom, "YYYY-MM-DD"), "days")

        /** clear previous ecommerce object */
        window.dataLayer.push({
            ecommerce: null
        })

        window.dataLayer.push({
            event: "select_item",
            ecommerce: {
                booking_country: "Russia",       // Страна, где расположен отель. Если у отелей нет такого параметра, то всегда передавать статическое значение “Russia”
                booking_city: city,       // Город, где расположен отель
                booking_start_date: urlFilters.dateFrom,       // Дата заезда
                booking_end_date: urlFilters.dateTo,       // Дата выезда
                booking_adults: +urlFilters.adults,       // Кол-во взрослых
                booking_kids: +urlFilters.children,       // Кол-во детей
                booking_nights: +bookingNightsCount,       // Кол-во ночей
                items: [
                    {
                        item_list_name: hotel?.name?.ru,       // Название отеля
                        item_list_id: `H${hotel.id}`,       // Префикс “H” (от Hotel) + ID отеля
                        item_name: `${room?.name?.ru}`,     // Название выбранного номера
                        item_id: `R${room.id}`,       // Префикс “R” (от Room) + ID выбранного номера
                    }]
            }
        })
    }

    const roomUrl = `/hotel/room?id=${hotelId}&roomId=${room.id}&${filtersUrl}`

    return (
        <div className={classes.wrap}>
            <div className={classes.inner}>
                <div className={classes.main}>
                    <NavLink
                        to={roomUrl}
                        onClick={() => gaEvent()}
                    >
                        <div className={classes.room_item_wrp_image}>
                            <img className={classes.room_item_image} src={roomImgUrl} alt="room-image" />
                            <div className={classes.room_item_wrp_image_length}>{(room.images && `${room.images.length} фото`)}</div>
                        </div>
                    </NavLink>
                    <NavLink
                        to={roomUrl}
                        onClick={() => gaEvent()}
                    >
                        <Button
                            btnColor="outline_blue"
                            className={classes.room_item_button}
                        >{t("hotelCard.prices.moreAboutRoom")}</Button>
                    </NavLink>
                </div>
                <div className={classes.info}>
                    <NavLink
                        className={classes.clickable}
                        to={roomUrl}
                        onClick={() => gaEvent()}
                    />
                    {
                        <h2 className={classes.room_item_header_title}>{room.name && room.name.ru}</h2>
                    }
                    {room.availability?<p className={classes.room_item_availability}>Осталось номеров:{room.availability}</p>:''}
                    {/*<p className={classes.room_item_header_subtitle}>Осталось 15 номеров</p>*/}

                    <div className={classes.conditions}>
                        <HotelConditions hotelInfo={hotel} roomInfo={room} amenity={amenity}></HotelConditions>
                    </div>
                    {//!isBooking && renderBedSelect()
                    }
                </div>
                <div className={classes.prices}>
                    {tariffs && tariffs.length ? renderTariffs() : null}
                </div>
            </div>
            { /* !noTariff && <div className={classes.room_item_footer}>
                {tariffs && tariffs.length ? renderTariffs() : null}
                </div> */ }
        </div>
    )
}

export default RoomItem