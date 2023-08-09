import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classes from './Pagination.module.scss';


const Pagination = ({
                                  className,
                                  quantityRecords,
                                  limit,
                                  onPrev,
                                  onNum,
                                  onNext,
                                  currentPage,
                                  typePagination
                              }) => {
    const { t } = useTranslation();

    const cls = [classes.Pagination];
    if (className) {
        cls.push(className);
    }


    /** Получаем число страниц */
    const quantityPage = Math.ceil(quantityRecords / (limit))

    /** Активная страница */
    const [activePage, changeActivePage] = useState(1);

    /** Перерисовка при изменении текущей страницы */
    useEffect(() => {
        changeActivePage(currentPage ? +currentPage : 1);
    }, [currentPage, changeActivePage]);

    /** Предыдущая страница */
    const prevPage = () => changeActivePage(activePage - 1);

    /** Нумерованая страница */
    const numPage = (num) => changeActivePage(num);

    /** Следующая страница */
    const nextPage = () => changeActivePage(activePage + 1);

    /** Prev шаблон */
    const prev = (
        <span
            className={classes.prev}
            onClick={async () => {
                if(activePage-1!==0){
                    const success = await onPrev(activePage - 1);
                    if (success) {
                        prevPage();
                    }
                }
            }}
            onKeyPress={async () => {
                if(activePage-1!==0){
                    const success = await onPrev(activePage - 1);
                    if (success) {
                        prevPage();
                    }
                }
            }}
            role="button"
            tabIndex="0"
        >
    </span>
    );

    /** Next шаблон */
    const next = (
        <span
            className={classes.next}
            onClick={async () => {
                if(activePage !== quantityPage){
                    const success = await onNext(activePage + 1);
                    if (success) {
                        nextPage();
                    }
                }
            }}
            onKeyPress={async () => {
                if(activePage !== quantityPage){
                    const success = await onNext(activePage + 1);
                    if (success) {
                        nextPage();
                    }
                }
            }}
            role="button"
            tabIndex="0"
        >
    </span>
    );

    /** Dot шаблон */
    const dot = <span className={classes.dot}>...</span>;

    /** Шаблон последней страницы */
    const lastPage = (
        <span
            className={classes.num}
            onClick={async (event) => {
                const page = +event.target.textContent;
                const success = await onNum(page);
                if (success) {
                    numPage(quantityPage);
                }
            }}
            onKeyPress={async (event) => {
                const page = +event.target.textContent;
                const success = await onNum(page);
                if (success) {
                    numPage(quantityPage);
                }
            }}
            role="button"
            tabIndex="0"
        >
      {quantityPage}
    </span>
    );
    const lastPageActive = (
        <span className={[classes.num, classes.active].join(' ')}>
      {quantityPage}
    </span>
    );
    /** Шаблон последней страницы */
    const firstPage = (
        <span
            className={classes.num}
            onClick={async (event) => {
                const page = +event.target.textContent;
                const success = await onNum(page);
                if (success) {
                    numPage(page);
                }
            }}
            onKeyPress={async (event) => {
                const page = +event.target.textContent;
                const success = await onNum(page);
                if (success) {
                    numPage(page);
                }
            }}
            role="button"
            tabIndex="0"
        >
    {1}
  </span>
    );





    /** Шаблон остальных пяти страниц */
    const otherThreePages = [];
    let startPage;

    if (quantityPage >= activePage) {
        startPage = activePage;
    }else {
        startPage = 1;
    }
    let restPages = quantityPage-startPage;
    let missingPage = quantityPage<3?startPage-(startPage-1):(quantityPage-restPages)

    let condition =  (startPage>=3?(restPages<3?missingPage-1:startPage-1):missingPage)
    for (let i = condition;
         (i < (condition+3) && i < quantityPage);
         i += 1) {
        if (i === activePage) {
            otherThreePages.push(
                <span className={[classes.num, classes.active].join(' ')} key={i}>
      {i}
    </span>
            );
            continue;
        }
        otherThreePages.push(
            <span
                className={classes.num}
                key={i}
                onClick={async (event) => {
                    const page = +event.target.textContent;
                    const success = await onNum(page);
                    if (success) {
                        numPage(page);
                    }
                }}
                onKeyPress={async (event) => {
                    const page = +event.target.textContent;
                    const success = await onNum(page);
                    if (success) {
                        numPage(page);
                    }
                }}
                role="button"
                tabIndex="0"
            >
    {i}
  </span>
        );
    }


    return (
        quantityPage > 1 && (
            <div className={cls.join(' ')}>
                {prev}
                <div className={classes.nums}>
                    {(activePage !== 1) && (quantityPage>=3)?firstPage:''}
                    {((activePage >= 3) && (quantityPage>3)) && dot}
                    {otherThreePages}
                    {quantityPage - activePage > 2 && dot}
                    {activePage === quantityPage ? lastPageActive : lastPage}
                </div>
                {next}
            </div>
        )
    );
};



export default Pagination;
