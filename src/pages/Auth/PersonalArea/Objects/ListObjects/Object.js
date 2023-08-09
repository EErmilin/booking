import React, { useCallback } from "react"
import { useTranslation } from "react-i18next";
import MenuLine from "../../../../../components/UI/line/Mnuline/MenuLine";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import StatusHotel from "../../../../../components/StatusHotel/StatusHotel";
import { useDispatch, useSelector } from "react-redux";
import {
    archiveHotel,
    changeHotelAmenity,
    deleteHotel,
    setHotelIntegrationType
} from "../../../../../store/actions/partnerHotelsActions";
import moment from "moment";
import useToggleVisibility from "../../../../../hooks/useToggleVisibility";
import TwoButtonModal from "../../../../../components/UI/modals/TwoButtonModal/TwoButtonModal";
import RevokeObjectModal from "../../../../../components/UI/modals/RevokeObjectModal"
import EmptyModal from "../../../../../components/UI/modals/EmptyModal/EmptyModal"
import IntegrationIcon from "../components/IntegrationIcon/IntegrationIcon";
import ModalChangeAmenity from "../components/ModalChangeAmenity/ModalChangeAmenity";
import ModalPaymentType from "../components/ModalPaymentType/ModalPaymentType";
import {
    INTEGRATION_TYPE_BNOVO,
    INTEGRATION_TYPE_TRAVELLINE_FIRST,
    INTEGRATION_TYPE_TRAVELLINE_SECOND
} from "../../../../../constants/integrations";
import classes from "./ListObjects.module.scss";


