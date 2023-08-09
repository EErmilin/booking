import React from 'react';
import classes from './Checkbox.module.scss';
import HelpNotation from "../../other/HelpNotation/HelpNotation"

const Checkbox = ({ state,
    name,
    contentStyle,
    content,
    text,
    onChange,
    checked,
    className,
    classNameLabel,
    classNameCheckBox,
    valid,
    shouldValidate,
    hint,
    classNameHintText,
    classNameHintWrap,
    disabled = false
}) => {
    const clsText = [classes.checkboxText];
    if (checked && !classNameLabel) {
        clsText.push(classes.blackText);
    }
    if (classNameLabel) {
        clsText.push(classNameLabel);
    }
    const textCheckbox = text && (
        <span className={clsText.join(' ')}>
            {text}
        </span>
    );

    const cls = [classes.checkboxWrap];
    if (className) {
        cls.push(className);
    }
    if (disabled) {
        cls.push(classes.disabled)
    }

    const clsCheckBox = [classes.checkboxFake]
    if (classNameCheckBox) clsCheckBox.push(classNameCheckBox)
    if (!valid && shouldValidate) clsCheckBox.push(classes.checkboxError)

    return (
        <label className={cls.join(' ')}>
            <input
                name={name}
                type="checkbox"
                className={classes.checkboxOriginal}
                onChange={onChange}
                checked={checked}
                disabled={disabled}
            />

            <span className={clsCheckBox.join(" ")} />
            <span className={contentStyle}>{content}</span>
            {textCheckbox}
            {hint && <HelpNotation text={hint} classNameText={classNameHintText} className={classNameHintWrap}/>}
        </label>
    );
};

export default Checkbox;
