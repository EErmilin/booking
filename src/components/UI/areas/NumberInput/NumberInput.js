import React from "react";
import classes from "./NumberInput.module.scss";

function NumberInput ({
    className,
    value,
    onChange,
    minValue = 1,
    maxValue = 10,
    disabled,
}){
    const cls = [classes.number_input]
    if(className)cls.push(className)

    return (
        <div className={cls.join(' ')}>
            <div
              onClick={() => {
              const newValue = Number(value) - 1
              if (newValue < minValue) return false
              return onChange(newValue)
              }}
              className={[classes.number_input_incr, value === minValue && classes.number_input_disable].join(" ")}
            >-</div>
            <input
                className={classes.number_input_input}
                value={value}
                onBlur={()=>{
                    if (value < minValue){
                        onChange(1)
                    }
                    if (value > maxValue)
                      onChange(maxValue)
                }}
                onChange={(event)=> {
                    onChange(event.target.value.replace(/\D/, ''))
            }}
                type="text"
                inputMode={'numeric'}
                disabled={disabled}
            />
            <div
                onClick={()=>{
                  const newValue = Number(value) + 1
                  if (newValue > maxValue) return false
                  return onChange(newValue)
                }}
                className={[classes.number_input_incr, value === maxValue && classes.number_input_disable].join(" ")}>+</div>
        </div>
    )
}

export default NumberInput