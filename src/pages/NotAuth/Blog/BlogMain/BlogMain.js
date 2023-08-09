import React, { useCallback, useEffect, useState } from "react";
import classes from "./BlogMain.module.scss";
import BlogItem from "../components/BlogItem";
import usePagination from "../../../../hooks/usePagination";
import Button from "../../../../components/UI/btns/Button/Button";
import Breadcrumbs from "../../../../components/Breadcrumbs/Breadcrumbs";
import { useDispatch, useSelector } from "react-redux";
import { getTegs, getTitles } from "../../../../store/actions/blogActions";
import {useParams, useSearchParams} from "react-router-dom";
import { Helmet } from "react-helmet"

function BlogMain() {
    

    const [activeCategorie, setActiveCategorie] = useState(0)
    const titles = useSelector(state => state.blog.titles)
    const tags = useSelector(state => state.blog.tags)
    const _meta = useSelector(state => state.blog._meta)
    const [otherParams,setOtherParams] = useState({})
    const {page} = useParams()
    const [searchParams, setSearchParams] = useSearchParams();

    const searchHandler = (id) => {
        setSearchParams({ id }, { replace: true });
        setActiveCategorie(Number(id))
    }

    const dispatcher = useDispatch()



    const getInfo = useCallback(async (params) => {
        if(searchParams.get("id"))searchHandler(searchParams.get("id"))
        dispatcher(getTegs())
        return dispatcher(getTitles(searchParams.get("id") ?? activeCategorie, +page))
    }, [page])

    /** Пагинация */
    const [pagination] = usePagination({
        otherParams:otherParams,
        limit: _meta && _meta.perPage,
        getInfo: getInfo,
        perPage: _meta && _meta.perPage,
        total: _meta && _meta.totalCount,
    })

    /** Формируем хлебные крошки */
    const BREADCRUMBS = [
        {
            name: 'Блог',
            url: `?${activeCategorie ? `id=${activeCategorie}` : ''}`
        },
    ]

    const setCategorieId = (id) => {
        setActiveCategorie(id)
        dispatcher(getTitles(id))
        searchHandler(id)
    }

    const renderCategories = tags.length && tags.map((item, id) => {
        return <Button
            key={id}
            onClick={() => setCategorieId(item.id)}
            className={[classes.category, activeCategorie === item.id ? classes.category_active : ""].join(" ")}>
            {item.name.ru}
        </Button>
    });

    const heroBackground = require("../../../../assets/image/blog.png")

    const renderBlogItem = titles.length && titles.map((item, id) => {
        return <BlogItem info={item} key={id} activeCategorie={activeCategorie} />
    })

    function getMetaTags() {

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
                }
            ]
        }

        return(
            <Helmet>
                <title>Читайте о путешествиях и секретах незабываемых поездок в блоге Check in</title>
                <meta name="description" content={'Узнайте о секретах путешествий, познакомьтесь с удивительными местами городов России, стройте маршруты к достопримечательностям, открывайте новое с Check in'} />
                <meta property="og:title" content="Читайте о путешествиях и секретах незабываемых поездок в блоге Check in"/>
                <meta property="og:description" content="Узнайте о секретах путешествий, познакомьтесь с удивительными местами городов России, стройте маршруты к достопримечательностям, открывайте новое с Check in"/>
                {heroBackground && <meta property="og:image" content={heroBackground} />}
                <script type="application/ld+json">
                    {JSON.stringify(ldJson)}
                </script>
            </Helmet>
        )
    }

    return (
        <div className={classes.wrap}>
            {getMetaTags()}
            <div className={classes.hero}>
                <div className={classes.hero_inner}>
                    <div className={classes.hero_background}>
                        <img className={classes.hero_background_image} src={heroBackground} />
                    </div>
                    <div className={classes.hero_container}>
                        <Breadcrumbs className={classes.breadcrumbs} breadcrumbs={BREADCRUMBS}></Breadcrumbs>
                        <div className={classes.hero_info}>
                            <h1 className={classes.hero_title}>Блог о путешествиях</h1>
                            <p className={classes.hero_text}>Читайте и узнавайте больше о путешествиях с нами</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={classes.container}>
                <div className={classes.categories}>
                    {renderCategories}
                </div>
                <div className={classes.list}>
                    {renderBlogItem.length && renderBlogItem}
                </div>
            </div>
            <div className={classes.pagination}>
                {pagination}
            </div>
        </div>
    )
}

export default BlogMain