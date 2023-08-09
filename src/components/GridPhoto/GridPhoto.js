import React, { useState } from "react"
import classes from "./GridPhoto.module.scss";
import { useTranslation } from "react-i18next";
import useToggleVisibility from "../../hooks/useToggleVisibility";
import EmptyModal from "../UI/modals/EmptyModal/EmptyModal";
import ModalGallery from "../UI/modals/ModalGallery/ModalGallery";
import Fancybox from "../UI/other/Fancybox/Fancybox";
import { SwiperSlide } from "swiper/react";
import noImg from "../../assets/image/noHotelImg.png";



function GridPhoto({
    className,
    photos,
    comment,
    viewType = 1,
    title
}) {
    const { t } = useTranslation()
    let Photos = photos.length ? photos : [{ url: noImg }, { url: noImg }, { url: noImg }, { url: noImg }, { url: noImg }, { url: noImg }, { url: noImg }]
    const cls = [viewType === 1 ? classes.grid_photo : classes.grid_photo_v2]
    if (className) cls.push(className)

    const idGallery = `gallery-photo-${Math.random()}`

    const restPhotosTemplate = photos.map((elem, id) => {
        if (viewType == 1) {
            if (id > 6) {
                return (
                    <div
                        className={classes.rest_photos}
                        key={id}
                        data-fancybox={idGallery}
                        data-src={elem.url}
                    >
                        <img src={elem.url} className={classes.image} alt="" />
                    </div>
                );
            }
        } else {
            if (id >= 5) {
                return (
                    <div
                        className={classes.rest_photos}
                        key={id}
                        data-fancybox={idGallery}
                        data-src={elem.url}
                    >
                        <img src={elem.url} className={classes.image} alt="" />
                    </div>
                );
            }
        }
    }).filter(elem => elem)
    let templatePhotos = ''

    if (viewType == 1) {
        templatePhotos = Photos.map((elem, id) => {
            if (id == 0) {
                return (
                    <div
                        className={[classes.picture_wrp, classes.g_1].join(' ')}
                        key={id}
                        data-fancybox={idGallery}
                        data-src={elem.url}
                    >
                        <img src={elem.url}
                            onError={({ currentTarget }) => {
                                currentTarget.onerror = null;
                                currentTarget.src = noImg;
                            }}
                            alt="" className={classes.picture} />
                    </div>
                )
            }
            else if (id === 6 && photos.length > 7) {
                return (
                    <div
                        className={[classes.picture_wrp].join(' ')}
                        key={id}
                        data-fancybox={idGallery}
                        data-src={elem.url}
                    >
                        <img
                            onError={({ currentTarget }) => {
                                currentTarget.onerror = null;
                                currentTarget.src = noImg;
                            }}
                            src={elem.url} alt="" className={classes.picture} />
                        <div className={classes.picture_rest}>
                            +{photos.slice(6).length - 1} {t("hotelCard.body.photos")}
                        </div>
                    </div>
                )
            } else if (id > 6) {
                return false
            } else {
                return (
                    <div
                        className={[classes.picture_wrp_v3].join(' ')}
                        key={id}
                        data-fancybox={idGallery}
                        data-src={elem.url}
                    >
                        <img
                            onError={({ currentTarget }) => {
                                currentTarget.onerror = null;
                                currentTarget.src = noImg;
                            }}
                            src={elem.url} alt="" className={classes.picture} />
                    </div>
                )
            }

        })
    } else {
        templatePhotos = Photos.map((elem, id) => {
            if (id <= 3) {
                return (
                    <div
                        className={[classes.picture_wrp_v2].join(' ')}
                        key={id}
                        data-fancybox={idGallery}
                        data-src={elem.url}
                    >
                        <img onError={({ currentTarget }) => {
                            currentTarget.onerror = null;
                            currentTarget.src = noImg;
                        }} src={elem.url} alt="" className={classes.picture} />
                    </div>
                )
            }
            else if (id === 4) {
                return (
                    <div
                        className={[classes.picture_wrp_v2, classes.picture_wrp_v2_default].join(' ')}
                        key={id}
                        data-fancybox={idGallery}
                        data-src={elem.url}

                    >
                        <span>{t("comment.allPhoto")}</span>
                    </div>
                )
            } else return false
        })
    }
    return (
        <div className={cls.join(' ')}>
            <Fancybox options={{ infinite: false }}>
                {templatePhotos}
                {restPhotosTemplate}
            </Fancybox>
        </div>
    )
}

export default GridPhoto