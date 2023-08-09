import React from "react"
import classes from "./PriceToPrice.module.scss"

function PriceToPrice({
    priceMin,
    priceMax,
    onChange,
    className
}) {
    const cls = [classes.price_to_price]
    if (className) cls.push(className)

    function handleChange(type, value) {
        if (value >= 0) {
            if (type === 'priceMin' && +value <= priceMax) {
                onChange({
                    priceMin: value,
                    priceMax: priceMax
                })
            } else if (type === 'priceMax' && +value >= priceMin) {
                onChange({
                    priceMin: priceMin,
                    priceMax: value
                })
            }
        }
    }

    return (
        <div className={cls.join(' ')}>
            <div className={classes.price_to_price_wrp}>
                <input type="text" pattern="[0-9]" className={classes.price_to_price_input} value={priceMin} onChange={(e) => handleChange('priceMin', e.target.value.replace(/[^0-9]/g, ""))} />
            </div>
            <div className={classes.price_to_price_wrp}>
                <input type="text" pattern="[0-9]" className={classes.price_to_price_input} value={priceMax} onChange={(e) => handleChange('priceMax', e.target.value.replace(/[^0-9]/g, ""))} />
            </div>
        </div>
    )
}

export default PriceToPrice