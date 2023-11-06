import React, { useEffect, useState } from 'react';
import { NotSpace } from '../../../../utiles/regex';
import { actionGetCheckMember } from '../../../../modules/action/MemberAction';

const ComponentMemberCheck = (props) => {
    let { memberId, setIndex, index } = props

    const [memberInfo, setMemberInfo] = useState({
        memberId: memberId,
        memberPwd: ''
    })

    const handleChange = (e) => {
        setMemberInfo({ ...memberInfo, memberPwd: e.target.value.replace(NotSpace, '') })
    }

    const onMemberCheck = () => {
        if (!memberInfo.memberPwd || memberInfo.memberPwd === '') {
            document.getElementsByName(`memberPwd`)[0].focus();
            props.funcAlertMsg('비밀번호를 입력해주세요.');
            return;
        }
        funcMemberCheck()
    }

    const funcMemberCheck = () => {
        actionGetCheckMember(memberInfo).then((res) => {
            if (res.statusCode == "10000") {
                const result = res?.data
                if (result) {
                    setIndex(index + 1)
                } else {
                    props.funcAlertMsg(res.message)
                    return
                }
            }
        })
    }

    return (
        <>
            <div className="inventory">
                <div className="dropout">
                    <div className="h1">회원탈퇴</div>
                    <div className="subtxt">
                        DTVERSE의 회원탈퇴를 원하십니까?<br/>
                        아래 절차에 따라 진행해 주시기 바랍니다.
                    </div>
                </div>
            </div>
            <div className="detail-info quit">
                <ul className="div_dropout">
                    <li className="dot-txt">비밀번호 인증 후 회원탈퇴가 가능합니다.</li>
                    <li className="dot-txt">입력하신 정보는 회원탈퇴 외 목적으로 사용하지 않습니다.</li>
                    <li className="dot-txt">비밀번호 인증 후 탈퇴 시 주의사항 확인 및 탈퇴사유를 선택해 주시기 바랍니다.</li>
                </ul>

                <div className="line-box">
                    <div className="dropout-body">
                        <div className="certify">
                            <div className="required">아이디</div>
                            <div><input type="text" defaultValue={memberId} disabled /></div>
                        </div>
                        <div className="certify">
                            <div className="required">비밀번호</div>
                            <div>
                                <input
                                    type="password"
                                    name="memberPwd"
                                    placeholder="비밀번호 입력 (8~16자 이내의 영문, 숫자, 특수문자 2개 조합)"
                                    maxLength={20}
                                    onChange={handleChange}
                                    value={memberInfo?.memberPwd}
                                    autoComplete='one-time-code'
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className='flex gap24x'>
                        <button type="button" className="btn-circle" onClick={() => props.history.goBack()}>취소</button>
                        <button type="button" className="btn-circle fill" onClick={onMemberCheck}>확인</button>
                    </div>
                </div>
            </div>

        </>
    )
}

export default ComponentMemberCheck;