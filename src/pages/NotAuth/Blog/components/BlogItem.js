import React from "react";
import {NavLink, useParams} from "react-router-dom";
import classes from "./BlogItem.module.scss";

function BlogItem({ info, activeCategorie }) {
    const {page} = useParams()
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timezone: 'UTC'
    };

    const date = new Date(info.published_at? info.published_at * 1000 :info.updated_at * 1000).toLocaleString("ru", options);
    return (
        <div className={classes.wrap}>

            <div className={classes.image}>
                {info.tags.length ? <div className={classes.category}>{info.tags[0].tag.name.ru}</div> : null}
                <NavLink to={`/blog/article?id=${info.id}${activeCategorie ? `&categorie=${activeCategorie}` : ''}`} state={page} className={classes.clickable}></NavLink>
                <img src={info.preview_image ?? info.main_image} alt="" />
            </div>
            <div className={classes.info}>
                <NavLink to={`/blog/article?id=${info.id}${activeCategorie ? `&categorie=${activeCategorie}` : ''}`} className={classes.clickable}></NavLink>
                <div className={classes.date}>{date}</div>
                <h3 className={classes.title}>{info.preview_title && info.preview_title.ru  ? info.preview_title.ru : info.main_title.ru}</h3>
            </div>
        </div>
    )
}

export default BlogItem