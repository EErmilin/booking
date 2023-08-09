import React,{useRef, useState} from "react";
import classes from "./ExpandBlock.module.scss";
import {useTranslation} from "react-i18next";



function ExpandBlock ({
    className,
    title,
    children
}){
    const cls = [classes.expand_block]
    if(className)cls.push(className)

    const {t} = useTranslation()
    const [isClick,setIsClick] = useState(false)
    const RoomsWrpRef = useRef()


    function expandBlock() {
        if(!isClick){
            const scrollHeight = RoomsWrpRef.current.scrollHeight
            RoomsWrpRef.current.style.height = `${scrollHeight}px`
            RoomsWrpRef.current.style.overflow = `visible`
            setIsClick(!isClick)
        }else{
            RoomsWrpRef.current.style.height = `0`
            RoomsWrpRef.current.style.overflow = `hidden`
            setIsClick(!isClick)
        }
    }


    return (
        <div className={cls.join(" ")}>
            <div className={[classes.expand_block_header,isClick?classes.expand_block_header_active:""].join((' '))} onClick={expandBlock}>
                <div className={classes.expand_block_header_name}>
                    {title}
                </div>
            </div>
            <div className={classes.expand_block_block} ref={RoomsWrpRef}>
                {children}
            </div>
        </div>
    )
}

export default ExpandBlock