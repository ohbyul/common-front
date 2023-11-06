import React, { useState } from "react"
import DatePicker from "react-datepicker"
import moment from 'moment'
import { ko } from  "date-fns/esm/locale"
import { getMonth, getYear, addYears } from 'date-fns';
import range from "lodash/range";
import { useEffect } from "react";

function Datepicker({name, value, setDate, disable, minDate, maxDate , placeholderText , maxYearAdd}) {

    const [inputValue, setInputValue] = useState(null);
    const [selected, setSelected] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const addYear = maxYearAdd ?? 10
    const years = range(1900, getYear(new Date()) + addYear + 1, 1);
    const months = [ "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월",];
    
    useEffect(() => {
        // if (value == '') {
            inputChange(value)
        // }
        
        if(value != null && value != '' && moment(value, 'YYYY-MM-DD',true).isValid()) {
            setSelected(new Date(value))
        } else {
            setSelected(new Date())
        }
    }, [value])

    


    // 달력 팝업에서 선택시
    const selectChange = (date) => {
        if(date != null && date != ''){
            let dateValue = new moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD');
            setDate(dateValue)
            setInputValue(dateValue)
        } else {
            setDate(date)
        }
        setIsOpen(false)
    }

    // 인풋에서 입력시
    // 달력 팝업에서 선택시도 함수 호출되어 date.target.value 값이 존재하는 경우만 처리
    const inputChange = (dateValue) => {
        // let dateValue = date.target.value;
        // 숫자, . - / 제외 제거
        dateValue = dateValue?.replace(/[^0-9\-]/g, '');
        if (dateValue || dateValue == '') {
            
            // dateValue = dateValue.replace(/[^0-9\.\-\/]/g, '');

            // 백스페이스시 마지막 문자가 - 일 경우 제거시 필요
            let lastWord = dateValue.substring(dateValue.length, dateValue.length-1);

            // 숫자만 가져와서 yyyymmdd 처리
            let dateNum = dateValue.replace(/\-/g, '');
            
            let year = dateNum.substring(0, 4);
            let month = dateNum.substring(4, 6);
            let day = dateNum.substring(6, 8);
                
            // 마지막 문자가 -,.,/ 일 경우 제거
            if (lastWord == '-') {
                dateNum = dateNum.substring(0, dateNum.length-1);
            }
                        
            // 달 최소, 최대값 세팅
            if (Number(month) > 12) {
                month = '12';
            }
            if (month == '00') {
                month = '01';
            }

            // yyyymm에 해당하는 최대 day가 max 값을 넘을 경우 최대 day로 세팅
            let maxDay = moment(`${year}${month}`, 'YYYYMM').daysInMonth();

            if (Number(day) > maxDay) {
                day = maxDay
            }
            if (day == '00') {
                day = '01';
            }
            
            dateValue = `${year}${month ? '-' + month : ''}${day ? '-' + day : ''}`
            setInputValue(dateValue)
            setDate(dateValue)
            // if (dateValue) {
            //     setDate(new moment(dateValue, 'YYYY-MM-DD').format('YYYY-MM-DD'))
            // }
            // else {
            //     setDate('')
            // }
            
        }
    }

    const openCalendar = () => {
        // setSelected(new Date(inputValue))
        setIsOpen(true)
    }

    return(
        <div className='datepicker-wrapper'>
            <DatePicker
                name={name}
                className="form-control date_picker"
                locale={ko}
                dateFormat="yyyy-MM-dd"
                selected={selected}
                value={inputValue}
                open={isOpen}
                disabledKeyboardNavigation={true}
                // onChange={(date) => value = new moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD')}
                onChangeRaw={(date) => inputChange(date.target.value)}
                onSelect={(date)=>selectChange(date)}
                onInputClick={()=>setIsOpen(false)}
                onClickOutside={()=>setIsOpen(false)}
                onBlur={()=>setIsOpen(false)}
                placeholderText={placeholderText}
                disabled={disable}
                minDate={minDate? minDate : new Date(new moment(years[0]+'0101', 'YYYY-MM-DD'))}
                maxDate={maxDate? maxDate : addYears(new Date(), addYear)}
                // showMonthDropdown
                // showYearDropdown
                // // useShortMonthInDropdown
                // dropdownMode="select"
                renderCustomHeader={({
                        date,
                        changeYear,
                        changeMonth,
                        decreaseMonth,
                        increaseMonth,
                        prevMonthButtonDisabled,
                        nextMonthButtonDisabled,
                }) => (
                    <div className={'react-datepicker__header__dropdown'} >
                        <button type="button" onClick={decreaseMonth} disabled={prevMonthButtonDisabled} className="react-datepicker__navigation react-datepicker__navigation--previous" aria-label="Previous Month">
                            <span className="react-datepicker__navigation-icon react-datepicker__navigation-icon--previous">Previous Month</span>
                        </button>
                        <div className={'react-datepicker__year-dropdown-container react-datepicker__year-dropdown-container--select'}>
                            <select
                                className={'react-datepicker__year-select'}
                                value={getYear(date)}
                                onChange={({ target: { value } }) => changeYear(value)}
                            >
                                {
                                    years.map((option) => (
                                        <option key={option} value={option}>
                                            {option}년
                                        </option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className={'react-datepicker__month-dropdown-container react-datepicker__month-dropdown-container--select'}>
                            <select
                                className={'react-datepicker__month-select'}
                                value={months[getMonth(date)]}
                                onChange={({ target: { value } }) => changeMonth(months.indexOf(value)) }
                            >
                                {
                                    months.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>
                        <button type="button" onClick={increaseMonth} disabled={nextMonthButtonDisabled} className="react-datepicker__navigation react-datepicker__navigation--next" aria-label="Next Month">
                            <span className="react-datepicker__navigation-icon react-datepicker__navigation-icon--next">Next Month</span>
                        </button>
                    </div>
                )}

            />
            <div className={`date_picker-ico ${disable ? 'uncursor' : ''}`} onClick={()=> disable ? '' : openCalendar()} />
        </div>
    );
}

export default Datepicker;