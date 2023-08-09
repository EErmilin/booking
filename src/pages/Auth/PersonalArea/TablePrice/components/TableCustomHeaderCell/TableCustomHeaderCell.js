import React from "react"
import classes from "./TableCustomHeaderCell.module.scss"
import moment from "moment"

function TableCustomHeaderCell({text,isStart,isMonth}){

  const dayOfWeek = moment(text).toDate().getDay();
  const isWeekend = (dayOfWeek === 6) || (dayOfWeek  === 0);

  return (isStart?
      <div className={classes.header_default}>
        Тарифы и номера
      </div>:
      (()=>isMonth?<div className={classes.header_month}>
          <p className={classes.header_month_text}>{moment(text).format("MMMM YYYY")}</p>

        </div>:
        <div className={[classes.header, isWeekend ? classes.header_weekend : ''].join(" ")}>
          <p className={classes.header_cell}>{moment(text).format("DD")}</p>
          <p className={classes.header_day}>{moment(text).format("dd")}</p>
        </div>)()
  )
}


export default TableCustomHeaderCell