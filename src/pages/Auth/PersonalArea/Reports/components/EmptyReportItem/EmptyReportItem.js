import React from "react"
import classes from "../../Reports.module.scss";
import moment from "moment";


function EmptyReportItem({ report }) {

    return (
        <div className={classes.report_empty}>
            <div className={[classes.report_props, classes.report_empty_name].join(" ")}>Отчёт за {moment(report.date, 'YYYY.MM.DD').format("MMMM")}</div>
            <div>За данный месяц нет завершенных бронирований</div>
        </div >
    )
}

export default EmptyReportItem