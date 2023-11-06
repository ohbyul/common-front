import React from 'react'

const Home = React.lazy(() => import('./views/home/Home'))
const Login = React.lazy(() => import('./views/login/Login'))

/** 
 *  1. url 소문자
 *  2. role 추가 시 ,(콤마)로 작성
 */
const routes = {
  menu: [
    { exact: true, name: '메인 페이지', component: Home, path: '/', auth: 'ALL' },
    { exact: true, name: '로그인', component: Login, path: '/login', auth: 'NA' },
  ],
  navi: [
    { key: 'main', value: 'Main', level: 1, urlYn: true, url: '/' },

    { key: 'write', value: '등록', level: 3 },
    { key: 'update', value: '수정', level: 3 },
    { key: 'detail', value: '상세', level: 3 },
    { key: 'list', value: '목록', level: 3 },
  ],
  subNavi: [
  ]
}



export default routes
