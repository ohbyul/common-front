import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Toolbar from './Toolbar';
import { useSelector } from 'react-redux';

const CalendarForm = (props) => {
  let { events , handleClick , handleDate } = props
    moment.locale('ko-KR');
    const localizer = momentLocalizer(moment);
    const calendarDate = useSelector(state => state.project.calendarDate)

    useEffect(()=>{
      if(calendarDate){
        handleDate(calendarDate)
      }
    },[calendarDate])

    return (
        <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            allDayAccessor="allDay"
            popup={true}
            // showAllEvents={true}
            onSelectEvent={handleClick}
            components={{
                toolbar: Toolbar,
            }}
            eventPropGetter={
              (event, start, end, isSelected) => {
                let newStyle = {
                  backgroundColor: event.colorEvento ,
                  color: events.color,
                  borderRadius: "0px",
                  border: "none"
                };

                if (isSelected){
                  newStyle.backgroundColor = "black"
                }
          
                return {
                  className: "",
                  style: newStyle
                };
              }
            }
            views={{
              month: true,
              week: false,
              day:false
            }}
        />
    )
};

export default CalendarForm;