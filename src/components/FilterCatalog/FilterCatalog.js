import React, { useEffect, useState } from "react"
import classes from "./FilterCatalog.module.scss"
import "./FilterCatalog.scss"
import { useTranslation } from "react-i18next";
import CalendarDropdownV2 from "../Dropdown/CalendarDropdownV2/CalendarDropdownV2";
import GuestDropDown from "../Dropdown/GuestDropDown/GuestDropDown";
import SearchInputAsync from "../UI/areas/SearchInputAsync/SearchInputAsync";
import Checkbox from "../UI/areas/Checkbox/Checkbox";
import Button from "../UI/btns/Button/Button";
import PriceToPrice from "../UI/areas/PriceToPrice/PriceToPrice";
import PriceRangeSlider from "../UI/areas/PriceRangeSlider/PriceRangeSlider";
import { useDispatch, useSelector } from "react-redux";
import { clearCity, clearHotels, getHotels, getSearch } from "../../store/actions/catalogActions";
import useWindowSize from "../../hooks/useWindowSize"
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import FiltersTypeHotel from "../../pages/NotAuth/Catalog/components/FiltersTypeHotel/FiltersTypeHotel";
import moment from "moment";
import FiltersStars from "../../pages/NotAuth/Catalog/components/FiltersStars/FiltersStars";
import FiltersAmenity from "../../pages/NotAuth/Catalog/components/FiltersAmenitys/FiltersAmenitys";
import FiltersSight from "../../pages/NotAuth/Catalog/components/FiltersSight/FiltersSight";
import FiltersArrival from "../../pages/NotAuth/Catalog/components/FiltersArrival/FiltersArrival";
import FiltersMealType from "../../pages/NotAuth/Catalog/components/FiltersMealType/FiltersMealType";
import FiltersPopularFilters from "../../pages/NotAuth/Catalog/components/FiltersPopularFilters/FiltersPopularFilters";
import FilterSubway from "../../pages/NotAuth/Catalog/components/FilterSubway/FilterSubway";
import { getKeyByValue } from "../../functions/getKeyByValue";
import { catalogFiltersConfig } from "../../pages/NotAuth/Catalog/constants/catalogFiltersConfig";

const priceCheckBoxes = [
    {
        label: "600 ₽ — 1 500 ₽",
        value: [600, 1500]
    },
    {
        label: "1 500 ₽ — 4 000 ₽",
        value: [1500, 4000]
    },
    {
        label: "4 000 ₽ — 6 000 ₽",
        value: [4000, 6000]
    },
    {
        label: "6 000 ₽ +",
        value: [6000, 999999]
    },

]


