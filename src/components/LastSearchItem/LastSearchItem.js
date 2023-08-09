import React from "react";
import classes from "./LastSearchItem.module.scss";
import { useNavigate } from "react-router-dom";

function LastSearchItem({
    lastRequest,
    filters
}) {
    const clsType = [classes.icon]
    const navigate = useNavigate()

    if (lastRequest) {
        let title = ''

        switch (lastRequest.type) {
            case "hotel": {
                clsType.push(classes.hotel)
                title = lastRequest.name ?? lastRequest.label
                break;
            }
            default: {
                clsType.push(classes.city)
                title = lastRequest.name ?? lastRequest.label
                break;
            }
        }

        const onClick = () => {
            if (lastRequest.type === 'hotel') {
                if (filters.dateTo) {
                    navigate(`/hotel?id=${lastRequest.id}&adults=${filters.adults}&children=${filters.children}&dateFrom=${filters.dateFrom.format('YYYY-MM-DD')}&dateTo=${filters.dateTo.format('YYYY-MM-DD')}`)
                }
            } else {
                if(lastRequest.type === "city-region"){
                    navigate(`catalog/1?city_region_id=${lastRequest.id}&type=${lastRequest.type}`)
                }else{
                    navigate(`catalog/1?id=${lastRequest.id}&type=${lastRequest.type}`)
                }
            }
        }

        return (
            <div className={classes.wrap} onClick={() => onClick()}>
                <div className={clsType.join(' ')}></div>
                <div className={classes.label}>
                    <p className={classes.title}>{title}</p>
                </div>
            </div>
        )
    }
}

export default LastSearchItem