import React from "react"
import classes from "./TableCustom.module.scss"
import {Table} from "antd";
import TableCustomHeaderCell from "../TableCustomHeaderCell/TableCustomHeaderCell";
import moment from "moment";
import TableCustomCell from "../TableCustomCell/TableCustomCell";


function TableCustom({tableInfo,hotelId,filters}){


    const headersColumn = (()=>{
        let initialValue = {
            title:()=><TableCustomHeaderCell isStart></TableCustomHeaderCell>,
            dataIndex:"default",
            width: 300,
            fixed: 'left',
            key:"default",
            render:(plan)=><TableCustomCell plan={plan}></TableCustomCell>
        }
        let arr = []
        let arrMonth = []
        for (const date in tableInfo.roomDates) {
            arr.push({
                title:()=><TableCustomHeaderCell text={date}></TableCustomHeaderCell>,
                dataIndex: date,
                key: `cell-${tableInfo.roomDates[date]?.id}`,
                month:+moment(date).format("MM"),
                date:date,
                render:(plansInfo)=><TableCustomCell
                    filters={filters}
                    hotelId={hotelId}
                    infoRoom={tableInfo}
                    plansInfo={plansInfo}
                    isActive={tableInfo.roomDates[date].isActive}
                ></TableCustomCell>
            })
        }
        arr.forEach((elem)=>{
            if(!arrMonth.find(e=>e.month == elem.month)){
                arrMonth.push({
                    title:()=><TableCustomHeaderCell text={elem.date} isMonth></TableCustomHeaderCell>,
                    dataIndex:`month-${elem.month}`,
                    key: `month-${elem.month}`,
                    children:arr.filter(children=>children.month === elem.month),
                    month:elem.month
                })
            }
        })
        return [initialValue,...arrMonth]
    })()
    const roomsOnSale = (()=>{
        let obj = {}
        for (const date in tableInfo.roomDates) {
            obj[date] = {...tableInfo.roomDates[date],roomsOnSale:true}
        }
       return {
           default:{
               roomsOnSale:true,
               title:"Номера на продажу",
               subTitle:"Осталось на продажу"
           },
           ...obj
       }
    })()
    const tariffPlans = (()=>{
        return tableInfo.plans.reduce((array,value,id)=>{
            const objDate = value.planDates.reduce((a, v) => ({ ...a, [v.date]: v}),{})
            const objMinStay = value.planDates.reduce((a, v) => ({ ...a, [v.date]: {...v,isMinStay:true}}),{})
            return [...array,{
                key:`cell-price-${id}`,
                default:value,
                ...objDate
            },{
                key:`cell-min-stay-${id}`,
                default: {isMinStay:true},
                ...objMinStay
            }]
        },[])
    })()
    return (
        <Table
            bordered
            columns={headersColumn}
            className={classes.table}
            dataSource={[roomsOnSale,...tariffPlans]}
            pagination={false}
        ></Table>
    )
}

export default TableCustom