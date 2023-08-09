import React from "react"
import classes from "./SettlementConditions.module.scss";
import { useTranslation } from "react-i18next";
import GuestTime from "../GuestTime/GuestTime";

/**
 *
 * @returns {JSX.Element}
 * @constructor
 */
function SettlementConditions({ hotel }) {
    const { t } = useTranslation()
    const { guest_time } = hotel

    const isPaymentInfo = hotel.payment_type_id.find(elem => elem === 1) || hotel.payment_type_id.find(elem => elem === 2) || hotel.payment_type_id.find(elem => elem === 3 || hotel.payment_type_id.find(elem => elem === 4))

    return (
        <div className={classes.wrap}>
            {guest_time &&
                <GuestTime className={classes.guest_time} guest_time={guest_time}></GuestTime>
            }

            {/* <div className={classes.item}>
                <h3 className={[classes.item_title, classes.money].join(' ')}>{t("hotelCard.description.paymentType")}</h3>
                <ul className={[classes.item_list, classes.item_list_check].join(" ")}>
                    <li>Детская люлька</li>
                    <li>Завтрак</li>
                </ul>
            </div> */}

            {isPaymentInfo &&
                <div className={classes.item}>
                    <h3 className={[classes.item_title, classes.card].join(' ')}>{t("hotelCard.description.payment")}</h3>
                    <ul className={[classes.item_list, classes.item_list_check].join(" ")}>
                        {hotel.payment_type_id.find(elem => elem === 2) &&
                            <li><p>Картой в объекте</p></li>
                        }
                        {hotel.payment_type_id.find(elem => elem === 1) &&
                            <li><p>Наличными в объекте</p></li>
                        }
                        {hotel.payment_type_id.find(elem => elem === 3) &&
                            <li><p>Переводом</p></li>
                        }
                        {hotel.payment_type_id.find(elem => elem === 4) &&
                            <li><p>Онлайн оплата картой</p></li>
                        }
                    </ul>
                </div>
            }
        </div>
    )
}

export default SettlementConditions