function FilterCatalog({
    filters,
    onChange,
    setIsCityCenter,
    className,
    toggleAllFilterModal,
    showAllFilterModal,
    isShowMap,
    setLastFilter,
    lastFilter
}) {
    const { t } = useTranslation()
    const { page } = useParams()
    const windowSize = useWindowSize()
    const [isError, setIsError] = useState()
    const cls = [isShowMap ? classes.map : classes.default]
    if (className) cls.push(className)
    const url = useLocation()
    const dispatcher = useDispatch()
    const city = useSelector(state => state.catalog.city)
    const [options, setOptions] = useState([])
    const [isFocus, setIsFocus] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams();
    const [sliderPriceMin, setSliderPriceMin] = useState(filters.minPrice)
    const [sliderPriceMax, setSliderPriceMax] = useState(filters.maxPrice)
    const [price, setPrice] = useState([])
    const ulrDateFrom = searchParams.get("dateFrom") ? moment(searchParams.get("dateFrom")) : filters.dateFrom
    const ulrDateTo = searchParams.get("dateTo") ? moment(searchParams.get("dateTo")) : filters.dateTo
    const hotels = useSelector(state => state.catalog.hotels)
    const [dateTo, setDateTo] = useState(ulrDateTo)
    const [dateFrom, setDateFrom] = useState(ulrDateFrom)
    const filtersCatalog = useSelector(state => state.catalog.filters)
    let sums = searchParams.get("sumCheckboxs")
    const [adults, setAdults] = useState(searchParams.get("adults"))

    useEffect(() => {
        setAdults(adults)
        setDateTo(ulrDateTo)
        setDateFrom(ulrDateFrom)
    }, [url])

    // Ставим цены из чекбоксов
    useEffect(() => {
        let priceArray = [];
        if (sums?.includes('0')) {
            priceArray = priceArray.concat([600, 1500])
            setPrice(priceArray)
        }
        if (sums?.includes('1')) {
            priceArray = priceArray.concat([1500, 4000])
            setPrice(priceArray)
        }
        if (sums?.includes('2')) {
            priceArray = priceArray.concat([4000, 6000])
            setPrice(priceArray)
        }
        if (sums?.includes('3')) {
            priceArray = priceArray.concat([6000, 999999])
            setPrice(priceArray)

        }
    }, [sums])


    const checkBoxesPrice = priceCheckBoxes.map((elem, key) => {
        const isChecked = sums ? sums.includes(key) : false
        let priceArray = [];
        let indexMaxSum;
        let min = 0
        let max = 999999

        return (
            <div className={classes.filter_catalog_all_checkboxes_item} key={key}>
                <Checkbox
                    classNameCheckBox={classes.filter_catalog_all_checkboxes_check}
                    classNameLabel={classes.filter_catalog_all_checkboxes_label}
                    checked={isChecked}
                    onChange={() => {
                        priceArray = price;
                        indexMaxSum = priceArray.indexOf(elem.value[1])
                        if (isChecked) {
                            priceArray = priceArray.slice(0, indexMaxSum - 1).concat(priceArray.slice(indexMaxSum + 1, priceArray.length));
                        } else {
                            priceArray = price.concat(elem.value)
                        }

                        if (priceArray.length) {
                            min = Math.min.apply(null, priceArray)
                            max = Math.max.apply(null, priceArray)
                        }
                        handleChangePriceSlider([(min), (max),])
                        setPrice(priceArray)
                        setSumCheckboxs(key)
                    }}
                    text={elem.label}></Checkbox>
            </div >
        )
    })
    /** Обработчик фильтров заезда */
    function arrivalHandler(arrivalObj) {
        if (filters.arrival_time_after.includes(arrivalObj.after)) {
            let arrAfter = [].concat(filters.arrival_time_after)
            let indexAfter = arrAfter.indexOf(arrivalObj.after)
            arrAfter.splice(indexAfter, 1)
            onChange(prevState => ({
                ...prevState,
                arrival_time_after: arrAfter,
            }))

        } else {
            onChange(prevState => ({
                ...prevState,
                arrival_time_after: [...prevState.arrival_time_after, arrivalObj.after],
            }))
            setLastFilter({ name: "arrival_time_after", value: arrivalObj.after })
        }
    }

    /** Обработчик популярных фильтров */
    const handleChangPopularFilters = (filter) => {
        let keyName = getKeyByValue(catalogFiltersConfig, filter.type)
        if (Array.isArray(filters[filter.type])) {
            if (filters[filter.type].includes(+filter.value ? +filter.value : filter.value)) {
                let array = filters[filter.type].filter(elem => elem !== (+filter.value ? +filter.value : filter.value))
                return onChange(prevState => ({
                    ...prevState,
                    [filter.type]: array
                }))
            } else {
                setLastFilter({ name: keyName, value: filter.value })
                return onChange(prevState => ({
                    ...prevState,
                    [filter.type]: [...prevState[filter.type], (+filter.value ? +filter.value : filter.value)]
                }))
            }
        } else if (filter.type == "stars") {
            return handleChangeStars(filter.value)
        } else if (typeof filters[filter.type] === "number") {
            setLastFilter({ name: keyName, value: Number(!filters[filter.type]) })
            return onChange(prevState => ({
                ...prevState,
                [filter.type]: Number(!prevState[filter.type])
            }))
        }
    }
    /** Обработчик фильтров выезда */
    function departureHandler(departureObj) {
        if (filters.departure_time_before.includes(departureObj.before)) {
            let arrBefore = [].concat(filters.departure_time_before)
            let indexBefore = arrBefore.indexOf(departureObj.before)
            arrBefore.splice(indexBefore, 1)
            onChange(prevState => ({
                ...prevState,
                departure_time_before: [...arrBefore]
            }))
        } else {
            onChange(prevState => ({
                ...filters,
                departure_time_before: [...prevState.departure_time_before, departureObj.before]
            }))
            setLastFilter({ name: "departure_time_before", value: departureObj.before })
        }

    }

    function handleChangeSubway(arr) {
        if (filters.station_ids.length < arr.length) {
            setLastFilter({ name: "station_ids", value: arr[arr.length - 1] })
        }
        onChange(prevState => ({
            ...prevState,
            station_ids: arr
        }))

    }

    function handleChangeCity(value) {
        dispatcher(clearCity())
        dispatcher(clearHotels())
        if (value.type === "city-region") {
            onChange(prevState => ({
                ...prevState,
                region: {
                    id: null,
                    type: value.type,
                    name: value.name,
                    city_region_id: value.id
                },
                type_id: [],
                amenity_ids: [],
                station_ids: [],
                meal_type_ids: [],
                point_of_interest_ids: [],
                shouldUpdate: true
            }))
        } else if (value.type === "hotel") {
            onChange(prevState => ({
                ...prevState,
                region: {
                    id: value.id,
                    type: value.type,
                    name: value.name,
                    city_region_id: value.city_region_id
                },
                type_id: [],
                amenity_ids: [],
                meal_type_ids: [],
                point_of_interest_ids: [],
                shouldUpdate: true
            }))
        }
        else {
            onChange(prevState => ({
                ...prevState,
                region: {
                    id: value.id,
                    type: value.type,
                    name: value.name,
                    city_region_id: null
                },
                type_id: [],
                amenity_ids: [],
                station_ids: [],
                meal_type_ids: [],
                point_of_interest_ids: [],
                shouldUpdate: true
            }))
        }
    }

    function setIsPreview() {
        onChange(prevState => ({
            ...prevState,
            preview: !prevState.preview
        }))
    }

    function setSumCheckboxs(value) {
        const stringValue = value.toString()
        if (sums.indexOf(value.toString()) === -1) {
            onChange(prevState => ({
                ...prevState,
                sumCheckboxs: filters.sumCheckboxs + stringValue,
            }))
        } else {
            onChange(prevState => ({
                ...prevState,
                sumCheckboxs: sums.split(stringValue).join(''),
            }))
        }
    }
    /** Обработчик для рейтинга */
    function handleChangeRating(value) {
        if (filters.rating.includes(value)) {
            onChange(prevState => ({
                ...prevState,
                rating: filters.rating.filter((elem) => elem !== value),
                shouldUpdate: true
            }))
        } else {
            let newInterest = [...filters.rating]
            newInterest.push(value)
            onChange(prevState => ({
                ...prevState,
                rating: newInterest,
                shouldUpdate: true
            }))
            setLastFilter({ name: "reviews_rating_from", value: value })
        }
    }
    const handleChangeStars = (count) => {
        let newFilters = []
        if (filters.stars.includes(count)) {
            newFilters = filters.stars.filter(elem => elem !== count)
        } else {
            newFilters = [...filters.stars]
            newFilters.push(count)
            setLastFilter({ name: "star_rating", value: count })
        }
        onChange((prevState) => ({
            ...prevState,
            stars: newFilters
        }))
    }

    const handleChangeTypeHotel = (idType) => {
        let newFilters = []
        if (filters.type_id.includes(idType)) {
            newFilters = filters.type_id.filter(elem => elem !== idType)
        } else {
            newFilters = [...filters.type_id]
            newFilters.push(idType)
            setLastFilter({ name: "type_id", value: idType })
        }
        onChange((prevState) => ({
            ...prevState,
            type_id: newFilters
        }))
    }

    /**Обработчик даты*/
    function handleChangeDate({ startDate, endDate }) {
        startDate && setDateFrom(startDate)
        setDateTo(endDate)
    }

    /**Обработчик гостей*/
    function handleChangeGuest(value) {
        setAdults(value.adults)
        //onChange(prevState => ({
        //    ...prevState,
        //    adults: value.adults,
        //    children: value.children,
        //    shouldUpdate: false
        //}))
    }
    /**Обработчик цены инпута*/
    function handleChangePrice({ priceMin, priceMax }) {
        if (priceMax > 999999) return
        changePriceSlider([priceMin, priceMax])
        onChange(prevState => ({
            ...prevState,
            minPrice: priceMin,
            maxPrice: priceMax,
            sumCheckboxs: '',
            shouldUpdate: true
        }))
    }
    /**Обработчик цены ближайших*/
    function handleChangeSights(interest_id) {
        if (filters.point_of_interest_ids.includes(interest_id)) {
            onChange(prevState => ({
                ...prevState,
                point_of_interest_ids: filters.point_of_interest_ids.filter((elem) => elem !== interest_id),
                shouldUpdate: true
            }))
        } else {
            let newInterest = [...filters.point_of_interest_ids]
            newInterest.push(interest_id)
            onChange(prevState => ({
                ...prevState,
                point_of_interest_ids: newInterest,
                shouldUpdate: true
            }))
            setLastFilter({ name: "point_of_interest_ids", value: interest_id })
        }

    }
    /**Обработчик цены инпута*/
    function handleChangeAmenity(amenity_id) {
        if (filters.amenity_ids.includes(amenity_id)) {
            onChange(prevState => ({
                ...prevState,
                amenity_ids: filters.amenity_ids.filter((elem) => elem !== amenity_id),
                shouldUpdate: true
            }))
        } else {
            let newAmenity = [...filters.amenity_ids]
            newAmenity.push(amenity_id)
            onChange(prevState => ({
                ...prevState,
                amenity_ids: newAmenity,
                shouldUpdate: true
            }))
            setLastFilter({ name: "amenity_ids", value: amenity_id })
        }

    }
    /**Обработчик ценны слайдера*/
    function handleChangePriceSlider([min, max]) {
        setPrice([])
        changePriceSlider([min, max])
        onChange(prevState => ({
            ...prevState,
            minPrice: min,
            maxPrice: max,
            sumCheckboxs: '',
            shouldUpdate: true
        }))
    }

    const changePriceSlider = ([min, max]) => {
        setSliderPriceMin(min)
        setSliderPriceMax(max)
    }

    function handleChangeCompliment() {
        if (Number(!filters.compliment)) {
            setLastFilter({ name: "has_compliment", value: Number(!filters.compliment) })
        }
        onChange(prevState => ({
            ...prevState,
            compliment: Number(!prevState.compliment),
            shouldUpdate: true
        }))
    }
    function handleChangeVerified() {
        if (!filters.is_verified) {
            setLastFilter({ name: "is_verified", value: 1 })
        }
        onChange(prevState => ({
            ...prevState,
            is_verified: Number(!prevState.is_verified),
            shouldUpdate: true
        }))
    }

    /** Обработчик типов питания */
    function handleChangeMeal(meal_type_id) {
        if (filters.meal_type_ids.includes(meal_type_id)) {
            onChange(prevState => ({
                ...prevState,
                meal_type_ids: filters.meal_type_ids.filter((elem) => elem !== meal_type_id),
                shouldUpdate: true
            }))
        } else {
            let newMeal = [...filters.meal_type_ids]
            newMeal.push(meal_type_id)
            onChange(prevState => ({
                ...prevState,
                meal_type_ids: newMeal,
                shouldUpdate: true
            }))
            setLastFilter({ name: "meal_type_ids", value: meal_type_id })
        }
    }

    const applyFilters = () => {
        if (filters.region.id || filters.region.city_region_id) {
            setIsCityCenter(true)
            onChange(prevState => ({
                ...prevState,
                adults,
                dateTo,
                dateFrom,
                shouldUpdate: true
            }))
        }
        else {
            return setIsError('Укажите город или объект')
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
                    <div className={[elem.type, 'search-async-input-field__option-label'].join(' ')}><i></i>
                        <span>{elem.name}{elem.type == `region` ? `, ${elem.region}` : ""} <span className={classes.city}>{elem.type == `hotel` ? `(${elem.city})` : ''}</span></span></div>
                    <div className={"is-last"}></div>
                </div>
                    : <div className={[elem.type, 'search-async-input-field__option-label'].join(' ')}><i></i>
                        <span>{elem.name}{elem.type == `region` ? `, ${elem.region}` : ""}<span className={classes.city}>{elem.type == `hotel` ? `(${elem.city})` : ''}</span></span></div>,
                name: elem.name,
                value: elem.id,
                id: elem.id,
                type: elem.type,
                city_region_id: elem.type === 'hotel' ? elem.city_id : elem.id
            }
        })
    }
    const filterAllItems = <>
        <div className={classes.filter_catalog_all_item}>
            <h3 className={classes.filter_catalog_all_subtitle}>{t("filterCatalog.search.priceForNight")}</h3>
            <PriceToPrice
                priceMin={sliderPriceMin}
                priceMax={sliderPriceMax}
                className={classes.filter_catalog_all_price_min_max}
                onChange={handleChangePrice}
            ></PriceToPrice>
            <PriceRangeSlider
                max={0}
                max={999999}
                value={[sliderPriceMin, sliderPriceMax]}
                lowerBound={filters.minPrice}
                upperBound={filters.maxPrice}
                onChange={(value) => changePriceSlider(value)}
                onAfterChange={handleChangePriceSlider}
                className={classes.filter_catalog_all_price_range}
            />
            <div className={classes.filter_catalog_all_checkboxes}>
                {checkBoxesPrice}
            </div>
        </div>
        <FiltersPopularFilters filters={filters} onChange={handleChangPopularFilters}></FiltersPopularFilters>
        <div className={classes.filter_catalog_all_item}>
            <h3 className={classes.filter_catalog_all_subtitle}>{t("filterCatalog.search.rating")}</h3>
            <div className={classes.filter_catalog_all_checkboxes}>
                <div className={classes.filter_catalog_all_checkboxes_item}>
                    <Checkbox
                        classNameCheckBox={classes.filter_catalog_all_checkboxes_check}
                        classNameLabel={classes.filter_catalog_all_checkboxes_label}
                        checked={filters.rating.includes(9)}
                        onChange={() => {
                            handleChangeRating(9)
                        }}
                        text={"Превосходно (9+)"}></Checkbox>

                </div>
                <div className={classes.filter_catalog_all_checkboxes_item}>
                    <Checkbox
                        classNameCheckBox={classes.filter_catalog_all_checkboxes_check}
                        classNameLabel={classes.filter_catalog_all_checkboxes_label}
                        checked={filters.rating.includes(8)}
                        onChange={() => {
                            handleChangeRating(8)
                        }}
                        text={"Отлично (8+)"}></Checkbox>

                </div>
                <div className={classes.filter_catalog_all_checkboxes_item}>
                    <Checkbox
                        classNameCheckBox={classes.filter_catalog_all_checkboxes_check}
                        classNameLabel={classes.filter_catalog_all_checkboxes_label}
                        checked={filters.rating.includes(7)}
                        onChange={() => {
                            handleChangeRating(7)
                        }}
                        text={"Очень хорошо (7+)"}></Checkbox>

                </div>
                <div className={classes.filter_catalog_all_checkboxes_item}>
                    <Checkbox
                        classNameCheckBox={classes.filter_catalog_all_checkboxes_check}
                        classNameLabel={classes.filter_catalog_all_checkboxes_label}
                        checked={filters.rating.includes(6)}
                        onChange={() => {
                            handleChangeRating(6)
                        }}
                        text={"Хорошо (6+)"}></Checkbox>

                </div>
                <div className={classes.filter_catalog_all_checkboxes_item}>
                    <Checkbox
                        checked={filters.rating.includes(5)}
                        classNameCheckBox={classes.filter_catalog_all_checkboxes_check}
                        classNameLabel={classes.filter_catalog_all_checkboxes_label}
                        onChange={() => {
                            handleChangeRating(5)
                        }}
                        text={"Неплохо (5+)"}></Checkbox>
                </div>
            </div>
        </div>

        <div className={classes.filter_catalog_all_item}>
            <h3 className={classes.filter_catalog_all_subtitle}>{t("filterCatalog.search.stars")}</h3>
            <FiltersStars filters={filters.stars} onChange={handleChangeStars} />
        </div>

        <div className={classes.filter_catalog_all_item}>
            <h3 className={classes.filter_catalog_all_subtitle}>{t("filterCatalog.search.typeHotel")}</h3>
            <FiltersTypeHotel filters={filters.type_id} onChange={handleChangeTypeHotel}></FiltersTypeHotel>
        </div>
        <FiltersAmenity filtersCatalog={filtersCatalog} filters={filters.amenity_ids}
            onChange={handleChangeAmenity}></FiltersAmenity>
        <FiltersArrival arrival={true} filters={filters} onChange={arrivalHandler}></FiltersArrival>
        <FiltersArrival arrival={false} filters={filters} onChange={departureHandler}></FiltersArrival>
        <FiltersSight onChange={handleChangeSights} filters={filters}></FiltersSight>
        <FiltersMealType onChange={handleChangeMeal} filters={filters.meal_type_ids}></FiltersMealType>
        <div className={classes.filter_catalog_all_item}>
            <h3 className={classes.filter_catalog_all_subtitle}>{t("filterCatalog.search.compliment")}</h3>
            <div className={classes.filter_catalog_all_checkboxes}>
                <div className={classes.filter_catalog_all_checkboxes_item}>
                    <Checkbox
                        checked={filters.compliment}
                        state={filters}
                        classNameCheckBox={classes.filter_catalog_all_checkboxes_check}
                        classNameLabel={classes.filter_catalog_all_checkboxes_label}
                        text={"Есть"}
                        onChange={handleChangeCompliment}
                    />
                </div>
            </div>
        </div>
        <div className={classes.filter_catalog_all_item}>
            <h3 className={classes.filter_catalog_all_subtitle}>Проверено Check in</h3>
            <div className={classes.filter_catalog_all_checkboxes}>
                <div className={classes.filter_catalog_all_checkboxes_item}>
                    <Checkbox
                        checked={filters.is_verified}
                        state={filters}
                        classNameCheckBox={classes.filter_catalog_all_checkboxes_check}
                        classNameLabel={classes.filter_catalog_all_checkboxes_label}
                        text={"Да"}
                        onChange={handleChangeVerified}
                    />
                </div>
            </div>
        </div>
        <FilterSubway setLastFilter={setLastFilter} filters={filters} onChange={handleChangeSubway}></FilterSubway>
    </>

    const valueSearch = (
        filters.region.type === "hotel" ? { label: hotels.length ? hotels[0].name.ru : '', id: filters.region.id } :
            filters.region.id ? { label: city, id: filters.region.id } : (
                filters.region.city_region_id ? { label: city, id: filters.region.city_region_id } :
                    isError ?
                        { label: <span className={classes.filter_catalog_search_error}>{isError}</span>, id: null } :
                        "")
    )

    return (
        <div className={cls.join(" ")}>
            <div className={[classes.filter_catalog_main, 'filter-catalog-main'].join(" ")}>
                <h3 className={classes.filter_catalog_main_title}>{t("filterCatalog.search.title")}</h3>
                <div className={classes.filter_catalog_search}>
                    <div className={classes.filter_catalog_search_field}>
                        <label className={classes.filter_catalog_search_label}>{t("filterCatalog.search.place")}</label>
                        <SearchInputAsync
                            value={valueSearch}
                            name="region_id"
                            className={classes.filter_catalog_search_input}
                            typeField={2}
                            icon={classes.filter_catalog_search_input_icon}
                            placeholder={windowSize.width < 1024 ? 'Укажите место / название объекта' : ''}
                            loadOptions={loadOptions}
                            onChange={(value, action) => {
                                handleChangeCity(value)
                            }}
                            onInputChange={(value, action) => {
                                setIsFocus(false)
                                setIsError(null)
                                if (action.action !== "select-option") return false
                                loadOptions({ target: { name: "region_id", value: value.value } })
                            }}
                            onFocus={() => {
                                setIsFocus(true)
                            }}
                            onBlur={() => {
                                setIsFocus(false)
                            }}
                            defaultOptions={[]}
                        />
                    </div>

                    <div className={'filter-catalog-main-dropdowns'}>
                        <div className={classes.filter_catalog_search_field}>
                            <CalendarDropdownV2
                                state={{ dateTo, dateFrom }}
                                onChange={handleChangeDate}
                                verticalSpacing={windowSize.width >= 1024 ? 100 : 10}
                            />
                        </div>
                        <div className={classes.filter_catalog_search_field}>
                            <label className={classes.filter_catalog_search_label}>{t("filterCatalog.search.guest")}</label>
                            <GuestDropDown
                                noLabel={true}
                                state={{ adults: Number(adults) }}
                                className={classes.filter_catalog_search_guest}
                                classNameDropdown={classes.filter_catalog_search_guest_dropdown}
                                onChange={handleChangeGuest}
                            ></GuestDropDown>
                        </div>
                    </div>

                    {
                        //<div className={classes.filter_catalog_search_field_check}>
                        //                        <Checkbox text={t("filterCatalog.search.travelForWork")}></Checkbox>
                        //                    </div>
                    }

                    <div className={windowSize.width < 1100 ? classes.btn : classes.filter_catalog_search_field_btn}>
                        <Button
                            btnColor={"white"}
                            className={classes.filter_catalog_search_btn}
                            onClick={() => applyFilters()}>
                            {t("filterCatalog.search.findOffers")}
                        </Button>
                    </div>
                </div>
            </div>
            {/*<Button*/}
            {/*    btnColor="outline_blue"*/}
            {/*    className={classes.buttonPreview}*/}
            {/*    onClick={setIsPreview}>{!filters.preview ? 'Перейти к просмотру всех объектов' : <><p>Перейти к просмотру</p> <p>объектов с Бронированием</p></>}</Button>*/}
            <div className={windowSize.width >= 1024 ? classes.filter_catalog_all : showAllFilterModal ? [classes.modal, classes.modal_show].join(" ") : classes.modal}>
                {windowSize.width < 1024 &&
                    <div
                        className={classes.modal_close}
                        onClick={() => { toggleAllFilterModal() }}
                    />
                }
                <h3 className={windowSize.width >= 1024 ? classes.filter_catalog_all_title : classes.modal_title}>{t("filterCatalog.search.allFilters")}</h3>
                {filterAllItems}
            </div>
        </div>
    )
}

export default FilterCatalog