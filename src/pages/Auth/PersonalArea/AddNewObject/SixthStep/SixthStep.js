import React, { useCallback, useEffect, useMemo, useState } from "react"
import classes from "./SixthStep.module.scss";
import { useTranslation } from "react-i18next";
import Button from "../../../../../components/UI/btns/Button/Button";
import { useNavigate, useParams } from "react-router-dom";
import CustomSelect from "../../../../../components/UI/areas/CustomeSelect/CustomSelect";
import FormHelp from "../../../../../components/FormHelp/FormHelp";
import FromToSelectTime from "../../../../../components/UI/areas/FromToSelectTime/FromToSelectTime";
import CustomRadio from "../../../../../components/UI/areas/CustomRadio/CustomRadio";
import { useDispatch, useSelector } from "react-redux";
import {
    clearAllHotelError,
    clearHotelError,
    editHotel,
    getHotelInfo,
    getServices,
    saveHotel,
    saveHotelPartial
} from "../../../../../store/actions/partnerHotelsActions";
import { object, string } from "yup";
import { useFormik } from "formik";
import ErrorMessage from "../../../../../components/UI/message/ErrorMessage";
import CustomTextArea from "../../../../../components/UI/areas/CustomTextArea/CustomTextArea";
import EmptyModal from "../../../../../components/UI/modals/EmptyModal/EmptyModal";
import useToggleVisibility from "../../../../../hooks/useToggleVisibility";

const optionTime = []
for (let i = 7; i < 22; i++) {
    if (i < 10) {
        optionTime.push({
            label: `0${i}:00`,
            value: i,
        })
    } else {
        optionTime.push({
            label: `${i}:00`,
            value: i,
        })
    }

}

