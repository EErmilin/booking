import React, {useEffect, useMemo, useRef} from "react";
import classes from "./StepByStep.module.scss";
import {NavLink, useParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import {clearErrors} from "../../store/actions/partnerHotelsActions";


function StepByStep ({
    className,
    steps,
    completedSteps,
    edit
}){
    const currentStep = useParams()['*']
    const currentStepRef = useRef()
    const loaderRef = useRef()
    const parentRef = useRef()
    const dispatcher = useDispatch()
    let activePage = currentStep
    if(activePage.includes('/')){
        activePage = activePage.split('/').find(elem=>elem.includes("step"))
    }

    /** Список шагов */
    const templateSteps = useMemo(()=>steps.map((elem,id)=>{
        let completedId = steps.find(elem=>elem.path===activePage).step
        let CurrentStep = currentStep
        const currentId = completedSteps
        // let link  = activePage>=id?elem.url:CurrentStep
        return (
            <div
                name="parent-item"
                onClick={(event)=>{
                        if(!edit)return
                        if(completedSteps<id)return
                        dispatcher(clearErrors())
                        return switchStep(event)
                }}
                className={[classes.step_by_step_item,activePage==elem.path?classes.step_by_step_item_active:''].join(' ')}
                key={id}
            >
                <NavLink className={classes.step_by_step_item_link} to={edit?elem.url:""}>
                    <div
                        name="children"
                        ref={activePage==elem.path?currentStepRef:null}
                        className={[classes.step_by_step_item_circle,completedId>id?classes.step_by_step_item_circle_success:''].join(' ')}
                    >
                         {id+1}
                    </div>
                    <p className={classes.step_by_step_item_label}>{elem.name}</p>
                </NavLink>
            </div>
        )
    }),[activePage,steps])

    /** Формируем стили */
    const cls = [classes.step_by_step]
    if(className)cls.push(className)

    useEffect(()=>{
        if(currentStepRef.current && loaderRef.current && parentRef.current){
            setTimeout(switchStep,500)
        }
    },[activePage])

    function switchStep(event){
        if(event)currentStepRef.current = event.target.closest('[name="parent-item"]').querySelector('[name="children"]')
        let width =(currentStepRef.current.getBoundingClientRect().left - parentRef.current.getBoundingClientRect().left)+12
        loaderRef.current.style.width = `${width}px`
    }



    return(
        <div className={cls.join(' ')}>
            <div className={classes.step_by_step_loader} ref={loaderRef}></div>
            <div className={classes.step_by_step_bar} ref={parentRef}>
                {templateSteps}
            </div>
        </div>
    )
}

export default StepByStep