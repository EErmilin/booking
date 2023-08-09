import React, { useEffect, useRef, useState } from "react"
import classes from "./TransitionContainer.module.scss";
import { useSearchParams } from "react-router-dom";

/**
 * Компонент который добавляет плавную анимацию между блоками с тайтлом
 * Если вы используете внутри него блок с состоянием то лучше этот блок обернуть в ReactComponent
 * @param blocks
 * @param className
 * @param classNameTitle
 * @returns {JSX.Element}
 * @constructor
 */
function TransitionContainer({
    blocks,
    className,
    classNameTitle,
    classNameTitlesWrap,
    currentBlock = 0,
    withTitleBorder,
    classNameBody
}) {
    const currentTitle = useRef()
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeBlock, setActiveBlock] = useState(currentBlock)
    const [currentBody, setCurrentBody] = useState(blocks[activeBlock].block)

    useEffect(() => { setCurrentBody(blocks[activeBlock].block) }, [blocks])
    useEffect(() => {
        const id = Number(searchParams.get("id"))
        if (id) {
            setActiveBlock(id)
        }
    }, [])


    /** Стили хидера */
    const clsTitlesWrap = [classes.header, withTitleBorder ? classes.transition_container_border : undefined]
    if (classNameTitlesWrap) clsTitlesWrap.push(classNameTitlesWrap)

    /** Стили боди */
    const clsBody = [classes.transition_container_body]
    if (classNameBody) clsBody.push(classNameBody)

    /** Стили глобальные */
    const cls = [classes.transition_container]
    if (className) cls.push(className)


    /** Стили заголовков */
    const clsTitle = [classes.title]
    if (classNameTitle) clsTitle.push(classNameTitle)

    const templateBlocksTitle = blocks.map((elem, id) => {
        const className = [...clsTitle]

        if (activeBlock == id) {
            className.push(classes.title_active)
        }
        return (
            <div
                className={className.join(' ')}
                key={id}
                ref={id == 0 ? currentTitle : null}

            >
                <div onClick={(event) => slideBlock(event, id)}>{elem.title}</div>
            </div>
        )
    })

    function slideBlock(event, id) {
        setActiveBlock(id)
        currentTitle.current.classList.remove(classes.title_active)
        setCurrentBody(blocks[id].block)
        currentTitle.current = event.target
        currentTitle.current.classList.add(classes.title_active)

    }

    return (
        <div className={cls.join(" ")}>
            <div className={clsTitlesWrap.join(' ')}>
                {templateBlocksTitle}
            </div>
            <div className={clsBody.join(' ')}>
                {currentBody}
            </div>
        </div>
    )
}

export default TransitionContainer