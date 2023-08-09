import React, {useRef} from "react";
import classes from "./CustomHeaderAnchor.module.scss";

/**
 *
 * @param className
 * @param classNameTitle
 * @param anchorTitles
 * @returns {JSX.Element}
 * @constructor
 */

function CustomHeaderAnchor({
    className,
    classNameTitle,
    anchorTitles=[],
}){
    const activeRef = useRef()
    const cls = [classes.custom_anchor]
    if(className)cls.push(className)

    const clsTitle = [classes.custom_anchor_title]
    if(classNameTitle)clsTitle.push(classNameTitle)

    function handleScroll(event,query){
        activeRef.current.classList.remove(classes.custom_anchor_active)
        activeRef.current = event.target
        activeRef.current.classList.add(classes.custom_anchor_active)
        document.getElementById(`${query}`).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })
    }

    const templateTitles = anchorTitles.map((elem,id)=>{
        const clsActiveTitle = [].concat(clsTitle)
        const props = {
            onClick:(event)=>handleScroll(event,elem.id),
            key:id
        }
        if(id==0){
            clsActiveTitle.push(classes.custom_anchor_active)
            props.ref = activeRef
        }
        props.className = clsActiveTitle.join(' ')
        return (
            <div {...props}>
                {elem.title}
            </div>
        )
    })

    return (
        <div className={cls.join(' ')}>
            {templateTitles}
        </div>
    )
}


export default CustomHeaderAnchor

