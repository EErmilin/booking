import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Pagination from '../components/UI/other/Pagination/Pagination';


/**
 * Пагинация
 * @param getInfo
 * @param limit
 * @param total
 * @param otherParams
 * @param className
 * @param limitKanban
 * @param getInfoSuccessCallback
 * @param callback
 * @returns {[*]}
 */
export default function usePagination(
    {
        getInfo,
        limit,
        total,
        otherParams = {},
        className,
        getInfoSuccessCallback,
        typePagination = 1,
        urlParams
    },
    callback
) {
    /** Объект истории */
    const history = useNavigate();

    /** Объект местоположения */
    const location = useLocation();

    /** Параметры роутов */
    const routeParams = useParams();
    const { page } = routeParams;

    /** Параметры запроса списка */
    const [param, changeParam] = useState({ limit, offset: 0 });
    const currentOffset = limit * (+page - 1);
    if (!Number.isNaN(currentOffset) && param.offset !== currentOffset) {
        changeParam({ ...param, offset: currentOffset });
    }

    /** Функция получения информации */
    const getInfoCallback = useCallback(() => {
        getInfo({ ...param, ...otherParams }).then(
            () => getInfoSuccessCallback && getInfoSuccessCallback()
        );
    }, [getInfo, getInfoSuccessCallback, param, otherParams]);

    /** Получаем инфу */
    useEffect(() => {
        getInfoCallback();
    }, [getInfoCallback]);

    /** Выполняется при кликах на пагинации */
    const onHandlerPagination = (num) => {
        if (callback) {
            callback();
        }

        /** Убираем параметр страницы из пути если он есть */
        const arrPathWithoutParamPage = location.pathname.split('/');
        if (page) {
            arrPathWithoutParamPage.splice(arrPathWithoutParamPage.length - 1, 1);
        }
        const pathWithoutParamPage = arrPathWithoutParamPage.join('/');

        /** Перебрасываем на url страницы */
        history({ pathname: `${pathWithoutParamPage}/${num}${urlParams ? '?' + urlParams : ''}` });

        const newParam = {
            ...param,
            limit: limit,
            offset: limit * (num - 1),
            page: num,
        };
        changeParam(newParam);

        return true;
    };
    const pagination = (
        <Pagination
            className={className}
            quantityRecords={total}
            currentPage={page}
            limit={limit}
            onPrev={onHandlerPagination}
            onNum={onHandlerPagination}
            onNext={onHandlerPagination}
            typePagination={2}
        />
    );

    return [pagination];
}
