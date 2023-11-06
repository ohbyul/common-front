import React, { useEffect, useState } from 'react';
import { dateFormat, dateTimeFormat, getCurrentDate } from '../../../../../utiles/date';
import moment from 'moment';

const ComponentProjectApplyList = (props) => {
    let { memberInfo , projects , isUseRestriction } = props

    const [isChecked , setIsChecked] = useState(false)
    const [ projectList , setProjectList ] = useState([])

    const today = dateFormat(getCurrentDate())

    useEffect(()=>{
        let temp = projects
        if(!isChecked){
            // 거절 탈락 제외 + 임상완료
            temp = temp?.filter(x=> (x.subjectStatusCd === 'APPLY' || x.subjectStatusCd === 'RESERVATION')
                                  && x.trialCloseYn === 'N' 
                                  && x.trialEndDate >= today 
                                )
        }
        setProjectList(temp)
    },[projects,isChecked])
    
    const handleChange = (e) => {
        setIsChecked(e.target.checked)
    }


    const onPage = (e , item) => {
        if(isUseRestriction){
            props.funcAlertMsg('이용이 제한되었습니다.')
            return
        }

        const pageName = e.target.getAttribute('name')
        switch(pageName){
            case 'inquiry' : 
                props.history.push(`/project/inquiry/${item.id}`)
                break;
            case 'subject' : 
                props.history.push(`/mypage/project/${item.id}/${item.subjectId}?tab=subject`)
                break;
            case 'survey' : 
                props.history.push(`/mypage/project/${item.id}/${item.subjectId}?tab=survey`)
                break;
            
        }
    }
    return (
        <>
            <div className="p0x30x14">
                <input type="checkbox" 
                        name="chk" 
                        id="chk"
                        onChange={handleChange}
                        checked={isChecked}
                />
                <label htmlFor="chk">임상완료/ 취소이력 포함조회</label>
            </div>
            
            {
                projectList?.length > 0 ?
                projectList?.map((item,index) => {
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

                    let applyStatus = item.subjectStatusCdNm
                    let applyClassName = 'sub-ing'
                    let progressStatusNm = ''
                    let progressStatus = ''
                    let isSurvey = false
                    // console.log(item);

                    // [1] 프로젝트의 상태
                    if(item?.trialCloseYn === 'Y' || item?.trialEndDate < today){
                        // 임상완료
                        applyStatus = '임상완료'
                        applyClassName='sub-end'
                        
                        if(item.surveyStartYn === 'Y'){
                            isSurvey=true
                        }
                    }

                    else{
                        // [2] 피험자의 상태
                        if(item.subjectStatusCd === 'APPLY' || item.subjectStatusCd === 'RESERVATION'){
                            applyStatus = '참여중'
                            applyClassName='sub-ing'

                            // 출력 데이터 설정 --------------
                            if(item.subjectStatusCd === 'APPLY'){
                                progressStatusNm='신청완료'
                                progressStatus='APPLY'
                            }

                            else 
                            if(item.subjectStatusCd === 'RESERVATION'){

                                const isSigned = item?.consentSignList?.filter(x=>x.statusCd === 'COMPLETE')?.length > 0 ? true : false
                                // 서명 여부
                                if(isSigned){

                                    // 비대면 상담 정보
                                    const counsel = item?.counselList?.filter(x=>dateTimeFormat(`${x.applyCounselDate} ${x.applyCounselTime}`) > nowDtm 
                                                                                && x.statusCd !== 'CANCEL' )
                                    if(counsel?.length > 0){
                                        progressStatusNm='임상진행'
                                        progressStatus='COUNSEL'
                                    }
                                    else{
                                        progressStatusNm='임상진행'
                                        progressStatus='SURVEY'
                                    }

                                    if(item.surveyStartYn === 'Y'){
                                        isSurvey=true
                                    }
                                    
                                }else{
                                    progressStatusNm='스크리닝'
                                    progressStatus='SCREENING'
                                }
                            }
                            //------------------------------
                        }

                        else
                        if(item.subjectStatusCd === 'REJECT' || item.subjectStatusCd === 'CANCEL'){
                            applyStatus = '참여취소'
                            applyClassName='sub-cancel'
                        }
                    }

                    // 스크리닝 정보
                    const screening = item?.screening
                    const counsel = item?.counselList?.filter(x=>dateTimeFormat(`${x.applyCounselDate} ${x.applyCounselTime}`) > nowDtm && x.statusCd !== 'CANCEL' )
                    
                    return(
                        <div className="con-my" key={index}>
                            <div className="space-between mb14">
                                <div className="flex-align gap10x">
                                    <div className={`state ${applyClassName}`}>
                                        <span>{applyStatus}</span> { applyClassName === 'sub-ing' ? <span>{progressStatusNm}</span>: '' }
                                    </div>
                                    <div className="ask-date">
                                        <span>신청일</span>
                                        <span>{dateFormat(item.applyDtm)}</span>
                                    </div>
                                </div>
                                <div className="flex-align gap10x">
                                    <button className="btn-circle w130xh36" name='inquiry' onClick={(e)=>onPage(e,item)}>1:1문의</button>
                                    <button className="btn-circle fill w130xh36" name='subject' onClick={(e)=>onPage(e,item)} >신청상세정보</button>
                                </div>
                            </div>
                            <div className="grid gap10x mb30">
                                <div className="ellipsis headline2-font cursor" name='subject' onClick={(e)=>onPage(e,item)}>{item.postTitle}</div>
                                <div className="clamp-3x contents1-font">{item.trialPurpose}</div>
                            </div>

                            {
                                progressStatus === 'APPLY' || 
                                progressStatus === 'SCREENING' ? 
                                    <div className="detail-info">
                                        <div className="balance">
                                            <div className="txt-title">방문예약 정보</div>
                                        </div>
                                        <div className="line-box">
                                            <div className="grid locate-3x gap40x">
                                                <div className="dot-txt tit untact">기관</div>
                                                <div>{screening?.organizationNm}</div>
                                            </div>
                                            <div className="grid locate-3x gap40x">
                                                <div className="dot-txt tit untact">방문예약일</div>
                                                <div>{dateTimeFormat(`${screening?.screeningDate} ${screening?.screeningTime}`)}</div>
                                            </div>
                                            <div className="grid locate-3x gap40x">
                                                <div className="dot-txt tit untact">상태</div>
                                                <div>
                                                    {
                                                        screening?.statusCd === 'APPLY' ? 
                                                            '예약일 확정 전'
                                                            : 
                                                            '예약일 확정'
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                : progressStatus === 'COUNSEL' ? 
                                    <div className="detail-info">
                                        <div className="balance">
                                            <div className="txt-title">비대면상담 예약정보</div>
                                        </div>
                                        <div className="line-box">
                                            <div className="grid locate-3x gap40x">
                                                <div className="dot-txt tit untact">기관</div>
                                                <div>{counsel[0]?.organizationNm}</div>
                                            </div>
                                            <div className="grid locate-3x gap40x">
                                                <div className="dot-txt tit untact">연구간호사</div>
                                                <div>{counsel[0]?.participantNm}</div>
                                            </div>
                                            <div className="grid locate-3x gap40x">
                                                <div className="dot-txt tit untact">상담예약일</div>
                                                <div>{dateTimeFormat(`${counsel[0]?.applyCounselDate} ${counsel[0]?.applyCounselTime}`)}</div>
                                            </div>
                                            <div className="grid locate-3x gap40x">
                                                <div className="dot-txt tit untact">상태</div>
                                                <div>
                                                    {
                                                        counsel[0]?.statusCd === 'APPLY' ? 
                                                            '예약일 확정 전'
                                                            : 
                                                            '예약일 확정'
                                                    }
                                                    {
                                                        counsel[0]?.requestTypeCd === 'APPLICANT' ? 
                                                            ` [${counsel[0]?.applyReasonCdNm}]`
                                                        : counsel[0]?.requestTypeCd === 'RESEARCHER' ?
                                                            ''
                                                        :''
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                : <></>
                            }

                            {
                                isSurvey ?
                                <div className="state-info">
                                    <div>임상완료 설문</div>
                                    <button className="btn-square" name='survey' onClick={(e)=>onPage(e,item)}>
                                        {
                                            item?.surveyYn === 'N' ? '설문참여' : '응답보기'
                                        }
                                    </button>
                                </div>
                                : <></>
                            }
                        </div>
                    )    
                })
                : 
                <div className="con-my">
                    <div className="empty">신청내역이 없습니다.</div>
                </div>
            }
        </>
    );
};

export default ComponentProjectApplyList;