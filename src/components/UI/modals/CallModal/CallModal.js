import React, { useMemo, useState } from 'react'
import Input from "../../areas/Input/Input";
import EmptyModal from "../EmptyModal/EmptyModal";
import CustomSelect from "../../areas/CustomeSelect/CustomSelect";
import CustomTextArea from "../../areas/CustomTextArea/CustomTextArea";
import Button from "../../btns/Button/Button";
import classes from "./CallModal.module.scss";
import { useDispatch, useSelector } from "react-redux";
import {clearContactFieldError, send} from "../../../../store/actions/contactActions";
import { object, string } from "yup";
import { useFormik } from "formik";


function CallModal({
    setIsShowCallModal,
}) {

    const [isSend, setIsSend] = useState(false)
    const errors = useSelector(state => state.contact.errors)
    const dispatcher = useDispatch()
    const optionsTimes = useMemo(() => {
        let arr = []
        for (let i = 9; i < 18; i++) {
            arr.push({ label: `${i}:00 - ${i + 1}:00`, value: i })
        }
        arr.unshift({ label: `Не выбрано`, value: 0 })
        return arr
    }, [])

    /** Схема валидации */
    const validationSchema = useMemo(
        () =>
            object().shape({
                name: string().required(),
                phone: string().required(),
                time: string().required(),
                text: string().required(),
            }),
        []
    );
    /** Начальные значения */
    const initialValues = useMemo(() => {
        return {
            name: '',
            phone: '',
            time: '',
            text: ''
        }
    }, [])
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
        enableReinitialize: true
    });

    async function onClick() {
        let isSend = await dispatcher(send(values))

        if (isSend) {
            setIsSend(true)
        }
    }

    /** Очищаем ошибки и изменяем состояние */
    function ClearErrorAndChange(field, value) {
        if (errors[field]) {
            dispatcher(clearContactFieldError(field))
        }
        handleChange({ target: { name: field, value: value } })
    }

    const modal = isSend ?
        <EmptyModal
            className={classes.modal_success}
            close={true}
            btnCancelClick={() => setIsShowCallModal(false)}
            typeModal={"withoutBack"}
            background="blue"
            width={375}
        >
            <h1>Заявка отправлена!</h1>
            <p>Ваша заявка будет обработана в течение 24 часов, пожалуйста ожидайте!</p>
        </EmptyModal>
        :
        <EmptyModal
            className={classes.modal}
            close={true}
            btnCancelClick={() => setIsShowCallModal(false)}
            typeModal={"withoutBack"}
            background="blue"
            width={301}
        >
            <h1>Обратная связь</h1>
            <Input
                className={classes.modal_input}
                typeClsInput="field"
                name="name"
                label={'Имя'}
                touched={!touched.name}
                valid={!errors.name}
                errorMessage={errors.name}
                required
                shouldValidate
                value={values.name}
                onChange={(e) => {
                    return ClearErrorAndChange("name", e.target.value)
                }}
            ></Input>
            <Input
                className={classes.modal_input}
                typeClsInput="field"
                name="phone"
                mask="+7 (999) 999-99-99"
                label={'Телефон'}
                value={values.phone}
                onChange={(e) => {
                    return ClearErrorAndChange("phone", e.target.value)
                }}
                touched={!touched.phone}
                valid={!errors.phone}
                errorMessage={errors.phone}
                required
                shouldValidate
            ></Input>
            <CustomSelect
                className={classes.modal_input}
                label={'Желаемое время для звонка'}
                name="time"
                defaultValue={optionsTimes[0]}
                options={optionsTimes}
                onChange={(value) => {
                    return ClearErrorAndChange("time", value.label)
                }}
                touched={!touched.time}
                valid={!errors.time}
                errorMessage={errors.time}
                required
                shouldValidate
            ></CustomSelect>
            <CustomTextArea
                className={classes.modal_textarea}
                label={'Комментарий'}
                name="text"
                value={values.text}
                touched={!touched.text}
                valid={!errors.text}
                errorMessage={errors.text}
                required
                shouldValidate
                onChange={(e) => {
                    return ClearErrorAndChange("text", e.target.value)
                }}
            />
            {Object.keys(errors).length ? <span className={classes.modal_error}>Не заполнены обязательные поля</span> : null}
            <p>* обязательные поля для заполнения</p>
            <Button
                onClick={onClick}
                className={classes.modal_btn}
                btnColor="ButtonGreen"
            >Отправить</Button>
        </EmptyModal>

    return modal

}

export default CallModal