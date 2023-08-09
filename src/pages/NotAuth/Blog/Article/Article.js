import React, {useEffect, useState} from "react";

import classes from "./Article.module.scss";
import Breadcrumbs from "../../../../components/Breadcrumbs/Breadcrumbs";
import {NavLink, useLocation} from "react-router-dom";
import { getTitle } from "../../../../store/actions/blogActions";
import { useDispatch, useSelector } from "react-redux";
import Preloader from "../../../../components/Preloader/Preloader";
import * as ReactRouterDOM from "react-router-dom";
import {
    OKIcon, OKShareButton, TelegramIcon, TelegramShareButton,
    VKIcon,
    VKShareButton
} from "react-share";
import { Helmet } from "react-helmet"
import siteLogo from '../../../../assets/svg/logo.svg'
import moment from "moment"



function Article() {
    const location = useLocation()
    const title = useSelector(state => state.blog.title)
    const dispatcher = useDispatch()
    const useSearchParams = ReactRouterDOM.useSearchParams;
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        dispatcher(getTitle(searchParams.get("id")))
    }, [])

    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timezone: 'UTC'
    };

    if (title) {
        const date = new Date(title.published_at? title.published_at * 1000 :title.updated_at * 1000).toLocaleString("ru", options);
        const id = searchParams.get("categorie");
        const BREADCRUMBS = [
            {
                name: 'Блог',
                url: '/blog'
            },

            {
                name: title.main_title.ru,
                url: `?id=${searchParams.get("id")}${id ? `&categorie=${id}` : ''}`
            },
        ]

        function getMetaTags(data) {

            const published_time = moment(data.published_at * 1000).format('YYYY-MM-DD')
            const modified_time = moment(data.updated_at * 1000).format('YYYY-MM-DD')

            const ldJson = {
                "@context": "https://schema.org/",
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Главная",
                        "item": "https://checkin.ru/"
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Статьи о путешествиях",
                        "item": "https://checkin.ru/blog"
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": `${data.main_title.ru}`
                    }
                ]
            }

            const articleLdJson = {
                "@context": "https://schema.org",
                "@type": "NewsArticle",
                "url": window.location.href,
                "publisher":{
                    "@type": "Organization",
                    "name": "Check in",
                    "logo": `${siteLogo}`
                },
                "headline": `${data.main_title.ru}`,
                "mainEntityOfPage": window.location.href,
                "articleBody": `${data.text}`,
                "image":[
                    data?.main_image ? data.main_image : siteLogo
                ],
                "datePublished": `${published_time}`
            }

            return(
                <Helmet>
                    <title>{data.main_title.ru}</title>
                    <meta name="description" content={`Статья в блоге Check in - ${data.main_title.ru}`} />
                    <meta property="og:type" content={"article"} />
                    <meta property="og:title" content={data.main_title.ru}/>
                    <meta property="og:description" content={`Статья в блоге Check in - ${data.main_title.ru}`}/>
                    <meta property="og:url" content={window.location.href} />
                    {data.main_image && <meta property="og:image" content={data.main_image} />}
                    <meta property="og:site_name" content="Checkin" />
                    <meta property="og:locale" content="ru_RU" />
                    <meta property="og:section" content="Блог" />
                    <meta property="og:published_time" content={published_time} />
                    <meta property="og:modified_time" content={modified_time} />
                    <script type="application/ld+json">
                        {JSON.stringify(ldJson)}
                    </script>
                    <script type="application/ld+json">
                        {JSON.stringify(articleLdJson)}
                    </script>
                </Helmet>
            )
        }

        return (
            <div className={classes.wrap}>
                {getMetaTags(title)}
                <Breadcrumbs breadcrumbs={BREADCRUMBS}></Breadcrumbs>
                <div className={classes.back}>
                    <NavLink
                        className={classes.back_btn}
                        to={`/blog/${location.state?location.state:'1'}?${id ? `&id=${id}` : ''}`}>Назад
                    </NavLink>
                </div>
                <div className={classes.hero}>
                    <div className={classes.hero_background}>
                        <img src={title.main_image} alt="" />
                    </div>
                    <div className={classes.hero_inner}>
                        <div className={classes.hero_container}>
                            {title.tags.length ? <div className={classes.category}>{title.tags[0].tag.name.ru}</div> : null}
                            <h1 className={classes.title}>{title.main_title.ru}</h1>
                            <p className={classes.date}>{date}</p>
                        </div>
                    </div>
                </div>
                <div className={classes.container}>
                    <div className={classes.content} dangerouslySetInnerHTML={{ __html: title.text }} />
                    <div className={classes.share}>
                        <div className={classes.share_text}>Поделиться:</div>
                        <div>
                        <VKShareButton
                            url={String(window.location)}>
                            <div className={classes.vk} />
                        </VKShareButton>
                        <TelegramShareButton
                            url={String(window.location)}
                        >
                            <div className={classes.tg} />
                        </TelegramShareButton>
                        <OKShareButton
                            url={String(window.location)}
                        >
                            <div className={classes.ok} />

                        </OKShareButton>
                        </div>

                    </div>
                </div>

            </div>
        )
    } else {
        return <Preloader />
    }
}

export default Article