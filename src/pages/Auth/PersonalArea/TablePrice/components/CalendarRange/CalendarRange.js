import React from "react"
import { DatePicker, ConfigProvider } from 'antd';
import ruRU from 'antd/lib/date-picker/locale/ru_RU';
import moment from "moment";
import 'moment/locale/ru';
moment.locale('ru');

function CalendarRange ({
                     value,
                     onChange,
                     disableDatesCount,
                     errorMessage,
                     className,
                   }){
  const cls = []
  if(className)cls.push(className)
  const disabledDate = (current) => {
    if (!value) {
      return false;
    }
    const tooLate = value[0] && current.diff(value[0], 'days') > disableDatesCount;
    const tooEarly = value[1] && value[1].diff(current, 'days') > disableDatesCount;
    return !!tooEarly || !!tooLate;
  };

  /**
   * Если поле инвалидно
   * то добавляем классы для инвалидного поля,
   * иначе, если поле было тронуто добавляем классы для валидного
   */
  if (errorMessage) {
    cls.push("ant-picker-range-custom_invalid");
  }
  const errorMassage = errorMessage && <span>{errorMessage}</span>
  return (
    <div className={cls.join(' ')}>
      <ConfigProvider local={ruRU}>
        <DatePicker.RangePicker
          className="ant-picker-range-custom"
          popupClassName="ant-picker-popup-custom"
          onChange={(value)=>{
            onChange(value)
          }}
          disabledDate={disableDatesCount?disabledDate:null}
          value={value}
          dateFormat={"DD.MM.YY"}
          locale={ruRU}
        ></DatePicker.RangePicker>
      </ConfigProvider>
      {errorMassage}
    </div>
  )
}

export default CalendarRange