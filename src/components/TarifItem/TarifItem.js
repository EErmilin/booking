import React, { useEffect, useMemo, useState } from "react"
import "./TarifItem.scss"
import { useTranslation } from "react-i18next";
import { ReactComponent as GuestIcon } from "../../assets/svg/icons/man-blue.svg"
import Input from "../UI/areas/Input/Input";



function TariffItem({
    id,
    tariff,
    price,
    guestCount,
    onDelete,
    onChange
}) {
    const { t } = useTranslation()
    const [tariffState, setTariff] = useState()

    useEffect(() => {
        if (!price) {
            let obj = {}
            for (let i = 1; i <= guestCount; i++) {
                if (i < 7) {
                    obj[i] = ""
                }
            }
            setTariff({ [tariff.id]: obj })
        } else {
            let obj = {}
            for (let i = 1; i <= guestCount; i++) {
                if (i < 7) {
                    obj[i] = price[i] ? price[i] : ''
                }
            }
            setTariff({ [tariff.id]: obj })
            onChange({ [tariff.id]: obj })
        }

    }, [tariff, guestCount, price])

    function handleChange(id, tariffId, value) {
        let obj = JSON.parse(JSON.stringify(tariffState))
        obj[tariffId][id] = value ? value : ''
        setTariff(obj)
        onChange(obj)
    }
    const templateFields = useMemo(() => {
        return tariffState && [...Array(guestCount)].map((elem, id) => {
            if (id < 6) {
                return (
                    <div className={"tariff_item_wrap"} key={id}>
                        {id < 3 ?
                            <div className="tariff_item_iconGuest">{[...Array(id + 1)].map((elem, key) => <GuestIcon />)}</div> :
                            <div className="tariff_item_iconGuest"><GuestIcon />{`x${id + 1}`}</div>
                        }
                        <Input
                            className={"tariff_item_wrap_input"}
                            typeClsInput="field"
                            name="price"
                            inputmode="numeric"
                            value={tariffState[tariff.id][id + 1]}
                            onChange={(e) => {
                                if (!isNaN(+e.target.value)) {
                                    handleChange(id + 1, tariff.id, +e.target.value)
                                }
                            }}
                        ></Input>
                    </div>
                )
            }
        })

    }, [guestCount, tariffState])

    return (
        <div className={"tariff_item"}>
            <h2 className={"tariff_item_title"}>Тариф {tariff.name && tariff.name.ru}</h2>
            <p className={"tariff_item_breakfast"}>Тип питания: {tariff.mealType?tariff.mealType.name.ru:"Стандарт"}</p>
            <div className={"tariff_item_header"}>
                <span className={"tariff_item_header_title"}>Кол-во гостей</span>
                <span className={"tariff_item_header_title"}>Укажите базовую стоимость</span>
            </div>
            {templateFields}
            {guestCount < 7 ? '' : <div className="tariff_item_iconGuest">До {guestCount} человек</div>}
        </div>
    )
}

export default TariffItem