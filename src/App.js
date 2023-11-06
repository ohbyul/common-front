import React, { Component, useEffect, useState, useRef } from 'react'
import { HashRouter, Route, Redirect, Switch, BrowserRouter } from 'react-router-dom'
import {useDispatch, useSelector} from "react-redux";
import axios from 'axios';
import { hot } from 'react-hot-loader'
import moment from 'moment';

import "@reach/dialog/styles.css";
import 'jquery-ui-bundle'

import './assets/css/fonts.css'//폰트 css
// import './assets/css/style.css';// 추가 css
import "react-datepicker/dist/react-datepicker.css";    // date/time/date-time picker

import { getCookie, setCookie, removeCookie } from "./utiles/cookie";

import Loading from "./views/components/Loading";                             // loding-spiner
import AlertDialogComponent from "./views/components/AlertDialogComponent";   // alert
import { toast , ToastContainer } from "react-toastify"                       // toast
import 'react-toastify/dist/ReactToastify.css';
import ModalProvider from '@components/modal'

import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";
import ScrollToTop from './utiles/scroll';


const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))      // Main Containers

function App() {
  const dispatch = useDispatch()
  //--------------- alert ---------------
  const cancelRef = React.useRef();
  const [showAlertDialog, setShowAlertDialog] = useState(false)
  const [alertDialogObject, setAlertDialogObject] = useState({description: '', close: null})

  const funcAlertMsg = (msg) => {
    setAlertDialogObject({
        description: [msg],
        close: alertDialogClose
    })
    setShowAlertDialog(true)
  }
  const alertDialogClose = () => {
    setShowAlertDialog(false)
  }
  //--------------- alert ---------------
  //toast
  const toastSuccess = (msg) => {
    toast.success( msg, {position: toast.POSITION.BOTTOM_CENTER} )
  }
  //loading spiner
  const [loading, setLoading] = useState(false)
  let axiosCnt = useRef(0)
  
  //login info
  let token = getCookie('dtverseMember');

  useEffect(()=>{
    if (process.env.NODE_ENV === 'production') {
      // 운영서버 배포 빌드 날짜를 로컬스토리지에 세팅
      fetch("/meta.json?date="+moment().unix())
          .then((response) => response.json())
          .then((meta) => {
            window.localStorage.setItem('buildDate', meta.buildDate)
          });
    }

    //axios 호출시 인터셉트
    axios.interceptors.request.use(function (config) {

      token = getCookie('dtverseMember');                                   //쿠키세팅
      config.headers.common['Authorization'] = `Bearer ${token}`;     //토큰세팅
      
      axiosCnt.current += 1;
      axiosCnt.current != 0? setLoading(true) : ''
      // if(!config.url.includes('autoLogin')){}
      // config.withCredentials = true;
      return config
    }, function (error) {
      return Promise.reject(error);
    });

    //axios 호출 종료시 인터셉트
    axios.interceptors.response.use(function (response) { 
      
      axiosCnt.current -= 1;
      axiosCnt.current == 0? setLoading(false) : ''

      return response;
    }, function (error) {
      axiosCnt.current -= 1;
      axiosCnt.current == 0? setLoading(false) : ''

      if (error.response.status == 401) {
        redirectLogin();
      }
      else {
        setAlertDialogObject({
          description: '입력하신 주소가 정확한지 다시 한번 확인해 주시기 바랍니다.',
          close: ()=>setShowAlertDialog(false)
        })
        setShowAlertDialog(true)
      }

      return Promise.reject(error);
    });
  },[]);

  const redirectLogin = () => {
    removeCookie('dtverseMember');
    sessionStorage.clear();
    window.location.replace("/login")
  }

  return (
    <>
      <ModalProvider>
      <BrowserView>
        <BrowserRouter>
          <ScrollToTop/>
          <React.Suspense fallback={<Loading loading={loading}/>}>
            <Switch>
              {
                <Route path="/" name="Home" render={(props) =>{
                    return <DefaultLayout {...props} funcAlertMsg={funcAlertMsg} toastSuccess={toastSuccess}/> 
                  }}
                />
              }

            </Switch>
          </React.Suspense>
        </BrowserRouter>
        <Loading loading={loading}/>
      </BrowserView>

      </ModalProvider>

      <ToastContainer />
      {
          showAlertDialog && <AlertDialogComponent cancelRef={cancelRef} description={alertDialogObject.description} close={alertDialogObject.close}/>
        } 

    </>
  )

}

export default hot(module)(App)
