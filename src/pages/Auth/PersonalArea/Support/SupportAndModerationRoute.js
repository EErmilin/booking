import React from "react"
import classes from "./SupportAndModeration.module.scss";
import {Route, Routes} from "react-router-dom";



function SupportAndModerationRoute({routes}){

    const templateRoutes = routes.map((elem,id)=>{
        return (
            <Route
                element={elem.component}
                path={elem.path}
                key={id}
                exact={id}
            >
            </Route>
        )
    })

    return (
        <div>
            <Routes>
                {templateRoutes}
            </Routes>
        </div>
    )
}


export default SupportAndModerationRoute