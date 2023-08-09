import React, {useEffect} from "react"
import classes from "./Prices.module.scss";
import {Route, Routes, } from "react-router-dom";


function Prices ({
                      routes
                  }){
    const templateRoutes = routes.map((elem,id)=>{
        return(
            <Route
                key={id}
                path={elem.path}
                element={elem.component}
            />
        )
    })

    return (
        <div className={classes.prices}>
            <Routes>
                {templateRoutes}
            </Routes>
        </div>
    )
}


export default Prices