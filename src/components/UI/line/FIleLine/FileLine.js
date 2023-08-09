import React from "react"
import classes from "./FileLine.module.scss";


function FileLine ({file,onDelete,}){
    const cls = [classes.file_line_icon]
    switch (file.type){
        case "docx":{
            cls.push(classes.docx)
            break;
        }
        case "xls":
        case "xlsx":{
            cls.push(classes.exel)
            break;
        }
        case "pdf":{
            cls.push(classes.pdf)
            break;
        }
        default:{
            cls.push(classes.default)
            break;
        }
    }
    return (
        <div className={classes.file_line}>
            <div className={cls.join(' ')}></div>
            <div className={classes.file_line_txt}>{file.name}</div>
            <div className={classes.file_line_size}>{file.sizeKB} kB</div>
            <div className={classes.file_line_button} onClick={onDelete}></div>
        </div>
    )
}

export default FileLine