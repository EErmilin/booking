import React, {useState} from "react";
import classes from "./AddPhotoV2.module.scss";
import Button from "../UI/btns/Button/Button";
import {useTranslation} from "react-i18next";
import convertFileToData from "../../functions/converFileToData";


function AddPhotoV2 ({
    className
}){
    const {t} = useTranslation()
    const cls = [classes.add_photo]
    if(className)cls.push(className)
    const [photos,setPhotos] = useState([])

    async function  AddNewPicture (event){
        let files = event.target.files[0]
        let fileData = await convertFileToData(files)
        let oldState = [...photos]
        if(!fileData || (photos.length==5))return
        oldState.push({
            name:files.name,
            size:files.size,
            url:fileData,
            id:Math.random()
        })
        setPhotos(oldState)
    }


    function deleteImage(id){
        let newArr = [...photos]
        newArr = newArr.filter((elem,key)=>key!==id)
        setPhotos(newArr)
    }


    const templatePhotos = photos.map((elem,id)=>{
        return(
            <div className={classes.add_photo_item} key={id}>
                <div
                    className={classes.add_photo_item_icon}
                    onClick={()=>deleteImage(id)}
                ></div>
                <img src={elem.url} name={elem.name} alt="Photo" />
            </div>
        )
    })

    return (
        <div className={cls.join(' ')}>
            <div className={classes.add_photo_wrap}>
                <Button
                    typeButton={2}
                    className={classes.add_photo_button}
                >
                    <div className={classes.add_photo_button_wrp}>
                        <p className={classes.add_photo_button_text}>{t("addPhoto.btn")}</p>
                        <input
                            onClick={(event)=>event.target.value = null}
                            onChange={AddNewPicture}
                            className={classes.add_photo_button_input}
                            type="file"
                            multiple
                        />
                    </div>
                </Button>
                {photos.length?<p className={classes.add_photo_wrap_text}>{t("addPhoto.help")}</p>:''}
            </div>
            <div className={classes.add_photo_photos}>
                {templatePhotos}
            </div>
        </div>
    )
}

export default AddPhotoV2