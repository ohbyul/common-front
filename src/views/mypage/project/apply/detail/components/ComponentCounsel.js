import React, { useEffect, useState } from 'react';
import { dateTimeFormat, getCurrentDate } from '../../../../../../utiles/date';
import moment from 'moment';
import ConfirmDialogComponent from '../../../../../components/ConfirmDialogComponent';
import ModalAddCounsel from '../modal/ModalAddCounsel';
import { actionInsertCounsel } from '../../../../../../modules/action/CounselAction';
import { decodeJwt } from '@/utiles/cookie';

const ComponentCounsel = (props) => {
    let { subject , isReject, projectId , subjectId, funcGetSubjectInfo } = props

    //--------------- session ---------------
    const memberInfo = decodeJwt("dtverseMember");
    //--------------- session ---------------

    //--------------- confirm ---------------
    const cancelConfirmRef = React.useRef();
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [confirmDialogObject, setConfirmDialogObject] = useState({
        description: '',
        leftText: '',
        rightText: '',
        leftClick: null,
        rightClick: null
    })
    //--------------- confirm ---------------
    const [ reservationInfo , setReservationInfo ] = useState()
    const [ isCompleteScreening , setIsCompleteScreening ] = useState(false)    // 동의서서명 여부
    const [isPassTime , setIsPassTime ] = useState(false)                       // 상담시간 지남 여부

    // modal on/off 
    const cancelModalRef = React.useRef();
    const [ showModal , setShowModal ] = useState(false);

    const [ selectItem , setSelectItem ] =useState()    // 예약정보

    useEffect(()=>{
        if(subject){
            // 비대면 상담 예약 정보 조회
            const nowTime = dateTimeFormat(getCurrentDate())
            let counsels = subject?.counselList?.find(x => moment(x.applyCounselDate + ' ' +x.applyCounselTime).add(30,'minutes').format('YYYY-MM-DD HH:mm:ss') >= nowTime 
                                                        && (x.statusCd === 'RESERVATION' || x.statusCd === 'APPLY')
                                                     )
            setReservationInfo(counsels)
            
            if(counsels){
                const counselDateTime =counsels.applyCounselDate + ' ' +counsels.applyCounselTime
                const pass30minTime = moment(counselDateTime).add(30,'minutes').format('YYYY-MM-DD HH:mm:ss')
                const isPass = counselDateTime < nowTime && pass30minTime > nowTime ? true : false
                if(isPass){
                    setIsPassTime(isPass)
                }
            }

            // 스크리닝 진행여부
            const consentSignList = subject?.consentSignList?.filter(x=>x.statusCd === 'COMPLETE')
            if(subject?.statusCd === 'RESERVATION' && consentSignList?.length > 0 ){
                setIsCompleteScreening(true)
            }
        }
    },[subject])

    // [2] 모달 ---------------------------------------------
    const onModal = () => {
        let item = {
            applicantNm:subject?.applicantNm
            ,subjectNm:subject?.subjectNm
            ,subjectId:subject?.id
            ,organizationCd:subject?.organizationCd
            ,organizationNm:subject?.organizationNm       //기관명
            ,counselId:reservationInfo?.id
            ,applyCounselDate:reservationInfo?.applyCounselDate
            ,applyCounselTime:reservationInfo?.applyCounselTime
            ,participantId:reservationInfo?.participantId
            ,applyReasonCd:reservationInfo?.applyReasonCd
        }
        setSelectItem(item)
        setShowModal(true)
    }

    // [3] 예약 취소------------------------------
    const onCancel = () => {
        setConfirmDialogObject({
            description: ['비대면 상담 예약을 취소하시겠습니까?'] ,
            leftText: '확인',
            rightText: '취소',
            leftClick: () => {
              setShowConfirmDialog(false);
              funcUpdateCounsel()
            },
            rightClick: () => {
              setShowConfirmDialog(false);
            },
        })
        setShowConfirmDialog(true)
    }

    const funcUpdateCounsel = () => {
        let param = {
            applicantNm:subject?.applicantNm
            ,subjectNm:subject?.subjectNm
            ,subjectId:reservationInfo?.subjectId
            ,organizationCd:reservationInfo?.organizationCd
            ,counselId:reservationInfo?.id
            ,applyCounselDate:reservationInfo?.applyCounselDate
            ,applyCounselTime:reservationInfo?.applyCounselTime
            ,participantId:reservationInfo?.participantId
            ,applyReasonCd:reservationInfo?.applyReasonCd
            ,statusCd: 'CANCEL'
        }
        actionInsertCounsel(projectId,param).then((res) => {
            if (res.statusCode == "10000") {
                props.toastSuccess(res.message)
                onReload()
            }
        })
    }

    const onReload = () => {
        funcGetSubjectInfo()
        // TODO : 이력 리로드
    }

    // [4] 상담 시작 ---------------------------
    const onStartCounsel = () => {
        if(reservationInfo?.statusCd === 'COMPLETE'){
            props.funcAlertMsg("이미 상담완료 되었습니다.")
            return
        }
        const baseTime = moment(`${reservationInfo?.applyCounselDate} ${reservationInfo?.applyCounselTime}`).add(-10,"m").format('YYYY-MM-DD HH:mm')
        const today = dateTimeFormat(getCurrentDate());
        if(baseTime < today){
            const url = `${reservationInfo?.counselUrl}?userName=${memberInfo?.memberNm}`
            window.open(url, "_blank");     //, "noopener, noreferrer"

        }else{
            props.funcAlertMsg("비대면상담 접속은 상담 시작 10분전부터 가능합니다.")
            return
        }

    }

    return (
        <div className='mb30'>
            <div className="balance">
                <div className="txt-title">비대면상담 예약정보</div>
                <div className="flex gap8x">

                    {
                        !reservationInfo ? 
                        <button type="button" 
                                className="btn-square"
                                onClick={onModal}
                                disabled={isReject || !isCompleteScreening }
                        >
                            신청
                        </button>
                        : 
                        ''
                    }

                    {/* 예약취소 - 신청 or 예약확정 일시 */}
                    {
                        reservationInfo?.statusCd === 'APPLY' || reservationInfo?.statusCd === 'RESERVATION' ? 
                            <button type="button" 
                                    className="btn-square" 
                                    onClick={onCancel} 
                                    disabled={isReject || !isCompleteScreening || reservationInfo?.statusCd === 'RESERVATION'}
                            >
                                예약취소
                            </button>                    
                            : ''
                    }

                    {/* 상담시작 - 예약 확정 일시 */}
                    {
                        reservationInfo?.statusCd === 'RESERVATION' ? 
                            <button type="button" className="btn-square fill" onClick={onStartCounsel} disabled={isReject}>
                                상담시작
                            </button> 
                            : ''
                    }
                </div>
            </div>
            <div className="info-box">
                {
                    reservationInfo ?
                    <dl>
                        <dd className="table-dd">
                            <div className="dot-txt">예약 상태</div>
                            <div>{reservationInfo?.statusCdNm}</div>
                            <div className="dot-txt">신청 사유</div>
                            <div>{reservationInfo?.applyReasonCdNm}</div>
                        </dd>
                        <dd className="table-dd">
                            <div className="dot-txt">기관</div>
                            <div>{reservationInfo?.organizationNm}</div>
                        </dd>
                        <dd className="table-dd">
                            <div className="dot-txt">상담예약일</div>
                            <div style={{color : `${isPassTime ? 'red' : ''}` }}>{dateTimeFormat(`${reservationInfo?.applyCounselDate} ${reservationInfo?.applyCounselTime}`)}</div>
                            <div className="dot-txt">담당 연구간호사</div>
                            <div>{reservationInfo?.participantNm}</div>
                        </dd>
                        <dd className="table-dd">
                            <div className="dot-txt">신청자</div>
                            <div>
                                <span>{ reservationInfo?.requestTypeCd === 'APPLICANT' ? '신청자 ' : reservationInfo?.requestTypeCd === 'RESEARCHER' ? '연구원 ' : '' }</span>
                                ({ reservationInfo?.requestTypeCd === 'APPLICANT' ? reservationInfo?.subjectNm : reservationInfo?.writeUserNm})
                            </div>
                            <div className="dot-txt">신청일</div>
                            <div>{dateTimeFormat(reservationInfo?.createDtm)}</div>
                        </dd>
                    </dl>
                    :
                    <div className="con-tip">
                        <div className="empty">
                            {
                                isCompleteScreening ?
                                '비대면상담 예약정보가 없습니다.' : '동의서 서명 완료 후 이용 가능합니다.'
                            }
                        </div>
                    </div>
                }
                <div className="infor-report gray200">
                    <div className="dot-txt">예약일정 확정시 안내문자가 별도로 발송됩니다.</div>
                    <div className="dot-txt">예약취소는 예약 확정 전에만 가능하며, 확정 후에는 불가합니다.</div>
                    <div className="dot-txt">예약일 확정 전 변경은 취소 후 재예약하거나, 1:1문의를 통해 변경해 주시기 바랍니다.</div>
                    <div className="dot-txt">예약일 확정 후 변경 및 취소는 1:1문의를 통해서 요청해 주시기 바랍니다.</div>
                </div>
            </div>

            {
                showModal && <ModalAddCounsel {...props} cancelRef={cancelModalRef} setShowModal={setShowModal}
                                                selectItem={selectItem} onReload={onReload}/>
            }
            {
                showConfirmDialog &&
                <ConfirmDialogComponent cancelRef={cancelConfirmRef} description={confirmDialogObject.description}
                                        leftText={confirmDialogObject.leftText}
                                        rightText={confirmDialogObject.rightText}
                                        leftClick={confirmDialogObject.leftClick}
                                        rightClick={confirmDialogObject.rightClick}/>
            }
        </div>
    );
};

export default ComponentCounsel;