function Object({ object: { id, name: { ru }, integration_type, address, type, star_rating, status_id, rooms, type_id, free_end_at, is_free_period_activated, partner_fee_percent, payment_type_id, amenity_ids }, archiveError, archiveSuccess }) {
    const navigate = useNavigate()
    const dispatcher = useDispatch()
    const { t } = useTranslation()
    const [showModalDelete, setShowModalDelete, closeModalDelete] = useToggleVisibility()
    const [showModalBnovoIntegration, setShowModalBnovoIntegration, closeModalBnovoIntegration] = useToggleVisibility()
    const [showModalBnovoIntegrationSuccess, setShowModalBnovoIntegrationSuccess, closeModalBnovoIntegrationSuccess] = useToggleVisibility()
    const [showModalTravellineIntegration, setShowModalTravellineIntegration, closeModalTravellineIntegration] = useToggleVisibility()
    const [showModalTravellineIntegrationSuccess, setShowModalTravellineIntegrationSuccess, closeModalTravellineIntegrationSuccess] = useToggleVisibility()
    const [showModalAmenity, setModalAmenity, closeModalAmenity] = useToggleVisibility()
    const [showRevokeModal, setRevokeModal, closeRevokeModal] = useToggleVisibility()
    const [showRevokeTravelLineModal, setRevokeTravelLineModal, closeRevokeTravelLineModal] = useToggleVisibility()
    const [modalRevokeError,setModalRevokeError,closeModalRevokeError] = useToggleVisibility()
    const typeHotels = useSelector(state => state.catalog.typeHotels)
    const [modalSuccess, setModalSuccess, closeModalSuccess] = useToggleVisibility()
    const [modalRevokeSuccess, setModalRevokeSuccess, closeModalRevokeSuccess] = useToggleVisibility()
    const [modalFatalError, setModalFatalError, closeModalFatalError] = useToggleVisibility()
    const [modalPayment, setModalPayment, closeModalPayment] = useToggleVisibility()
    const { page } = useParams()
    const listHotel = useSelector(state => state.objects.hotels)

    const templateModalPayment = <ModalPaymentType
        setModal={setModalPayment}
        closeModal={closeModalPayment}
        modal={modalPayment}
        id={id}
        payment_type={payment_type_id}
    ></ModalPaymentType>

    const templateModal = modalSuccess && <EmptyModal
        close={true}
        background="blue"
        closeModal={closeModalSuccess}
        btnCancelClick={() => setModalSuccess(false)}
        width={334}
        typeModal="withoutBack"
        className={classes.modal_success}
    >
        <h2 className={classes.modal_success_title}>Отлично</h2>
        <p className={classes.modal_success_subtitle}>Услуги и удобства добавлены.</p>
    </EmptyModal>

    const templateModalRevokeSuccess = modalRevokeSuccess && <EmptyModal
        close={true}
        background="blue"
        closeModal={closeModalRevokeSuccess}
        btnCancelClick={() => setModalRevokeSuccess(false)}
        width={302}
        typeModal="withoutBack"
        className={classes.objects_integration_success}
    >
        <h2 className={classes.modal_success_title}>Отлично!</h2>
        <p className={classes.modal_success_subtitle}>Вы успешно отозвали объект</p>
    </EmptyModal>

    const templateModalRevokeFatalError = modalFatalError && <EmptyModal
        close={true}
        background="blue"
        closeModal={closeModalFatalError}
        btnCancelClick={() => setModalFatalError(false)}
        typeModal="withoutBack"
        width={420}
        className={classes.objects_integration_success}>
        <p className={classes.modal_archive_title}>Невозможно отозвать объект!</p>
        <p className={classes.modal_archive_text}>Если вы хотите отозвать объект, требуется обратиться в поддержку</p>
    </EmptyModal>

    const saveAmenity = async (id, amenity) => {
        const isSave = await dispatcher(changeHotelAmenity(id, amenity))
        if (isSave) {
            setModalAmenity(false)
            setModalSuccess(true)
        }
    }

    const modalDelete = showModalDelete && (
        <TwoButtonModal
            className={classes.objects_delete}
            classNameTitle={classes.objects_delete_title}
            title={t("objects.modalDelete.title")}
            btnCancelClick={() => setShowModalDelete(false)}
            btnCancelText={t("objects.modalDelete.cancel")}
            btnNextClick={() => { dispatcher(deleteHotel(id)); setShowModalDelete(false) }}
            btnNextText={t("objects.modalDelete.yes")}
            closeModal={closeModalDelete}
            width={360}
            background="blue"
            typeModal="withoutBack"
        ></TwoButtonModal>
    )

    async function saveBnovoIntegration() {
        const isIntegrated = await dispatcher(setHotelIntegrationType(id, INTEGRATION_TYPE_BNOVO))

        if (isIntegrated) {
            setShowModalBnovoIntegration(false)
            setShowModalBnovoIntegrationSuccess(true)
        }
    }

    async function saveTravellineIntegration() {
        const isIntegrated = await dispatcher(setHotelIntegrationType(id, INTEGRATION_TYPE_TRAVELLINE_SECOND))

        if (isIntegrated) {
            setShowModalTravellineIntegration(false)
            setShowModalTravellineIntegrationSuccess(true)
        }
    }

    const modalBnovoIntegration = showModalBnovoIntegration && (
        <TwoButtonModal
            background="blue"
            typeModal="withoutBack"
            btnCancelClick={() => { setShowModalBnovoIntegration(false) }}
            btnCancelText={t("objects.bnovo.cancel")}
            btnNextClick={saveBnovoIntegration}
            btnNextText={t("objects.bnovo.save")}
            closeModal={closeModalBnovoIntegration}
            className={classes.objects_integration_modal}
        >
            <h3 className={classes.objects_integration_title_should_integrate}>{t("objects.bnovo.confirm")}</h3>
        </TwoButtonModal>
    )

    const modalBnovoIntegrationSuccess = showModalBnovoIntegrationSuccess && (
        <EmptyModal
            close={true}
            btnCancelClick={() => setShowModalBnovoIntegrationSuccess(false)}
            background="blue"
            typeModal="withoutBack"
            closeModal={closeModalBnovoIntegrationSuccess}

            className={classes.objects_integration_success}>
            {integration_type === INTEGRATION_TYPE_BNOVO
              ?
                <p className={classes.objects_integration_already}>
                {t("objects.bnovo.already")}
                </p>
              :
                <>
                    <h3 className={classes.objects_integration_title}>{t("objects.bnovo.great")}</h3>
                    <p>
                        {t("objects.bnovo.success")}
                    </p>
                </>
            }
            <p className={classes.objects_integration_id}>
                {t("objects.bnovo.hotelId")}: {id}
                <div className={classes.objects_integration_id_copy} onClick={() => {
                    navigator.clipboard.writeText(id)
                }} />
            </p>
        </EmptyModal>
    )

    const modalTravellineIntegration = showModalTravellineIntegration && (
      <TwoButtonModal
        background="blue"
        typeModal="withoutBack"
        btnCancelClick={() => { setShowModalTravellineIntegration(false) }}
        btnCancelText={t("objects.travelline.cancel")}
        btnNextClick={saveTravellineIntegration}
        btnNextText={t("objects.travelline.save")}
        closeModal={closeModalTravellineIntegration}
        className={classes.objects_integration_modal}
      >
          <h3 className={classes.objects_integration_title_should_integrate}>{t("objects.travelline.confirm")}</h3>
      </TwoButtonModal>
    )

    const modalTravellineIntegrationSuccess = showModalTravellineIntegrationSuccess && (
      <EmptyModal
        close={true}
        btnCancelClick={() => setShowModalTravellineIntegrationSuccess(false)}
        background="blue"
        typeModal="withoutBack"
        closeModal={closeModalTravellineIntegrationSuccess}

        className={classes.objects_integration_success}>
          {integration_type === INTEGRATION_TYPE_TRAVELLINE_FIRST || integration_type === INTEGRATION_TYPE_TRAVELLINE_SECOND
            ?
            <p className={classes.objects_integration_already}>
                {t("objects.travelline.already")}
            </p>
            :
            <>
                <h3 className={classes.objects_integration_title}>{t("objects.travelline.great")}</h3>
                <p>
                    {t("objects.travelline.success")}
                </p>
            </>
          }
          <p className={classes.objects_integration_id}>
              {t("objects.travelline.hotelId")}: {id}
              <div className={classes.objects_integration_id_copy} onClick={() => {
                  navigator.clipboard.writeText(id)
              }} />
          </p>
      </EmptyModal>
    )

    const templateModalRevokeError = modalRevokeError && (
        <EmptyModal
            close={true}
            btnCancelClick={() => setModalRevokeError(false)}
            background="blue"
            typeModal="withoutBack"
            width={420}
            closeModal={closeModalRevokeError}
            className={classes.objects_integration_success}>
            <p className={classes.modal_archive_title}>{t("objects.revokeHotelErrorTitle")}</p>
            <p className={classes.modal_archive_text}>{t("objects.revokeHotelErrorText")}</p>
        </EmptyModal>
    )
    const modalChangeAmenity = showModalAmenity && <ModalChangeAmenity
        setModal={setModalAmenity}
        closeModal={closeModalAmenity}
        id={id}
        amenity_ids={amenity_ids}
        onNextClick={saveAmenity}
    ></ModalChangeAmenity>

    const revokeModal = showRevokeModal &&
        <RevokeObjectModal
            objectId={id}
            setModal={setRevokeModal}
            setErrorModal={setModalRevokeError}
            closeModal={closeRevokeModal}
            setModalSuccess={setModalRevokeSuccess}
            setModalFatalError={setModalFatalError}
        />

    const revokeTravelLineModal = showRevokeTravelLineModal &&
        <EmptyModal
            close={true}
            className={classes.modal}
            btnCancelClick={() => setRevokeTravelLineModal(false)}
            closeModal={closeRevokeTravelLineModal}
            background="blue"
            width={308}
            typeModal="withoutBack">
            <p>Отзыв объекта доступен только в кабинете TravelLine.</p>
        </EmptyModal>


    const menuList = status_id == 5 ? [
        {
            text: t("objects.preview"),
            onClick: () => navigate(`/hotel?id=${id}&adults=1&children=0&dateFrom=${moment(new Date()).format("YYYY-MM-DD")}&dateTo=${moment(new Date()).add(2, "days").format("YYYY-MM-DD")}`)
        },
        (integration_type === INTEGRATION_TYPE_TRAVELLINE_FIRST ? {
            text: t("objects.typePayment"),
            onClick: () => setModalPayment(true)
        } : null),
        (integration_type !== INTEGRATION_TYPE_TRAVELLINE_FIRST ?
        {
            text: t("objects.edit"),
            onClick: () => navigate(`/edit-object/${id}/first-step`)
        } : null),
        {
            text: t("objects.amenity"),
            onClick: () => setModalAmenity(true)
        },
        {
            text: t("objects.revoke"),
            onClick: () => integration_type === 2 ? setRevokeTravelLineModal(true) : setRevokeModal(true),
        },
        {
            text: t("objects.tablePrice"),
            onClick: () => navigate(`/table-price/${id}`)
        },
        (integration_type !== INTEGRATION_TYPE_TRAVELLINE_FIRST && integration_type !== INTEGRATION_TYPE_TRAVELLINE_SECOND ? {
            text: t("objects.bnovo.title"),
            onClick: () => integration_type === INTEGRATION_TYPE_BNOVO ? setShowModalBnovoIntegrationSuccess(true) : setShowModalBnovoIntegration(true)
        } : null),
        (integration_type !== INTEGRATION_TYPE_BNOVO ? {
            text: t("objects.travelline.title"),
            onClick: () => integration_type === INTEGRATION_TYPE_TRAVELLINE_FIRST || integration_type === INTEGRATION_TYPE_TRAVELLINE_SECOND ? setShowModalTravellineIntegrationSuccess(true) : setShowModalTravellineIntegration(true)
        } : null),
        {
            text: t("objects.archive"),
            onClick: async () => {
                const isArchive = await dispatcher(archiveHotel(id))
                if (isArchive) {
                    archiveSuccess(true)
                    if (+page !== 1 && listHotel.length == 1) {
                        navigate(`/personal-area/objects/${+page - 1}`)
                    }
                } else {
                    archiveError(true)
                }
            }
        }
    ].filter(elem => elem) : [
        {
            text: t("objects.preview"),
            onClick: () => navigate(`/hotel?id=${id}&adults=1&children=0&dateFrom=${moment(new Date()).format("YYYY-MM-DD")}&dateTo=${moment(new Date()).add(2, "days").format("YYYY-MM-DD")}&edit=true`)
        },
        (integration_type !== INTEGRATION_TYPE_TRAVELLINE_FIRST ?
        {
            text: t("objects.edit"),
            onClick: () => navigate(`/edit-object/${id}/first-step`)
        } : null ),
        {
            text: t("objects.tablePrice"),
            onClick: () => navigate(`/table-price/${id}`)
        },
        (integration_type !== INTEGRATION_TYPE_TRAVELLINE_FIRST && integration_type !== INTEGRATION_TYPE_TRAVELLINE_SECOND ? {
            text: t("objects.bnovo.title"),
            onClick: () => integration_type === INTEGRATION_TYPE_BNOVO ? setShowModalBnovoIntegrationSuccess(true) : setShowModalBnovoIntegration(true)
        } : null),
        (integration_type !== INTEGRATION_TYPE_BNOVO ? {
            text: t("objects.travelline.title"),
            onClick: () => integration_type === INTEGRATION_TYPE_TRAVELLINE_FIRST || integration_type === INTEGRATION_TYPE_TRAVELLINE_SECOND ? setShowModalTravellineIntegrationSuccess(true) : setShowModalTravellineIntegration(true)
        } : null),
        {
            text: t("objects.archive"),
            onClick: async () => {
                const isArchive = await dispatcher(archiveHotel(id))
                if (isArchive) {
                    archiveSuccess(true)
                    if (+page !== 1 && listHotel.length == 1) {
                        navigate(`/personal-area/objects/${+page - 1}`)
                    }
                } else {
                    archiveError(true)
                }
            }
        }

        //{
        //    text: t("objects.delete"),
        //    onClick: () => setShowModalDelete(true),
        //    type: "del"
        //},
    ].filter(elem => elem)


    // const menuList = [
    //     {
    //         text: t("objects.edit"),
    //         onClick:()=>navigate(`/edit-object/${id}/first-step`)
    //     }
    // ]


    const typeHotel = typeHotels.find(elem => elem.id == type_id) ? typeHotels.find(elem => elem.id == type_id).name : "Объект"
    const is_free_period = moment.unix(free_end_at).isSameOrAfter(moment(moment().format("YYYY-MM-DD")), "YYYY-MM-DD")

    return (
        <div className={classes.object}>
            {revokeModal}
            {revokeTravelLineModal}
            {modalDelete}
            {modalChangeAmenity}
            {templateModal}
            {modalBnovoIntegrationSuccess}
            {modalBnovoIntegration}
            {modalTravellineIntegrationSuccess}
            {modalTravellineIntegration}
            {modalDelete}
            {templateModalPayment}
            {templateModalRevokeError}
            {templateModalRevokeSuccess}
            {templateModalRevokeFatalError}
            <div className={classes.object_props_main}>
                <div className={classes.object_props_name_wrap}>
                    <div className={classes.object_props_url_wrap}>
                        {rooms && rooms.length ?
                            <NavLink to={`/personal-area/objects/rooms/${id}`} state={{ page: page }} className={[classes.object_props, classes.object_props_name].join(" ")}>
                                {ru}
                            </NavLink> :
                            <NavLink to={`/edit-object/${id}/first-step`} className={[classes.object_props, classes.object_props_name].join(" ")}>
                                {ru}
                            </NavLink>}
                    </div>
                    <IntegrationIcon className={classes.object_props_name_icon} integrationType={integration_type}></IntegrationIcon>
                </div>
                <div className={[classes.object_props, classes.object_props_address].join(" ")}>{address}</div>
            </div>
            <div className={classes.object_props_id}>{id}</div>
            <div className={[classes.object_props_small, classes.object_props_type].join(" ")}>
                {typeHotel}
            </div>
            <div className={[classes.object_props_small, classes.object_props_rating].join(" ")}>
                <div className={classes.object_rating}>
                    <span>{star_rating}</span>
                    <div className={classes.star} />
                </div>
            </div>
            <div className={[classes.object_props_small, classes.object_props_status].join(" ")}>
                <StatusHotel status={status_id} />
                {status_id == 5 && <div
                    className={classes.period}>
                    <div
                        className={classes.period_help}>
                        <div className={[classes.period, is_free_period ? classes.period_help_free : classes.period_help_paid].join(' ')}>{is_free_period ?
                            `Бесплатный период для Отель «${ru}» без комиссии действует до ${moment.unix(free_end_at).format('DD.MM.YYYY')}` :
                            'Платный период'}
                        </div>
                    </div>
                    <div className={[classes.period_percent, is_free_period ? classes.period_free : classes.period_paid].join(' ')}>{is_free_period ? 0 : (partner_fee_percent * 100).toFixed(2)}%</div>
                </div>}
            </div>
            <div
                className={classes.object_table_price}
                onClick={() => navigate(`/table-price/${id}`)}
           >
                <div className={classes.object_table_price_icon}></div>
            </div>
            <MenuLine className={classes.menu} list={menuList} />
        </div>
    )
}

export default Object