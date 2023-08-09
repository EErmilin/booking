import React from "react"
import classes from "./Reservations.module.scss";
import { Route, Routes } from "react-router-dom";


function Reservations({ routes }) {



    const templateRoutes = routes.map((elem, id) => {
        return (
            <Route
                key={id}
                path={elem.path}
                element={elem.component}
            />
        )
    })

    return (
        <div className={classes.objects}>
            <Routes>
                {templateRoutes}
            </Routes>
        </div>
    )
}


export default Reservations