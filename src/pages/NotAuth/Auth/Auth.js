import React from "react"
import classes from "./Auth.module.scss";
import {Route,Routes,Navigate} from "react-router-dom";



function Auth ({
    routes
}){
    const templateRoutes = routes.map(({path='',exact,component},id)=>{
        return (
            <Route
                key={id}
                path={path}
                exact={exact}
                element={component}
            ></Route>
        )
    })

    return (
        <div className={classes.auth_form}>
            <Routes>
                {templateRoutes}
            </Routes>
        </div>
    )
}

export default Auth