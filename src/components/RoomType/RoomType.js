import { useTranslation } from "react-i18next";
import classes from "./RoomType.module.scss";
import FilterCatalogRooms from "../FilterCatalogRooms";
import RoomItemPrice from "../RoomItemPrice";
import CustomRadio from "../UI/areas/CustomRadio/CustomRadio";

function RoomType({ room, hotel }) {
    const { t } = useTranslation();
    const { tariffs } = room

    const renderTariffs = () => {
        return tariffs.map((item, id) => {
            return (
                <div className={classes.list} key={id}>
                    <RoomItemPrice
                        room={room}
                        hotel={hotel}
                        tariff={item}
                        breakfastTitle={t("hotelCard.prices.breakfastNonInPrice")}
                        className={classes.room_wrap}
                    />
                </div>
            )
        })
    }

    return (
        <div className={classes.wrapper}>
            {/*<div className={classes.filter}>
                <FilterCatalogRooms buttonName={t("hotelRoom.tariff.filterButtonName")} />
            </div>*/}
            <div className={classes.body}>
                {/*<div className={classes.header}>*/}
                {/*    <div className={classes.message}>*/}
                {/*        <ErrorMessage error={"На нашем сайте осталось только 5 номеров данного типа"} />*/}
                {/*    </div>*/}
                {/*<CustomRadio*/}
                {/*   label={t("hotelCard.prices.selectTypeBed")}*/}
                {/*  listRadio={[{ text: t("hotelCard.prices.singleBed") }, { text: t("hotelCard.prices.doubleBed") }]}*/}
                {/*  name={"bed-type"}*/}
                {/*></CustomRadio>*/}

                {/*</div>*/}
                {renderTariffs()}
            </div>
        </div>
    )
}

export default RoomType;
