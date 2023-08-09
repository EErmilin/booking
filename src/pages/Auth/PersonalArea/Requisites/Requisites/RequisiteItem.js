import React, { useMemo } from "react"
import { NavLink } from "react-router-dom";
import StatusHotel from "../../../../../components/StatusHotel/StatusHotel";
import useWindowSize from "../../../../../hooks/useWindowSize"
import Button from "../../../../../components/UI/btns/Button/Button";
import classes from "./Requisites.module.scss";

function RequisiteItem({ object: { id, name: { ru }, address, requisites, requisites_status } }) {

    const windowSize = useWindowSize()

    let statusRequisitesHotel = useMemo(() => {
        switch (requisites_status) {
            case 1: {
                return 'requestRequest'
            }
            case 2: {
                return 'requisiteChecking'
            }
            case 3: {
                return "requisiteNotConfirmed"
            }
            case 4: {
                return "requisiteСonfirmed"
            }
            default: {
                return "noRequisite"
            }
        }
    }, [requisites_status])

    let statusRequisites = useMemo(() => {
        switch (requisites && requisites.requisites_partner_status_id) {
            case 1: {
                return 'requestRequest'
            }
            case 2: {
                return 'requisiteChecking'
            }
            case 3: {
                return "requisiteNotConfirmed"
            }
            case 4: {
                return "requisiteСonfirmed"
            }
            default: {
                return "noRequisite"
            }
        }
    }, [requisites])

    return (
      <NavLink to={`/personal-area/requisites/hotel/${id}`} className={classes.object}>
          <div className={classes.object_wrap}>
              <div
                  className={[classes.object_props, classes.object_props_name].join(" ")}>{ru}</div>
              <div className={[classes.object_props, classes.object_props_address].join(" ")}>
                  <p className={classes.object_props_address_text}>{address}</p>
              </div>
          </div>
          <div className={[classes.object_props_small, classes.object_props_status, classes.object_props_connection].join(" ")}>
              {windowSize.width < 992 && <div className={classes.object_status_title}>Статус проверки привязки к объекту</div>}
              <StatusHotel status={statusRequisitesHotel} />
          </div>
          <div className={[classes.object_props_small, classes.object_props_status, classes.object_props_requisites].join(" ")}>
              {windowSize.width < 992 && <div className={classes.object_status_title}>Статус проверки реквизитов</div>}
              <StatusHotel status={statusRequisites} />
          </div>
          <div className={classes.object_props_btn_wrap}>
              <Button
                btnColor="blueBorderButton"
                className={classes.object_props_btn}
              >Открыть</Button>
          </div>
      </NavLink>
    )
}

export default RequisiteItem