function SixthStep({ edit }) {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const dispatcher = useDispatch()
    const errors = useSelector(state => state.objects.errors)
    const hotelInfo = useSelector(state => state.objects.hotelInfo)
    const [showModal, setShowModal, closeModal] = useToggleVisibility()
    const [showModalError, setShowModalError, closeModalError] = useToggleVisibility()
    const [showModalSuccess, setShowModalSuccess, closeModalSuccess] = useToggleVisibility()
    const { id } = useParams()
    const optionsPets = [
        {
            label: t("addNewObjects.sixthStep.childAllowed.yes"),
            value: true
        },
        {
            label: t("addNewObjects.sixthStep.childAllowed.no"),
            value: false
        }
    ]

    const optionsCancelBook = [
        {
            label: t("addNewObjects.sixthStep.option.no"),
            value: { text: t("addNewObjects.sixthStep.option.no"), value: null },
        },
        {
            label: t("addNewObjects.sixthStep.option.default"),
            value: { text: t("addNewObjects.sixthStep.option.defaultHelp"), value: 1 },
        },
        {
            label: t("addNewObjects.sixthStep.option.oneDay"),
            value: { text: t("addNewObjects.sixthStep.option.oneDay"), value: 2 },
        },
        {
            label: t("addNewObjects.sixthStep.option.twoDay"),
            value: { text: t("addNewObjects.sixthStep.option.twoDay"), value: 3 },
        },
        {
            label: t("addNewObjects.sixthStep.option.threeDay"),
            value: { text: t("addNewObjects.sixthStep.option.threeDay"), value: 4 },
        },
        {
            label: t("addNewObjects.sixthStep.option.fiveDay"),
            value: { text: t("addNewObjects.sixthStep.option.fiveDay"), value: 5 },
        },
    ]
    /** Опции для возраста детей */
    const optionsKidsYear = []
    for (let i = 1; i < 13; i++) {
        optionsKidsYear.push({
            label: `${t("addNewObjects.sixthStep.childAllowed.upTo")} ${i}`,
            value: i,
        },)
    }

    const [cancelBooking, setCancelBooking] = useState(optionsCancelBook[0])

    useEffect(() => {
        setCancelBooking(optionsCancelBook[hotelInfo.appointment_cancel_before_days])
    }, [hotelInfo])
    /** Текст подсказки по форме */
    const textCancelBooking = (
        <>
            <p>{t("addNewObjects.sixthStep.cancelBookHelp")} {cancelBooking ? cancelBooking.value && cancelBooking.value.text : 'Не выбрано'}</p>
            <p>{t("addNewObjects.sixthStep.cancelBookHelpNote")}</p>
        </>
    )

    /** Подтягиваем инфу о услугах */
    /** Если редактирование подтягиваем информацию для редактирования */
    useEffect(() => {
        dispatcher(clearAllHotelError())
        if (edit) {
            dispatcher(getHotelInfo(id))
        }
    }, [])



    function back() {
        if (edit) {
            navigate(`/edit-object/${id}/fifth-step`)
        }
    }
    /** Начальные значения */
    const initialValues = useMemo(() => {
        if (!Object.keys(hotelInfo).length) {
            return {
                appointment_cancel_before_days: '',
                kids_are_allowed: "",
                kids_max_age: "",
                arrival_after: 14,
                arrival_before: "",
                departure_after: "",
                departure_before: 12,
                is_pets_allowed: "",
                children_conditions: '',
                status_id: 2
            }
        } else {
            return {
                appointment_cancel_before_days: hotelInfo.appointment_cancel_before_days,
                kids_are_allowed: hotelInfo.kids_are_allowed,
                kids_max_age: hotelInfo.kids_max_age,
                arrival_after: hotelInfo.guest_time?.arrival_after.split(":")[0] ? +hotelInfo.guest_time?.arrival_after.split(":")[0] : 14,
                departure_before: hotelInfo.guest_time?.departure_before.split(":")[0] ? +hotelInfo.guest_time?.departure_before.split(":")[0] : 12,
                is_pets_allowed: hotelInfo.is_pets_allowed,
                children_conditions: hotelInfo.children_conditions ? hotelInfo.children_conditions.ru : '',
                status_id: 2
            }
        }

    }, [hotelInfo])

    /** Схема валидации */
    const validationSchema = useMemo(
        () =>
            object().shape({
                type_id: string().required(),
                appointment_cancel_before_days: string().required(),
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
        enableReinitialize: true
    });

    /** Очищаем ошибки и изменяем состояние */
    function ClearErrorAndChange(field, value) {
        if (errors[field]) {
            dispatcher(clearHotelError(field))
        }
        handleChange({ target: { name: field, value: value } })
    }
    const formatData = (value) => {
        return {
            appointment_cancel_before_days: value.appointment_cancel_before_days,
            guest_time: {
                arrival_after: value.arrival_after,
                arrival_before: value.arrival_before,
                departure_after: value.departure_after,
                departure_before: value.departure_before,
            },
            children_conditions: { ru: value.children_conditions },
            kids_are_allowed: value.kids_are_allowed,
            kids_max_age: value.kids_max_age,
            is_pets_allowed: value.is_pets_allowed
        }
    }

    /** Отправляем отель на модерацию */
    const send = useCallback(async function () {
        const hotelId = await dispatcher(editHotel(formatData(values), id))
        if (hotelId) {
            const hotelId = await dispatcher(saveHotel({ ...values, children_conditions: { ru: values.children_conditions }, }, id))

            if (typeof hotelId === "object") {
                setShowModalError(true)
            } else {
                setShowModalSuccess(true)
            }
            setShowModal(false)
        }
    }, [errors, values])

    /** Модалка отправки на модерацию */
    const templateModal = showModal && (
        <EmptyModal
            className={classes.sixth_step_modal}
            close={true}
            width={347}
            closeModal={closeModal}
            btnCancelClick={() => setShowModal(false)}
            background="blue"
            typeModal="withoutBack"

        ><h3 className={classes.sixth_step_modal_title}>{t("addNewObjects.sixthStep.modal.excellent")}</h3>
            <p className={classes.sixth_step_modal_sub_title}>{t(edit ? "addNewObjects.sixthStep.modal.titleEdit" : "addNewObjects.sixthStep.modal.title")}</p>
            <Button
                typeButton={2}
                btnColor="ButtonGreen"
                onClick={send}
                className={classes.sixth_step_modal_save}
            > <p className={classes.sixth_step_modal_save_text}>{t("addNewObjects.sixthStep.modal.btnSuccess")}</p></Button>
            {/*<Button*/}
            {/*    typeButton={2}*/}
            {/*    btnColor="ButtonWhite"*/}
            {/*    className={classes.sixth_step_modal_cancel}*/}
            {/*>{t("addNewObjects.sixthStep.modal.btnCancel")}</Button>*/}
        </EmptyModal>
    )


    /** Модалка успешной отправки отеля на модерацию */
    const templateSuccessModal = showModalSuccess && (
        <EmptyModal
            close={true}
            closeModal={(event) => {
                navigate("/personal-area/objects/1")
                return closeModalSuccess(event)
            }}
            btnCancelClick={() => {
                navigate("/personal-area/objects/1")
                setShowModalSuccess(false)
            }}
            background="blue"
            width={294}
            typeModal="withoutBack"
        >
            <h2 className={classes.sixth_step_modal_title2}>{t("addNewObjects.sixthStep.modal.ready")}</h2>
            <p className={classes.sixth_step_modal_text}>{t("addNewObjects.sixthStep.modal.text")}</p>
        </EmptyModal>
    )

    const templateErrors = useMemo(() => {
        let arr = []
        for (let key in errors) {
            arr.push(
                <li className={classes.fifth_step_form_modal_text}>{errors[key]}</li>
            )
        }
        return arr
    }, [errors])

    /** Видимость сообщения об ошибке */
    const errMsg = showModalError && <EmptyModal
        close={true}
        closeModal={closeModalError}
        btnCancelClick={() => {
            setShowModalError(false)
        }}
        background="blue"
        width={520}
        typeModal="withoutBack"
    >
        <div className={classes.modal_content}>
            <ErrorMessage className={classes.modal_error_message} error={'Невозможно отправить объект на модерацию, заполните следующую информацию:'} />
            <ul className={classes.errors_list}>
                {templateErrors}
            </ul>
        </div>
        <div className={classes.fifth_step_form_modal_wrap}>
            <Button
                typeButton={1}
                btnColor="outline_blue"
                onClick={() => navigate(`/edit-object/${id}/second-step`)}
                className={classes.fifth_step_form_modal_cancel}
            >Перейти к редактированию</Button>
        </div>
    </EmptyModal>




    return (
        <div className={classes.fifth_step}>
            {templateModal}
            {templateSuccessModal}
            <h2 className={classes.fifth_step_title} >{t("addNewObjects.sixthStep.title")}</h2>
            <p className={classes.fifth_step_subtitle}>{t("addNewObjects.sixthStep.subTitle")}</p>
            <form className={classes.fifth_step_form}>
                <div className={classes.fifth_step_form_block}>
                    <h2 className={classes.fifth_step_form_field_title}>{t("addNewObjects.sixthStep.cancelBookTitle")}</h2>
                    <div className={classes.fifth_step_form_field}>
                        <CustomSelect
                            label={t("addNewObjects.sixthStep.cancelBookLabel")}
                            options={optionsCancelBook}
                            name="appointment_cancel_before_days"
                            defaultValue={optionsCancelBook[0]}
                            touched={!touched.appointment_cancel_before_days}
                            valid={!errors.appointment_cancel_before_days}
                            shouldValidate
                            errorMessage={errors.appointment_cancel_before_days}
                            onChange={(value) => {
                                ClearErrorAndChange("appointment_cancel_before_days", value.value.value)
                                setCancelBooking(value)
                            }}
                            value={optionsCancelBook.find(elem => elem.value.value == values.appointment_cancel_before_days)}
                        ></CustomSelect>
                    </div>
                    <FormHelp
                        className={classes.fifth_step_form_help}
                        text={textCancelBooking}
                    ></FormHelp>
                </div>
                <div className={classes.fifth_step_form_block}>
                    <h2 className={classes.fifth_step_form_field_title}>{t("addNewObjects.sixthStep.register.title")}</h2>
                    <div className={classes.fifth_step_form_field3}>
                        <div className={classes.fifth_step_time}>
                            <div className={classes.fifth_step_time_label}>
                                {t("addNewObjects.sixthStep.register.from")}
                            </div>
                            <div className={classes.fifth_step_time_wrap}>
                                <div className={classes.fifth_step_time_label}>{t("addNewObjects.sixthStep.register.after")}</div>
                                <CustomSelect
                                    options={optionTime}
                                    name="arrival_after"
                                    onChange={(value) => {
                                        ClearErrorAndChange("arrival_after", value.value)
                                        //setCancelBooking(value)
                                    }}
                                    value={optionTime.find(elem => elem.value == values.arrival_after)}
                                    className={classes.fifth_step_form_select}
                                ></CustomSelect>
                            </div>
                        </div>
                        <div className={classes.fifth_step_time}>
                            <div className={classes.fifth_step_time_label}>
                                {t("addNewObjects.sixthStep.register.to")}
                            </div>
                            <div className={classes.fifth_step_time_wrap}>
                                <div className={classes.fifth_step_time_label}>{t("addNewObjects.sixthStep.register.before")}</div>
                                <CustomSelect
                                    options={optionTime}
                                    name="departure_before"
                                    onChange={(value) => {
                                        ClearErrorAndChange("departure_before", value.value)
                                        //setCancelBooking(value)
                                    }}
                                    value={optionTime.find(elem => elem.value == values.departure_before)}
                                    className={classes.fifth_step_form_select}
                                ></CustomSelect>
                            </div>
                        </div>
                        {/*<FromToSelectTime*/}
                        {/*    label={t("addNewObjects.fifthStep.register.from")}*/}
                        {/*    valueFrom={values.arrival_after}*/}
                        {/*    onChangeFrom={(value)=>ClearErrorAndChange("arrival_after",value)}*/}
                        {/*    onChangeTo={(value)=>ClearErrorAndChange("arrival_before",value)}*/}
                        {/*    valueTo={values.arrival_before}*/}
                        {/*></FromToSelectTime>*/}
                        {/*<FromToSelectTime*/}
                        {/*    label={t("addNewObjects.fifthStep.register.to")}*/}
                        {/*    valueFrom={values.departure_after}*/}
                        {/*    onChangeFrom={(value)=>ClearErrorAndChange("departure_after",value)}*/}
                        {/*    onChangeTo={(value)=>ClearErrorAndChange("departure_before",value)}*/}
                        {/*    valueTo={values.departure_before}*/}
                        {/*></FromToSelectTime>*/}
                    </div>
                    {errMsg}
                </div>
                <div className={classes.fifth_step_form_block}>
                    <h2 className={classes.fifth_step_form_field_title}>Дети</h2>
                    <CustomTextArea
                        label="Условия размещения детей"
                        name="children_conditions"
                        onChange={(event) => {
                            ClearErrorAndChange("children_conditions", event.target.value)
                            //setCancelBooking(value)
                        }}
                        value={values.children_conditions}
                    >
                    </CustomTextArea>
                </div>
                <div className={classes.fifth_step_form_block}>
                    <h2 className={classes.fifth_step_form_field_title}>{t("addNewObjects.sixthStep.pet.title")}</h2>
                    <h2 className={classes.fifth_step_form_field_title}>{t("addNewObjects.sixthStep.pet.subTitle")}</h2>
                    <div className={classes.fifth_step_form_field2}>
                        <CustomSelect
                            label={t("addNewObjects.sixthStep.pet.label")}
                            options={optionsPets}
                            name="is_pets_allowed"
                            onChange={(value) => {
                                ClearErrorAndChange("is_pets_allowed", value.value)
                                //setCancelBooking(value)
                            }}
                            value={optionsPets.find(elem => elem.value == values.is_pets_allowed)}
                        ></CustomSelect>
                    </div>
                </div>
            </form>
            {Object.keys(errors).length ? <ErrorMessage error={"Есть незаполненные обязательные поля"} /> : null}
            <div className={classes.fifth_step_buttons}>
                <Button
                    typeButton={1}
                    btnColor="outline_blue back"
                    onClick={back}
                    className={classes.fifth_step_buttons_cancel}
                >{t("addNewObjects.secondStep.buttons.back")}</Button>
                <Button
                    typeButton={1}
                    btnColor="green"
                    className={classes.fifth_step_buttons_save}
                    onClick={send}
                >{t("addNewObjects.sixthStep.ready")}</Button>
            </div>
        </div>
    )
}

export default SixthStep