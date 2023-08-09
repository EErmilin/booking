import React,{useState} from "react"
import {useTranslation} from "react-i18next";
import 'react-datepicker/dist/react-datepicker.css';
import classes from "./CalendarDropdown.module.scss";
import 'react-dates/lib/css/_datepicker.css';
import 'react-dates/initialize';
import {DateRangePicker} from 'react-dates'
import moment from "moment"
import 'moment/locale/ru';
import useWindowSize from "../../../hooks/useWindowSize"
import {DEFAULT_VERTICAL_SPACING} from "react-dates/constants"

function CalendarDropdown({
                              className,
                              state,
                              onChange,
                              id
                          }){
    require("./CalendarDropdown.scss")
    const {t} = useTranslation()
    const cls = [classes.calendar]
    if(className)cls.push(className)
    const [focusedInput,setFocusedInput] = useState(null)
    const [isShowCalendarInfo,setCalendarInfo] = useState(false)
    const [showToCurrentDay,setShowToCurrentDay] = useState(true)
    moment.locale("ru")

    const windowSize = useWindowSize()
    const numberOfMonths = windowSize.width >= 750 ? 2 : 1

    const isOutsideRange = day => {
        let dateFrom = state.dateFrom.format("DD-MM-YYYY 23:00")
        return (
            showToCurrentDay?
                day.isBefore(moment("23:00","HH:mm").subtract(24,"hours")):
                (moment(dateFrom,"DD-MM-YYYY").add(60, "days").isAfter(moment().add(1, "year"))?
                day.isBefore(moment("23:00","HH:mm").subtract(24,"hours")):
                day.isBefore(moment(dateFrom,"DD-MM-YYYY HH:mm").subtract(24, "hours")))
            )
            ||  (showToCurrentDay?
                day.isAfter(moment().add(1, "year")):
                (moment(dateFrom,"DD-MM-YYYY").add(60, "days").isAfter(moment().add(1, "year"))?
                    day.isAfter(moment().add(1, "year")):
                    day.isAfter(moment(dateFrom,"DD-MM-YYYY").add(59, "days").add(22, 'hours')))
                );
    }

    return (
        <div
            className={cls.join(' ')}
            onMouseOver={(event)=>{
                let outOfRangeDate = moment(event.target.getAttribute("aria-label")?.split(",")[1],"DD MMMM YYYY")
                let dateFrom = moment(state.dateFrom.format("DD-MM-YYYY 23:00"),"DD-MM-YYYY HH:mm")
                if([...event.target.classList].includes("CalendarDay__blocked_out_of_range") && (outOfRangeDate?dateFrom.add(59,"days")?.isBefore(outOfRangeDate):false)){
                    setCalendarInfo(true)
                }
                else if(![...event.target.classList].includes("CalendarDay__blocked_out_of_range") &&
                    [...event.target.classList].includes("CalendarDay__default")
                ){
                    setCalendarInfo(false)
                }
            }}
        >
            <div className={classes.calendar_header}>
                <span className={classes.calendar_label}>{t('filters.dateFrom')}</span>
                <span className={classes.calendar_label}>{t('filters.dateTo')}</span>
            </div>
            <DateRangePicker
                numberOfMonths={numberOfMonths}
                startDate={state.dateFrom}
                startDateId="dateFrom"
                endDate={state.dateTo}
                endDateId="dateTo"
                onDatesChange={({ startDate, endDate }) => {
                    let startDateFormat = moment(startDate.format("DD-MM-YYYY 23:00"),"DD-MM-YYYY HH:mm")
                    if(startDateFormat.isSameOrAfter(moment().add(1,"year")) && !endDate){
                        onChange({startDate:startDateFormat.subtract(47,"hours"),endDate:startDate})
                    }else if(!endDate){
                        let dateFrom = moment(startDate.format("DD-MM-YYYY"),"DD-MM-YYYY")
                        onChange({startDate,endDate:dateFrom.add(1,"day")})
                    }else if(endDate && endDate.diff(startDate,"days")>=59){
                        let dateFrom = moment(startDate.format("DD-MM-YYYY"),"DD-MM-YYYY")
                        onChange({startDate,endDate:dateFrom.add(59,"days")})
                    }else{
                        onChange({startDate,endDate})
                    }

                    setShowToCurrentDay(false)
                }}
                readOnly
                noBorder={true}
                displayFormat={'dd DD.MM.YY'}
                focusedInput={focusedInput}
                onFocusChange={focusedInput => setFocusedInput(focusedInput)}
                verticalSpacing={0}
                isOutsideRange={isOutsideRange}
                withPortal={windowSize.width < 1200}
                onClose={()=>setShowToCurrentDay(true)}
                renderCalendarInfo={()=>{
                    return (
                        isShowCalendarInfo?<div className="calendar_info_wrap">
                            <div className="calendar_info">
                                <div className="calendar_info_text">Нельзя выбрать период более 60 дней</div>
                            </div>
                        </div>:''
                    )
                }}
            />
        </div>
    )
}

export default CalendarDropdown