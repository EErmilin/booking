import React, { useEffect, useState } from "react"
import Button from "../UI/btns/Button/Button"
import image from "../../assets/image/percentImg.png"
import useWindowSize from "../../hooks/useWindowSize"
import classes from "./Discount.module.scss"
import { useDispatch, useSelector } from "react-redux"
import { getDiscountPecent } from "../../store/actions/bookingActions"
import { useNavigate } from "react-router-dom"


function Discount({ isTinny, isCatalog, isShowMap }) {
    const windowSize = useWindowSize()
    const dispatcher = useDispatch()
    const isAuth = useSelector(state => state.auth.isAuth)
    const [isShow, setIsShow] = useState(!isAuth)
    const navigate = useNavigate()

    useEffect(() => {
        if (isAuth) {
            const fetchData = async () => {
                const response = await dispatcher(getDiscountPecent())
                if (response.success) {
                    setIsShow(!!response.discountPercent)
                }
            }
            fetchData()
        }
    }, [])


    const cls = [classes.discount_wrp]
    if (isShowMap) cls.push(classes.discount_catalog_on_map)
    if (isCatalog) cls.push(classes.discount_catalog_wrp)
    if (isTinny) cls.push(classes.discount_tinny_wrp)

    const clsPercentWrp = [classes.discount_percent_wrp]
    if (isCatalog) clsPercentWrp.push(classes.discount_catalog_percent_wrp)
    if (isTinny) clsPercentWrp.push(classes.discount_tinny_percent_wrp)

    const clsPercent = [classes.discount_percent]
    if (isCatalog) clsPercent.push(classes.discount_catalog_percent)
    if (isTinny) clsPercent.push(classes.discount_tinny_percent)

    const clsImg = [classes.discount_img]
    if (isCatalog) clsImg.push(classes.discount_catalog_img)
    if (isTinny) clsImg.push(classes.discount_tinny_img)

    const clsText = [classes.discount_text]
    if (isCatalog) clsText.push(classes.discount_catalog_text)
    if (isTinny) clsText.push(classes.discount_tinny_text)

    const clsTextImg = [classes.discount_text_img]
    if (isCatalog) clsTextImg.push(classes.discount_catalog_text_img)
    if (isTinny) clsTextImg.push(classes.discount_tinny_text_img)



    if (!isShow) return null
    return (
        <div className={cls.join(' ')}>
            <div className={clsPercentWrp.join(' ')}>
                <span className={clsPercent.join(' ')}>10%</span>
                {((isTinny ? windowSize.width <= 767 : isCatalog ? windowSize.width <= 1024 : windowSize.width <= 769) || isShowMap) && <div className={clsText.join(' ')}>Зарегистрируйся

                    и получи скидку
                    на первое бронирование</div>}
                {!isTinny && <Button
                     onClick={()=>navigate('/auth/register')}
                        className={classes.discount_btn}
                    >Зарегистрироваться</Button>
              }
            </div>
            <div className={clsText.join(' ')}>
                {(isTinny ? windowSize.width > 767 : isCatalog ? windowSize.width > 1024 : windowSize.width > 769) && !isShowMap && <div className={classes.text}>Зарегистрируйся и&nbsp;получи скидку
                    на&nbsp;первое бронирование</div>}
                    {!isTinny && <div className={clsTextImg.join(' ')} />}
            </div>
            {isTinny &&
                        <Button
                            onClick={()=>navigate('/auth/register')}
                            className={classes.discount_tinny_btn}
                        >Зарегистрироваться</Button>}

            <div className={clsImg.join(' ')}>
                <img src={image} alt="" />
            </div>
        </div>
    )
}

export default Discount
