import React, {useEffect, useState,useMemo} from "react"
import classes from "./ModalChangeAmenity.module.scss"
import {changeHotelAmenity, getServices} from "../../../../../../store/actions/partnerHotelsActions";
import {useDispatch, useSelector} from "react-redux";
import DropdownList from "../../../../../../components/Dropdown/DropdownList/DropdownList";
import Checkbox from "../../../../../../components/UI/areas/Checkbox/Checkbox";
import TwoButtonModal from "../../../../../../components/UI/modals/TwoButtonModal/TwoButtonModal";
import {useTranslation} from "react-i18next";
import {object} from "yup";
import {useFormik} from "formik";
import useToggleVisibility from "../../../../../../hooks/useToggleVisibility";
import EmptyModal from "../../../../../../components/UI/modals/EmptyModal/EmptyModal";

function ModalChangeAmenity({id,amenity_ids,setModal,closeModal,onNextClick}){
    const {t} = useTranslation()
    const dispatcher = useDispatch()
    const amenity = useSelector(state=>state.objects.amenity)


    /** Начальные значения */
    const initialValues = useMemo(()=>{
        return {
            amenity_ids:amenity_ids? amenity_ids : []
        }
    },[amenity_ids])
    /** Схема валидации */
    const validationSchema = useMemo(
        () =>
            object().shape({
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

    /** Массив с груп id услуг */
    const groupsId = useMemo(()=>{
        let arrayGroups = []
        amenity.forEach(elem=>{
            if(elem.group.id==8)return
            if(!(arrayGroups.find((e)=>e.group_id==elem.group.id))){
                arrayGroups.push({group_id:elem.group.id,name:elem.group.name.ru})
            }
        })
        return arrayGroups
    },[amenity])

    /** Рендерим услуги */
    const renderServices = (group_id) => {
        const arrAmenity = amenity.filter(elem=>elem.group.id==group_id)
        return arrAmenity.map((elem,id) => {
            return <div className={classes.modal_amenity_form_serviceLayout} key={id}>
                <Checkbox
                    classNameCheckBox={classes.modal_amenity_form_checkboxes_check}
                    classNameLabel={classes.modal_amenity_form_serviceTitle}
                    checked={values.amenity_ids.find(id=>id==+elem.id)}
                    value={values.amenity_ids.find(id=>id==+elem.id)}
                    name='amenity_ids'
                    onChange={(event=>{
                        if(!values.amenity_ids.includes(elem.id)){
                            let arr = [...values.amenity_ids,elem.id]

                            handleChange({target: {name: "amenity_ids", value: arr}})
                        }else{
                            handleChange({target: {name: "amenity_ids", value: values.amenity_ids.filter(e=>e!==elem.id)}})
                        }
                    })}
                    text={elem.name.ru}
                />
            </div>
        })
    };

    /** Рендерим группы услуг */
    const templateServicesTypes = useMemo(() => {
        return groupsId.map((elem,id) => {
            return <DropdownList
                key={id}
                id={elem.group_id}
                title={elem.name}
                titleClassName={classes.modal_amenity_services_dropdown}
                className={[classes.modal_amenity_form_field, classes.modal_amenity_form_field_dropdown].join(" ")}>
                {renderServices(elem.group_id)}
            </DropdownList>
        })
    },[groupsId,values.amenity_ids]);

    useEffect(()=>{
        dispatcher(getServices({'per-page':1000,expand:"group"}))
    },[])




    return (
        <>
            <TwoButtonModal
                classNameTitle={classes.modal_amenity_title}
                className={classes.modal_amenity}
                title={"Укажите услуги и удобства Вашего объекта"}
                btnCancelClick={()=>setModal(false)}
                btnCancelText={t("modalADdTariff.btn.cancel")}
                btnNextClick={()=>{onNextClick(id,values)}}
                btnNextText={t("modalADdTariff.btn.save")}
                closeModal={closeModal}
                classNameButtonWrap={classes.modal_amenity_btns}
                width={812}
                background="blue"
                typeModal="withoutBack"
            >
                <p className={classes.modal_amenity_subTitle}>При поиске места размещения, гости ищут чаще всего эти услуги. </p>
                <div>
                    {templateServicesTypes}
                </div>
            </TwoButtonModal>
        </>

    )
}


export default ModalChangeAmenity