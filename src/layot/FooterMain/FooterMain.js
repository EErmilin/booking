import React from "react"
import classes from "./FooterMain.module.scss"
import SubscribeEmail from "../../components/SubscribeEmail/SubscribeEmail";
import FooterNavigation from "../../components/FooterNavigation/FooterNavigation";


function FooterMain(){
    return (
        <div
            className={classes.footer_main}
        >
            <SubscribeEmail></SubscribeEmail>
            <FooterNavigation></FooterNavigation>
        </div>
    )
}

export default FooterMain