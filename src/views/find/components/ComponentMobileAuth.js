import React, { useState } from 'react';
import { NotSpace, regex_mobile, regex_mobile_input } from '../../../utiles/regex';
import { useEffect } from 'react';
import { actionCreateAuthCode, actionGetAuthCode } from '../../../modules/action/AuthAction';

const ComponentMobileAuth = (props) => {
    let {error, setError, findInfo, setFindInfo, tab} = props;

    const [ authInfo , setAuthInfo ] = useState({
        mobileNo:'',
        authType:'mobile',    //인증 타입
        authMobileNo:'' //휴대폰 인증번호
    })


    //[2] 입력 데이터 세팅 -------------------------------------------------------------
    const handleChange = (e) => {
        switch (e.target.name) {
            case 'mobileNo':
                const value = e.target.value.replace(NotSpace, '').replaceAll('-', '')
                if (regex_mobile_input.test(e.target.value)) {
                    if (value.length === 10) {
                        setFindInfo({ ...findInfo, mobileNo: value })
                        setAuthInfo({ ...authInfo, mobileNo: value })
                        break;
                    } else if (value.length === 11) {
                        setFindInfo({ ...findInfo, mobileNo: value })
                        setAuthInfo({ ...authInfo, mobileNo: value })
                        break;
                    } else {
                        setFindInfo({ ...findInfo, mobileNo: value })
                        setAuthInfo({ ...authInfo, mobileNo: value })
                        break;
                    }
                }
                break;
            case 'authMobileNo' :
                setAuthInfo({...authInfo, authMobileNo: e.target.value.replace(NotSpace,'')})
                break;
        }
        
    }

    //[3] validation  -------------------------------------------------------------
    
    useEffect(()=>{
        const mobile = findInfo?.mobileNo;
        let mobileError

        if(mobile == ''){
            mobileError = { error : null , msg : null , class : '' , isAuth : false , isAuthComplete : false }
        }else{
            let temp = mobile
            if(mobile?.length === 10){
                temp = mobile.replace(/-/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
            }else 
            if(mobile?.length === 11){
                temp = mobile.replace(/-/g, '').replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
            }

            if(!regex_mobile.test(temp)){
                mobileError = { error : true , msg : '휴대폰번호를 정확하게 입력해 주시기 바랍니다.' , class : 'warning' } 
            }else{
                mobileError = { error : false , msg : '인증을 진행해 주세요' , class : 'confirm' , isAuth : false , isAuthComplete : false  } 
            }
        }
        setError({...error , mobileNo : mobileError })
    },[findInfo?.mobileNo])
    
    // [4] 인증 코드 발송 ---------------------------------------------
    const onAuth = (e) => {
        // const type = e.target.name
        if (error?.mobileNo.error == null || error?.mobileNo.error) {
            return 
        }
        // authInfo.authType = type
        authInfo.isFindPw = tab === 'PASSWORD' ? true : false  //비밀번호 찾기 플래그
        authInfo.memberId = findInfo?.memberId

        actionCreateAuthCode(authInfo).then((response) => {
            if (response.statusCode == "10000") {
                setAuthInfo({...authInfo, authMobileNo: ''})
                let temp
                let tempAuthNo = { error : null , msg : null , class : '' }  // 재인증 시 인증번호 초기화
                if(response.data.isChk){
                    temp = { error : false , msg : response.message , class : 'confirm' , isAuth : true , isAuthComplete : false } 
                    // setAuthNoTest({...authNoTest , mobile : authInfo.authMobileNo})          // TEST : 보낸 인증번호 저장
                }else{
                    temp = { error : true , msg : response.message , class : 'warning' , isAuth : false , isAuthComplete : false } 
                }
                setError({...error , mobileNo : temp , authMobileNo : tempAuthNo  })
                return
            }
        })
    }
    
    const onAuthCheck = (e) => {
        const type = e.target.name

        if(authInfo.authMobileNo == '') {
            return
        }
        actionGetAuthCode(authInfo).then((response) => {
            if (response.statusCode == "10000") {
                let temp
                if (response.data.isChk) {
                    error.mobileNo.isAuthComplete = true
                    temp = { error : false , msg : response.message , class : 'confirm'}
                } else {
                    error.mobileNo.isAuthComplete = false
                    temp = { error : true , msg : response.message , class : 'warning' }
                }
                setError({...error , authMobileNo : temp})
                return
            }
        })
    }

    return (
    <div className="pw-set">
        <div className="certify">
            <div className="required">휴대폰 번호</div>
                <div>
                    <input
                        type="text"
                        name="mobileNo"
                        placeholder="휴대폰번호 입력"
                        onChange={handleChange}
                        value={
                            findInfo?.mobileNo?.length === 10 ? findInfo?.mobileNo.replace(/-/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3') 
                            : findInfo?.mobileNo?.length === 11 ? findInfo?.mobileNo.replace(/-/g, '').replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
                            : findInfo?.mobileNo || ''
                        }
                        required
                    />       
                </div>
                    {
                        !error?.mobileNo?.isAuth ? 
                        <button type="button" className="btn-square" onClick={onAuth}>인증요청</button>
                        : <button type="button" className="btn-square" onClick={onAuth}>재인증</button>
                    } 
                    {
                        error?.mobileNo?.error !==null ?
                            <div className={`alert error ${error.mobileNo.class} span2x2`}>{error.mobileNo.msg}</div>
                        : ''
                    }
        </div>
                {
                    error?.mobileNo?.isAuth ?
                    <div className="certify mt10">
                        <div className="required">휴대폰 인증번호</div>
                        <div>
                            <input
                                type="text"
                                name="authMobileNo"
                                placeholder="인증번호 입력"
                                onChange={handleChange}
                                value={authInfo?.authMobileNo || ''}
                                disabled={error?.mobileNo?.isAuthComplete}
                                required
                            />
                        </div>
                        <button type="button" className="btn-square" onClick={onAuthCheck}>인증확인</button>
                        {
                            error?.authMobileNo?.error !==null ?
                                <div className={`alert error ${error.authMobileNo.class} span2x2`}>{error.authMobileNo.msg}</div>
                                : ''
                        }
                    </div>
                    : ''
                }
    </div>
    )
}

export default ComponentMobileAuth