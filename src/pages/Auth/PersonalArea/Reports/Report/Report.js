import React, { useEffect, useMemo, useState } from "react";
import classes from "./Report.module.scss";
import RoomLine from "../../../../../components/UI/line/RoomLine/RoomLine";
import { useTranslation } from "react-i18next";
import { NavLink, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import TransitionContainer from "../../../../../components/UI/other/TransitionContainer/TransitionContainer";
import Button from "../../../../../components/UI/btns/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import {
    confirmReport,
    downloadReportXlsx,
    getHotelInfo,
    getListRoomsPartner,
    getReports,
    getReportsJson
} from "../../../../../store/actions/partnerHotelsActions";
import Preloader from "../../../../../components/Preloader/Preloader";
import CustomSelect from "../../../../../components/UI/areas/CustomeSelect/CustomSelect";
import moment from "moment";
import HelpNotation from "../../../../../components/UI/other/HelpNotation/HelpNotation";



function Report() {
    const { t } = useTranslation()
    const report = useSelector(state => state.objects.report)
    const reports = useSelector(state => state.objects.reports)
    const dispatcher = useDispatch()
    const { id } = useParams()
    const location = useLocation()
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()
    const [updated, setUpdated] = useState(false)

    const optionsMonth = useMemo(() => {
        let arr = []
        for (let i = 1; i < 13; i++) {
            arr.push({
                label: moment(i, "MM").format("MMMM"),
                value: i
            })
        }
        return arr
    }, [])


    const isNewReport = report.summary && report.summary.final_price

    console.log(report)

    const optionsYear = [
        {
            value: 2022,
            label: 2022
        },
        {
            value: 2023,
            label: 2023
        },
    ]

    const [monthFilter, setMonthFilter] = useState(+searchParams.get("month"))
    const [year, setYear] = useState(+searchParams.get("year"))

    useEffect(() => {
        if (monthFilter && year && updated) {
            dispatcher(getReports(report.report.hotel_id, year, monthFilter))
        }
    }, [monthFilter, year])

    useEffect(() => {
        if (reports.length && monthFilter && year && updated) {
            navigate(`/personal-area/reports/${reports[0].id}?month=${monthFilter}&year=${year}`, { sate: location.state })
        }
    }, [reports])

    useEffect(() => {
        if (id) {
            dispatcher(getReportsJson(id))
        }
    }, [id])

    const formateSum = (sum) => {
        return Number(sum).toFixed(2).replace(/\./g, ',')
    }

    const update = async () => {
        await dispatcher(confirmReport(id))
        await dispatcher(getReportsJson(id))
    }

    if (report.data && report.data.length && report.summary) {
        const renderTitles =
            <>
                <div className={classes.data_field}>ID бронирования</div>
                <div className={classes.data_field}>ФИО клиента </div>
                <div className={classes.data_field}> Дата бронирования</div>
                <div className={classes.data_field}>Период проживания
                    <div className={classes.data_period}>
                        <div className={classes.data_period_label}>От</div>
                        <div className={classes.data_period_label}>До</div>
                    </div>
                </div>
                <div className={classes.data_field}>Тип отплаты</div>
                {isNewReport ? <>
                    <div className={classes.data_field}>Базовая стоимость</div>
                    <div className={classes.data_field}>
                        <div className={classes.data_title}><span>Скидка Check in</span>
                           <HelpNotation className={classes.hint_wrp} 
                           classNameHintWrap={classes.hint} 
                           classNameText={classes.hint_text}
                           text={'Скидка при первом бронирование'} /></div>
                        
                    </div>
                    <div className={classes.data_field}>
                        <div className={classes.data_title}><span>Списанные ключи</span>
                        <HelpNotation className={classes.hint_wrp} 
                        classNameText={classes.hint_text}
                        classNameHintWrap={classes.hint} 
                        text={'Ключи (бонусы), списанные клиентом при бронировании'} /></div>
                      
                    </div>
                    <div className={classes.data_field}>
                        <div className={classes.data_title}><span>Итоговая стоимость</span>
                        <HelpNotation className={classes.hint_wrp} 
                        classNameText={classes.hint_text}
                        classNameHintWrap={classes.hint} 
                        text={'Общая стоимость бронирования с учётом списания ключей и применения скидки'} /></div>
                        <span className={classes.data_subtitle}>Оплачено гостем</span>
                    </div>
                    <div className={classes.data_field}>
                        <div className={classes.data_title}>
                            <span>Комиссия Check in</span>
                                <HelpNotation  classNameText={classes.hint_text} 
                                className={classes.hint_wrp} classNameHintWrap={classes.hint} 
                                text={'% комиссии от базовой стоимости с вычетом ключей и скидок на момент бронирования гостем'} /></div>
                      
                    </div>
                </> : <>
                    <div className={classes.data_field}>Стоимость</div>
                    <div className={classes.data_field}>
                        <span>Стоимость</span>
                        <span className={classes.data_subtitle}>С учетом скидки</span>
                    </div>
                    <div className={classes.data_field}>
                        <span>Стоимость</span>
                        <span className={classes.data_subtitle}>С учетом списания ключей</span>
                    </div>
                    <div className={classes.data_field}>Кол-во списанных<br />ключей</div>
                    <div className={classes.data_field}>Комиссия</div>
                </>}
            </>

        const renderReport = report.data.map((elem, id) => {
            const paymentType = () => {
                switch (elem.paymentTypeId) {
                    case 1: {
                        return 'Наличными на месте'
                    } case 2: {
                        return "Оплата картой на месте"
                    } case 3: {
                        return "Выставление счета на месте"
                    } case 4: {
                        return "Онлайн оплата картой"
                    }
                    default: {
                        return 'Через платформу'
                    }
                }
            }

            const dates = elem.bookingPeriod.split(" - ")
            const dateStart = moment(dates[0]).format("DD.MM.YY");
            const dateEnd = moment(dates[1]).format("DD.MM.YY");
            const dayStart = moment(dates[0]).format('dd');
            const dayEnd = moment(dates[1]).format('dd');

            const percent = (Number(elem.commission) / Number(elem.bookingPrice)) * 100
            const percentFinale = elem.partner_fee_percent ? (+elem.partner_fee_percent * 100).toFixed(2) : (percent ? percent.toFixed(2) : 0)

            return <div className={classes.data_report}>
                <div className={[classes.data_field, id === 0 ? classes.data_field_first : ""].join(" ")}>
                    <NavLink to={`/personal-area/reservations/hotel/${report.report.hotel.id}/1`} className={classes.link}>
                        {elem.id}
                    </NavLink>
                </div>
                <div className={classes.data_field}>
                    {elem.fio}
                </div>
                <div className={classes.data_field}>
                    {elem.bookingTimestamp && moment.unix(elem.bookingTimestamp).format("DD.MM.YYYY HH:mm")}
                </div>
                <div className={classes.data_field}>
                    <div className={classes.data_period}>
                        <div className={[classes.data_period_value].join(" ")}>
                            {`${dayStart}, ${dateStart}`}
                        </div>
                        <div className={[classes.data_period_value].join(" ")}>
                            {`${dayEnd}, ${dateEnd}`}
                        </div>
                    </div>
                </div>
                <div className={classes.data_field}>
                    {paymentType()}
                </div>
                <div className={classes.data_field}>
                    {formateSum(elem.bookingPrice)}&nbsp;р.
                </div>
                <div className={classes.data_field}>
                    {formateSum(isNewReport ? elem.booking_discount : elem.booking_discount ? Number(elem.bookingPrice) - elem.booking_discount : Number(elem.bookingPrice))}&nbsp;р.

                </div>
                <div className={classes.data_field}>
                    {isNewReport ? elem.keysSpent : `${formateSum(elem.bookingPriceWithKeys)} р.`}
                </div>
                <div className={classes.data_field}>
                    {isNewReport ? `${Number(elem.bookingPriceWithKeys)}  р.` : elem.keysSpent}
                </div>
                <div className={[classes.data_field, id === 0 ? classes.data_field_last : ""].join(" ")}>
                    <div className={classes.percent_wrap}>
                        <div className={classes.percent_commission}>{formateSum(elem.commission)}&nbsp;р.</div><div className={[classes.percent, Number(percentFinale) ? classes.paid : classes.free].join(' ')}>{Number(percentFinale) ? percentFinale : percentFinale * 100}%</div>
                    </div>
                </div>

            </div>
        })
        const result = <div className={classes.result}>
            <div className={[classes.data_field, classes.data_field_first].join(" ")}></div>
            <div className={classes.data_field}></div>
            <div className={classes.data_field}></div>
            <div className={classes.data_field}></div>
            <div className={classes.data_field}>
                Итого:
            </div>
            <div className={classes.data_field}>
                {formateSum(report.summary.sum)}&nbsp;р.
            </div>
            <div className={classes.data_field}>
                {isNewReport ? `${formateSum(report.summary.booking_discount)} р.` : report.summary.sum_with_discount ? `${formateSum(report.summary.sum_with_discount)} р.` : ''}

            </div>
            <div className={classes.data_field}>
                {isNewReport ? report.summary.spent_points : ` ${formateSum(report.summary.sum_with_points)} р.`}
            </div>
            <div className={classes.data_field}>
                {isNewReport ? `${report.summary.final_price} р.` : report.summary.spent_points}
            </div>
            <div className={[classes.data_field, classes.data_field_last].join(" ")}>
                {formateSum(report.summary.commission)}&nbsp;р.
            </div>
        </div>

        let file;
        const month = moment(report.report.date, 'YYYY.MM.DD').format('MMMM')
        const download = async () => {
            file = await dispatcher(downloadReportXlsx(id))
            if (file) {
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(file.data);
                link.setAttribute('download', `Отчёт за ${month}.xlsx`);
                link.click();
                window.URL.revokeObjectURL(link.href);
            }
        }

        if (!report.data.length) return <Preloader></Preloader>

        return (
            <div className={classes.wrap}>
                <div className={classes.top}>
                    <NavLink className={classes.back} to={`/personal-area/reports?hotelId=${report.report.hotel.id}&year=${year}`} state={location.state}>{t("addNewObjects.secondStep.buttons.back")}</NavLink>
                    <h2 className={classes.title}>{t("personalArea.navBar.reports") + ` (Отель ${report.report.hotel.name.ru})`}</h2>
                    <div className={classes.header}>
                        <div className={classes.header_filters}>
                            <CustomSelect
                                className={classes.header_filters_month}
                                label={t("personalArea.reports.month")}
                                options={optionsMonth}
                                onChange={(event) => {
                                    setUpdated(true)
                                    setMonthFilter(event.value)
                                }}
                                value={optionsMonth.find(elem => elem.value == monthFilter)}
                                defaultValue={optionsMonth[0]}
                            ></CustomSelect>
                            <CustomSelect
                                className={classes.header_filters_year}
                                label={t("personalArea.reports.year")}
                                options={optionsYear}
                                onChange={(event) => {
                                    setUpdated(true)
                                    setYear(event.value)
                                }}
                                value={optionsYear.find(elem => elem.value == year)}
                                defaultValue={optionsYear[0]}
                            ></CustomSelect>
                        </div>

                        {(reports.length || !updated) ? <>
                            <div className={classes.btn}>
                                <Button
                                    disabled={report.report.confirmation}
                                    btnColor="ButtonGreen"
                                    onClick={() => update()}
                                >Подтвердить</Button>
                                <Button
                                    className={classes.download}
                                    btnColor="blueBorderButton"
                                    onClick={() => download()}
                                >Скачать отчет</Button>
                            </div>
                        </> : null}
                    </div>
                </div>
                {(reports.length || !updated) ?
                    <div className={classes.data_container}>
                        <div className={classes.data}>
                                <div className={classes.data_header}>
                                    {renderTitles}
                                </div>
                                {renderReport}
                                {result}
                            </div>
                    </div>:(
                        <div className={classes.empty_wrap}>
                            <div className={classes.empty}>
                                <p className={classes.empty_text}>{t("personalArea.reports.emptyReport")}</p>
                            </div>
                        </div>
                    )}
            </div>
        )
    }
}

export default Report