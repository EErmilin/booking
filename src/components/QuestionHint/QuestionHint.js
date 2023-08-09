import React from "react"
import classes from "./QuestionHint.module.scss"


function QuestionHint({
    count
}){
    return (
        <div className={classes.question_hint}>
            <div className={classes.question_hint_icon}></div>
            <div className={classes.question_hint_hint}>У вас осталось еще {count} незавершенных бронирований</div>
        </div>
    )
}

export default QuestionHint