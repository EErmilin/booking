import React, {useEffect} from "react"
import classes from "./Objects.module.css";
import {Route, Routes, useNavigate, useParams} from "react-router-dom";


function Objects ({
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
        <div className={classes.objects}>
            <Routes>
                {templateRoutes}
            </Routes>
        </div>
    )
}


export default Objects