import React, { useEffect, useState } from "react"
import classes from "./Contact.module.scss"
import { useMemo } from "react"
import Breadcrumbs from "../../../components/Breadcrumbs/Breadcrumbs"
import InfoPageUnit from "../../../components/InfoPageUnit/InfoPageUnit"
import CustomMap from "../../../components/UI/other/CustomMap/CustomMap"
import ContactUnit from "../../../components/ContactUnit/ContactUnit";
import { useDispatch, useSelector } from "react-redux";
import { getContactInfo } from "../../../store/actions/generalInfoAction";
import Preloader from "../../../components/Preloader/Preloader";
import EmptyModal from "../../../components/UI/modals/EmptyModal/EmptyModal";
import Input from "../../../components/UI/areas/Input/Input";
import CustomSelect from "../../../components/UI/areas/CustomeSelect/CustomSelect";
import CustomTextArea from "../../../components/UI/areas/CustomTextArea/CustomTextArea";
import Button from "../../../components/UI/btns/Button/Button";
import CallModal from "../../../components/UI/modals/CallModal/CallModal"
import {clearContactError} from "../../../store/actions/contactActions";


function Contact() {
    const contacts = useSelector(state => state.general.contacts)
    const [IsShowCallModal, setIsShowCallModal] = useState(false)
    const dispatcher = useDispatch()
    const img = require("../../../assets/image/call.png")
    useEffect(() => {
        dispatcher(getContactInfo())
    }, [])

    const breadcrumbs = useMemo(
        () => [
            {
                name: 'Контакты',
                url: ''
            }
        ],
        []
    );
    
    const onClickCall = () => {
        dispatcher(clearContactError()); 
        setIsShowCallModal(true)
    }

    if (!contacts) return <Preloader />

        return (
        <div className={classes.wrapper}>
            {IsShowCallModal && <CallModal setIsShowCallModal={setIsShowCallModal} />}
            {/*<Breadcrumbs breadcrumbs={breadcrumbs}></Breadcrumbs>*/}
            <div className={classes.content}>
                <InfoPageUnit title={'Контакты'}>
                    {!!contacts.text && <div className={classes.description} dangerouslySetInnerHTML={{ __html: contacts.text.ru }}></div>}
                    <ContactUnit contacts={contacts} className={classes.contacts} />
                    <CustomMap withPortal={false} hotels={[{ lat: '59.935511', lon: '30.329046' }]} />
                    <div className={classes.call}>
                        <div className={classes.call_text}>
                            <h2>Возникли вопросы?</h2>
                            <h2>Укажите, пожалуйста, ваш номер,</h2>
                            <h2>мы вам перезвоним.</h2>
                            <p>Обратите внимание, ваша заявка будет обработана в течение 24 часов.
                                Для решения срочных вопросов обратитесь, пожалуйста, в чат.</p>
                            <Button
                                className={classes.call_btn}
                                onClick={() => onClickCall()}
                                btnColor="ButtonBlue"
                            >Отправить</Button>
                        </div>
                        <img src={img} className={classes.img} />
                    </div>
                </InfoPageUnit>
            </div>
        </div>
    )
}

export default Contact