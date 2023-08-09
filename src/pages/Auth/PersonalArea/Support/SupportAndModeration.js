import React from "react"
import classes from "./SupportAndModeration.module.scss";
import {useTranslation} from "react-i18next";
import Support from "./Support/Support";
import TransitionContainer from "../../../../components/UI/other/TransitionContainer/TransitionContainer";
import ListModeration from "./ListModeration/ListModeration";


function SupportAndModeration(){
    const {t} = useTranslation()


    const blocks = [
        // {
        //     title:<div className={classes.support_blocks_wrap}>
        //         {t("support.support")}
        //         {/*<span className={classes.support_blocks_notification}>7</span>*/}
        //     </div>,
        //     block:<Support></Support>
        // },
        {
            title:<div className={classes.support_blocks_wrap}>
                {t("support.moderation")}
                {/*<span className={classes.support_blocks_notification}>3</span>*/}
            </div>,
            block: <ListModeration></ListModeration>
        },
    ]

    return (
        <div>
            <h2 className={classes.support_title}>{t("personalArea.navBar.support")}</h2>
            <TransitionContainer
                className={classes.support_container}
                classNameTitle={classes.support_subtitle}
                classNameTitlesWrap={classes.support_wrap}
                blocks={blocks}
            ></TransitionContainer>
        </div>
    )
}

export default SupportAndModeration