import React, { useEffect } from "react"
import classes from "../../Reports.module.scss";
import { useTranslation } from "react-i18next";
import MenuLine from "../../../../../../components/UI/line/Mnuline/MenuLine";
import {NavLink, useLocation, useNavigate, useSearchParams} from "react-router-dom";
import { useDispatch } from "react-redux";
import {
    confirmReport,
    deleteHotel,
    downloadActXlsx, downloadBillXlsx,
    downloadReportXlsx,
    revokeHotel
} from "../../../../../../store/actions/partnerHotelsActions";
import moment from "moment";
import useToggleVisibility from "../../../../../../hooks/useToggleVisibility";
import TwoButtonModal from "../../../../../../components/UI/modals/TwoButtonModal/TwoButtonModal";
import StatusHotel from "../../../../../../components/StatusHotel/StatusHotel";
import Button from "../../../../../../components/UI/btns/Button/Button";
import fileDownload from "js-file-download"

function ReportItem({ report, update,hotelId, }) {
    const {t} = useTranslation()
    const dispatcher = useDispatch()
    const [searchParams, setSearchParams] = useSearchParams();
    const year = searchParams.get("year")

    const handleConfirmReport = () => {
        dispatcher(confirmReport(report.id))
        update()
    }

    const month = moment(report.date, 'YYYY.MM.DD').format('MMMM')
    const status = report.confirmation ? 'confirmReport' : 'noConfirmReport'

    let file;

    const download = async () => {
        file = await dispatcher(downloadReportXlsx(report.id))

        if (file) {
            fileDownload(file.data, `Отчёт за ${month}.xlsx`)
        }
    }

    const downloadAct = async () => {
        file = await dispatcher(downloadActXlsx(report.id))

        if (file) {
            fileDownload(file.data, `Акт за ${month}.pdf`)
        }
    }

    const downloadBill = async () => {
        file = await dispatcher(downloadBillXlsx(report.id))

        if (file) {
            fileDownload(file.data, `Счет за ${month}.pdf`)
        }
    }

    return (
        <div className={classes.report}>
            <div className={classes.report_name}>
                <NavLink to={`/personal-area/reports/${report.id}?month=${moment(report.date, 'YYYY.MM.DD').format('MM')}&year=${year}`} state={{hotelId:hotelId.value,year:year}} className={[classes.report_props, classes.report_props_name].join(" ")}>Отчёт за {month}</NavLink>
                <div className={classes.download} onClick={() => download()}></div>
            </div>
            <div className={[classes.report_props_small, classes.report_props_status].join(" ")}>
                <StatusHotel status={status} />
            </div>
            <div className={[classes.report_props_small, classes.report_date].join(' ')}>{moment.unix(report.updated_at).format("DD.MM.YY HH:mm")}</div>
            <div className={classes.report_confirm_wrap}>
                <Button
                    disabled={report.confirmation}
                    btnColor="ButtonGreen"
                    onClick={() => handleConfirmReport()}
                    className={classes.report_confirm_btn}
                >Подтвердить</Button>
                <div className={classes.download_small} onClick={() => download()}></div>
            </div>
            <div className={classes.report_wrap}>
                <div className={classes.report_status_download}>
                    <div className={report.act_file_path?classes.report_status_confirmed:classes.report_status_not_confirmed}>
                        {t("personalArea.reports.checkUpper")}
                    </div>
                    {report.act_file_path?<div className={classes.download} onClick={() => downloadBill()}></div>:<div className={classes.download_block}></div>}
                </div>
                <div className={classes.report_status_download}>
                    <div className={report.bill_file_path?classes.report_status_confirmed:classes.report_status_not_confirmed}>
                        { t("personalArea.reports.actUpper")}
                    </div>
                    {report.bill_file_path?<div className={classes.download} onClick={() => downloadAct()}></div>:<div className={classes.download_block}></div>}
                </div>
            </div>


        </div >
    )
}

export default ReportItem