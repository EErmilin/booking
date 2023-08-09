import React from "react";
import classes from "./PriceRangeSlider.module.scss";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css'
import "./PriceRangeSlider.scss"
function PriceRangeSlider ({
    className,
    onChange,
    onAfterChange,
    ...rest
}){
    const cls = [classes.price_range]
    if(className)cls.push(className)


    return (
        <div className={cls.join(' ')}>
            <Slider
                range={true}
                className="PriceRangeSlider"
                onChange={onChange}
                onAfterChange={onAfterChange}
                {...rest}
            />
        </div>
    )
}

export default PriceRangeSlider