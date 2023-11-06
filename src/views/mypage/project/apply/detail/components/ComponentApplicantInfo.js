import React, { useEffect, useState } from 'react';
import { dateTimeFormat, getCurrentDate } from '../../../../../../utiles/date';
import ModalCancelReason from '../modal/ModalCancelReason';
import moment from 'moment';

const ComponentApplicantInfo = (props) => {
    let { subject , isReject, projectId , funcGetSubjectInfo } = props

    const [ status , setStatus] = useState()
    const [ isCancelPossible , setIsCancelPossible ] = useState(false)
    // 참여취소
    const cancelModalRef = React.useRef();
    const [ showModal , setShowModal ] = useState(false);

    // [2] 참여취소 ---------------------------------------
    const onCancel = () => {
        setShowModal(true)
    }

    useEffect(()=>{
        if(!subject)return;

        const today = moment().format('YYYY-MM-DD')
        const nowDtm = dateTimeFormat(getCurrentDate())

        // 신청 상태 [ 참여중 / 임상완료 / 참여취소 ] => 최상단 상태
        //--------------------------------------------------
        // 참여중 =  [ 신청완료 / 스크리닝 / 임상진행 ]
        // 
        // 신청완료 : 신청자가 공개Portal에서 참여신청 후, 연구자가 확인 전
        // 스크리닝 : 1) 공개Portal에서 참여신청 후, 연구자가 확인하여 스크리닝 일정 등록 시
        //           2) 관리Portal에서 연구자가 타경로 신청자의 스크리닝 일정 등록 시
        // 임상진행 : 스크리닝 진행 및 동의서 등록 완료 시
        //           ㄴ 전자서명 : 서명자 전원 서명 완료 시
        //           ㄴ 서면동의서 : 동의서 첨부 완료 시
        //
        //--------------------------------------------------
        // 임상완료 : 임상시험 기간 종료일 후 및 임상종료 시
        // 참여취소 : 1 ) 임상시험 신청취소 또는 임상시험 진행중에 참여취소 시
        //           2 ) 스크리닝 후, 탈락 처리 시
        //--------------------------------------------------

        let applyStatus = subject.statusCdNm
        let applyClassName = 'sub-ing'
        let progressStatusNm = ''
        let progressStatus = ''

        // [1] 프로젝트의 상태
        if(subject?.project?.trialCloseYn === 'Y' || subject?.project?.trialEndDate < today){
            // 임상완료
            applyStatus = '임상완료'
            applyClassName='sub-end'
        }
        else{
            // [2] 피험자의 상태
            if(subject.statusCd === 'APPLY' || subject.statusCd === 'RESERVATION'){
                applyStatus = '참여중'
                applyClassName='sub-ing'

                // 출력 데이터 설정 --------------
                if(subject.statusCd === 'APPLY'){
                    progressStatusNm='신청완료'
                    progressStatus='APPLY'
                    // @@@@ 참여 신청은 신청 상태일때만 가능함 @@@@
                    setIsCancelPossible(true)
                }

                else 
                if(subject.statusCd === 'RESERVATION'){
                    const isSigned = subject?.consentSignList?.filter(x=>x.statusCd === 'COMPLETE')?.length > 0 ? true : false
                    // 서명 여부
                    if(isSigned){

                        // 비대면 상담 정보
                        const counsel = subject?.counselList?.filter(x=>dateTimeFormat(`${x.applyCounselDate} ${x.applyCounselTime}`) > nowDtm 
                                                                    && x.statusCd !== 'CANCEL' )
                        if(counsel?.length > 0){
                            progressStatusNm='임상진행'
                            progressStatus='COUNSEL'
                        }
                        else{
                            progressStatusNm='임상진행'
                            progressStatus='SURVEY'
                        }
                    }else{
                        progressStatusNm='스크리닝'
                        progressStatus='SCREENING'
                    }
                }
                //------------------------------
            }

            else 
            if(subject.statusCd === 'REJECT' || subject.statusCd === 'CANCEL'){
                applyStatus = '참여취소'
                applyClassName='sub-cancel'
            }
        }
        setStatus({
            applyStatus : applyStatus ,
            applyClassName : applyClassName ,
            progressStatusNm : progressStatusNm ,
            progressStatus : progressStatus ,
        })
        // console.log(subject)
    },[subject])

    

    return (
        <div className='breakpoint'>
            <div className="balance">
                <div className="txt-title flex">
                    신청 정보

                    {/*
                        참여중 / className= sub-ing
                        임상완료 / className= sub-end
                        참여취소 / className= sub-cancel
                    */}
                    <div className={`ml8 state ${status?.applyClassName}`}>
                        <span>{status?.applyStatus}</span>
                        <span>{status?.progressStatusNm}</span>
                    </div>
                </div>
                <button type="button" className="btn-square btn-h32" onClick={onCancel} disabled={!isCancelPossible}>참여취소</button>
            </div>
            <div className="mypage-info-box">
                <table className="project-table">
                    <colgroup>
                        <col style={{ "width": "10%" }} />
                        <col style={{ "width": "14%" }} />
                        <col style={{ "width": "auto" }} />
                        <col style={{ "width": "14%" }} />
                        <col style={{ "width": "auto" }} />
                    </colgroup>
                    <tbody>
                        <tr>
                            <th className="txt-center" rowSpan="5">신청자</th>
                            <th className="txt-center">신청구분</th>
                            <td>{subject?.applicantTypeCdNm}</td>
                            <th className="txt-center">신청일</th>
                            <td>{dateTimeFormat(subject?.applyDtm)}</td>
                        </tr>
                        <tr>
                            <th className="txt-center">성명</th>
                            <td>{subject?.applicantNm}</td>
                            <th className="txt-center">생년월일</th>
                            <td>{subject?.applicantBirthDate}</td>
                        </tr>
                        <tr>
                            <th className="txt-center">성별</th>
                            <td>{subject?.applicantGender === 'M' ? '남성' : subject?.applicantGender === 'F' ? '여성' : ''}</td>
                            <th className="txt-center">연락처</th>
                            <td>
                                {
                                    subject?.applicantMobileNo?.length === 10 ? subject?.applicantMobileNo.replace(/-/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3') 
                                    : subject?.applicantMobileNo?.length === 11 ? subject?.applicantMobileNo.replace(/-/g, '').replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
                                    : subject?.applicantMobileNo || ''
                                }
                            </td>
                        </tr>
                        <tr>
                            <th className="txt-center">이메일</th>
                            <td colSpan="3">{subject?.applicantEmail ?? '-'}</td>
                        </tr>
                        <tr>
                            <th className="txt-center">주소</th>
                            <td colSpan="3">{subject?.applicantZipCode ? `(${subject?.applicantZipCode})` : '-'} {subject?.applicantAddress} {subject?.applicantAddressDetail}</td>
                        </tr>
                        <tr>
                            <th className="txt-center" rowSpan="5">시험대상자</th>
                            <th className="txt-center">성명</th>
                            <td>{subject?.subjectNm}</td>
                            <th className="txt-center">신청자와의 관계</th>
                            <td>{subject?.subjectRelation}</td>
                        </tr>
                        <tr>
                            <th className="txt-center">성별</th>
                            <td>{subject?.subjectGender === 'M' ? '남성' : subject?.subjectGender === 'F' ? '여성' : ''}</td>
                            <th className="txt-center">생년월일</th>
                            <td>{subject?.subjectBirthDate}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            {/* 참여 취소 모달 */}
            {
                showModal && <ModalCancelReason {...props} cancelRef={cancelModalRef} setShowModal={setShowModal}
                                                           subject={subject}
                                                           funcGetSubjectInfo={funcGetSubjectInfo}
                                                           projectId={projectId}
                />
            }
        </div>
    );
};

export default ComponentApplicantInfo;