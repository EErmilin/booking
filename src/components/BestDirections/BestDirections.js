import React from "react"
import classes from "./BestDirections.module.scss";
import BestDirectionItem from "../BestDirectionItem/BestDirectionItem";
import {useTranslation} from "react-i18next";
import * as _ from 'lodash';
import {NavLink} from "react-router-dom";

function BestDirections({ isDirectionPage = false, directions }) {
    const { t } = useTranslation()
    const templateDirections = directions.map((elem, id) => {
        if (!isDirectionPage) {
            return <BestDirectionItem directionItem={elem} key={id}></BestDirectionItem>
        }
        return (
            elem.is_favorite && <BestDirectionItem directionItem={elem} key={id}></BestDirectionItem>
        )
    })

    directions.sort((a, b) => a.name.ru > b.name.ru ? 1 : -1);

    const renderSortCites = () => {
        const lettersArray = directions.map((item, id) => item.name.ru[0])
        const filteredLettersArray = _.uniq(lettersArray)

        const citesArray = [];

        for (const letter of filteredLettersArray) {
            const carrentLetterAray = []
            for (const direction of directions) {
                if (direction.name.ru[0] === letter) {
                    carrentLetterAray.push(direction)
                }
            }
            citesArray.push(carrentLetterAray)
        }

        return citesArray.length && citesArray.map((elem, id) => {

            const list = elem.map((elem, id) => {
                const url = `/catalog/1?id=${elem.region_id}&name=${elem.name.ru}`
                return (
                    <li key={id}>
                        <NavLink to={url}>{elem.name.ru}</NavLink>
                    </li>

                )
            })
            return <ul key={id}>
                <li>{elem[0].name.ru[0]}</li>
                {list}
            </ul>
        })
    }


    return (
        <div className={classes.wrap}>
            <h2 className={isDirectionPage ? classes.page_title : classes.title}>{t("bestDirection.title")}
            </h2>
            <div className={classes.list}>
                {templateDirections}
            </div>
            {isDirectionPage && <>
                <h2 className={classes.page_subtitle}>Все направления</h2>
                <div className={classes.links}>
                    {renderSortCites()}
                </div>
            </>}
        </div>
    )
}

export default BestDirections