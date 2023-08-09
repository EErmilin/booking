import React, { useMemo, useEffect, useState } from "react"
import classes from "./Reports.module.scss";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import ReportItem from "./components/ReportItem/ReportItem";
import { getHotelListPartner, getReports } from "../../../../store/actions/partnerHotelsActions";
import CustomSelect from "../../../../components/UI/areas/CustomeSelect/CustomSelect";
import { useSearchParams } from "react-router-dom";
import moment from "moment";
import EmptyReportItem from "./components/EmptyReportItem/EmptyReportItem";


function ListReports() {
    const { t } = useTranslation()
    const dispatcher = useDispatch()
    const reports = useSelector(state => state.objects.reports)
    const listHotel = useSelector(state => state.objects.hotels)
    const [searchParams, setSearchParams] = useSearchParams();
    const hotelId = Number(searchParams.get("hotelId"))
    const Year = Number(searchParams.get("year"))

    const optionsObjects = listHotel.length ? listHotel.map((item) => {
        return {
            label: item.name.ru,
            value: item.id
        }
    }):[]

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

    const getCurrentYear = () => optionsYear.find(option => new Date().getFullYear() === option.value)

    const currentHotel = optionsObjects.length && optionsObjects.find((option) => option.value === hotelId)
    const [hotel, setHotel] = useState(currentHotel ?? optionsObjects[0])
    const currentYear = optionsYear.length && optionsYear.find((option) => option.value === Year)
    const [year, setYear] = useState(currentYear ?? getCurrentYear())

    useEffect(() => {
        dispatcher(getHotelListPartner({"per-page":1000}))
    }, [])

    const update = () => {
        if (hotel) {
            dispatcher(getReports(hotel.value, year.value))
        }
    }

    useEffect(() => { // TODO: Летят лишнии запросы
        if (listHotel.length) {
            dispatcher(getReports(hotelId?hotelId:listHotel[0].id, year.value))
        }
        if (!!hotelId) {
            dispatcher(getReports(hotelId, year.value))
        }
    }, [listHotel, hotelId])

    useEffect(() => {
        hotel && setSearchParams({ hotelId: hotel.value, year: year.value }, { replace: true });
        update()
    }, [hotel, year])

    const templateReports = useMemo(() => {
            let maxMonth = +moment().format("MM") - 1? +moment().format("MM") - 1: +moment().format("MM")
            let arrEmptyMonth = []
            for (let i = 1; i <= maxMonth; i++) {
                if(!reports.find(elem=>+moment(elem.date, 'YYYY.MM.DD').format('MM')==i)){
                    arrEmptyMonth.push({
                        empty:true,
                        date:moment(i,"MM").format('YYYY.MM.DD')
                    })
                }
            }
            let allMonth = [...arrEmptyMonth,...reports].sort((a, b) => +moment(a.date, 'YYYY.MM.DD').format('MM') - +moment(b.date, 'YYYY.MM.DD').format('MM'))
            return allMonth.map((elem, id) => {
                if(elem.empty){
                    return <EmptyReportItem report={elem} key={id} />
                }else {
                    return <ReportItem hotelId={hotel} year={year} report={elem} key={id} update={update} />

                }
            })
    }, [reports,hotelId,year])


    const titles = [
        t("personalArea.reports.name"),
        t("personalArea.reports.status"),
        t("personalArea.reports.date"),
        t("personalArea.reports.check"),
        t("personalArea.reports.act")
    ]



    const renderTitles = titles.map((elem, id) => {
        return <div
            key={id}
            className={classes.report_props}
        >{t(elem)}
            <div className={classes.sort} />
        </div>
    })

    if (listHotel.length) {
        return (
            <div className={classes.reports}>
                <h2 className={classes.reports_title}>{t("personalArea.navBar.reports")}</h2>
                <div className={classes.report_area}>
                    <div className={classes.filters}>
                        <CustomSelect
                            className={classes.filters_object}
                            label={t("personalArea.reports.object")}
                            options={optionsObjects}
                            defaultValue={currentHotel ?? optionsObjects[0]}
                            onChange={(value) => {
                                setHotel(value)
                            }}
                        ></CustomSelect>
                        <CustomSelect
                            className={classes.filters_year}
                            label={t("personalArea.reports.year")}
                            options={optionsYear}
                            defaultValue={currentYear ?? getCurrentYear()}
                            onChange={(value) => {
                                setYear(value)
                            }}
                        ></CustomSelect>
                    </div>
                        <>
                            <div className={classes.reports_props_titles}>
                                {renderTitles}
                            </div>
                            {templateReports}
                        </>

                        {/*<div className={classes.empty}>*/}
                        {/*    <h2 className={classes.empty_title}>*/}
                        {/*        {t('personalArea.reports.emptyTitle')}*/}
                        {/*    </h2>*/}
                        {/*</div>*/}

                </div>
            </div>
        )
    } else {
        return (
            <div className={classes.empty_wrap}>
                <h2 className={classes.reports_title}>{t("personalArea.navBar.reports")}</h2>
                <div className={classes.empty}>
                    <p className={classes.empty_text}>{t("personalArea.reports.empty")}</p>
                </div>
            </div>
        )
    }
}

export default ListReports