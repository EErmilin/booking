import React from "react"
import classes from "./FooterCatalog.module.scss"
import FooterNavigation from "../../components/FooterNavigation/FooterNavigation";
import SubscribeEmailCatalog from "../../components/SubscribeEmailCatalog/SubscribeEmailCatalog";
import OurPartners from "../../components/OurPartners/OurPartners";


function FooterCatalog(){
    return (
        <div
            className={classes.wrap}
        >
            <SubscribeEmailCatalog></SubscribeEmailCatalog>
            <OurPartners ></OurPartners>
            <FooterNavigation></FooterNavigation>
        </div>
    )
}

export default FooterCatalog