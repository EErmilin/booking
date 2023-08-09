import React from 'react';
import classes from './Preloader.module.scss';
import DarkBackground from "../UI/modals/DarkBackground/DarkBackground";
import { useSelector } from "react-redux";

const Preloader = () => {
    // const preloaderVisible = useSelector(state => state.router.preloaderVisible)
    
    // if (preloaderVisible) {
    //
    // }
    return (
        <div className={classes.loader}>loading</div>
    );
};

export default Preloader;
