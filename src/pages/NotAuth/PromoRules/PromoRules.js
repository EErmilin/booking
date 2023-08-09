import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getPromoRulesInfo } from "../../../store/actions/generalInfoAction"
import { Helmet } from "react-helmet"
import siteLogo from "../../../assets/svg/logo.svg"
import Preloader from "../../../components/Preloader/Preloader"
import InfoPageUnit from "../../../components/InfoPageUnit/InfoPageUnit"
import classes from "./PromoRules.module.scss"

function PromoRules() {

  const dispatch = useDispatch()
  const {info} = useSelector(state => state.general)

  useEffect(() => {
    dispatch(getPromoRulesInfo())
  }, [dispatch])

  function getMetaTags() {
    return(
      <Helmet>
        <title>Правила проведения акции | Check in</title>
        <meta name="description" content={'Правила проведения акции. Check in — удобный сервис бронирования отелей и гостиниц. Включайся в путешествия'} />
        <meta property="og:title" content={'Правила проведения акции | Check in'}/>
        <meta property="og:description" content={'Правила проведения акции. Check in — удобный сервис бронирования отелей и гостиниц. Включайся в путешествия'}/>
        {<meta property="og:image" content={siteLogo} />}
      </Helmet>
    )
  }

  const infoTemplate = info && <InfoPageUnit title={info?.name?.ru}>
    <div dangerouslySetInnerHTML={{ __html: info?.text?.ru }}></div>
  </InfoPageUnit>

  if (!info) return <Preloader></Preloader>

  return (
    <div className={classes.wrapper}>
      {getMetaTags()}
      <div className={classes.content}>
        {infoTemplate}
      </div>
    </div>
  )
}

export default PromoRules