import React from 'react'
import classes from './SearchPanel.module.scss'

export default function SearchPanel({filters, toggleModal}) {
    return(
        <div className={classes.wrap} onClick={toggleModal}>
            <div className={classes.content}>
                <div className={classes.top}>
                    {filters.region.id &&
                        <div className={classes.search}>
                            {filters.region.label}
                        </div>
                    }
                </div>
                <div className={classes.bottom}>
                    <div className={classes.option}>
                        {filters.dateFrom && filters.dateFrom.format('DD.MM.YY')} - {filters.dateTo && filters.dateTo.format('DD.MM.YY')}
                    </div>
                    <div className={classes.option}>
                        {filters.adults} взрослых ∙ {filters.children} детей
                    </div>
                </div>
            </div>
        </div>
    )
}