import React from "react";
import classes from "./AddPhotoItem.module.scss";
import Checkbox from "../UI/areas/Checkbox/Checkbox";
import MainImageButton from "../UI/btns/MainImageButton/MainImageButton";


function AddPhotoItem ({
    photo,
    onChange,
    onDelete,
    checked,
    id,
    mainClick,
    activeButton,
    typeImage,
}){
    return (
        <div className={classes.add_photo_item}>
            {photo.errors?"":<MainImageButton
                type={typeImage}
                activeButton={activeButton}
                onClick={mainClick}
                className={classes.add_photo_item_main_button}
            ></MainImageButton>}
            <img className={classes.add_photo_item_img} alt={"Photo"} src={photo.url} />
            {photo.errors?<div className={classes.add_photo_item_error}>
                <span onClick={()=>onDelete(photo.id)} className={classes.add_photo_item_error_delete}></span>
                <div className={classes.add_photo_item_error_icon}></div>
                <div className={classes.add_photo_item_error_text}>{photo.errors.image}</div>
            </div>:''}
            {!photo.errors &&
                <div className={classes.add_photo_item_wrap}>
                    <div className={classes.add_photo_item_footer}>
                        <div className={classes.add_photo_item_footer_wrap}>
                            <div className={classes.add_photo_item_footer_background}></div>
                            <div className={classes.add_photo_item_footer_flex}>
                                <Checkbox
                                    onChange={onChange}
                                    name={id}
                                    checked={checked}
                                ></Checkbox>
                                <span onClick={()=>onDelete()} className={classes.add_photo_item_footer_button}></span>
                            </div>
                        </div>
                    </div>
                </div>
                }
        </div>
    )
}

export default AddPhotoItem