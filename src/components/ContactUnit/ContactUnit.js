import React, { useMemo } from 'react'
import classes from './ContactUnit.module.scss'
import { useTranslation } from "react-i18next";

export default function ContactUnit({ contacts, className }) {
    const { t } = useTranslation()
    const cls = [classes.list]
    if (className) cls.push(className)


    return (
        <div className={cls.join(" ")}>
            {/* <div className={classes.item}>
                <div className={classes.label}>
                    {t("contacts.phone")}
                </div>
                <div className={classes.values}>
                    <span>{contacts.contact_phone}</span>
                    <span>{contacts.contact_phone_additional}</span>
                </div>
            </div> */}
            <div className={classes.item} >
                <div className={classes.label}>
                {t("contacts.issueResolutionDepartment")}
                </div>
                <div className={classes.values}>
                    {!!contacts.email && <span><a href={`mailto:${contacts.email}`}>{contacts.email}</a></span>}
                </div>
            </div>            <div className={classes.item} >
                <div className={classes.label}>
                    {t("contacts.departmentForWorkWithPartners")}
                </div>
                <div className={classes.values}>
                    {!!contacts.email_1 && <span><a href={`mailto:${contacts.email_1}`}>{contacts.email_1}</a></span>}
                </div>
            </div>
            <div className={classes.item} >
                <div className={classes.label}>
                    {t("contacts.address")}
                </div>
                <div className={classes.values}>
                    {contacts.address.ru}
                </div>
            </div>
        </div>
    )
}