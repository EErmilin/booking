import React, {useState} from "react"
import "./MultipleSelect.scss";
import {Select, Tag} from "antd";
import classes from "../../modals/ModalWithBackground/ModalWithBackground.module.scss";


function MultipleSelect ({
    placeHolder,
    defaultValue,
    onChange,
    options,
    value
}){
    const [placeholderIsVisible,setPlaceholderIsVisible] = useState(true)

    return (
        <Select
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder={placeHolder}
            defaultValue={defaultValue}
            onChange={onChange}
            options={options}
            value={value}
            onClick={()=>setPlaceholderIsVisible(false)}
            onBlur={()=>setPlaceholderIsVisible(true)}
            filterOption={(input, option) => {
                return (
                    option.name.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
            }}
            className={placeholderIsVisible?"multiple_select":"multiple_select_placeholder_hidden"}
        ></Select>
    )
}

export default MultipleSelect