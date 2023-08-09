import React, {useState} from "react";
import classes from "./HotelWithdrawn.module.scss";
import { useNavigate, useSearchParams} from "react-router-dom";
import Button from "../../../components/UI/btns/Button/Button";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {getCityNameById, getSearch} from "../../../store/actions/catalogActions";

function HotelWithdrawn() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [region,setRegion] = useState({})
    const lastRequests = JSON.parse(localStorage.getItem("lastRequests")) || [];
    const city = useSelector(state => state.catalog.city)
    const hotel = lastRequests.filter((hotel) => hotel.id === searchParams.get("id"))[0]
    const navigate = useNavigate()
    const dispatcher = useDispatch()


    useEffect(() => {
        if (hotel && hotel.region) {
            dispatcher(getCityNameById(hotel.region))
        }else {
            (async ()=>{
                let name = await dispatcher(getSearch("Москва"))
                setRegion(name.find((elem)=>elem.type==="region"))
            })()
        }
    }, [])

    return (
        <div className={classes.error_fallback}>
            <div className={classes.error_fallback_wrap}>
                <div className={classes.error_fallback_left}>
                    <h2 className={classes.error_fallback_title_big}>Объект временно</h2>
                    <h2 className={classes.error_fallback_title_big}>недоступен</h2>
                    <p className={classes.error_fallback_subtitle}>Объект находится на модерации или временно закрыт владельцем, посмотрите другие предложения</p>
                    <Button
                        btnColor="ButtonGreen"
                        typeButton={2}
                        onClick={() => {
                            if(hotel){
                                navigate(`/catalog/1?id=${hotel.region}&name=${city}`)
                            }else{
                                navigate(`/catalog/1?id=${region.id}&name=${region.name}`)
                            }
                        }}
                    >Перейти в каталог</Button>
                </div>
                <div className={classes.error_fallback_right}></div>
            </div>
        </div>
    )
}

export default HotelWithdrawn