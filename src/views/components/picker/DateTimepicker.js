import React, { useState } from "react"
import DatePicker from "react-datepicker"
import moment from 'moment'
import { ko } from  "date-fns/esm/locale"

function DateTimepicker({value, setDate}) {

    let selected
    if(value != null && value != '') {
        selected = new Date(value)
    } else {
        selected = value
    }

    const toChange = (date) => {
        const selecteDate = new Date(date)
        if(date != null && date != '') {
            setDate(new moment(date, 'YYYY-MM-DD hh:mm').format('YYYY-MM-DD hh:mm'))
        } else {
            setDate(date)
        }
        
    }

    return(
        <>
            <DatePicker
                className="form-control date_picker"
                locale={ko}
                timeInputLabel="Time:"
                dateFormat="yyyy-MM-dd hh:mm"
                selected={selected}
                onChange={(date) => toChange(date)}
                placeholder="기간입력"
                showTimeInput
            />
        </>
    );
}

export default DateTimepicker;