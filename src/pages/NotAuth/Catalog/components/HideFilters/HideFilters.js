import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import classes from "./HideFilters.module.scss";
import Button from "../../../../../components/UI/btns/Button/Button";


function HideFilters({children,hiddenChildren,length}){
    const [isHide,setIsHide] = useState(false)
    const {t} = useTranslation()
    return (
        <div className={classes.filter_amenity_all_checkboxes}>
            <div className={classes.filter_amenity_shown}>
                {children}
            </div>
            <div className={isHide ? classes.filter_amenity_shown : classes.filter_amenity_hide}>
                {hiddenChildren}
            </div>
            {hiddenChildren.length ? <Button
                onClick={() => setIsHide(!isHide)}
                className={classes.show_all}
            >
                {isHide ? t("filterCatalog.search.hideAllType") : `Показать все ${length} фильтров `}
            </Button> : ''}
        </div>
    )

}


export default HideFilters