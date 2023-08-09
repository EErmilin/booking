import React from "react";
import classes from "./SocialMediaItem.module.scss";
import {NavLink} from "react-router-dom";

function SocialMediaItem ({
    typeSocial,
    social,
    type
}){
    const cls = [classes.social_media_item]
    switch (social.type){
        case "vk":{
            cls.push(classes.vk)
            break;
        }
        case "odnoklassniki":{
            cls.push(classes.odnoklassniki)
            break;
        }
        case "rutube":{
            cls.push(classes.rutube)
            break;
        }
        case "telegram":{
            cls.push(classes.telegram)
            break;
        }
        case "tiktok":{
            cls.push(classes.tiktok)
            break;
        }
        default :{
            cls.push(classes.default);
            break;
        }
    }

    return (
        <a href={`${social.href}`} className={cls.join(' ')}>

        </a>
    )
}

export default SocialMediaItem