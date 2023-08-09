import React, { useEffect, useMemo, useState } from "react";
import classes from "./FAQ.module.scss";
import Button from "../../../components/UI/btns/Button/Button";
import SupportModal from "../../../components/UI/modals/SupportModal/SupportModal";
import DropdownList from "../../../components/Dropdown/DropdownList/DropdownList";
import { useDispatch, useSelector } from "react-redux";
import { getGroupFAQ, getListFAQ } from "../../../store/actions/faqActions";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../../components/Breadcrumbs/Breadcrumbs";
import heroBackground from "../../../assets/image/blog.png";

const catigories = [
    {
        id: 2,
        name: {
            ru: 'Клиентам',
        }
    },
    {
        id: 1,
        name: {
            ru: 'Партнерам',
        }
    },
    {
        id: 3,
        name: {
            ru: 'Общие вопросы',
        }
    }
]

function FAQ() {
    const answers = useSelector(state => state.faq.list)
    const { id } = useParams()
    const [activeCategory, setActiveCategory] = useState(Number(id))
    const [groupTitle, setGroupTitle] = useState('')
    const dispatcher = useDispatch()
    const navigate = useNavigate()

    /** Подтягиваем инфу */
    useEffect(() => {
        setActiveCategory(Number(id))
        dispatcher(getListFAQ({ group_id: id }))
    }, [id])

    const [isShowModal, setIsShowModal] = useState(false)

    const onClickCategory = (elem) => {
        navigate(`/faq/${elem.id}`)
    }

    /** Лист менюшки слева */
    const templateGroup = (() => {
        return catigories.map((elem, key) => {
            return <Button className={[classes.category, activeCategory === elem.id ? classes.category_active : ""].join(" ")}
                onClick={() => onClickCategory(elem)} key={key} >{elem.name && elem.name.ru}</Button>
        })
    })

    /** Ответы */
    const templateAnswers = useMemo(() => {
        return answers && answers.map((elem, id) => {
            return <DropdownList
                key={elem.id}
                title={elem.question.ru}
                className={classes.question_wrap}
                titleActiveClassName={classes.question_title_active}
                titleClassName={classes.question_title}>
                <div dangerouslySetInnerHTML={{ __html: elem.answer.ru }}></div>
            </DropdownList>
        })
    }, [answers])

    const heroBackground = require("../../../assets/image/faq.png")

    /** Формируем хлебные крошки */
    const BREADCRUMBS = [
        {
            name: 'Служба поддержки',
            url: ''
        },
    ]

    return (
        <div className={classes.wrap}>
            {isShowModal && <SupportModal
                isNoAuth={true}
                setIsShow={setIsShowModal} />}
            <div className={classes.hero}>
                <div className={classes.hero_inner}>
                    <div className={classes.hero_background}>
                        <img className={classes.hero_background_image} src={heroBackground} />
                    </div>
                    <div className={classes.hero_container}>
                        <Breadcrumbs className={classes.breadcrumbs} breadcrumbs={BREADCRUMBS}></Breadcrumbs>
                        <div className={classes.hero_info}>
                            <h1 className={classes.hero_title}>Отдел решения вопросов</h1>
                            <p className={classes.hero_text}>Надеемся, что вы на этой странице просто из любопытства. Но если вдруг возникли вопросы, с радостью ответим на них.</p>
                            {/*<div className={classes.hero_bottom}>*/}
                            {/*    <Button*/}
                            {/*        className={classes.btn}*/}
                            {/*        btnColor="ButtonBlue"*/}
                            {/*        onClick={() => setIsShowModal(true)}*/}
                            {/*    >Решить вопрос*/}
                            {/*    </Button>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                </div>
            </div>
            <div className={classes.container}>
                <div className={classes.content}>
                    <div className={classes.categories}>
                        <div className={classes.categories_list}>
                            {templateGroup()}
                        </div>
                    </div>
                    <div className={classes.answers}>
                        {groupTitle && <div className={classes.group_title}>{groupTitle}</div>}
                        <div className={classes.answers_list}>
                            {templateAnswers}
                        </div>
                        {/*<div className={classes.support}>*/}
                        {/*    <div className={classes.support_title}>*/}
                        {/*        Не нашли ответа на свой вопрос?*/}
                        {/*    </div>*/}
                        {/*    <Button btnColor="blueBorderButton"*/}
                        {/*        onClick={() => setIsShowModal(true)}*/}
                        {/*        typeButton={2} >*/}
                        {/*        Написать в техподдержку*/}
                        {/*    </Button>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FAQ