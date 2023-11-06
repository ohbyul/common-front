import moment from "moment";

export function getCurrentDate(){
  const date = new Date();
  let year = date.getFullYear().toString();
  let month = date.getMonth() + 1;
  month = month < 10 ? '0' + month.toString() : month.toString();
  let day = date.getDate();
  day = day < 10 ? '0' + day.toString() : day.toString();
  let hour = date.getHours();
  hour = hour < 10 ? '0' + hour.toString() : hour.toString();
  let minites = date.getMinutes();
  minites = minites < 10 ? '0' + minites.toString() : minites.toString();
  let seconds = date.getSeconds();
  seconds = seconds < 10 ? '0' + seconds.toString() : seconds.toString();
  
  return year + '-'+  month + '-'+  day + ' '+  hour + ':'+  minites;
}

export function dateFormat(date){
  if(!date){
    return 
  }
  let result = moment(date).format('YYYY-MM-DD')
  return result;
}

export function dateHourMinFormat(date){
  if(!date){
    return 
  }
  let result = moment(date).format('YY-MM-DD HH:mm')
  return result;
}

export function dateTimeFormat(date){
  if(!date){
    return 
  }
  let result = moment(date).format('YYYY-MM-DD HH:mm')
  return result;
}

export function dateFulltimeFormat(date){
  if(!date){
    return 
  }
  let result = moment(date).format('YYYY-MM-DD HH:mm:ss')
  return result;
}

export function hourFormat(date){
  if(!date){
    return 
  }
  let result = moment(date).format('HH:mm')
  return result;
}
export function timeFormat(date){
  if(!date){
    return 
  }
  let result = moment(date).format('HH:mm:ss')
  return result;
}

export function dateFormatHangul(date){
  let result = moment(date).format('YYYY년 MM월 DD일')
  return result;
}

export function getWesternAge(birthday){
  if(!birthday){
    return
  }
  let today = new Date();
	let birthDay = new Date(birthday);
	let age = today.getFullYear() - birthDay.getFullYear();
	
	let todayMonth = today.getMonth() + 1;
	let birthMonth = birthDay.getMonth() + 1;
	
	if (birthMonth > todayMonth || (birthMonth === todayMonth && birthDay.getDate() >= today.getDate())) {
		age--;
	} 
	return age;
}


export function dateFormatValid(date){
  let result = moment(date, 'YYYY-MM-DD',true).isValid()
  return result;
}


export function dateTimeSubtract(startDate , endDate){
  if(!startDate || !endDate)return;
  
  const sTime = moment(startDate , 'YYYY-MM-DD HH:mm:ss')
  const eTime = moment(endDate , 'YYYY-MM-DD HH:mm:ss')

  let result = moment.duration(eTime.diff(sTime)).asMinutes()
  const hour = Math.floor(result/60)
  const min = result%60

  return result;
}