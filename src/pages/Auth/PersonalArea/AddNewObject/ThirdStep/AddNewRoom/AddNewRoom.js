import React, {useCallback, useEffect, useMemo, useState} from 'react'
import classes from "./AddNewRoom.module.scss"
import {NavLink, useNavigate, useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import Input from "../../../../../../components/UI/areas/Input/Input";
import CustomSelect from "../../../../../../components/UI/areas/CustomeSelect/CustomSelect";
import CustomTextArea from "../../../../../../components/UI/areas/CustomTextArea/CustomTextArea";
import Service from "../Service/Service";
import AddPhotos from "../../../../../../components/AddPhotos/AddPhotos";
import FormHelp from "../../../../../../components/FormHelp/FormHelp";
import TariffItem from "../../../../../../components/TarifItem/TarifItem";
import Button from "../../../../../../components/UI/btns/Button/Button";
import BedLine from "../../../../../../components/UI/line/BedLine/BedLine";
import {useDispatch, useSelector} from "react-redux";
import {object, string} from "yup";
import {useFormik} from "formik";
import {
    clearHotelError, clearHotelImage, clearRoomInfo,
    createHotelRoom,
    createRoomTariff,
    deleteRoomBed,
    deleteRoomImage,
    deleteRoomTariff,
    editBed,
    editHotelRoom,
    editRoomTariff, getBedTypes, getListTariff,
    getRoomInfo,
    getServices, setMainImageHotel, setMainImageRoomSuccess,
    uploadHotelImage,
    uploadRoomImage,
    сreateBed
} from "../../../../../../store/actions/partnerHotelsActions";
import useToggleVisibility from "../../../../../../hooks/useToggleVisibility";
import EmptyModal from "../../../../../../components/UI/modals/EmptyModal/EmptyModal";
import ErrorMessage from "../../../../../../components/UI/message/ErrorMessage";
import Checkbox from "../../../../../../components/UI/areas/Checkbox/Checkbox";
import {fakeRoomType, fakeSmokeOption, guestOption, kitchenOptions, roomCapacity} from "./constants/optionsForSelect";





function AddNewRoom ({edit,editHotel}){
    const {t} = useTranslation()
    /** Редирект */
    const navigate= useNavigate()
    /** Тариффы */
    const tariffs = useSelector(state => state.objects.tariff)
    const optionsTariff = useMemo(()=>{
        return tariffs? tariffs.map(elem=>({
            label:<div>{elem.name && elem.name.ru} <span className={classes.add_new_room_tariff_breakfast}>({elem.mealType?elem.mealType.name.ru:"Стандарт"})</span></div>,
            value:elem.id,
            tariff:elem
        })):[]
    },[tariffs])
    /** id Отеля */
    const idHotel = useParams()['id']
    /** Состояния комнат */
    const roomsInfo = useSelector(state=>state.objects.roomsInfo)
    const amenity = useSelector(state => state.objects.amenity)
    const errors = useSelector(state => state.objects.errors)
    const errorsImage = useSelector(state => state.objects.errorsImage)
    const bedTypes = useSelector(state => state.objects.bedTypes)
    const [mainImage,setMainImage] = useState('')
    const [modal,setShowModal,closeModal] = useToggleVisibility()
    /** id диспатчер */
    const dispatcher = useDispatch()
    /** id Комнаты */
    const {roomId} = useParams()
    /** Картинки */
    const [saveImage,setSaveImage] = useState([])
    const [basePrice,setBasePrice] = useState({})




    useEffect(()=>{
        if(roomsInfo.images && edit){
            setSaveImage(roomsInfo.images.map(elem=>{
                return{
                    urlToDelete:elem,
                    url:elem,
                    id:Math.random(),
                }
            }))
        }
    },[roomsInfo.id])



    useEffect(()=>{
        let main_image = saveImage.find(elem=>elem.url===roomsInfo.main_image)
        if(main_image){
            setMainImage(main_image)
        }
    },[roomsInfo.id,saveImage])


    /** Подтягиваем все нужные поля */
    useEffect(()=>{
       dispatcher(clearRoomInfo())
       dispatcher(getListTariff(idHotel))
       dispatcher(getServices({group_id:8,'per-page':1000,expand:"group"}))
        dispatcher(getBedTypes())
        if(edit && roomId){
            dispatcher(getRoomInfo(roomId))
        }
    },[])

    /** Состояние и темплейт тарифа */
    const [beds,setBeds] = useState([])

    useEffect(()=>{
        if(editHotel){
            setBeds(roomsInfo.beds? roomsInfo.beds.map(elem=>({
                ...elem,
                deleteId:Math.random()
            })):[])
        }
    },[roomsInfo.beds,roomsInfo.tariffs])


    function handleChangeBed(id,newState){
        let newObj = [...beds]
        newObj.splice(id,1,newState)
        setBeds(newObj)
    }
    /** Методы для добавления и удаления кровати */
    function addNewBed(){
        const newArr = [...beds]
        newArr.push({bed_type_id:2,bed_count:1,deleteId:Math.random()})
        setBeds(newArr)
    }
    function deleteBed(deleteId,bedId){
        let newArr = [...beds]
        if(bedId)dispatcher(deleteRoomBed(bedId))
        newArr = newArr.filter((elem)=>(elem.deleteId !== deleteId))
        setBeds(newArr)
    }


    const templateBeds = useMemo(()=>{
        return beds.map((elem,id)=>{
            return (
                <BedLine
                    bed={elem}
                    key={id}
                    id={id}
                    bedTypes={bedTypes}
                    onChange={(id,value)=>handleChangeBed(id,value)}
                    onDelete={deleteBed}
                ></BedLine>
            )
        })
    },[beds, bedTypes])
    /** Начальные значения */
    const initialValues = useMemo(()=>{
        if(edit && Object.keys(roomsInfo).length){
            return {
                allotment:roomsInfo.allotment,
                type_id:roomsInfo.type_id,
                name:roomsInfo.name.ru,
                description:roomsInfo.description.ru,
                area:roomsInfo.area,
                smoking_type_id:roomsInfo.smoking_type_id,
                guest_count:roomsInfo.guest_count ?? 1,
                amenity_ids:roomsInfo.amenity_ids,
                base_price:roomsInfo.base_price?roomsInfo.base_price:{},
                tariff_ids:roomsInfo.tariff_ids?roomsInfo.tariff_ids:[],
                more_than_six:roomsInfo.more_than_six,
                room_capacity:roomsInfo.room_capacity,
                kitchen:roomsInfo.kitchen,
                bed_capacity:roomsInfo.bed_capacity,
                additional_bed_capacity:roomsInfo.additional_bed_capacity
            };
        }else {
            return {
                allotment:'',
                type_id:1,
                name:"",
                description:"",
                area:"",
                smoking_type_id:"",
                guest_count:1,
                amenity_ids:[],
                base_price:{},
                tariff_ids:[''],
                more_than_six:false,
                room_capacity:null,
                kitchen:null,
                bed_capacity:'',
                additional_bed_capacity:''
            };
        }
    },[roomsInfo])
    /** Схема валидации */
    const validationSchema = useMemo(
        () =>
            object().shape({
                type_id:string().required(),
            }),
        []
    );

    /** Стейт полей и правила */
    const {
        values,
        handleChange,
        handleSubmit,
        touched,
    } = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {

        },
        enableReinitialize:true
    });
    useEffect(()=>{
        setBasePrice(roomsInfo.base_price)
    },[roomsInfo.base_price])
    /** Очищаем ошибки и изменяем состояние */
    function ClearErrorAndChange (field,value){
        if(errors[field]){
            dispatcher(clearHotelError(field))
        }
        handleChange({target: {name: field, value: value}})
    }


    /** Формирует дату до нужного вида */
    function formatData (roomInfo){
        let prices = {}
        roomInfo.tariff_ids.forEach(elem => {
            if(!elem)return
            if(!basePrice)return;
            if(basePrice[elem]){
                prices[elem] = basePrice[elem]
            }
        })
        return {
            ...roomInfo,
            name:{
                ru:roomInfo.name
            },
            description:{
                ru:roomInfo.description
            },
            base_price: prices,
            main_image:saveImage.length?(mainImage && mainImage.url.includes("data:image/"))?'':(mainImage.url?mainImage.url:''):"",
            tariff_ids:roomInfo.tariff_ids.filter(elem=>elem),
            images:null
        }
    }



    /** Цена за ночь */
    const templatePriceTariff = useMemo(()=>{
        const filteredTariffs = tariffs?tariffs.filter(elem=>{
            return values.tariff_ids.includes(elem.id)
        }):[]
        return filteredTariffs.map((elem,id)=>{
            return <TariffItem
                price={basePrice && basePrice[elem.id]}
                guestCount={values.guest_count}
                onChange={(objPrice)=> {
                    setBasePrice((prevState)=>({...prevState,...objPrice}))
                }}
                tariff={elem} id={id}
                key={id}
            ></TariffItem>
        })
    },[values.tariff_ids,tariffs,values.guest_count])

    /** Список тарифов */
    function deleteTariff(id){
        const newArr = values.tariff_ids.filter((elem,i)=>(elem!==id))
        handleChange({target:{name:"tariff_ids",value:newArr}})
    }
    function addNewTariff(){
        const newArr = [...values.tariff_ids]
        newArr.push('')
        handleChange({target:{name:"tariff_ids",value:newArr}})

    }
    function handleChangeTariff(id,newState){
        let tariffs = [...values.tariff_ids]
        tariffs.splice(id,1,newState)
        handleChange({target:{name:"tariff_ids",value:tariffs}})
    }
    const templateTariff = useMemo(()=>values.tariff_ids.map((elem,id)=>(
        <div className={classes.add_new_room_tariff_wrap}>
            <CustomSelect
                label={t("addNewObjects.secondStep.form.selectTariff")}
                typeClsInput="field"
                options={optionsTariff}
                className={classes.add_new_room_tariff}
                name="tariff_ids"
                value={optionsTariff.find(e=>e.value==elem)}
                onChange={(value)=>{
                    return handleChangeTariff(id,value.value)
                }}
            ></CustomSelect>
            <div onClick={()=>deleteTariff(elem)} className={"bed_line_icon"}></div>
        </div>

        //
    )),[values.tariff_ids,errors.tariff_ids,optionsTariff])

    /** Сохраняем номер */
    async function save(){
        let idRoom =''
        let isSaveImage = true
        if(roomsInfo.id){
            idRoom = await dispatcher(editHotelRoom(roomsInfo.id,formatData(values),+idHotel))
        }else{
            idRoom = await dispatcher(createHotelRoom(formatData(values),+idHotel))
        }

        if(!idRoom)return
        // if(tariff.length){
        //     for (let tariffElement of tariff) {
        //         if(tariffElement.id){
        //             await dispatcher(editRoomTariff({...tariffElement,room_id:roomsInfo.id},tariffElement.id))
        //         }else{
        //             await dispatcher(createRoomTariff({...tariffElement,room_id:idRoom}))
        //         }
        //     }
        // }
        if(beds.length){
            for (let bedsElement of beds) {
                if(bedsElement.id){
                    await dispatcher(editBed({...bedsElement,room_id:roomsInfo.id},bedsElement.id))
                }
                else await dispatcher(сreateBed({...bedsElement,room_id:idRoom}))
            }
        }

        if(saveImage.length){
            let errorImage = []
            for (let image of saveImage) {
                if(!image.errors && image.formData instanceof FormData){
                    image.formData.append("room_id",idRoom)
                    let imageUrl = await dispatcher(uploadRoomImage(image,roomId))
                    if(mainImage.id===image.id){
                        await dispatcher(editHotelRoom(idRoom, {main_image:imageUrl.data},+idHotel))
                    }
                    if(!imageUrl.isUpload){
                        errorImage.push(imageUrl)
                        setSaveImage(prevState => prevState.filter(elem=>elem.id !== imageUrl.id))
                        isSaveImage = false
                    }else {
                        let arr = [...saveImage]
                        let index = arr.findIndex((e=>e.id==imageUrl.id))
                        arr[index] = imageUrl
                        setSaveImage(arr)
                    }
               }
            }
            if(errorImage.length)setSaveImage(prevState => [...prevState,...errorImage])
        }
        if(!mainImage && !saveImage.length){
            await dispatcher(editHotelRoom(idRoom, {main_image:""},+idHotel))
        }
        if(isSaveImage){
            dispatcher(clearHotelImage())
            navigate(`/edit-object/${idHotel}/third-step`)
            setBasePrice({})

        }
    }



    async function setImageMain(active,image){
        if(!active){
            if(image.urlToDelete){
                await dispatcher(editHotelRoom(roomsInfo.id, {main_image:image.urlToDelete},+idHotel))
                setMainImage(image)
            }else{
                setMainImage(image)
            }
        }else{
            if(image.urlToDelete){
                await dispatcher(editHotelRoom(roomsInfo.id, {main_image:saveImage[0].url},+idHotel))
                setMainImage(saveImage[0])
            }else{
                setMainImage(saveImage[0])
            }
        }
    }


    useEffect(()=>{
        if(tariffs && !tariffs.length){
            setShowModal(true)
        }
    },[tariffs])

    const templateModal = modal && <EmptyModal
        close={true}
        closeModal={closeModal}
        btnCancelClick={setShowModal}
        width={372}
        background="blue"
        typeModal="withoutBack"
    >
        <h2 className={classes.add_new_room_form_title}>Отсутствуют тарифы</h2>
        <p>Для редактирования номерного фонда должен быть создан и добавлен хотя бы один тариф и указаны базовые стоимости.</p>
        <div className={classes.add_new_room_form_wrap}>
            <Button
                typeButton={2}
                btnColor="ButtonWhite"
                className={classes.add_new_room_buttons_cancel}
                onClick={()=>navigate(`/edit-object/${idHotel}/second-step`)}
            >
                Создать тариф
            </Button>
        </div>
    </EmptyModal>

    const errTariff = errors.tariff_ids? (
        <span className={classes.add_new_room_form_error}>{errors.tariff_ids || t('area-validation.default-message')}</span>
    ) : null;
    const errPrice = errors.base_price? (
        <span className={classes.add_new_room_form_error}>{errors.base_price || t('area-validation.default-message')}</span>
    ) : null;


    return (
        <div className={classes.add_new_room}>
            {templateModal}
            <NavLink
                className={classes.add_new_room_link}
                to={`/edit-object/${idHotel}/third-step`}>{t("addNewObjects.secondStep.buttons.back")}
            </NavLink>
            <form className={classes.add_new_room_form}>
                <div className={classes.add_new_room_form_block}>
                    <h2 className={classes.add_new_room_form_title}>{t("addNewObjects.secondStep.form.title")}</h2>
                    <div className={classes.add_new_room_field}>
                        <CustomSelect
                            label={t("addNewObjects.secondStep.form.typeRoom")}
                            typeClsInput="field"
                            name="type_id"
                            defaultValue={fakeRoomType[0]}
                            value={fakeRoomType.find(elem=>elem.value==values.type_id)}
                            options={fakeRoomType}
                            onChange={(option)=>{
                                return ClearErrorAndChange("type_id",option.value)
                            }}
                            shouldValidate
                            required
                            touched={!touched.type_id}
                            valid={!errors.type_id}
                            errorMessage={errors.type_id}
                        ></CustomSelect>
                    </div>
                    <div className={classes.add_new_room_field_name}>
                        <Input
                            label={t("addNewObjects.secondStep.form.nameRoom")}
                            typeClsInput="field"
                            name="name"
                            value={values.name}
                            onChange={(e) => {
                                handleChange({target:{name:"name",value:e.target.value}})
                            }}
                            shouldValidate
                            required
                            touched={!touched.name}
                            valid={!errors.name}
                            errorMessage={errors.name}
                        ></Input>
                        {
                            //<p className={classes.add_new_room_field_help}>{t("addNewObjects.secondStep.form.nameRoomHelp")}</p>
                        }
                    </div>
                    <div className={classes.add_new_room_field}>
                        <Input
                            label={t("addNewObjects.secondStep.form.quantityRoom")}
                            mask={"999"}
                            typeClsInput="field"
                            className={classes.add_new_room_field_input}
                            name="allotment"
                            value={values.allotment}
                            onChange={(event)=>{
                                handleChange({target:{name:"allotment",value:event.target.value}})
                            }}
                            shouldValidate
                            required
                            touched={!touched.allotment}
                            valid={!errors.allotment}
                            errorMessage={errors.allotment}
                        ></Input>
                    </div>
                </div>
                <div className={classes.add_new_room_form_block}>
                    <h2 className={classes.add_new_room_form_title}>{t("addNewObjects.secondStep.form.titleTariff")}</h2>
                    <div className={classes.add_new_room_tariff_list}>
                        {templateTariff}
                    </div>
                    <div className={classes.add_new_room_tariff_buttons}>
                        <Button
                            type="button"
                            onClick={addNewTariff}
                        >
                            <div className={classes.add_new_room_tariff_btns}>{t("addNewObjects.secondStep.form.tariff.btnAdd")}</div>
                        </Button>
                    </div>
                    {errTariff}
                </div>
                <div className={classes.add_new_room_form_block}>
                    <h2 className={classes.add_new_room_form_title}>{t("addNewObjects.secondStep.form.descriptionTitle")}</h2>
                    <div className={classes.add_new_room_field_flex}>
                        <Input
                            label={t("addNewObjects.secondStep.form.sizeRoom")}
                            typeClsInput="field"
                            name="area"
                            value={values.area}
                            onChange={(event)=>{
                                return handleChange({target:{name:"area",value:event.target.value}})
                            }}
                            className={classes.add_new_room_field_flex2_input}
                            shouldValidate
                            required
                            touched={!touched.area}
                            valid={!errors.area}
                            errorMessage={errors.area}
                        ></Input>
                        <div className={classes.add_new_room_field_flex_select}>
                            <CustomSelect
                                label={t("addNewObjects.secondStep.form.smoking")}
                                typeClsInput="field"
                                options={fakeSmokeOption}
                                name="smoking_type_id"
                                value={fakeSmokeOption.find(elem=>elem.value==values.smoking_type_id)}
                                defaultValue={fakeSmokeOption[0]}
                                onChange={(option)=>{
                                    return handleChange({target:{name:"smoking_type_id",value:option.value}})
                                }}
                                shouldValidate
                                required
                                touched={!touched.smoking_type_id}
                                valid={!errors.smoking_type_id}
                                errorMessage={errors.smoking_type_id}
                            ></CustomSelect>
                        </div>
                    </div>
                    <div className={classes.add_new_room_field_flex2}>
                        <CustomSelect
                            label={t("addNewObjects.secondStep.form.countRooms")}
                            typeClsInput="field"
                            options={roomCapacity}
                            name="room_capacity"
                            value={roomCapacity.find(elem=>elem.value==values.room_capacity)}
                            defaultValue={roomCapacity[0]}
                            onChange={(option)=>{
                                return handleChange({target:{name:"room_capacity",value:option.value}})
                            }}
                            className={classes.add_new_room_field_flex2_select}
                            shouldValidate
                            touched={!touched.room_capacity}
                            valid={!errors.room_capacity}
                            errorMessage={errors.room_capacity}
                        ></CustomSelect>
                        <CustomSelect
                            label={t("addNewObjects.secondStep.form.availabilityOfKitchen")}
                            typeClsInput="field"
                            options={kitchenOptions}
                            name="kitchen"
                            value={kitchenOptions.find(elem=>elem.value==values.kitchen)}
                            defaultValue={kitchenOptions[0]}
                            onChange={(option)=>{
                                return handleChange({target:{name:"kitchen",value:option.value}})
                            }}
                            className={classes.add_new_room_field_flex2_select}
                            shouldValidate
                            touched={!touched.kitchen}
                            valid={!errors.kitchen}
                            errorMessage={errors.kitchen}
                        ></CustomSelect>
                        <Input
                            label={t("addNewObjects.secondStep.form.numberOfBeds")}
                            typeClsInput="field"
                            name="bed_capacity"
                            placeholder="Не указано"
                            value={values.bed_capacity}
                            onChange={(event)=>{
                                return handleChange({target:{name:"bed_capacity",value:event.target.value}})
                            }}
                            className={classes.add_new_room_field_flex2_input}
                            shouldValidate
                            touched={!touched.bed_capacity}
                            valid={!errors.bed_capacity}
                            errorMessage={errors.bed_capacity}
                        ></Input>
                        <Input
                            label={t("addNewObjects.secondStep.form.sleepingPlaces")}
                            typeClsInput="field"
                            name="additional_bed_capacity"
                            placeholder="Не указано"
                            value={values.additional_bed_capacity}
                            onChange={(event)=>{
                                return handleChange({target:{name:"additional_bed_capacity",value:event.target.value}})
                            }}
                            className={classes.add_new_room_field_flex2_input}
                            shouldValidate
                            touched={!touched.additional_bed_capacity}
                            valid={!errors.additional_bed_capacity}
                            errorMessage={errors.additional_bed_capacity}
                        ></Input>
                    </div>
                    <div className={classes.add_new_room_field}>
                        <CustomTextArea
                            className={classes.add_new_room_field_textarea}
                            label={t("addNewObjects.secondStep.form.descriptionLabel")}
                            name="description"
                            value={values.description}
                            onChange={(e)=>{
                                handleChange({target:{name:"description",value:e.target.value}})
                            }}
                            shouldValidate
                            required
                            touched={!touched.description}
                            valid={!errors.description}
                            errorMessage={errors.description}
                        ></CustomTextArea>
                    </div>
                </div>
                <div className={classes.add_new_room_form_block}>
                    <h2 className={classes.add_new_room_form_title}>{t("addNewObjects.secondStep.form.bedsTitle")}</h2>
                    <div className={classes.add_new_room_beds_list}>
                        {templateBeds}
                    </div>
                    <div className={classes.add_new_room_tariff_buttons}>
                        <Button
                            type="button"
                            onClick={addNewBed}
                        >
                            <div className={classes.add_new_room_tariff_btns}>{t("addNewObjects.secondStep.form.beds.addBtn")}</div>
                        </Button>
                    </div>
                    <div className={classes.add_new_room_beds}>
                        <span className={classes.add_new_room_label}>{t("addNewObjects.secondStep.form.beds.quantityGuest")}</span>
                        <CustomSelect
                            className={[classes.add_new_room_beds_input,classes.add_new_room_beds_icon].join(' ')}
                            typeClsInput="field"
                            name="guest_count"
                            options={guestOption}
                            defaultValue={guestOption[0]}
                            value={guestOption.find(elem=>elem.value==values.guest_count)}
                            onChange={(value)=>{
                                if(!values.more_than_six)handleChange({target:{name:"guest_count",value:value.value}})
                            }}
                            shouldValidate
                            required
                            touched={!touched.guest_count}
                            valid={!errors.guest_count}
                            errorMessage={errors.guest_count}
                        ></CustomSelect>
                    </div>
                    <div className={classes.add_new_room_beds}>
                        <Checkbox
                            text={"Больше 6 гостей"}
                            name="more_than_six"
                            checked={values.more_than_six}
                            onChange={(event)=>{
                                handleChange({target:{name:"more_than_six",value:event.target.checked}})
                            }}
                            className={classes.add_new_room_service}
                            classNameLabel={classes.add_new_room_service_label}
                            classNameCheckBox={classes.add_new_room_service_checkbox}
                        ></Checkbox>
                        {values.more_than_six &&<Input
                            label="Лимит кол-ва гостей "
                            typeClsInput="field"
                            name="guest_count"
                            value={values.guest_count}
                            onChange={(event) => {
                                return handleChange({target:{name:"guest_count",value:+event.target.value}})
                            }}
                            className={classes.add_new_room_service_input}
                        ></Input>}
                    </div>
                </div>
                <div className={classes.add_new_room_form_block}>
                    <h2 className={classes.add_new_room_form_title}>{t("addNewObjects.secondStep.form.tariff.title")}</h2>
                    <FormHelp className={classes.add_new_room_help} text={t("addNewObjects.secondStep.form.tariff.tariffHelp")}></FormHelp>
                    {templatePriceTariff}
                    {errPrice}
                </div>
                <div className={classes.add_new_room_form_block}>
                    <h2 className={classes.add_new_room_form_title}>{t("addNewObjects.secondStep.form.serviceTitle")}</h2>
                    <Service
                        name="amenity_ids"
                        amenity={amenity}
                        value={values.amenity_ids}
                        onChange={(arr)=>handleChange({target:{name:"amenity_ids",value:arr}})}
                    ></Service>
                </div>
                <div className={classes.add_new_room_form_block}>
                    <h2 className={classes.add_new_room_form_title}>{t("addNewObjects.secondStep.form.photoTitle")}</h2>
                    <AddPhotos
                        mainImage={mainImage}
                        photos={saveImage}
                        nameField={"room_id"}
                        id={roomId}
                        mainClick={setImageMain}
                        onChange={(image)=> {
                            setSaveImage(prevState => [...prevState,image])
                        }}
                        onDeleteImage={(array)=>{
                            setSaveImage(array)
                        }}
                        typeImage="default"
                        setMainImage={setMainImage}
                        onDelete={(urlToDelete)=>dispatcher(deleteRoomImage(urlToDelete,roomId))}
                    ></AddPhotos>
                </div>
            </form>
            {Object.keys(errors).length ? <ErrorMessage error={"Есть незаполненные обязательные поля"} /> : null}
            <div className={classes.add_new_room_buttons}>
                <Button
                    typeButton={1}
                    btnColor="outline_blue"
                    className={classes.add_new_room_buttons_cancel}
                    onClick={()=>navigate(`/edit-object/${idHotel}/third-step`)}
                >{t("addNewObjects.firstStep.btnCancel")}</Button>
                <Button
                    typeButton={1}
                    btnColor="green"
                    className={classes.add_new_room_buttons_save}
                    onClick={save}
                >{t("profile.save")}</Button>
            </div>
        </div>
    )
}


export default AddNewRoom