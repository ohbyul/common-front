import React, { useEffect, useState } from 'react';
import ComponentJoinForm from './components/ComponentJoinForm';
import { actionCreateMember, actionGetMemberLoginId } from '../../modules/action/MemberAction';
import ComponentTerms from './components/ComponentTerms';
import { requiredValueCheck } from '../../utiles/common';
import ComponentJoinComplete from './components/ComponentJoinComplete';
import { actionGetCodeList } from '../../modules/action/CommonAction';
import {KEYWORD} from '../../utiles/code';

const MemberJoin = (props) => {
    //[1] JoinInfo
    const [ joinInfo , setJoinInfo ] = useState({
        memberNm : '',
        birth : '' ,
        gender : '' ,
        memberId : '',
        memberPwd : '',
        memberPwdChk : '',
        
        mobileNo : '',
        phoneNo : '',
        email: '',
        zipCode : '',
        address : '',
        addressDetail : '',
        keywordList: [],

        adult: false ,                      //19세이상
        service : false,                    //서비스이용약관
        privacy : false,                    //개인정보이용약관
    })

    const [ keywordList , setKeywordList] = useState() //키워드cd
    const [ directInput , setDirectInput ] = useState({ value : '', disabled : true })  //직접입력 키워드
    // 키워드
    useEffect( () => {
        let data = {
            groupCd : KEYWORD
        }
        actionGetCodeList(data).then(res=>{if(res)setKeywordList(res.data)})
    },[])

    //[1-2] validation
    const [ error , setError ] = useState({
        memberId :       { error : null , msg : null , class : '' , isAuth : false , isAuthComplete : false } , 
        mobileNo :     { error : null , msg : null , class : '' , isAuth : false , isAuthComplete : false } ,
        authMobileNo : { error : null , msg : null , class : '' } ,  
        memberPwd :      { error : null , msg : null , class : '' } , 
        memberPwdChk :   { error : null , msg : null , class : '' } , 
        birth :   { error : null , msg : null , class : '' } , 
    })
    //[1-3] 중복체크 여부
    const [ isUse , setIsUse ] = useState()

    const [ isComplete , setIsComplete] = useState(false)
    // [2] 취소 -------------------------------------
    const onCancle = () => {
        props.history.push('/login')
    }

    // // [3] 중복체크 -------------------------------------
    // const onCheck = () => {
    //     if(!joinInfo?.memberId || joinInfo?.memberId ===''){
    //         props.funcAlertMsg('아이디를 입력해주세요.')
    //         document.getElementsByName('memberId')[0].focus();
    //         return
    //     }
    //     actionGetMemberLoginId(joinInfo?.memberId).then((res) => {
    //         if (res.statusCode == "10000") {
    //             const result = res.data
    //             setIsUse(result.isUse)
    //         }
    //     })
    // }

    // [4] 가입 -------------------------------------
    const onSignUp = () => {
        // validation
        //[1-1] 필수값 체크
        const validObj = requiredValueCheck(joinInfo)
        if(validObj){
            if ( validObj.id == 'gender') {
                document.getElementById(`${validObj.id}`).setAttribute('tabindex', -1);
                document.getElementById(`${validObj.id}`).focus();
            }
            else {
                document.getElementsByName(`${validObj.id}`)[0].focus();
            }
            props.funcAlertMsg(validObj.msg)
            return
        }

        //[1-2] 아이디 비번
        if(isUse === null ){
            props.funcAlertMsg('아이디 중복체크는 필수입니다.')
            document.getElementsByName('memberId')[0].focus();
            return
        }
        for (const [key, value] of Object.entries(error)) {
            if(value.error){
                document.getElementsByName(`${key}`)[0].focus();
                props.funcAlertMsg(value.msg)
                return
            } else if(value.error === null) {
                let temp = key.includes('authMobileNo') && '휴대폰'
                document.getElementsByName(`${temp ==='휴대폰' && 'mobileNo'}`)[0].focus();
                props.funcAlertMsg(`${temp} 인증은 필수입니다.`)
                return
            }
        }

        if (!error?.mobileNo?.isAuth) {
            props.funcAlertMsg(`휴대폰 인증을 진행 해주세요`)
            return
        } 
        //[1-3] 약관 동의
        if(!joinInfo?.service || !joinInfo?.privacy || !joinInfo?.adult){
            props.funcAlertMsg('약관 동의는 필수 입니다.')
            return
        }
        //[1-4] 휴대폰번호 
        if (joinInfo?.mobileNo != '') {
            joinInfo['mobileNo'] = joinInfo?.mobileNo.replace(/-/g,'');
        }
        
        // 가입
        actionCreateMember(joinInfo).then((response) => {
            if (response.statusCode == "10000") {
                setIsComplete(true)
                return
            }else {
                funcAlertMsg(response.message)
                return
            }
        })
    }

    return (
            <div className="user-wrap">

                {/* 회원가입 */}
                <div className="con-header">
                    <div>
                        <div className="h1">회원가입</div>
                        <div className="subtxt">DTVERSE 공개 Portal에 오신 것을 환영합니다.</div>
                        <ul>
                            <li></li>
                            <li></li>
                            <li></li>
                        </ul>
                    </div>
                </div>
                {
                    !isComplete ? 
                    <>
                    <div className="con-body">
                        <ComponentJoinForm {...props}
                                        joinInfo={joinInfo} setJoinInfo={setJoinInfo}
                                        error={error} setError={setError} keywordList={keywordList}
                                        directInput={directInput} setDirectInput={setDirectInput}
                                        // onCheck={onCheck}
                                        isUse={isUse} setIsUse={setIsUse}
                        />
                        <ComponentTerms {...props} joinInfo={joinInfo} setJoinInfo={setJoinInfo} />
                    </div>
                    <div className="con-footer">
                        <div>
                            <button type="button" className="btn-circle" onClick={onCancle}>취소</button>
                            <button type="button" className="btn-circle fill" onClick={onSignUp}>가입하기</button>
                        </div>
                    </div>
                    </>
                    :
                    <ComponentJoinComplete {...props}/>
                }
                
            </div>
    )
}

export default MemberJoin