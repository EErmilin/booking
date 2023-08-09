import React from "react";
import classes from "./RoomGallery.module.scss";
import {useTranslation} from "react-i18next";
import Fancybox from "../UI/other/Fancybox/Fancybox";

function RoomGallery({
    photos,
    className,
    title
}) {
    const {t} = useTranslation()
    const allClasses = [classes.list];

    if (className) allClasses.push(className);

    const galleryRestTemplate = photos.map((elem, id) => {
        if (id > 6) {
            return (
                <div
                    className={classes.rest_photos}
                    key={id}
                    data-fancybox={'gallery-photo'}
                    data-src={elem.url}
                >
                    <img src={elem.url} className={classes.image} alt=""/>
                </div>
            );
        }
    })

    const galleryTemplate = photos.map((elem, id) => {

        if (id > 6) {
            return false
        }

        if (id === 6 && photos.length > 7) {
            return (
                <div
                    className={classes.item}
                    key={id}
                    data-fancybox={'gallery-photo'}
                    data-src={elem.url}
                >
                    <img src={elem.url} className={classes.image} alt=""/>
                    <div className={classes.rest}>
                        +{photos.slice(6).length - 1} {t("hotelRoom.gallery.restText")}
                    </div>
                </div>
            )
        } else {
            return (
                <div
                    className={classes.item}
                    key={id}
                    data-fancybox={'gallery-photo'}
                    data-src={elem.url}
                >
                    <img src={elem.url} className={classes.image} alt=""/>
                </div>
            )
        }
    })

    return (
        <div className={allClasses.join(" ")}>
            <Fancybox options={{ infinite: false }}>
                {galleryTemplate}
                {galleryRestTemplate}
            </Fancybox>
        </div>
    )
}

export default RoomGallery;