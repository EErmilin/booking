import React, {useCallback, useEffect, useMemo, useState} from "react";
import classes from "./AddPhotos.module.scss";
import {useTranslation} from "react-i18next";
import {ReactComponent as AddPhotoIcon} from '../../assets/svg/icons/add-photo.svg'
import AddPhotoItem from "../AddPhotoItem/AddPhotoItem";
import convertFileToData from "../../functions/converFileToData";
import dataURItoBlob from "../../functions/dataUriToBlob";
import {changeUserAvatar} from "../../store/actions/authActions";
import {useDispatch} from "react-redux";
import {DELETE_HOTEL_ERROR_IMAGE} from "../../store/actions/actionsType";
import {deleteErrorImage} from "../../store/actions/partnerHotelsActions";
import EmptyModal from "../UI/modals/EmptyModal/EmptyModal";
import useToggleVisibility from "../../hooks/useToggleVisibility";
import imageCompression from "browser-image-compression";
import Button from "../UI/btns/Button/Button";
import AddPhotoItemReview from "../AddPhotoItemReview/AddPhotoItemReview";



function AddPhotos ({
    mainImage,
    className,
    photos=[],
    onChange,
    id,
    nameField,
    onDelete,
    onDeleteImage,
    mainClick,
    typeImage,
    setMainImage,
    typeInput="place",
    imageType='default'
}){
    const [images,setImages] = useState(photos)
    const [checkedArr,setCheckedArr] = useState([])
    const dispatcher = useDispatch()
    const [showModal,setModal,closeModal] = useToggleVisibility()

    const {t} = useTranslation()
    useEffect(()=>{
        setImages(photos)
    },[photos])
    /** Формируем стили */
    const cls = [classes.add_photo]
    if(className)cls.push(className)


    const templateImages = useMemo(()=>{
        return images.map((elem,id)=>{
            return (
                imageType==="default"?<AddPhotoItem
                    photo={elem}
                    key={id}
                    activeButton={mainImage.id==elem.id}
                    typeImage={typeImage}
                    id={id}
                    checked={checkedArr.find((e=>elem.id==e.id))?true:false}
                    onChange={(event)=>{
                        if(event.target.checked){
                            let oldCheckedArr = [...checkedArr]
                            oldCheckedArr.push(elem)
                            setCheckedArr(oldCheckedArr)
                        }else{
                            let  oldCheckedArr = checkedArr.filter(e=>elem.id !== e.id)
                            setCheckedArr(oldCheckedArr)
                        }
                    }}
                    mainClick={(active)=>mainClick(active,elem)}
                    onDelete={()=>{
                        if(mainImage.id==elem.id){
                            setMainImage&&  setMainImage('')
                        }
                        let deletedObj = images.find((e,key)=>elem.id==e.id)
                        let filteredImage = images.filter((e,key)=> {
                            if (elem.id === e.id){
                                return false
                            }else return  true
                        })
                        setCheckedArr(prevState => prevState.filter(e=>elem.id!==e.id))
                        onDeleteImage(filteredImage)
                        setImages(filteredImage)
                        if(deletedObj.urlToDelete)onDelete(deletedObj)
                    }}
                ></AddPhotoItem>:<AddPhotoItemReview
                    key={id}
                    image={elem}
                    onDelete={(idError)=>{
                        if(idError)dispatcher(deleteErrorImage(idError))
                        let deletedObj = images.find((e,key)=>elem.id==e.id)
                        let filteredImage = images.filter((e,key)=> {
                            if (elem.id === e.id){
                                return false
                            }else return  true
                        })
                        onDeleteImage(filteredImage)
                        setImages(filteredImage)
                        if(deletedObj.urlToDelete)onDelete(deletedObj.urlToDelete)
                    }}
                ></AddPhotoItemReview>
            )
        })
    },[images,mainImage,checkedArr])

    let AddNewPicture = useCallback(async function   (event){
        let arr = [...images]
        for await (let image of event.target.files) {
            try {
                let files = image
                let fileData = await convertFileToData(files)
                const blob = dataURItoBlob(fileData);
                await imageCompression.getExifOrientation(image)
                let compressedImage = await imageCompression(image, {
                    maxSizeMB: 1.5,
                    maxWidthOrHeight:1024,
                    maxIteration:2,
                    useWebWorker:true
                })
                const formData = new FormData();
                formData.append('image', compressedImage, files.name);
                formData.append(nameField, id)
                arr.push({
                    name: files.name,
                    size: files.size,
                    url: fileData,
                    id: Math.random(),
                    formData: formData
                })
                onChange({
                    name: files.name,
                    size: files.size,
                    url: fileData,
                    id: Math.random(),
                    formData: formData
                })

            } catch (e) {

            }

        }
        setImages(arr)
    },[images])

    const deleteImage = useCallback(function(){
        let newArr = []
        images.forEach(elem=>{
            if(mainImage.id==checkedArr.find(e=>e.id==elem.id)?.id){
                setMainImage && setMainImage('')
            }
            if(!checkedArr.find(e=>e.id==elem.id)){
                newArr.push(elem)
            }else{
                if(elem.urlToDelete)onDelete(elem)
            }
        })

        setImages(newArr)
        setCheckedArr([])
        onDeleteImage(newArr)
    },[images,checkedArr])

    const templateModal = showModal && <EmptyModal
        close={true}
        closeModal={closeModal}
        btnCancelClick={()=>setModal(false)}
        width={400}
        background="blue"
        typeModal="withoutBack"
    >
        <p className={classes.add_photo_size}>Размер каждого из загружаемых файлов не должен превышать 2 Мб.</p>
    </EmptyModal>

    return (
        <div className={cls.join(' ')}>
            {typeInput==="place"?<label className={classes.add_photo_photo_bar}>
                <div className={classes.add_photo_photo_bar_file}>
                    <AddPhotoIcon/>
                    <p className={classes.add_photo_photo_bar_txt}>{t("addNewObjects.secondStep.form.uploadPhotos")}</p>
                </div>
                <input
                    onClick={(event) => event.target.value = null}
                    onChange={AddNewPicture}
                    className={classes.add_photo_photo_bar_input}
                    type="file"
                    multiple
                />
            </label>:<div className={classes.add_file_wrap}>
                <Button
                    typeButton={2}
                    className={classes.add_file_button}
                    onClick={() => { }}
                >
                    <input
                        onClick={(event)=>event.target.value = null}
                        type="file"
                        multiple
                        className={classes.add_file_input}
                        onChange={AddNewPicture}
                    />
                    <div className={classes.add_file_clipBtn} />
                    <span>{t("support.file")}</span>
                </Button>
            </div>}
            {checkedArr.length?
                <div className={classes.add_photo_checked}>
                    <p className={classes.add_photo_checked_text}>{`
                        ${t("addNewObjects.secondStep.form.photos.selected")} ${checkedArr.length} ${t("addNewObjects.secondStep.form.photos.of")}
                        ${images.length} ${t("addNewObjects.secondStep.form.photos.photo")}
                    `}</p>
                    <div className={classes.add_photo_checked_btns}>
                        <span className={classes.add_photo_checked_btns_default} onClick={()=>{
                            setCheckedArr(images)
                        }}>{t("addNewObjects.secondStep.form.photos.selectAll")}</span>
                        <span onClick={()=>{
                            setCheckedArr([])
                        }} className={classes.add_photo_checked_btns_default}>{t("addNewObjects.secondStep.form.photos.cancelSelect")}</span>
                        <span onClick={deleteImage} className={classes.add_photo_checked_btns_red}>{t("addNewObjects.secondStep.form.photos.delete")}</span>
                    </div>
                </div>:""
            }
            <div className={typeImage==="default"?classes.add_photo_list:classes.add_photo_listReview}>
                {templateImages}
            </div>
            {templateModal}
        </div>
    )
}

export default AddPhotos