import React, { useEffect, useState } from 'react'
import { NotSpace, regex_pwd } from '../../../utiles/regex';
import { useDispatch } from 'react-redux';
import { setCookie, getCookie, decodeJwt } from '../../../utiles/cookie';
import { LOGIN_MEMBER } from '../../../modules/action/actionTypes';
import { actionUpdatePw } from '../../../modules/action/AuthAction';
import { actionUpdateLastPwChgDate } from '../../../modules/action/MemberAction';

const PasswordChange = (props) => {
    //--------------- session ---------------
    const memberInfo = JSON.parse(window.sessionStorage.getItem('dtverseMember'));
    const memberId = memberInfo?.memberId
    //--------------- session ---------------

    const dispatch = useDispatch()
    const [error, setError] = useState({
        memberPwd: { error: null, msg: null, class: '' },
        memberPwdChk: { error: null, msg: null, class: '' },
    });

    // resetInfo
    const [resetInfo, setResetInfo] = useState({
        // userId: memberInfo.userId,
        memberId: memberId,
        memberPwd: '',
        memberPwdChk: '',
    });

    // 입력 데이터 셋팅
    const handleChange = (e) => {
        switch (e.target.name) {
            case 'memberPwdPre':
                setResetInfo({ ...resetInfo, memberPwdPre: e.target.value.replace(NotSpace, '') })
                break
            case 'memberPwd':
                setResetInfo({ ...resetInfo, memberPwd: e.target.value.replace(NotSpace, '') })
                break
            case 'memberPwdChk':
                setResetInfo({ ...resetInfo, memberPwdChk: e.target.value.replace(NotSpace, '') })
                break
        }
    }

    // validation
    useEffect(() => {
        const pw = resetInfo?.memberPwd;
        const checkPw = resetInfo?.memberPwdChk;
        
        let pwd         //비밀번호 에러
        let pwdChk      //비밀번호확인 에러

        if (pw == '') {
            pwd = { error: null, msg: null, class: '' }
        } else {
            if (!regex_pwd.test(pw)) {
                pwd = { error: true, msg: '영문자, 숫자, 특수문자 조합으로 8~16자리', class: 'warning' }
            } else {
                pwd = { error: false, msg: '사용 가능한 비밀번호입니다.', class: 'confirm' }
            }
        }

        if (checkPw == '') {
            pwdChk = { error: null, msg: null, class: '' }
        } else {
            if (checkPw === pw) {
                pwdChk = { error: false, msg: '비밀번호가 일치합니다.', class: 'confirm' }
            } else {
                pwdChk = { error: true, msg: '비밀번호가 일치하지 않습니다.', class: 'warning' }
            }
        }
        setError({ ...error, memberPwd: pwd, memberPwdChk: pwdChk })

    }, [resetInfo?.memberPwd, resetInfo?.memberPwdChk])

    // 비밀번호 재설정
    const onResetPw = () => {
        if (error?.memberPwd.error == null || error?.memberPwd.error) {
            props.funcAlertMsg('새 비밀번호를 정확히 입력해 주세요.')
            return
        }
        if (error?.memberPwdChk.error == null || error?.memberPwdChk.error) {
            props.funcAlertMsg('비밀번호 확인 절차를 진행해 주세요.')
            return
        }

        actionUpdatePw(resetInfo).then((res) => {
            if (res.statusCode == "10000") {
                props.funcAlertMsg(res.message)
                sessionStorage.clear();
                props.history.push('/login')
            } else if (res.statusCode == "30005") {
                props.funcAlertMsg(res.message)
                return
            } else if (res.statusCode == "20008") {
                props.funcAlertMsg(res.message)
                return
            }
        })
    }

    // 비밀번호 다음에 변경 
    const onNextPw = () => {
        actionUpdateLastPwChgDate(resetInfo).then((res) => {
            if (res.statusCode == "10000") {
                //[1] 로그인 token 저장 및 사용자 정보 저장
                const accessToken = memberInfo.access_token;

                //[2] 해당 token을 이용한 axios default 설정
                dispatch({ type: LOGIN_MEMBER, memberInfo: memberInfo })          //redux 세팅

                //[3] 로그인 유효시간
                const expires = new Date()
                expires.setTime((Date.now() + 360000 * 1) + (60 * 60 * 1000 * 9 * 1))      // 1시간

                //[4]쿠키 설정
                setCookie("dtverseMember", accessToken, { path: '/', expires })

                //[5] 로그인 성공 메인페이지 이동
                window.location.replace("/")
            }
        });
    }

    return (
        <>
            <div className="section-wrap">
                <div className="header-bg"></div>
                <div>
                    <div className="inventory">
                        <div>
                            <div className="h1">비밀번호 변경</div>
                            <div className="subtxt">아래 절차에 따라 진행해 주시기 바랍니다.</div>
                        </div>
                    </div>
                </div>
                <div className="con-body">
                    <dl className="find-header">
                        <dl>새로운 비밀번호를 입력해 주세요.</dl>
                        <dd>DTVERSE에서는 회원님의 개인정보 보호를 위해 3개월 이상 비밀번호를 변경하지 않은 경우 비밀번호 변경을 안내 드리고 있습니다.</dd>
                        <dd>비밀번호는 8 ~ 16자의 영문 대소문자, 숫자, 특수문자를 조합하여 설정해 주세요.</dd>
                        <dd>안전을 위해 자주 사용했거나 쉬운 비밀번호가 아닌 새 비밀번호를 등록하고 주기적으로 변경해 주세요.</dd>
                    </dl>


                    <div className="password-change">
                        <div className="member-pw-body">
                            <div className="pw-certify">
                                <div className="required">새 비밀번호</div>
                                <div>
                                    <input
                                        type="password"
                                        name="memberPwd"
                                        placeholder="비밀번호 (8~16자 이내의 영문, 숫자, 특수문자 조합)"
                                        maxLength={15}
                                        onChange={handleChange}
                                        value={resetInfo?.memberPwd || ''}
                                        autoComplete='one-time-code'
                                        required
                                    />
                                </div>
                                <div>
                                    {
                                        error?.memberPwd?.error !== null ?
                                            <div className={`error ${error.memberPwd.class}`}>{error.memberPwd.msg}</div>
                                            : ''
                                    }
                                </div>
                            </div>
                            <div className="pw-certify">
                                <div className="required">새 비밀번호 확인</div>
                                <div>
                                    <input
                                        type="password"
                                        name="memberPwdChk"
                                        placeholder="비밀번호 재입력"
                                        maxLength={15}
                                        onChange={handleChange}
                                        value={resetInfo?.memberPwdChk || ''}
                                        autoComplete='one-time-code'
                                        required
                                    />
                                </div>
                                <div>
                                    {
                                        error?.memberPwdChk?.error !== null ?
                                            <div className={`${error.memberPwdChk.class}`}>{error.memberPwdChk.msg}</div>
                                            : ''
                                    }
                                </div>
                            </div>
                            <dl className="info-area">
                                <dd>비밀번호 변경 시 기존 로그인된 모든 기기에서 로그아웃됩니다. </dd>
                                <dd>지금 비밀번호 변경을 원하시지 않을 경우, '다음에 변경' 을 선택하시면 3개월 뒤 재안내 드립니다.</dd>
                            </dl>

                        </div>
                    </div>
                    <div className="find-footer">
                        <div>
                            <button type="button" className="btn-circle" onClick={onNextPw}>다음에 변경</button>
                            <button type="button" className="btn-circle fill" onClick={onResetPw}>지금 변경</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PasswordChange