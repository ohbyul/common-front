import React, { useEffect, useState } from 'react';


import ComponentScreening from './ComponentScreening';
import ComponentExamination from './ComponentExamination';
import ComponentTerms from './ComponentTerms';

const PageApplyInfo = (props) => {
    let {projectInfo , params , setParams} = props
    
    // 스크리닝
    const [ orgs , setOrgs] = useState([])

    useEffect(()=>{
        if(projectInfo){
            let hospital = projectInfo?.organizationList?.filter(x=>x.organizationTypeCd === 'HOSPITAL')
            setOrgs(hospital)
            setParams({...params , examinationList : projectInfo?.examinationList})
        }
    },[projectInfo])

   

    
    return (
        <>
            <div className="detail-info">
                <div className="balance">
                    <div className="txt-title">스크리닝(건강검진) 방문 기관 및 일정 선택</div>
                </div>
                
                <ComponentScreening {...props} orgs={orgs} />

            </div>

            <div className="detail-info">
                <div className="balance">
                    <div className="txt-title">문진표 작성</div>
                </div>
                
                <ComponentExamination {...props} />

                <dl className="attention mt10">
                    <dt className="info">신청서 제출 전 반드시 확인해 주세요.</dt>
                    <dd>온라인 지원 시 작성하신 정보는 해당 임상시험 관련 기관에 제공됩니다.</dd>
                    <dd>필요에 따라 신청자 또는 대리인(보호자) 신청)분께 개별적으로 연락이 갈 수 있습니다.</dd>
                    <dd>모든 신청자는 스크르닝 검사 통과 시에도 후보가 되거나 연구에 참여하지 못 할 수 있습니다.</dd>
                    <dd>검사 방문과 탈락 시 별도의 교통비와 사례비는 지급되지 않습니다.</dd>
                    <dd>중복 참여되거나 다수의 임상 시험에 동시다발적으로 시험대상자로 선발된 경우, 선발이 취소될 수 있습니다.</dd>
                    <dd>모집공고 상세 내용과 주의사항을 모두 확인하시고 신청을 완료해 주시기 바랍니다.</dd>
                </dl>
            </div>


            <div className="detail-info">
                <div className="balance">
                    <div className="txt-title">임상시험 참여 약관 동의</div>
                </div>
                
                <ComponentTerms {...props}/>
            </div>
        </>
    );
};

export default PageApplyInfo;