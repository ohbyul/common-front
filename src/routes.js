import React from 'react'


const Home = React.lazy(() => import('./views/home/Home'))
const Login = React.lazy(() => import('./views/login/Login'))
const PasswordChange = React.lazy(() => import('./views/login/resetPassword/PasswordChange'))
const MemberJoin = React.lazy(() => import('./views/join/MemberJoin'))
const FindAccount = React.lazy(() => import('./views/find/FindAccount'))

// [3] 고객센터 -------------------------------------------------------------------------
const Notice = React.lazy(() => import('./views/board/notice/Notice'))
const NoticeDetail = React.lazy(() => import('./views/board/notice/NoticeDetail'))
const Faq = React.lazy(() => import('./views/board/faq/Faq'))
const inquiry = React.lazy(() => import('./views/board/inquiry/Inquiry'))
const inquiryWrite = React.lazy(() => import('./views/board/inquiry/InquiryWrite'))

/** 
 *  1. url 소문자
 *  2. role 추가 시 ,(콤마)로 작성
 */
const routes = {
  menu: [
    { exact: true, name: '메인 페이지', component: Home, path: '/', auth: 'ALL' },
    { exact: true, name: '로그인', component: Login, path: '/login', auth: 'NA' },
    { exact: true, name: '비밀번호 변경', component: PasswordChange, path: '/pw-change', auth: 'ALL' },

    { exact: true, name: '회원가입', component: MemberJoin, path: '/sign-up', auth: 'NA' },
    { exact: true, name: 'ID/비밀번호 찾기', component: FindAccount, path: '/find', auth: 'NA' },

    // 고객센터
    { exact: true, name: '공지사항', component: Notice, path: '/cs/notice', auth: 'ALL' },
    { exact: false, name: '공지사항', component: NoticeDetail, path: '/cs/notice/detail/:boardId', auth: 'ALL' },
    { exact: true, name: '자주하는 질문', component: Faq, path: '/cs/faq', auth: 'ALL' },
    { exact: true, name: '이용문의', component: inquiry, path: '/cs/inquiry', auth: 'ALL' },
    { exact: true, naem: '이용문의 등록', component: inquiryWrite, path: '/cs/inquiry/write', auth: 'AUTH' },

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
