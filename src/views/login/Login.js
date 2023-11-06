import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { decodeJwt, getCookie, removeCookie, setCookie } from "../../utiles/cookie";
import { NotSpace, regex_UserId, regex_LoginId, regex_pwd } from "../../utiles/regex";

import { actionLoginMember } from '../../modules/action/AuthAction';
import { LOGIN_MEMBER } from '../../modules/action/actionTypes';


const Login = (props) => {
    const dispatch = useDispatch();
    //--------------- session ---------------
    const memberInfo =  decodeJwt("dtverseMember");
    const token = getCookie("dtverseMember");
    const saveMemberId = getCookie('dtverseMember-id');
    //--------------- session ---------------

    //[1] loginInfo
    const [loginInfo, setLoginInfo] = useState({
        memberId: '',
        memberPwd: ''
    })
    // 아이디 저장
    const [isRemember, setIsRemember] = useState(false);
    
    useEffect( () => {
        if (token && memberInfo) {
            props.history.push('/')
        }
    },[])

    // [2] 아이디 저장 / 자동로그인 -------------------------------
    useEffect(()=> {
        if (saveMemberId) {
            setLoginInfo({...loginInfo, memberId : saveMemberId});
            setIsRemember(true);
        }
    },[])

    const onRemember = (e) => {
        setIsRemember(e.target.checked);
        if (!e.target.checked) {
            removeCookie("dtverseMember-id");
        }
    }

    //[3] 입력 데이터 세팅 -------------------------------------------------------------
    //[3-1] input박스

    const handleChange = (e) => {
        switch (e.target.name) {
            case 'id':
                setLoginInfo({...loginInfo, memberId: e.target.value.replace(NotSpace,'')})
                break;
            case 'password':
                setLoginInfo({...loginInfo, memberPwd: e.target.value.replace(NotSpace, '')})
                break;
        }
    }
    
    //[4] 로그인  -------------------------------------------------------------
    const onLogin = (e) => {
        e.preventDefault();

        if(!regex_LoginId.test(loginInfo.memberId)){
            props.funcAlertMsg('아이디 형식에 맞지 않습니다.');
            document.getElementsByName(`id`)[0].focus();
            return;
        }
        // if(!regex_pwd.test(loginInfo.memberPwd)){
        //     document.getElementsByName(`password`)[0].focus();
        //     funcAlertMsg('비밀번호 형식에 맞지 않습니다.\\n영문 대/소문자 +  숫자 및 특수문자를 포함 (8~20글자)');
        //     return;
        // }
        let params = {
            memberId: loginInfo.memberId,
            memberPwd: loginInfo.memberPwd,
            userAgent: window.navigator.userAgent,
            ip: '',
            isAutoLogin: true
        };

        dispatch(actionLoginMember(params)).then((res) => {
            if (res.payload != null) {
                if(res.payload.statusCode == 10000){
                    //[1] 로그인 성공시 token 저장 및 사용자 정보 저장
                    const accessToken = res.payload.access_token;
                    
                    //[2] 해당 token을 이용한 axios default 설정 및 sessionStorage 저장
                    dispatch({ type: LOGIN_MEMBER, memberInfo: res.payload })          //redux 세팅

                    //[3] 로그인 유효시간
                    const expires = new Date()
                    expires.setTime((Date.now() + 21600000 ) + ( 60 * 60 * 1000 * 9 * 1 ))      // 6시간
                    
                    //[4]쿠키 설정
                    setCookie("dtverseMember", accessToken, {path:'/', expires})

                    if (isRemember) {
                        // [4-1]아이디 저장 쿠키설정
                        const expires = new Date()
                        expires.setDate(expires.getDate()+7);
                        setCookie("dtverseMember-id", loginInfo.memberId, {path:'/', expires});
                    } else {
                        removeCookie("dtverseMember-id");
                    }

                    //[5] 로그인 성공 메인페이지 이동
                    if(location.search){
                        // referer ? 값 존재시 해당 페이지로 이동
                        const pathArr = location.search.split('referer=')
                        const useLocation = pathArr[pathArr.length - 1]
                        window.location.replace(useLocation)
                    }else{
                        window.location.replace("/")
                    }
                }else if(res.payload.statusCode == 20006){ 
                    sessionStorage.setItem('dtverseMember', JSON.stringify(res.payload));
                    props.history.push('/pw-change')
                }else{
                    props.funcAlertMsg(res.payload.message)
                }
            }
        })
    }

    const enterKey = (e) => {
        e.target.addEventListener('keydown', function() {
            if(window.event.keyCode === 13){
                onLogin(e)
            }
        }, {once: true});
    }

    return (
        <div className="user-wrap">
            <div className="con-header">
                <div>
                    <div className="h1 login-img"></div>
                    <div className="subtxt">DTVERSE 공개 Portal에 오신 것을 환영합니다.</div>
                    <ul>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                </div>
            </div>
            <div className="con-body">

                <div className="login-from">
                    <div>
                        <div className="contents2-font">아이디</div>
                        <div>
                            <input
                                type="text"
                                name="id"
                                id='memberid'
                                className="component-input-line uppercase"
                                placeholder="아이디를 입력해 주세요."
                                onChange={handleChange}
                                value={loginInfo?.memberId || ''}
                                onKeyUp={enterKey}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <div className="contents2-font">비밀번호</div>
                        <div>
                            <input
                                type="password"
                                name="password"
                                id='memberpw'
                                className="component-input-line"
                                placeholder="비밀번호를 입력해 주세요."
                                onChange={handleChange}
                                value={loginInfo?.memberPwd || ''}
                                onKeyUp={enterKey}
                                required
                            />
                        </div>
                    </div>
                    <div className="flex balance">
                        <div>
                            <input 
                                type='checkbox' 
                                id='isRemember' 
                                checked={isRemember}
                                onChange={(e)=> {onRemember(e)}}
                            />
                            <label htmlFor='isRemember'>아이디 저장</label>
                        </div>
 
                    </div>
                    <div>
                        <button type='button' className='btn-circle login-btn' onClick={onLogin}>로그인</button>
                    </div>
                </div>

            </div>
            <div className="con-footer">
                <div className="info-user">
                    <div className="cursor" onClick={()=>props.history.push('/sign-up')}>
                        <div className="big-icon join"></div>
                        <div>회원가입</div>
                    </div>
                    <div className="cursor" onClick={()=>props.history.push('/find')}>
                        <div className="big-icon pw"></div>
                        <div>아이디/비밀번호 찾기</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;