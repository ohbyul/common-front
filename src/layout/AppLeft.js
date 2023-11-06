import React, { useState } from 'react'
import { withRouter } from "react-router-dom";

import '../assets/css/common.css'//공통 css
import '../assets/css/style.css';// 추가 css

import AlertDialogComponent from '../views/components/AlertDialogComponent';

const AppLeft = (props) => {
   let { uppperPath } = props
   //--------------- alert ---------------
   const cancelRef = React.useRef();
   const [showAlertDialog, setShowAlertDialog] = useState(false)
   const [alertDialogObject, setAlertDialogObject] = useState({ description: '', close: null })
   //--------------- alert ---------------
   //path
   const path = location.pathname;
   const pathArr = path?.split('/')
   const pagePath = pathArr[2]
   const subPagePath = pathArr[3]

   const menus = [
      {
         name: 'project',
         title: '임상시험 신청내역',
         url: '/mypage/project'
      },
      {
         name: 'scrap',
         title: '스크랩한 공고',
         url: '/mypage/scrap'
      },
      {
         name: 'inquiry',
         title: '문의내역',
         url: '/mypage/inquiry/project',
         items: [
            {
               name: 'project',
               title: '모집공고문의',
               url: '/mypage/inquiry/project'
            },
            {
               name: 'user',
               title: '이용문의',
               url: '/mypage/inquiry/user'
            }
         ]
      },
      {
         name: 'privacy',
         title: '개인정보 관리',
         url: '/mypage/privacy'
      }

   ]
   const link = (url) => url.includes(path) ? (window.location = url) : props.history.push(url)
   return (
      <>
         <div id='snb' className='mypage'>
            <div className="snb-title">마이페이지</div>
            <ul className="nav">
               {menus.map(menu => menu.items ?
                  <li key={menu.name} className={pagePath === menu.name ? 'select open' : ''}>
                     <div onClick={() => link(menu.url)}>{menu.title}</div>
                     <ul className='step2-menu'>
                        {menu.items.map(item =>
                           <li key={item.name} className={subPagePath === item.name ? 'link-selected' : ''}
                              onClick={() => link(item.url)}
                           >{item.title}</li>
                        )}
                     </ul>
                  </li>
                  : <li key={menu.name} className={pagePath === menu.name ? 'select' : ''}
                     name={menu.name}
                     onClick={() => link(menu.url)}
                  >
                     <div>{menu.title}</div>
                  </li>
               )}
            </ul>
         </div>
         {
            showAlertDialog && <AlertDialogComponent cancelRef={cancelRef} description={alertDialogObject.description} close={alertDialogObject.close} />
         }
      </>
   )
}

export default withRouter(AppLeft)