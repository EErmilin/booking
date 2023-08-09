import React from "react"
import numberFormat from "../../../../../../functions/numberFormat";
import {Placemark} from "react-yandex-maps";

function getClusterDomElement(cluster) {
    const overlay = cluster.getOverlaySync();
    const layout = overlay.getLayoutSync();
    return layout.getParentElement();
}

function CustomPlaceMark ({
    hotel,
    id,
    isCatalog,
    mainHotel,
    isCityCenter,
    closeCurrentBalloon,
    setActiveId,
    setActive,
    withPortal,
    mapInstanceRef,
    ymaps,
    setCurrentMapHotel
},
){
    /** Интерполяция иконки */
    const icon = !isCatalog ? `<div class="pointGreen"/>` :
        `<div class="${mainHotel && hotel.id === mainHotel.id && !isCityCenter ? 'pointCenter' : 'point'}">
            ${numberFormat(hotel.sum)}
        </div>`




    const iconSize = !isCatalog ? [40, 50] : [55, 21]

    return <Placemark
        geometry={[hotel.lat, hotel.lon]}
        key={id}
        options={{
            iconLayout: 'default#imageWithContent',
            iconImageHref: '',
            iconImageSize: iconSize,
            iconImageOffset: [-24, -24],
        }
        }

        properties={
            {
                iconContent: icon,
                balloonContent: '<div id="hotelId" class="hotel-card"></div>',
            }}
        onClick={() => {
            if (withPortal) {
                setCurrentMapHotel(null)
                setActive(false)
                setActiveId(hotel.id)
                setTimeout(() => { setActive(true) }, 0)
            } else {
                setTimeout(() => { closeCurrentBalloon() }, 0)
            }
        }}
        instanceRef={(ref) => {
            ref?.events.add('mouseenter', (event) => {
                let child =getClusterDomElement(event.get('target'));
                if(child && child.querySelector('.point')){
                    child.querySelector('.point').classList.add('hover')
                }

                // child
            });
            ref?.events.add('mouseleave', (event) => {
                let child =getClusterDomElement(event.get('target'));
                if(child && child.querySelector('.point')){
                    child.querySelector('.point').classList.remove('hover')
                }

            });
        }}

    />
}


export default CustomPlaceMark

