import React, { useEffect, useMemo } from "react"
import classes from "./FooterNavigation.module.scss";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SocialMediaItem from "../SocialMediaItem/SocialMediaItem";
import { useDispatch, useSelector } from "react-redux";
import { getFooterLinks, getSocialMedias } from "../../store/actions/generalInfoAction";
import drawRulesDocPath from "../../assets/docs/draw_rules.pdf";
import loyaltyDocPath from "../../assets/docs/loyalty_rules.pdf";
import AppDownload from "../AppDownload"

const hardCodeLinks = {
  service: [
    {
      name: 'footerMain.about',
      link: '/about'
    },
    {
      name: 'footerMain.blog',
      link: '/blog'
    },
    {
      name: 'footerMain.contact',
      link: '/contact'
    },
    {
      name: 'footerMain.requisite',
      link: '/requisite'
    }
  ],
  users: [
    {
      name: 'footerMain.directions',
      link: '/directions'
    },
    {
      name: 'footerMain.agreement',
      link: '/terms'
    },
    {
      name: 'footerMain.privacyPolicy',
      link: '/policy'
    },
    {
      name: 'footerMain.serviceRules',
      link: '/service-rules'
    },
    {
      name: 'footerMain.cookiesAgreement',
      link: '/cookies'
    },
    {
      name: 'footerMain.termUse',
      link: '/user-term-of-use'
    },
    {
      name: 'Правила программы лояльности',
      link: loyaltyDocPath,
      target: '_blank'
    },
    {
      name: 'footerMain.FAQ',
      link: 'https://help.checkin.ru/knowledge-base/articles/guests',
      target: '_blank'
    },
    {
      name: 'footerMain.payments',
      link: '/payments'
    },
    {
      name: 'Правила проведения акции',
      link: '/promo-rules'
    }
  ],
  common: [
    {
      text: 'footerMain.offer',
      link: 'https://cdn.checkin.uno/oferta.pdf',
      target: '_blank'
    },
    {
      text: 'footerMain.platformRules',
      link: '/platform-rules'
    },
    {
      text: 'footerMain.addObject',
      link: '/partner'
    },
    {
      text: 'footerMain.partner',
      link: '/auth/partner/register'
    },
    {
      text: 'footerMain.authPartner',
      link: '/auth/partner/login'
    },
    {
      text: 'Условия акции',
      link: drawRulesDocPath,
      target: '_blank'
    },
    {
      text: 'footerMain.knowledgeBase',
      link: 'https://help.checkin.ru/knowledge-base/articles/partners',
      target: '_blank'
    },
  ],
}

function FooterNavigation() {
  const { t } = useTranslation()
  const dispatcher = useDispatch()
  const { socialMedias, footerLinks } = useSelector(state => state.general)

  useEffect(() => {
    if (!socialMedias) {
      dispatcher(getSocialMedias())
    }
    if (!footerLinks.length) {
      dispatcher(getFooterLinks())
    }
  }, [])

  const templateServiceLinks = hardCodeLinks.service.map((elem, id) => {
    return (
      <div className={classes.item} key={id}>
        <NavLink key={id} className={classes.link} to={elem.link}>{t(elem.name)}</NavLink>
      </div>
    )
  })

  const templateUsersLinks = hardCodeLinks.users.map((elem, id) => {
    return (
      <div className={classes.item} key={id}>
        <a key={id} target={elem.target} className={classes.link} href={elem.link}>{t(elem.name)}</a>
      </div>
    )
  })

  const templateCommonLinks = useMemo(() => {

    const links = hardCodeLinks.common
    const link = links.filter(val => val.link === footerLinks.link)

    if (!link.length && footerLinks.link) {
      links.push(footerLinks)
    }

    return links.map((elem, id) => {
      return (
        <div className={classes.item} key={id}>
          <a key={id} target={elem.target} className={classes.link} href={elem.link}>{t(elem.text)}</a>
        </div>
      )
    })
  }, [footerLinks])

  const templateSocialMedias = useMemo(() => {
    if (!socialMedias) return
    let arrSocials = []
    for (const social in socialMedias) {
      if (social === "id") continue
      else {
        arrSocials.push({ type: social, href: socialMedias[social] })
      }
    }
    return arrSocials.map((elem, id) => {
      return (
        <SocialMediaItem key={id} type={elem.type} social={elem}></SocialMediaItem>
      )
    })
  }, [socialMedias])

  return (
    <div className={classes.wrap}>
      <div className={classes.grid}>
        <div className={classes.unit}>
          <div className={[classes.unit_title, classes.unit_title_blue].join(" ")}>{t("footerMain.service")}</div>
          <div className={[classes.list, classes.list_double].join(" ")}>{templateServiceLinks}</div>
        </div>
        <div className={classes.unit}>
          <div className={[classes.unit_title, classes.unit_title_blue].join(" ")}>{t("footerMain.users")}</div>
          <div className={[classes.list, classes.list_double].join(" ")}>{templateUsersLinks}</div>
        </div>
        <div className={classes.unit}>
          <div className={[classes.unit_title, classes.unit_title_blue].join(" ")}>{t("footerMain.partnerTitle")}</div>
          <div className={classes.list}>{templateCommonLinks}</div>
        </div>
        {(templateSocialMedias && templateSocialMedias.length) ? <div className={classes.unit}>
          <div
            className={[classes.unit_title, classes.unit_title_blue].join(" ")}>{t("footerMain.socialMedias")}</div>
          <div className={classes.unit_social}>{templateSocialMedias}</div>
        </div> : ""}
      </div>
      <div className={classes.app}>
        <AppDownload/>
      </div>
      <div className={classes.copyright}>
        <p className={classes.copyright_text}>{t("footerMain.copyRight")}</p>
      </div>
    </div>
  )
}

export default FooterNavigation