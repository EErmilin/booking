import React from "react"
import classes from "./FirstVisitorModal.module.scss"
import picture from "../../../../assets/image/getting_started_popup_picture.png"

export default function FirstVisitorModal({closeModal, btnCancelClick}) {

    return (
        <div className={classes.wrap}>
            <div className={classes.close} onClick={() => {btnCancelClick()}}></div>
            <div className={classes.picture}>
                <img src={picture} alt=""/>
            </div>
            <h3 className={classes.title}>Рады видеть вас на Check in!</h3>
            <div className={classes.text}>
                <p>Мы — новый сервис бронирования объектов. Здесь найдете проверенные объекты. Важно предупредить: так как мы новый сервис, на сайте могут встретиться баги/ошибки. Не пугайтесь. Скорее всего мы уже знаем о них и исправляем. Но если вы сообщите нам о них в чате — будем благодарны)</p>
            </div>
            <div className={classes.bottom}>
                <div
                    className={classes.button}
                    onClick={() => {
                        btnCancelClick()
                    }}
                >Вперед!</div>
            </div>
        </div>
    )
}