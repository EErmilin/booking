import React, { useEffect, useMemo, useState } from "react";
import classes from "./Documents.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, clearHotelError, getHotelListPartner, getTypeHotels, setRequisitesDelivery } from "../../../../../../../store/actions/partnerHotelsActions";
import Input from "../../../../../../../components/UI/areas/Input/Input";
import { useFormik } from "formik";
import CustomRadio from "../../../../../../../components/UI/areas/CustomRadio/CustomRadio";


function Documents({
    values,
    clearErrorAndChange,
    touched
}) {
    const dispatcher = useDispatch()
    const errors = useSelector(state => state.objects.errors)
    const hotelInfo = useSelector(state => state.objects.hotelInfo)


    useEffect(() => {
        if (values.doc_shipment_method_id === 1) {
            clearErrorAndChange("shipping_country", 'Российская Федерация')
        } else {
            clearErrorAndChange("shipping_country", '')
        }

    }, [values.doc_shipment_method_id])


    const renderForm = () => {
        if (values.doc_shipment_method_id === 2) {
            return <div className={classes.documents_form}>
                <Input
                    label={"Идентификатор абонента ЭДО"}
                    className={classes.documents_form_input_edo}
                    typeClsInput="field"
                    name="doc_shipment_description"
                    shouldValidate
                    touched={!touched.doc_shipment_description}
                    valid={!errors.doc_shipment_description}
                    errorMessage={errors.doc_shipment_description}
                    required
                    value={values.doc_shipment_description}
                    onChange={(event) => clearErrorAndChange("doc_shipment_description", event.target.value)}
                ></Input >
            </div>
        }
        return <div className={classes.documents_form}>
            <Input
                label={"Название организации"}
                className={classes.documents_form_input}
                typeClsInput="field"
                name="shipping_organization"
                shouldValidate
                touched={!touched.shipping_organization}
                valid={!errors.shipping_organization}
                errorMessage={errors.shipping_organization}
                required
                value={values.shipping_organization}
                onChange={(event) => clearErrorAndChange("shipping_organization", event.target.value)}
            ></Input >
            <Input
                disabled={true}
                label={"Страна"}
                className={classes.documents_form_input}
                typeClsInput="field"
                name="shipping_country"
                shouldValidate
                touched={!touched.shipping_country}
                valid={!errors.shipping_country}
                errorMessage={errors.shipping_country}
                required
                value={values.shipping_country}
                onChange={(event) => clearErrorAndChange("shipping_country", event.target.value)}
            ></Input >
            <Input
                label={"Почтовый индекс"}
                className={classes.documents_form_input}
                typeClsInput="field"
                name="shipping_zip"
                shouldValidate
                touched={!touched.shipping_zip}
                valid={!errors.shipping_zip}
                errorMessage={errors.shipping_zip}
                required
                value={values.shipping_zip}
                onChange={(event) => clearErrorAndChange("shipping_zip", event.target.value)}
            ></Input >
            <Input
                label={"Край/Регион/Область"}
                className={classes.documents_form_input}
                typeClsInput="field"
                name="shipping_region"
                shouldValidate
                touched={!touched.shipping_region}
                valid={!errors.shipping_region}
                errorMessage={errors.shipping_region}
                required
                value={values.shipping_region}
                onChange={(event) => clearErrorAndChange("shipping_region", event.target.value)}
            ></Input >
            <Input
                label={"Город"}
                className={classes.documents_form_input}
                typeClsInput="field"
                name="shipping_city"
                shouldValidate
                touched={!touched.shipping_city}
                valid={!errors.shipping_city}
                errorMessage={errors.shipping_city}
                required
                value={values.shipping_city}
                onChange={(event) => clearErrorAndChange("shipping_city", event.target.value)}
            ></Input >
            <div className={classes.documents_form_address}>
                <Input
                    label={"Улица"}
                    className={classes.documents_form_address_street}
                    typeClsInput="field"
                    name="shipping_street"
                    shouldValidate
                    touched={!touched.shipping_street}
                    valid={!errors.shipping_street}
                    errorMessage={errors.shipping_street}
                    required
                    value={values.shipping_street}
                    onChange={(event) => clearErrorAndChange("shipping_street", event.target.value)}
                ></Input >
                <Input
                    label={"Дом/строение"}
                    className={classes.documents_form_address_street_house}
                    typeClsInput="field"
                    name="shipping_house"
                    shouldValidate
                    touched={!touched.shipping_house}
                    valid={!errors.shipping_house}
                    errorMessage={errors.shipping_house}
                    required
                    value={values.shipping_house}
                    onChange={(event) => clearErrorAndChange("shipping_house", event.target.value)}
                ></Input >
                <Input
                    label={"Офис/квартира"}
                    className={classes.documents_form_address_street_house}
                    typeClsInput="field"
                    name="shipping_office"
                    shouldValidate
                    touched={!touched.shipping_office}
                    valid={!errors.shipping_office}
                    errorMessage={errors.shipping_office}
                    value={values.shipping_office}
                    onChange={(event) => clearErrorAndChange("shipping_office", event.target.value)}
                ></Input >
            </div>
            <Input
                label={"Фамилия получателя"}
                className={classes.documents_form_input}
                typeClsInput="field"
                name="shipping_second_name"
                shouldValidate
                touched={!touched.shipping_second_name}
                valid={!errors.shipping_second_name}
                errorMessage={errors.shipping_second_name}
                required
                value={values.shipping_second_name}
                onChange={(event) => clearErrorAndChange("shipping_second_name", event.target.value)}
            ></Input >
            <Input
                label={"Имя получателя"}
                className={classes.documents_form_input}
                typeClsInput="field"
                name="shipping_first_name"
                shouldValidate
                touched={!touched.shipping_first_name}
                valid={!errors.shipping_first_name}
                errorMessage={errors.shipping_first_name}
                required
                value={values.shipping_first_name}
                onChange={(event) => clearErrorAndChange("shipping_first_name", event.target.value)}
            ></Input >
            <Input
                label={"Отчество получателя"}
                className={classes.documents_form_input}
                typeClsInput="field"
                name="shipping_mid_name"
                shouldValidate
                touched={!touched.shipping_mid_name}
                valid={!errors.shipping_mid_name}
                errorMessage={errors.shipping_mid_name}
                value={values.shipping_mid_name}
                onChange={(event) => clearErrorAndChange("shipping_mid_name", event.target.value)}
            ></Input >
            <Input
                mask={"+7 (999) 999-99-99"}
                label={"Телефон"}
                className={classes.documents_form_input}
                typeClsInput="field"
                name="shipping_phone"
                shouldValidate
                touched={!touched.shipping_phone}
                valid={!errors.shipping_phone}
                errorMessage={errors.shipping_phone}
                required
                value={values.shipping_phone}
                onChange={(event) => clearErrorAndChange("shipping_phone", event.target.value)}
            ></Input >
        </div>
    }

    return (
        <div className={classes.documents}>
            <div className={classes.documents_wrp}>
                <CustomRadio
                    listRadio={[{ text: "Через электронный документооборот", value: 2 }, { text: "Курьерская служба", value: 1 }]}
                    name={"documentSendType"}
                    value={values.doc_shipment_method_id}
                    label={"Укажите способ отправки документов"}
                    radioWrpClassName={classes.documents_radio_wrp}
                    isColumn={true}
                    labelClassName={classes.documents_radio_wrp_label}
                    radioLabelClassName={classes.documents_radio_label}
                    className={classes.documents_shipping_method}
                    onChange={(event) => {
                        dispatcher(clearErrors())
                        clearErrorAndChange("doc_shipment_method_id", event)
                    }}>
                    {renderForm()}
                </CustomRadio>
            </div>
        </div>

    )
}

export default Documents