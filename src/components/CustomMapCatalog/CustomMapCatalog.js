import React, {useEffect, useState,useRef} from "react"
import classes from "./CustomMapCatalog.module.scss"
import ReactDOM from "react-dom";
import {useNavigate} from "react-router-dom";
import mapService from "../../services/map.service";
import MarkerWithPopup from "./components/MarkerWithPopup/MarkerWithPopup";
import {Clusterer} from "react-yandex-maps";


function CustomMapCatalog ({
    className,
    hotels,
    filters,
    isCatalog = false,
    close,
    cityCenter,
    isCityCenter = false,
    withPortal = true,
    currentMapHotel,
    setCurrentMapHotel,
    isShowMap
}){
    /** Рефка карты */
    const mapRef = useRef()

    /** Обертка реакта от яндекса */
    const [reactify,setReactify] = useState(mapService.getReactify())

    /** Кластеры */
    const [clusterer,setclusterer] = useState(mapService.getClusterer())

    /** Стили */
    const cls = [classes.map]
    if (className) cls.push(className)



    /** Активный балун */
    const [active, setActive] = useState(false)


    /** Центр и зум */
    const [center, setCenter] = React.useState([]);
    const [zoom,setZoom] = useState(filters.region.type==="region"?12:10)

    /** Отель который мы выбрали в каталоге */
    const mainHotel = hotels.length && (currentMapHotel && hotels.find((hotel) => hotel.id === currentMapHotel.id))



    /** Закрываем балун */
    function closeCurrentPopup() {
        if(active){
            setActive(null)
        }
    }

    /** Закрываем балун при смене центра */
    useEffect(() => {
        closeCurrentPopup()
        setCenterFunc()
    }, [cityCenter, hotels, mainHotel])


    /** Проставляем центр в зависимости от отелей */
    const setCenterFunc = () => {
        if(hotels && hotels.length === 1){
            return setCenter([+hotels[0].lon,+hotels[0].lat ])
        }
        if (isCityCenter && cityCenter && cityCenter.length) {
            return setCenter(cityCenter.map(elem=>+elem).reverse())
        }

        if (mainHotel) {
            return setCenter([+mainHotel.lon, +mainHotel.lat])
        }
    }

    /** Стейт карты */
    const mapState = React.useMemo(
        () => ({ center: center, zoom: zoom }),
        [center,zoom]
    );

    /** Меняем зум в зависимости от типа региона область/город */
    useEffect(() => {
        if (filters) {
            if (mapRef.current) {
                if (filters.region.type === "region") {
                    setZoom(12)
                } else {
                    setZoom(10)
                }
            }
        }
    }, [hotels, mapRef,filters])

    /** Загружаем обертку реакта */
    const load = async ()=> {
        const [ymaps3React] = await Promise.all([window.ymaps3.import('@yandex/ymaps3-reactify'),  window.ymaps3.ready]);
        const ymaps3Clusterer = await window.ymaps3.import('@yandex/ymaps3-clusterer@0.0.1');
        const reactify = ymaps3React.reactify.bindTo(React, ReactDOM);
        let data = reactify.module(window.ymaps3);
        setReactify(data)
        setclusterer(ymaps3Clusterer)
        mapService.setReactify(data)
        mapService.setClusterer(ymaps3Clusterer)
    }

    /** Подгружаем карту */
    useEffect(()=>{
        load()
    },[window.ymaps3.ready])


    if(!reactify)return (<div></div>)

    /** Рендерим маркеры */
    const renderPoints = () => {
        let arr = [...hotels]
        if(mainHotel){
            arr = [...hotels, mainHotel]
        }
        return arr.map((hotel, id) => {
            return <MarkerWithPopup
                id={id}
                hotel={hotel}
                isCatalog={isCatalog}
                mainHotel={mainHotel}
                isCityCenter={isCityCenter}
                setActive={setActive}
                closeOtherPopup={active}
                withPortal={withPortal}
                active={active}
                reactify={reactify}
                filters={filters}
            />
        })

    }

    return (
        <div
            style={{ height: isCatalog ? '100vh' : '386px' }}
            onClick={(event)=>{
                if(![...event.target.classList].includes("point")){
                    setActive(null)
                }
            }}
            className={cls.join(' ')}>
            {isCatalog && <div className={classes.map_close} onClick={close} />}
            <reactify.YMap
                style={{ height: isCatalog ? '100vh' : '386px' }}
                location={mapState}
                className={classes.map}
                mode="vector"
            >
                <reactify.YMapDefaultSchemeLayer />
                <reactify.YMapDefaultFeaturesLayer />
                {renderPoints()}
            </reactify.YMap>
        </div>
    )
}


export default CustomMapCatalog