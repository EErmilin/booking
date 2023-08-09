import React, {useEffect, useState} from "react"
import classes from "./FilterMain.module.scss"
import "./FilterMain.scss"
import SearchInputAsync from "../UI/areas/SearchInputAsync/SearchInputAsync";
import FilterDateFromTo from "../UI/FilterItems/FIlterDateFromTo/FIlterDateFromTo";
import { useTranslation } from "react-i18next";
import Button from "../UI/btns/Button/Button";
import { dispatchObjectToUrl } from "../../functions/dispatchObjectToUrl";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useDispatch } from "react-redux";
import { getSearch } from "../../store/actions/catalogActions";
import EmptyModal from "../UI/modals/EmptyModal/EmptyModal";


/**
 * Фильтры для главной
 * @returns {JSX.Element}
 * @constructor
 */


function FilterMain({ filters, setFilters }) {
    const { t } = useTranslation()
    const [isError, setIsError] = useState()
    const [showEmptySearchModal, setShowEmptySearchModal] = useState(false)
    const [isPreview, setIsPreview] = useState(true)
    const dispatcher = useDispatch()
    const [isFocus, setIsFocus] = useState(false)
    const navigate = useNavigate()
    const [defaultOptions,setDefaultOptions] = useState([])
    /**Обработчик фильтров даты*/
    function handleChangeDate({ startDate, endDate }) {
        setFilters(prevState => ({
            ...prevState,
            dateFrom: startDate ? startDate : prevState.dateFrom,
            dateTo: endDate
        }))
    }


    /**Обработчик фильтров гостей*/
    function handleChangeGuest({ adults, children }) {
        setFilters(prevState => ({
            ...prevState,
            adults: adults,
            children: children
        }))
    }
    /**Обработчик строки поиска*/
    function handleChangeSearch(value) {
        setIsFocus(false)
        setIsError(false)
        setFilters(prevState => ({ ...prevState, search: value }))
    }

    const emptySearchModal = showEmptySearchModal && <EmptyModal
        close={true}
        background="blue"
        btnCancelClick={() => setShowEmptySearchModal(false)}
        width={420}
        typeModal="withoutBack"
    >
        <h2>Где будете отдыхать?</h2>
        <p>Выберите направление или объект</p>
    </EmptyModal>

    /** Формирование фильтров */
    function findInCatalog() {
        if (filters.search.type === "city-region") {
            const filtersObg = {
                adults: filters.adults,
                children: filters.children,
                name: filters.search.name,
                city_region_id: filters.search.city_region_id,
                type: filters.search.type,
                dateFrom: filters.dateFrom ? filters.dateFrom.format('YYYY-MM-DD') : moment(new Date()).add(2, 'days'),
                dateTo: filters.dateTo ? filters.dateTo.format('YYYY-MM-DD') : moment(new Date()).add(3, 'days'),
            }
            // if (isPreview) {
            //     Object.assign(filtersObg, { preview: true })
            // }
            const filtersUrl = dispatchObjectToUrl(filtersObg)
            return filtersUrl
        } else {
            const filtersObg = {
                adults: filters.adults,
                children: filters.children,
                name: filters.search.name,
                id: filters.search.id,
                type: filters.search.type,
                dateFrom: filters.dateFrom ? filters.dateFrom.format('YYYY-MM-DD') : moment(new Date()).add(2, 'days'),
                dateTo: filters.dateTo ? filters.dateTo.format('YYYY-MM-DD') : moment(new Date()).add(3, 'days'),
            }
            // if (isPreview) {
            //     Object.assign(filtersObg, { preview: true })
            // }
            const filtersUrl = dispatchObjectToUrl(filtersObg)
            return filtersUrl
        }
    }

    const loadOptions = async function (event) {
        let names = await dispatcher(getSearch(event))
        const regions = names.filter(elem => elem.type === 'region');
        regions[regions.length - 1] = {
            ...regions[regions.length - 1],
            isLast: true
        }
        const hotels = names.filter(elem => elem.type === 'hotel');
        const cityRegion = names.filter(elem => elem.type === 'city-region');
        cityRegion[cityRegion.length - 1] = {
            ...cityRegion[cityRegion.length - 1],
            isLast: true
        }
        const options = [...cityRegion, ...regions, ...hotels];

        return options.map(elem => {
            return {
                label: elem.isLast ? <div>
                    <div className={[elem.type, 'search-async-input__option-label'].join(' ')}><i></i>
                        <span>{elem.name}{elem.type == `region` ? `, ${elem.region}` : ""}{elem.type == `hotel` ? `, ${elem.city}` : ""}</span></div>
                    <div className="is-last"></div>
                </div> :
                    <div className={[elem.type, 'search-async-input__option-label'].join(' ')}><i></i>
                        <span>{elem.name}{elem.type == `region` ? `, ${elem.region}` : ""}{elem.type == `hotel` ? `, ${elem.city}` : ""}</span></div>,
                name: elem.name,
                value: elem.id,
                id: elem.id,
                type: elem.type,
                city_region_id: elem.id
            }
        })
    }
    /** Подтягиваем дефолтные поля для поиска */
    async function loadDefaultSearch(){
        const result = await loadOptions()
        setDefaultOptions(result)
    }
    useEffect(()=>{
        loadDefaultSearch()
    },[])
    const onSearch = () => {
        if (!filters.search) return setIsError(true)
        if (filters.search.type === 'hotel') {
            const { search, dateFrom, dateTo, adults, children } = filters;
            navigate(`/hotel?id=${search.id}&dateFrom=${dateFrom.format('YYYY-MM-DD')}&dateTo=${dateTo.format('YYYY-MM-DD')}&adults=${adults}&children=${children}`)
        } else {
            navigate(`catalog/1${`${findInCatalog().length ? `?${findInCatalog()}` : ``}`}`)
        }
    }
    return (
        <div className={[classes.wrap, 'filter-main'].join(" ")}>
            {emptySearchModal}
            <div className={classes.container}>
                <SearchInputAsync
                    value={isFocus ? { label: '' } : filters.search}
                    onChange={handleChangeSearch}
                    placeholder={t('filters.search')}
                    loadOptions={loadOptions}
                    className={classes.search_input}
                    icon={classes.search_input_icon}
                    inputWrapClass={classes.search_input_wrap}
                    onFocus={() => {
                        setIsFocus(true)
                    }}
                    onBlur={() => {
                        setIsFocus(false)
                    }}
                    defaultOptions={defaultOptions}
                    cacheOptions
                />
                {isError && <p className={classes.search_input_error}>Укажите название населенного пункта или объекта</p>}
                <div className={classes.filters_bar}>
                    <div className={classes.filters_wrp}>
                        <FilterDateFromTo
                            type="date"
                            state={{ dateFrom: filters.dateFrom, dateTo: filters.dateTo }}
                            onChange={handleChangeDate}
                        ></FilterDateFromTo>
                        <FilterDateFromTo
                            className={classes.mg_8}
                            type="guest"
                            state={{ adults: filters.adults, children: filters.children }}
                            onChange={handleChangeGuest}
                        ></FilterDateFromTo>
                    </div>
                    <Button
                        id="button_mainpage_guest_b2c_check_prices"
                        className={[classes.btn_search, "button_mainpage_guest_b2c_check_prices"].join(" ")}
                        btnColor="ButtonWhite"
                        onClick={() => onSearch()}
                    >{t("filters.btnSearch")}
                    </Button>
                </div>
            </div>
            {/*<Checkbox*/}
            {/*    classNameCheckBox={classes.preview_check}*/}
            {/*    classNameLabel={classes.preview}*/}
            {/*    checked={!isPreview}*/}
            {/*    onChange={() => {*/}
            {/*        setIsPreview(!isPreview)*/}
            {/*    }}*/}
            {/*    text={'Искать объекты с «Бронированием»'}></Checkbox>*/}
        </div>
    )
}

export default FilterMain