import React from 'react'
import classes from "./WrapperComponent.module.scss";
import HeaderMain from "../../../layot/HeaderMain/HeaderMain";
import HeaderCatalog from "../../../layot/HeaderCatalog/HeaderCatalog";
import FooterMain from "../../../layot/FooterMain/FooterMain";
import FooterCatalog from "../../../layot/FooterCatalog/FooterCatalog";
import { Helmet } from "react-helmet"

/**
 * Тип шапки
 * на выходе список роутов
 * @param headerType
 * @param footerType
 * @param children
 */

function WrapperComponent ({
    headerType,
    footerType,
    children
   }){

    const header = headerType==1
        ?<HeaderMain></HeaderMain>
        :<HeaderCatalog></HeaderCatalog>

    const footer = footerType==1
    ?<FooterMain />
    :<FooterCatalog />

    function getMetaTags() {

        const ldJson = {
            "@context": "https://schema.org",
            "@type": "Organization",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Санкт-Петербург, Россия",
                "postalCode": "191186",
                "streetAddress": "Невский проспект, 32-34"
            },
            "email": "support@checkin.ru",
            "name": "Check in"
        }

        return(
            <Helmet>
                <meta property="og:url" content={window.location.href} />
                <meta property="og:type" content="website" />
                <script type="application/ld+json">
                    {JSON.stringify(ldJson)}
                </script>
            </Helmet>
        )
    }

    return (
        <>
            {getMetaTags()}
            {header}
            <div className={footerType==2?classes.background:''}>
                {children}
                {footer}
            </div>
        </>
    )
}

export default WrapperComponent