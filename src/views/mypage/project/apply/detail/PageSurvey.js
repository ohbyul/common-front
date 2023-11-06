import React, { useEffect, useState, useRef } from "react";
import ComponentWriteSurvey from "./components/ComponentWriteSurvey";

const PageSurvey = (props) => {
    let { subject , isReject , projectId, subjectId, funcGetSubjectInfo } = props

    const [ isStartSurvey, setIsStartSurvey ] = useState(false)
    const [ isCompleteSurvey, setIsCompleteSurvey ] = useState(false)
    const [ isSubjectSurvetPossible , setIsSubjectSurvetPossible] = useState(false)
    const [ project , setProject ]= useState()
    const [ survey , setSurvey ] = useState()

    // console.log(subject);
    useEffect(()=>{
        if(subject){
            // 상태
            const isProjectStart = subject?.project?.surveyStartYn === 'N' ? false : true
            const isSurveyPossible = subject?.statusCd === 'RESERVATION'
            setIsSubjectSurvetPossible(isSurveyPossible)
            const isFinishSubject = subject?.surveyYn === 'N' ? false : true
            setIsStartSurvey(isProjectStart)
            setIsCompleteSurvey(isFinishSubject)
            // 설문
            setProject(subject?.project)
            setSurvey(subject?.surveyList)
        }
    },[subject])

    return (
        <div>
            {
                isStartSurvey && isSubjectSurvetPossible ? 
                <div className="mypage-counsel">
                    <div className="balance"><div className="txt-title">{project?.surveyTitle}</div></div>
                    <ul className="infor-report gray100 mt10">
                        {project?.surveyContents && <li className="dot-txt">{project?.surveyContents}</li>}
                        <li className="dot-txt">더 나은 서비스 제공을 위해 설문조사를 진행중이니 기간내 참여 부탁드립니다.</li>
                    </ul>
                    <ComponentWriteSurvey {...props} 
                                            survey={survey} setSurvey={setSurvey} subject={subject}
                                            isCompleteSurvey={isCompleteSurvey}
                    />   

                </div>
                : <div className="new-empty">설문이 시작되지 않았습니다.</div>
            }
            
        </div>
    );
};

export default PageSurvey;