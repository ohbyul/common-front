import React, { useEffect, useState } from 'react'
import { AppContent, AppLeft, AppFooter, AppHeader } from './index'
import moment from 'moment';

import '../assets/css/common.css'// pc공통 css
import '../assets/css/style.css';// pc추가 css

const DefaultLayout = (props) => {
  //path
  const path = location.pathname;
  const uppperPath = path?.split('/')[1]
  // const lowerPath = path?.split('/')[2]
  const [ isActiveLeft , setIsActiveLeft] = useState(false)

// console.log(uppperPath)

  useEffect(() => {
    // 운영서버 배포 빌드 날짜값과 로컬스토리지의 날짜값을 비교하여 일치하지 않을 시 강제 새로고침
    if (process.env.NODE_ENV === 'production') {
      fetch("/meta.json?date="+moment().unix())
      .then((response) => response.json())
      .then((meta) => {
        
        const latestVersionDate = Number(window.localStorage.getItem('buildDate'));
        const currentVersionDate = meta.buildDate;
        
        if (latestVersionDate != currentVersionDate) {
          window.localStorage.setItem('buildDate', currentVersionDate);
          window.location.reload(true);
        }
      });
    }
  }, [props.location]);

  useEffect(()=>{
    const isTemp = uppperPath === 'mypage' ? true : false
    setIsActiveLeft(isTemp)
  },[uppperPath])

  return (
    <div id='wrap'>
		  <AppHeader {...props} />
      
      <div id='container'>
        <div id='contents' className={isActiveLeft ?"activeleft" : ""}>
          {
            isActiveLeft ?
              <>
                <AppLeft {...props} uppperPath={uppperPath} /> 
                <div className="con-wrap">
                  <AppContent  {...props}/>
                </div>
              </>
              : <AppContent  {...props}/>
          }
        </div>
      </div>
      
      <AppFooter />
    </div>
  )

}

export default DefaultLayout
