import React, { useState } from "react"
//npm i react-month-picker
import moment from 'moment'
import { ko } from  "date-fns/esm/locale"
import DatePicker from "react-datepicker"

const MonthPicker = ({value, setDate, type, disable}) => {
    let selected
    if(value != null && value != '') {
        selected = new Date(value)
    } else {
        selected = value
    }

    const toChange = (date) => {
        if(date != null && date != ''){
            if(type == 'start'){
                setDate(new moment(date, 'YYYY-MM-01').format('YYYY-MM-01'))
            }else if(type == 'end'){
                //윤년 , 달별 마지막 날짜
                var year =Number(new moment(date, 'YYYY').format('YYYY'))
                var month =Number(new moment(date, 'MM').format('MM'))
                let lastDay= [31,28,31,30,31,30,31,31,30,31,30,31]
                if((year%4==0 && year%100!=0)||(year%400==0)){
                    lastDay[1]=29;
                }
                var dateFormat = 'YYYY-MM-' + lastDay[month-1]
                setDate(new moment(date, dateFormat).format(dateFormat))
            }
            
        } else {
            setDate(date)
        }
    }

    return (
        <>
            <DatePicker
                className="form-control date_picker"
                locale={ko}
                selectsStart
                selected={selected}
                dateFormat="MM/yyyy"
                onChange={(date) => toChange(date)}
                showMonthYearPicker
                disabled={disable}
            />
        </>
    );
};

export default MonthPicker;