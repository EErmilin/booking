import React from "react";
import classes from "./BookInfo.module.scss";
import moment from "moment";


function BookInfo({
    className,
    bookInfo,
    isHotelPage
}) {
    /** Формируем стили */
    const cls = [classes.book_info]
    if (className) cls.push(className)

    if (bookInfo.booking) {
        return (
            <div className={cls.join(' ')}>
                {!isHotelPage && <p className={[classes.book_info_text, classes.book_info_text_big, classes.mg_17].join(' ')}>
                    {bookInfo.booking.hotel_name && bookInfo.booking.hotel_name.ru}
                </p>}
                <p className={[classes.book_info_line, classes.mg_23].join(' ')}>
                    <span className={[classes.book_info_icon, classes.book_info_beds].join(' ')}></span>
                    <span className={classes.book_info_text}>{bookInfo.booking.room_name && bookInfo.booking.room_name.ru}</span>
                </p>
                {!isHotelPage && <p className={[classes.book_info_line, classes.mg_17].join(' ')}>
                    <span className={[classes.book_info_icon, classes.book_info_guest].join(' ')}></span>
                    <span className={classes.book_info_text}>{bookInfo.booking && bookInfo.booking.additional_guests.length + 1} взрослых { }</span>
                </p>}
                <p className={[classes.book_info_line, classes.mg_0].join(' ')}>
                    <span className={[classes.book_info_icon, classes.book_info_calendar].join(' ')}></span>
                    <span className={classes.book_info_text}>
                        <p className={classes.book_info_city}>{bookInfo.hotel && bookInfo.hotel.region && bookInfo.hotel.region.name && bookInfo.hotel.region.name.ru}</p>
                        {bookInfo.booking.arrival_date && bookInfo.booking.departure_date && isHotelPage?
                        <span className={classes.book_info_date}>{moment(bookInfo.booking.arrival_date).format("MMMM YYYY")}</span>:
                            <span className={classes.book_info_text}>{moment(bookInfo.booking.arrival_date).format("DD.MM.YY")}-{moment(bookInfo.booking.departure_date).format("DD.MM.YY")}</span>}
                    </span>
                </p>
            </div>
        )
    }
}

export default BookInfo