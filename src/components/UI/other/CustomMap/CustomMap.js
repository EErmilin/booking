import React, { useCallback, useEffect, useRef, useState } from "react"
import classes from "./CustomMap.module.scss";
import { Map } from "react-yandex-maps";
import './HotelCardMap.scss'
import Portal from "./Portal";
import CommentRatingV2 from "../../../CommentRatingV2/CommentRatingV2";
import { useNavigate } from "react-router-dom";
import numberFormat from "../../../../functions/numberFormat";
import CustomPlaceMark from "./components/CustomPlaceMark/CustomPlaceMark";


const noImg = require("../../../../assets/image/noHotelImg.png");



function CustomMap({
    className,
    hotels,
    filters,
    isCatalog = false,
    close,
    cityCenter,
    isCityCenter = false,
    withPortal = true,
    currentMapHotel,
    setCurrentMapHotel
}) {
    const cls = [classes.map]
    if (className) cls.push(className)
    const [isNoImg, setIsNoImg] = useState(false)
    const [active, setActive] = useState(false)
    const [activeId, setActiveId] = useState()
    const imgUrl = '';
    const navigate = useNavigate()
    const [center, setCenter] = React.useState([]);
    const mapRef = useRef()
    const mapState = React.useMemo(
        () => ({ center: center, zoom: 10 }),
        [center]
    );

    const mainHotel = hotels.length && (currentMapHotel && hotels.find((hotel) => hotel.id === currentMapHotel.id) || hotels.find((hotel) => hotel.id === activeId))
    const isShowBaloon = withPortal && active && hotels.length && mainHotel

    useEffect(() => {
        closeCurrentBalloon()
        setActive(false)
        setCenterFunc()
    }, [cityCenter, hotels, mainHotel])

    const setCenterFunc = () => {
        if(hotels && hotels.length === 1){
            return setCenter([hotels[0].lat, hotels[0].lon])
        }
        if (isCityCenter && cityCenter && cityCenter.length) {
            return setCenter(cityCenter)
        }

        if (mainHotel) {
            return setCenter([mainHotel.lat, mainHotel.lon])
        }
    }


    useEffect(() => {
        if (filters) {
            if (mapRef.current) {
                if (filters.region.type === "region") {
                    mapRef.current.setZoom(12)
                } else {
                    mapRef.current.setZoom(10)
                }
            }
        }
    }, [hotels, mapRef])


    const renderPoints = () => {
        if (mainHotel) {
            return [...hotels, mainHotel].map((hotel, id) => {
                return <CustomPlaceMark
                    id={id}
                    hotel={hotel}
                    isCatalog={isCatalog}
                    mainHotel={mainHotel}
                    isCityCenter={isCityCenter}
                    setActive={setActive}
                    setActiveId={setActiveId}
                    closeCurrentBalloon={closeCurrentBalloon}
                    withPortal={withPortal}
                    ymaps={mapRef}
                    setCurrentMapHotel={setCurrentMapHotel}
                />
            })
        } else {
            return hotels.map((hotel, id) => {
                return <CustomPlaceMark
                    id={id}
                    hotel={hotel}
                    isCatalog={isCatalog}
                    mainHotel={mainHotel}
                    isCityCenter={isCityCenter}
                    setActive={setActive}
                    setActiveId={setActiveId}
                    closeCurrentBalloon={closeCurrentBalloon}
                    withPortal={withPortal}
                    ymaps={mapRef}
                    setCurrentMapHotel={setCurrentMapHotel}
                />
            })
        }
    }

    const toHotel = () => {
        if (isCatalog) {
            window.open(`/hotel?id=${activeId}&dateFrom=${filters.dateFrom.format('YYYY-MM-DD')}&dateTo=${filters.dateTo.format('YYYY-MM-DD')}&adults=${filters.adults}&children=0`, '_blank')
        } else {
            closeCurrentBalloon()
        }
    }

    function closeCurrentBalloon(event) {
        let close = document.querySelector('ymaps[class$="-balloon__close-button"]');
        if (close) {
            close.click();
        }
    }



    return (
        <div className={cls.join(' ')} >
            {isCatalog && <div className={classes.map_close} onClick={close} />}
            <Map
                state={mapState}
                style={{ height: isCatalog ? '100vh' : '386px' }}
                defaultState={mapState}
                modules={['geoObject.addon.balloon', 'geoObject.addon.hint', "templateLayoutFactory", "layout.ImageWithContent"]}
                onClick={closeCurrentBalloon}
                instanceRef={mapRef}
                options={{
                    yandexMapDisablePoiInteractivity: true
                }}
            >
                {hotels.length ? renderPoints() : null}
            </Map>
            {isShowBaloon &&
                <Portal getHTMLElementId={'hotelId'}>
                    <div className={classes.map_hotel} onClick={() => toHotel()}>
                        <img className={classes.map_hotel_img} onError={() => setIsNoImg(true)} src={isNoImg ? noImg : imgUrl + mainHotel.main_image} alt="" />
                        <div>
                            <div className={classes.map_hotel_name}>{mainHotel.name.ru}</div>
                            <div>
                            <div className={classes.discount_wrp}>
                                <CommentRatingV2
                                    rating={mainHotel.reviews_rating}
                                    size="small"
                                    commentCount={189}
                                ></CommentRatingV2>
                                    {mainHotel.price !== mainHotel.discount_price &&<p className={classes.discount}>Скидка 10%</p>}
                                </div>
                            </div>
                            {!!mainHotel?.price &&
                                <div className={classes.map_hotel_price}>

                                    <div className={classes.map_hotel_price_title}>Кол-во ночей: {filters.dateTo.diff(filters.dateFrom, "days")}</div>
                                    {mainHotel.price !== mainHotel.discount_price && <h3 className={classes.map_hotel_price_full}>от {numberFormat(mainHotel.sum)} руб.</h3>}
                                    <h3 className={classes.map_hotel_price_value}>от {numberFormat(mainHotel.discount_sum)} руб.</h3>

                                </div>
                            }
                        </div>
                    </div>
                </Portal>}
        </div >
    )
}

export default CustomMap