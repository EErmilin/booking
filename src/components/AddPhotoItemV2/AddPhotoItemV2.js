import React from "react";
import classes from "./AddPhotoItemV2.module.scss";
import Checkbox from "../UI/areas/Checkbox/Checkbox";


function AddPhotoItemV2 ({
   photo,
   onDelete,
   id
}){
    return (
        <div className={classes.add_photo_item}>
            <img className={classes.add_photo_item_img} alt={"Photo"} src={photo.url} />
            <span onClick={onDelete} className={classes.add_photo_item_button}></span>
        </div>
    )
}

export default AddPhotoItemV2