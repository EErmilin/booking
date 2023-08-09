import React, {useEffect, useMemo} from "react"
import classes from "./Favorites.module.scss"
import {useTranslation} from "react-i18next";
import DropdownList from "../../../../components/Dropdown/DropdownList/DropdownList";
import {useSelector} from "react-redux";
import HotelCardFavorite from "../../../../components/HotelCardFavorite/HotelCardFavorite";
import heartIcon from "../../../../assets/svg/icons/heart-outline-red.svg"

function Favorites ({}){
    const {t} = useTranslation()
    const favorites = useSelector(state => state.favorites.favorites)

    const emptyFavorites =
        <div className={classes.empty}>
            <div className={classes.empty_title}>В избранном пока ничего нет</div>
            <div className={classes.empty_text}>
                <span>Добавляйте понравившиеся отели с помощью</span>
                <img className={classes.empty_heart} src={heartIcon} alt=""/>
            </div>
        </div>

    const templateCity = useMemo(()=>{
        if (favorites && favorites.length) {
            const formatHotels = favorites.map(elem=>elem.hotel[0])
            const formatRegion = formatHotels && [...new Set(formatHotels.map(elem=>elem.region_id))]
            return formatRegion && formatRegion.map((elem,id)=>{
                const currentRegion = formatHotels.find(region=>region.region_id==elem)
                const templateHotels = formatHotels.filter((hotel)=>elem==hotel.region_id).map((hotel,key)=>{
                    return <HotelCardFavorite
                        hotelInfo={hotel}
                        key={key}
                        isActive={true}
                    />
                })
                return <DropdownList
                    key={id}
                    id={elem.group_id}
                    title={
                        <div className={classes.favorites_dropdown_title}>
                            <p className={classes.favorites_dropdown_title_big}>{currentRegion.region.name.ru}</p>
                            <p className={classes.favorites_dropdown_title_small}>{`${t("favorites.noted")}:${templateHotels.length}`}</p>
                        </div>
                    }
                    titleClassName={classes.favorites_dropdown_wrap}
                    className={classes.favorites_dropdown}>
                    {templateHotels}
                </DropdownList>
            })
        } else {
            return emptyFavorites
        }

    },[favorites])

    return (
        <div className={classes.favorites}>
            <h2 className={classes.favorites_title}>{t('favorites.title')}</h2>
            <div className={classes.favorites_wrap}>
                {templateCity}
            </div>
        </div>
    )
}

export default Favorites