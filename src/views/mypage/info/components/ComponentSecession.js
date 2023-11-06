import React, { useEffect, useState } from 'react';
import { getCodeOption } from '../../../../utiles/code';
import SelectBox from '../../../components/SelectBox';
import { actionDeleteMember } from '../../../../modules/action/MemberAction';
import { removeCookie } from '../../../../utiles/cookie';
import ConfirmDialogComponent from '../../../components/ConfirmDialogComponent';
import { LOGIN_MEMBER } from '../../../../modules/action/actionTypes';
import { useDispatch } from 'react-redux';


const ComponentSecession = (props) => {
    let {memberId, setIndex, index} = props
    const dispatch = useDispatch();
    //--------------- confirm ---------------
    const cancelRef = React.useRef();
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [confirmDialogObject, setConfirmDialogObject] = useState({
        description: '',
        leftText: '',
        rightText: '',
        leftClick: null,
        rightClick: null
    })
    //--------------- confirm ---------------
    const [ memberDeleteReason , setMemberDeleteReason ] = useState([])
    const [ deleteReason , setDeleteReason ] = useState('')
    const [ deleteParam , setDeleteParam] = useState({
        deleteReasonCd: '',
        deleteReasonEtc: '',
        loginId: memberId,
    })
    const [ agreeYn , setAgreeYn ] = useState(false);

    // 탈퇴사유 불러오기
    useEffect( () => {
        let data = {
            groupCd : 'MEMBER_DELETE_REASON',
            default : '선택'
        }
        getCodeOption(data).then(res=>{if(res)setMemberDeleteReason(res)})
    },[])

    // 입력값 셋팅
    const handleChange = (e) => {
        switch (e.target.name) {
            case 'deleteReasonEtc' :
                setDeleteParam({...deleteParam, deleteReasonEtc: e.target.value})
                break;
            case 'agreeYn' :
                setAgreeYn(e.target.checked)
                break;
        }
    }

    useEffect(()=> {
        setDeleteParam({...deleteParam, deleteReasonCd: deleteReason})
    },[deleteReason])

    //삭제 
    const onSecession = () => {
        //validation
        if (deleteParam?.deleteReasonCd == '') {
            props.funcAlertMsg(`탈퇴사유를 선택해주세요.`)
            return
        } else if (deleteParam?.deleteReasonEtc == '' && deleteReason == '0007') {
            document.getElementsByName(`deleteReasonEtc`)[0].focus();
            props.funcAlertMsg(`탈퇴사유 상세내용을 기입해주세요`)
            return
        }

        if (!agreeYn) {
            props.funcAlertMsg('회원 탈퇴 안내 확인 및 \n 동의에 체크해 주세요.')
            return
        }

        let msg = '회원 탈퇴 관련 안내 사항을 모두 \n확인해주세요. \n탈퇴 하시겠습니까?'
        setConfirmDialogObject({
            description: [msg],
            leftText: '확인',
            rightText: '취소',
            leftClick: () => {
                setShowConfirmDialog(false);
                onDeleteUser()
            },
            rightClick: () => {
                setShowConfirmDialog(false);
            },
        })
        setShowConfirmDialog(true)
    }

    const onDeleteUser = () => {
        actionDeleteMember(deleteParam).then((res) => {
            if (res.statusCode == "10000") {
                Logout()
                setIndex(index + 1)
            } else {
                props.funcAlertMsg(res.message)
            }
        })
    }

    const Logout = () => {
        dispatch({ type: LOGIN_MEMBER, userInfo: null }) 
        removeCookie("dtverseMember");
        sessionStorage.clear();
    }

    const onCancel = () => {
        setIndex(index -1)
    }


    return(
        <>
            <div>
                <div className="inventory">
                    <div>
                        <div className="h1">회원탈퇴 확인</div>
                        <div className="subtxt">회원탈퇴 전 확인해 주세요.</div>
                    </div>
                </div>
                
                <div className="detail-info quit">
                    <dl className="dropout-header">
                        <dl>회원탈퇴시, 회원님의 정보는 삭제되며 복구는 불가능합니다.</dl>
                        <dd>회원님의 성명, 연락처 등의 모든 개인정보는 삭제됩니다.</dd>
                        <dd>탈퇴 후 정보 복구는 불가능합니다.</dd>
                        <dd>참여 신청했던 임상 내역 및 문의내역 등의 조회는 불가능합니다.</dd>
                        <dd>사용하였던 아이디와 동일한 아이디로는 재가입이 불가능합니다.</dd>
                    </dl>
                    <dl className="dropout-header">
                        <dl>회원탈퇴 하더라도 일부 게시물, 프로젝트 운영 내역 등은 삭제되지 않고 보관 유지됩니다.</dl>
                        <dd>회원님께서 작성하신 이용문의, 1:1문의 등의 공용게시물은 삭제되지 않습니다.</dd>
                        <dd>임상 모집공고를 신청하시거나 참여하신 경우, 임상 내역(신청정보, 스크리닝 정보, 비대면상담 내역 등)과 관련된 정보는 삭제되지 않습니다.</dd>
                    </dl>
                    <dl className="dropout-header">
                        <dl>아래에 해당되는 경우 회원탈퇴는 불가능합니다.</dl>
                        <dd>임상 모집공고에 참여신청하여 진행 중인 경우 탈퇴가 불가능합니다.</dd>
                        <dd>임상 모집공고에 참여신청하였으나 회원탈퇴를 원하시는 경우 참여취소 후 회원탈퇴해 주시기 바랍니다.</dd>
                        <dd>임상 진행 중인 경우 탈퇴가 불가하오니 임상 완료된 후 회원탈퇴해 주시기 바랍니다.</dd>
                    </dl>
                    <div className="dropout-body">
                        <div className="certify">
                            <div className="required">탈퇴사유</div>
                                <SelectBox id='deleteReason' options={memberDeleteReason} setValue={setDeleteReason} selectValue={deleteReason} />
                            <div>
                                <textarea
                                    disabled={deleteReason != '0007'}
                                    id='deleteReasonEtc'
                                    name='deleteReasonEtc'
                                    onChange={handleChange}
                                    value={deleteReason != '0007' ? '' : deleteParam?.deleteReasonEtc || ''}
                                    placeholder="탈퇴사유를 기타(직접입력)로 선택하신 경우, 필수 입력해주세요. &#13;&#10;회원님의 소중한 의견으로 더 나은 서비스를 제공할 수 있도록 노력하겠습니다."
                                />
                            </div>
                        </div>

                        <div>
                            <input type="checkbox" id="agreeYn" name="agreeYn"checked={agreeYn} onChange={handleChange} />
                            <label htmlFor="agreeYn">위 내용을 모두 확인하였으며, 이의 없음에 동의합니다.</label>
                        </div>

                    </div>
                    <div className="btn-quit">
                        <button type="button" className="btn-circle" onClick={onCancel}>취소</button>
                        <button type="button" className="btn-circle fill" onClick={onSecession}>회원탈퇴</button>
                    </div>
                    {/* alert */}
                    {
                        showConfirmDialog &&
                        <ConfirmDialogComponent cancelRef={cancelRef} description={confirmDialogObject.description}
                            leftText={confirmDialogObject.leftText}
                            rightText={confirmDialogObject.rightText}
                            leftClick={confirmDialogObject.leftClick}
                            rightClick={confirmDialogObject.rightClick} />
                    }
                    {/* alert */}
                </div>
            </div>
        </>
    )
}

export default ComponentSecession;