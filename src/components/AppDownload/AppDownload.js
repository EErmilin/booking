import React, { useEffect } from "react"
import Button from "../UI/btns/Button/Button"
import classes from "./AppDownload.module.scss"
import image from "../../assets/image/app-download-illustration.png"
import { useDispatch, useSelector } from "react-redux"

export default function AppDownload() {
    const url = useSelector(state => state.app.url)

    return(
        <div className={classes.wrap}>
            <div className={classes.picture}>
                <img src={image} alt=""/>
            </div>
            <div className={classes.info}>
                <div className={classes.title}>Теперь доступно для Android</div>
                <Button
                    id={"button_mainpage_guest_b2c_download_app"}
                    className={[classes.btn, "button_mainpage_guest_b2c_download_app"].join(" ")}
                    onClick={() => window.location.href=url}
                    btnColor="blue"
                >Скачать приложение</Button>
            </div>
        </div>
    )
}