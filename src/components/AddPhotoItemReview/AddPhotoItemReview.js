import React from "react"
import classes from "./AddPhotoItemReview.module.scss"


function AddPhotoItemReview({
    image,
    onDelete,

}){
    return (
        <div className={classes.add_photo_item}>
            <div className={classes.add_photo_item_delete} onClick={()=>onDelete()}></div>
            <img className={classes.add_photo_item_image} src={image.url} alt="review image" />
        </div>
    )
}

export default AddPhotoItemReview