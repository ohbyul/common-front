import React, { useEffect } from 'react';
import { NotSpace, regex_pwd } from '../../../utiles/regex';
import { actionUpdatePw } from '../../../modules/action/AuthAction';

const ComponentResetPw = (props) => {
    let {findInfo, setFindInfo, error, setError} = props

    // 입력 데이터 셋팅
    const handleChange = (e) => {
        switch(e.target.name) {
            case 'memberPwd':
                setFindInfo({...findInfo, memberPwd: e.target.value.replace(NotSpace,'')})
                break
            case 'memberPwdChk':
                setFindInfo({...findInfo, memberPwdChk: e.target.value.replace(NotSpace,'')})
                break
        }
    }

    // validation
    useEffect(() => {
        const memberPassword = findInfo?.memberPwd;
        const memberPasswordChk = findInfo?.memberPwdChk;
        let pwError         //비밀번호 에러
        let pwChkError      //비밀번호확인 에러

        if (memberPassword == '') {
            pwError = { error : null , msg : null , class : ''}
        } else {
            if (!regex_pwd.test(memberPassword)) {
                pwError = { error : true , msg : '영문자, 숫자, 특수문자 3종류 조합으로 8~15자리 입력해 주세요.' , class : 'warning'}
            } else {
                pwError = { error : false , msg : '사용 가능한 비밀번호입니다.' , class: 'confirm'}
            }
        }

        if (memberPasswordChk == '') {
            pwChkError = { error : null , msg : null , class : ''}
        } else {
            if (memberPasswordChk === memberPassword) {
                pwChkError = { error : false , msg : '비밀번호가 일치합니다.' , class: 'confirm'}
            } else {
                pwChkError = { error : true , msg : '비밀번호가 일치하지 않습니다.' , class : 'warning'}
            }
        }

        setError({...error , memberPwd : pwError , memberPwdChk : pwChkError })        

    },[findInfo?.memberPwd,findInfo?.memberPwdChk])


    return (
        <div className="pw-set">
            <div className="certify">
                <div className="required">새 비밀번호</div>
                <div>
                    <input 
                        type="password"
                        name="memberPwd"
                        placeholder="비밀번호 입력(8~16자 이내의 영문, 숫자, 특수문자 3개 조합)"
                        maxLength={15}
                        onChange={handleChange}
                        value={findInfo?.memberPwd || ''}
                        autoComplete='one-time-code'
                        required
                    />
                </div>
                    {
                        error?.memberPwd?.error !==null ?
                            <div className={`alert error ${error.memberPwd.class} span2x2`}>{error.memberPwd.msg}</div>
                            : ''
                    }
            </div>
            <div className="certify">
                <div className="required">새 비밀번호 확인</div>
                <div>
                    <input
                        type="password" 
                        name="memberPwdChk"
                        placeholder="비밀번호 재입력"
                        maxLength={15}
                        onChange={handleChange}
                        autoComplete='one-time-code'
                        value={findInfo?.memberPwdChk || ''}
                        required
                    />
                </div>
                    {
                        error?.memberPwdChk?.error !==null ?
                            <div className={`alert error ${error.memberPwdChk.class} span2x2`}>{error.memberPwdChk.msg}</div>
                            : ''
                    }
            </div>
        </div>
    );
};

export default ComponentResetPw;