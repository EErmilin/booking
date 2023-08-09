import React from "react"
import classes from "./CatalogRooms.module.scss"
import FilterCatalogRooms from "../FilterCatalogRooms/FilterCatalogRooms";
import { useTranslation } from "react-i18next";
import RoomItem from "../RoomItem/RoomItem";
import CatalogHotelSliderItem from "../CatalogHotelSliderItem/CatalogHotelSliderItem";
import EmptyModal from "../UI/modals/EmptyModal/EmptyModal";
import useToggleVisibility from "../../hooks/useToggleVisibility";
import EmptyRooms from "./components/EmptyRooms/EmptyRooms";
import { useSelector } from "react-redux";

function CatalogRooms({
    hotel,
    similarHotels,
    filters,
}) {

    const { t } = useTranslation()
    const { rooms, id } = hotel
    const [modalRoom, setModalRoom, closeModalRoom] = useToggleVisibility()
    const isLoadingSimilar = useSelector(state => state.catalog.isLoadingSimilar)
    const renderRooms = rooms.map((room, key) => {
        return <RoomItem room={room} hotel={hotel} setModal={setModalRoom} key={key} hotelId={id} filters={filters} />
    })

    const listSameHotels = similarHotels.length && similarHotels.map((elem, id) => {
        return <CatalogHotelSliderItem hotel={elem} key={id} typeView={2} filters={filters}></CatalogHotelSliderItem>
    })

    const sideBar = <div className={classes.catalog_rooms_same_offer}>
        <h2 className={isLoadingSimilar?classes.catalog_rooms_title_loading:classes.catalog_rooms_title}>{t("hotelCard.prices.sameOffer")}</h2>
        <div className={classes.catalog_rooms_same_offer}>
            {listSameHotels}
        </div>
    </div>

    const templateModalRoomNotAvailible = modalRoom && <EmptyModal
        close={true}
        closeModal={(event) => {
            // navigate(`/hotel?id=${hotel.id}&dateFrom=${dateFrom.format("YYYY-MM-DD")}&dateTo=${dateTo.format("YYYY-MM-DD")}&regionId=${hotel.region_id}`)
            return setModalRoom(event)
        }}
        btnCancelClick={() => setModalRoom(false)}
        width={400}
        background="blue"
        typeModal={"withoutBack"}
    >
        <h2 className={classes.booking_room}>{t("lockRoom.roomNotFound")}</h2>
        {/*<Button*/}
        {/*    typeButton={2}*/}
        {/*    btnColor="ButtonGreen"*/}
        {/*    onClick={() => navigate(`/hotel?id=${hotel.id}&dateFrom=${dateFrom.format("YYYY-MM-DD")}&dateTo=${dateTo.format("YYYY-MM-DD")}&regionId=${hotel.region_id}`)}*/}
        {/*>{t("lockRoom.btn")}</Button>*/}
    </EmptyModal>

    return (
        <>
            <div className={classes.catalog_rooms}>
                {!filters.edit && <FilterCatalogRooms
                    className={classes.catalog_rooms_filters}
                    buttonName={t("hotelCard.prices.btn")}
                    startFilters={filters}
                ></FilterCatalogRooms>}
                {hotel.rooms.length ? <div className={classes.catalog_rooms_list}>
                        <div className={classes.catalog_rooms_list_rooms}>
                            {rooms && renderRooms}
                        </div>
                        {similarHotels.length ? sideBar : null}
                    </div> :
                    <div className={classes.noFind}>
                        {hotel.contiguousDates && hotel.contiguousDates.length ?
                            <EmptyRooms dates={hotel.contiguousDates} filters={filters}></EmptyRooms>:
                            <div className={classes.noFind_message}> <h2>Отсутствуют свободные номера!</h2>
                                <p>Измените даты для поиска или посмотрите другие варианты размещения. </p>
                            </div>
                        }
                        {similarHotels.length ? sideBar : null}
                    </div>}
            </div>
            {templateModalRoomNotAvailible}
        </>
    )
}

export default CatalogRooms