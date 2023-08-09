import React from "react"
import classes from "./SortSelect.module.scss";
import "./SortSelect.scss"
import Select from "react-select";


function SortSelect({
    option,
    defaultValue,
    className,
    onChange,
    isSearchable=false,
    ...rest
}){
    const cls = [classes.sort_select]
    if (className)cls.push(className)


    return (
        <div className={cls.join(' ')}>
            <Select
                className="SortSelect"
                classNamePrefix="sort-select"
                options={option}
                defaultValue={defaultValue}
                onChange={onChange}
                isSearchable={ isSearchable }
                components={{DropdownIndicator:()=>(<span className={classes.sort_select_indicator}></span>)}}
                {...rest}
            />
        </div>
    )
}

export default SortSelect