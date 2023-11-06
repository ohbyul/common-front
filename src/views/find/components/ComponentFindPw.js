import React, { useState } from 'react';
import { NotSpace } from '../../../utiles/regex';
import ComponentMobileAuth from './ComponentMobileAuth';
import { dateFormat } from '../../../utiles/date';
import ComponentResetPw from './ComponentResetPw';
import { actionGetMemberId, actionUpdatePw } from '../../../modules/action/AuthAction';

const ComponentFindPw = (props) => {
    let {findInfo, setFindInfo, error, setError, setIsComplete} = props;
    
    const tab = 'PASSWORD'

    const [ successId , setSuccessId ] = useState(false);
    const [ resetPw , setResetPw ] = useState(false); 
    const handleChange = (e) => {
        setFindInfo({...findInfo, memberId : e.target.value.replace(NotSpace,'')})
    }
    const onSearchId = () => {
        const memberId = findInfo?.memberId;
        if(memberId === '') { 
            props.funcAlertMsg('아이디를 입력해주세요');
            return
        }
        actionGetMemberId(memberId).then((response) => {
            if (response.statusCode == "10000") {
                const joinDate = dateFormat(response.data.memberJoinDate)
                setFindInfo({...findInfo, memberId : response.data.memberId , memberJoinDate: joinDate })
                setSuccessId(true)
            } else {
                props.funcAlertMsg(response.message)
                return
            }
        })
    }
    const onResetPassword = () => {
        if (error?.mobileNo.error != false || error?.authMobileNo.error != false) {
            props.funcAlertMsg("휴대폰 인증을 진행해 주시기 바랍니다.")
            return
        }
        setResetPw(true);
    }

    // 비밀번호 변경 
    const onChangePw = ()=> {
        if (error?.memberPwd.error == null || error?.memberPwd.error) {
            props.funcAlertMsg('비밀번호를 정확히 입력해 주세요.')
            return 
        }
        if (error?.memberPwdChk.error == null || error?.memberPwdChk.error) {
            props.funcAlertMsg('비밀번호 확인 절차를 진행해 주세요.')
            return
        }

        actionUpdatePw(findInfo).then((response) => {
            if (response.statusCode == "10000") {
                setIsComplete(true)
            } else {
                props.funcAlertMsg(response.message)
                return
            }
        })
    }
    return (
        <div className='tab'>
            {
                !successId ? 
                <div className='find-header'>
                    비밀번호를 잊으셨나요?<br/>
                    비밀번호를 찾고자 하는 아이디를 입력해 주세요.
                </div>
                :
                <div className="find-header">
                    아이디가 확인 되었습니다.<br />
                    본인인증 후 비밀번호를 재설정해 주세요.
                </div>
            }
            <div className='find-body'>
                {
                    !successId ? 
                    <div className="certify">
                        <div className="required">아이디</div>
                        <div>
                            <input
                                type="text"
                                id='PWid'
                                placeholder="아이디를 입력해 주세요."
                                value={findInfo?.memberId || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <button type="button" className="btn-square" onClick={onSearchId}>확인</button>
                    </div>
                    :
                    <div className="certify-find">
                        <div className="required">아이디</div>
                            <div>
                                <input type="tel" value={findInfo?.memberId || ''} disabled />
                            </div>
                            <div className="comment">가입일 : {findInfo?.memberJoinDate}</div>
                    </div>
                }
                </div>
                {
                    successId && !resetPw && <ComponentMobileAuth {...props} tab={tab} />
                }
                {
                    successId && resetPw && <ComponentResetPw {...props}/>
                }
                {
                    !resetPw ? 
                    <div className='con-footer'>
                        <div>
                            {
                                successId ?
                                    <button type='button' className='btn-circle fill' data-href="/views/members/findId.html" onClick={onResetPassword}>비밀번호 재설정</button>
                                : 
                                    ''
                            }
                        </div>
                    </div>
                    :
                    <div className='con-footer'>
                        <div>
                            {
                                successId ?
                                <button type='button' className='btn-circle fill' onClick={onChangePw} >비밀번호 변경</button>
                                : 
                                    ''
                            }
                        </div>
                    </div> 
                    
                }
            
        </div>
    );
};

export default ComponentFindPw;