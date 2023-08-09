import React, {useEffect} from "react"
import classes from "./ErrorBoundery.module.scss";
import WrapperComponent from "../components/Wrappers/WrapperComponent/WrapperComponent";
import Button from "../components/UI/btns/Button/Button";
import {useNavigate} from "react-router-dom";



function ErrorFallback({error, resetErrorBoundary}) {
    const navigate = useNavigate()
    useEffect(()=>{
        window.onclick = function (){
            return resetErrorBoundary()
        }
    })
    return (
        <div role="alert">
            <WrapperComponent>
                <div className={classes.error_fallback}>
                    <div className={classes.error_fallback_wrap}>
                        <div className={classes.error_fallback_left}>
                            <p className={classes.error_fallback_title}>Error 404</p>
                            <h2 className={classes.error_fallback_title_big}>Ой, что-то пошло не так</h2>
                            <p className={classes.error_fallback_subtitle}>Не расстраивайтесь, попробуйте заново</p>
                            <Button
                                btnColor="ButtonGreen"
                                typeButton={2}
                                onClick={()=> {
                                    resetErrorBoundary()
                                    navigate('/')
                                }}
                            >Вернуться на главную</Button>
                        </div>
                        <div className={classes.error_fallback_right}></div>
                    </div>
                </div>
            </WrapperComponent>
        </div>
    )
}

export default ErrorFallback