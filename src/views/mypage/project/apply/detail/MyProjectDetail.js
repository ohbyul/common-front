import React, { useEffect, useState } from 'react';
import { decodeJwt } from '../../../../../utiles/cookie';
import { actionGetSubjectInfo } from '../../../../../modules/action/SubjectAction';
import Datepicker from '../../../../components/picker/Datepicker';
import SelectBox from '../../../../components/SelectBox';
import PageCounsel from './PageCounsel';
import PageSubject from './PageSubject';
import PageSurvey from './PageSurvey';

const MyProjectDetail = (props) => {
    //path
    const path = location.pathname;
    const queryObj =  new URLSearchParams(location.search);
    const projectId = props.match.params['projectId']
    const subjectId = props.match.params['subjectId']
    
    const tabs = [
        { index: 0, id: 'subject', name: '신청상세정보' },
        { index: 1, id: 'counsel', name: '비대면상담' },
        { index: 2, id: 'survey', name: '임상완료 설문' },
    ]
    const [selectTab, setSelectTab] = useState(queryObj.get('tab') ?? 'subject')
    const onTab = (data) => {
        setSelectTab(data)
        queryObj.set('tab' ,data)
        props.history.push(`${path}?` + queryObj.toString())

    }
    // [1-1] 신청자 정보
    const [subject, setSubject] = useState()
    // boolean
    const [isReject, setIsReject] = useState(false)

    // [1] 데이터 조회 ---------------------------------------
    useEffect(() => {
        if (subjectId) {
            funcGetSubjectInfo()
        }
    }, [subjectId])

    const funcGetSubjectInfo = () => {
        let params = {
            id: projectId,
            subjectId: subjectId
        }
        actionGetSubjectInfo(params).then((res) => {
            if (res.statusCode == "10000") {
                // console.log("subject",res.data);
                setSubject(res.data)
                // 활성화 여부
                if (res.data?.statusCd === 'CANCEL' || res.data?.statusCd === 'REJECT') {
                    setIsReject(true)
                }
            }
        })
    }

    return (
        <div>

            <div className="con-infor">
                <div className="space-between">
                    <div className="flex-align gap24x">
                        <div className="protocol">Protocol No. {subject?.protocolNo}</div>
                        <div>{subject?.project?.postTitle}</div>
                    </div>
                    <div>
                        <button type="button" className="btn-circle" onClick={() => props.history.push('/mypage/project')}>신청내역 목록</button>
                    </div>
                </div>


                <div className="flex">
                    {
                        tabs.map((item) => {
                            return (
                                <div className="tab-choice" key={item.index}>
                                    <input type="radio"
                                        id={item.id}
                                        name="tab"
                                        onChange={() => onTab(item.id)}
                                        checked={selectTab === item.id}
                                    />
                                    <label htmlFor={item.id}>{item.name}</label>
                                </div>
                            )
                        })
                    }
                </div>
            </div>

            {
                selectTab === 'subject' ?  <PageSubject {...props} subject={subject} funcGetSubjectInfo={funcGetSubjectInfo}
                                                                    projectId={projectId} subjectId={subjectId} isReject={isReject}
                                            />
                : selectTab === 'counsel' ? <PageCounsel {...props} subject={subject} funcGetSubjectInfo={funcGetSubjectInfo}
                                                                    projectId={projectId} subjectId={subjectId} isReject={isReject}
                                            />
                : selectTab === 'survey' ? <PageSurvey {...props} subject={subject} funcGetSubjectInfo={funcGetSubjectInfo}
                                                                  projectId={projectId} subjectId={subjectId} isReject={isReject}
                                            />
                : <></>
            }

        </div >
    );
};

export default MyProjectDetail;