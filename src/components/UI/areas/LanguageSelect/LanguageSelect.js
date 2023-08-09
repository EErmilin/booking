import React from "react"
import "./LanguageSelect.scss";
import Select from "react-select";



function LanguageSelect ({
    onChange,
    optionValues,
    defaultValue,
    globeColor,
    className,
    ...rest
}){
    const colorGlobe = globeColor ? "LanguageSelectBlue":"LanguageSelect"
    const cls = [colorGlobe]

    if (className) cls.push(className)

    return (
        <Select
            className={cls.join(" ")}
            classNamePrefix="language-select"
            onChange={onChange}
            options={optionValues}
            defaultValue={defaultValue}
            {...rest}
        />
    )
}

export default LanguageSelect