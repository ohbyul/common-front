import React, { useState } from 'react';
import ComponentMobileAuth from './ComponentMobileAuth';
import { dateFormat } from '../../../utiles/date';
import { actionGetFindId } from '../../../modules/action/AuthAction';

const ComponentFindId = (props) => {
    let {setIsComplete, findInfo, setFindInfo, error} = props
    

    const onFindId = () => {
        if (error?.mobileNo.error != false || error?.authMobileNo.error != false) {
            props.funcAlertMsg("휴대폰 인증을 진행해 주시기 바랍니다.")
            return
        }
        actionGetFindId(findInfo.mobileNo).then((response) => {
            if (response.statusCode == "10000") {
                const joinDate = dateFormat(response.data.memberJoinDate)
                setFindInfo({...findInfo, memberId : response.data.memberId , memberJoinDate: joinDate })
                setIsComplete(true)
            } else {
                props.funcAlertMsg(response.message)
                return
            }
        })
    }

    return (
        <div className="tab">
            <div className="find-header">
                아이디를 잊으셨나요?<br/>
                회원정보에 등록된 휴대폰번호 인증을 통해 계정을 찾습니다
            </div>
            <ComponentMobileAuth {...props}/>
            <div className="con-footer">
                <div>
                    <button type="button" className="btn-circle fill" onClick={onFindId}>아이디 찾기</button> 
                </div>
            </div>
        </div>
    );
};

export default ComponentFindId;