import React, {useState} from "react"
import classes from "./AddFile.module.scss";
import Button from "../UI/btns/Button/Button";
import {useTranslation} from "react-i18next";
import convertFileToData from "../../functions/converFileToData";
import dataURItoBlob from "../../functions/dataUriToBlob";
import AddPhotoItemV2 from "../AddPhotoItemV2/AddPhotoItemV2";
import FileLine from "../UI/line/FIleLine/FileLine";


function AddFile ({state,onChange,nameField,id,noFile}){
    const {t} = useTranslation()
    const [allFiles,setFiles] = useState(state)

    async function  AddNewFile (event){
        let files = event.target.files[0]
        let oldState = [...allFiles]
        if(files.type.includes('image')){
            let fileData = await convertFileToData(files)
            const blob = dataURItoBlob(fileData);
            const formData = new FormData();
            formData.append('image', blob, files.name);
            formData.append(nameField,id)
            oldState.push({
                name:files.name,
                size:files.size,
                sizeKB:Math.round(files.size/1024),
                url:fileData,
                id:Math.random(),
                formData:formData,
                type:files.type
            })
        }else{
            if(!noFile){
                const type = files.name.split('.').slice(-1)[0]
                let fileData = await convertFileToData(files,true)
                const blob = dataURItoBlob(fileData,files.type);
                const formData = new FormData();
                formData.append('file', blob, files.name);
                formData.append(nameField,id)
                oldState.push({
                    name:files.name,
                    size:files.size,
                    sizeKB:Math.round(files.size/1024),
                    url:fileData,
                    id:Math.random(),
                    formData:formData,
                    type:type
                })
            }
        }
        
        setFiles(oldState)
        onChange(oldState.map(elem=>elem.formData))
    }

    const templateImages = allFiles.filter(elem=>elem.type.includes('image')).map((elem,id)=>{
        return (
            <AddPhotoItemV2
                photo={elem}
                key={id}
                id={id}
                onDelete={()=>{
                    let arr = allFiles.filter(e=>e.id!==elem.id)
                    setFiles(arr)
                }}
            ></AddPhotoItemV2>
        )
    })
    const templateFiles = allFiles.filter(elem=>!elem.type.includes('image')).map((elem,id)=>{
        return (
            <FileLine
                file={elem}
                key={id}
                id={id}
                onDelete={()=>{
                    let arr = allFiles.filter(e=>e.id!==elem.id)
                    setFiles(arr)
                }}
            ></FileLine>
        )
    })

    return (
        <div>
            <div className={classes.add_file_wrap}>
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
                        onChange={AddNewFile}
                    />
                    <div className={classes.add_file_clipBtn} />
                    <span>{t("support.file")}</span>
                </Button>
                {allFiles.length?<div className={classes.add_file_text}>{t("addFile.text")}</div>:''}
            </div>
            <div className={classes.add_file_images}>
                {templateImages}
            </div>
            <div className={classes.add_file_files}>
                {templateFiles}
            </div>
        </div>
    )
}

export default AddFile