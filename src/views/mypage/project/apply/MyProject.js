import React, { useEffect, useState } from 'react';
import ComponentMyInfo from './components/ComponentMyInfo';
import ComponentProjectApplyList from './components/ComponentProjectApplyList';
import { actionGetMyApplyStatus, actionGetMyProjectList } from '../../../../modules/action/ProjectAction';
import { decodeJwt } from '../../../../utiles/cookie';

const MyProject = (props) => {
    //--------------- session ---------------
    const memberInfo =  decodeJwt("dtverseMember");
    //--------------- session ---------------
    //[1] 프로젝트 리스트
    const [projects , setProjects] = useState([]);

    //내 참여 상태 POSSIBLE : 지원가능 , APPLY : 지원중 , IMPOSSIBLE : 지원불가
    const [ status , setStatus ] = useState()
    const [ isUseRestriction , setisUseRestriction ] = useState(false)

    //출력 데이터
    useEffect(()=> {
        funcGetMyProjectList();
        funcGetMyApplyStatus();
    }, [])

    const funcGetMyProjectList = () => {
        actionGetMyProjectList().then(res => {
            if (res.statusCode===10000) {
                // console.log(res.data);
                setProjects(res.data)
            }
        })
    }

    const funcGetMyApplyStatus = () => {
        actionGetMyApplyStatus().then(res => {
            if (res.statusCode===10000) {
                const result = res.data
                
                if(memberInfo?.useRestrictionYn === 'Y'){
                    setStatus('IMPOSSIBLE')
                    setisUseRestriction(true)
                }
                else{
                    if(result?.length > 0 ){
                        setStatus('APPLY')
                    }else{
                        setStatus('POSSIBLE')
                    }
                }
            }
        })
    }

    return (
        <div>

            <div className="con-header">
                <ComponentMyInfo {...props}
                            memberInfo={memberInfo}
                            projects={projects}
                            status={status}
                />
            </div>

            <div className="con-body">
                <ComponentProjectApplyList {...props}
                                            memberInfo={memberInfo}
                                            projects={projects} 
                                            isUseRestriction={isUseRestriction}
                />

                <dl className="attention p0x30">
                    <dt className="info">안내</dt>
                    <dd>예약일 확정 시 안내문자가 별도로 발송됩니다.</dd>
                    <dd>예약일 변경/취소는 1:1문의를 통해 요청해 주세요.</dd>
                </dl>
            </div>
            
        </div>
    );
};

export default MyProject;