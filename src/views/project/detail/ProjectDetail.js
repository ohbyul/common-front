import React, { useEffect, useRef, useState } from 'react';
import { decodeJwt } from '../../../utiles/cookie';
import { actionGetMyApplyStatus, actionGetProjectInfo, actionInsertScrap } from '../../../modules/action/ProjectAction';
import { dateFormat, getCurrentDate } from '../../../utiles/date';
import ComponentOrganization from './components/ComponentOrganization';
import ComponentDocument from './components/ComponentDocument';
import ConfirmDialogComponent from '../../components/ConfirmDialogComponent';
import moment from 'moment';
import { METHOD_TYPE, getCodeOption, projectInfo, scrap } from '../../../utiles/code';
import { utilGetListSearch } from '../../../utiles/common';

const ProjectDetail = (props) => {
    //--------------- session ---------------
    const memberInfo =  decodeJwt("dtverseMember");
    //--------------- session ---------------
    //path
    const path = location.pathname;
    const pathArr = path?.split('/')
    const projectId = props.match.params['id']
    const pathType = pathArr[2]
    const queryObj = new URLSearchParams(location.search);
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

    const [param, setParam] = useState()
    const today = dateFormat(getCurrentDate())

    //--------------------------------------------------
    // 신청조건
    // 1. 로그인(& 내 로그인제한)
    // 2. 프로젝트의 모집기간
    // 3. 프로젝트의 임상기간 / 임상 종료 플래그
    // 4. 나의 참여 상태 (다른프로젝트참여중인지)
    // 5. 현재 프로젝트의 신청이력 (탈락.취소 불가)
    // 
    //--------------------------------------------------
    // 신청제한 설정
    const [ isRecruit , setIsRecruit ] = useState(false)            //모집 여부
    const [ isRestriction , setIsRestriction  ] = useState(false)   //내 계정 제한
    const [ isApply , setIsApply  ] = useState(false)               //전체적 프로젝트 참여 현황 

    // 신청방법
    const [ optionsMethodTypeCd , setOptionsMethodTypeCd ] = useState()
    useEffect( () => {
        let data = {
            groupCd : METHOD_TYPE,
            default : '전체'
        }
        getCodeOption(data).then(res=>{if(res)setOptionsMethodTypeCd(res)})
    },[])


    // 데이터 load ---------------------------------------------
    useEffect(()=>{
        if(projectId && optionsMethodTypeCd){
            funcGetProjectInfo()
        }
    },[projectId , optionsMethodTypeCd])

    useEffect(()=>{
        if(memberInfo){
            funcGetMyApplyStatus()
        }
    },[])

    const funcGetMyApplyStatus = () => {
        actionGetMyApplyStatus().then(res => {
            if (res.statusCode===10000) {
                const result = res.data
                // console.log(result);
                
                // 신청제한 설정
                if(memberInfo?.useRestrictionYn === 'Y'){
                    setIsRestriction(true)
                    console.log('이용제한 상태');
                }
                
                if(result?.length > 0){
                    setIsApply(true)
                    console.log('다른 프로젝트 참여중');
                }
            }
        })
    }

    const funcGetProjectInfo = () => {
        let params = {
            projectId : projectId,
            loginYn : memberInfo ? 'Y' : 'N', 
            memberId : memberInfo ? memberInfo?.memberId : null
        }
        
        actionGetProjectInfo(params).then((res) => {
            if (res.statusCode == "10000") {
                let result = res.data
                
                // console.log(result);
                
                // String -> 배열 파싱 
                result.keywordList = JSON.parse(result.keywordList)
                result.organizationList.map(org=>{
                    org.participantList.map(pt=>{
                        if(pt.manageOrgList!==null) {
                            pt.manageOrgList = JSON.parse(pt.manageOrgList)
                        }
                    })
                })

                // status
                let statusValue 
                let statusClassName
                if(result.trialCloseYn === 'Y' || result.trialEndDate < today ){
                    statusValue = '모집종료'    //임상종료 
                    statusClassName = 'end'
                }else{
                    if(result.recruitStartDate > today || result.recruitStartDate === null){
                        statusValue = '모집예정'
                        statusClassName = 'standby'
                    }else if(result.recruitEndDate < today){
                        statusValue = '모집종료'
                        statusClassName = 'end'
                    }else if(result.recruitStartDate <= today && result.recruitEndDate >= today ){
                        const before2weeksDay = moment(result.recruitEndDate).add('-2','w').format('YYYY-MM-DD')
                        if(today >= before2weeksDay){
                            statusValue = '마감임박'
                            statusClassName = 'expect'
                        }else{
                            statusValue = '모집중'
                            statusClassName = 'ing'
                        }
                        setIsRecruit(true)
                    }else{
                        statusValue=''
                        statusClassName = ''
                    }
                }
                
                
                // 모집인원
                const orgs = result?.organizationList?.filter(x=>x.organizationTypeCd === 'HOSPITAL')
                let recruitArr = orgs.map(x=>{return x.recruitNumber})
                let recruitSum = 0
                if(recruitArr?.length > 0){
                    recruitSum = recruitArr?.reduce((a,b) => (a+b));
                }


                //지역
                let region = orgs?.map(x=>{return x.region})
                region = region.filter((item, pos) => region.indexOf(item) === pos);    //중복제거
                let totalRegion = region?.length
                let restNumRegion = totalRegion - 2
                

                // 기관
                let totalOrg = orgs?.length
                let restNumOrg = totalOrg - 3

                // // 신청방법 ME / AGENT
                // let constraintMethodValue
                // const constraintMethod = result?.constraintList.filter(x=>x.constraintTypeCd === 'METHOD')[0]
                // const isDisplay = constraintMethod?.displayYn === 'N' ? false : true
                
                // if(isDisplay){
                //     constraintMethodValue = optionsMethodTypeCd.find(x=>x.value === constraintMethod?.constraintValue)?.label
                // }else{
                //     constraintMethodValue = '-'
                // }

                setParam({...result , 
                    statusValue : statusValue , 
                    statusClassName : statusClassName , 
                    recruitTotalCount : recruitSum,
                    region:region,
                    restNumRegion:restNumRegion,
                    restNumOrg:restNumOrg , 
                    // constraintMethodValue: constraintMethodValue ,
                })
            }
        }).catch(() => props.history.push('/'))
    }

    // [2] 신청 ----------------------------------
    const onInquiry = () => {
        if(isRestriction){
            props.funcAlertMsg('이용이 제한되었습니다.')
            return
        }

        if(memberInfo){
            props.history.push(`/project/inquiry/${projectId}`)
        }else{
            onLoginPage()
        }
    }

    const onApply = () => {
        if(!isRecruit){
            props.funcAlertMsg('모집이 종료된 프로젝트 입니다.')
            return
        }

        else 
        if(isRestriction){
            props.funcAlertMsg('이용이 제한되었습니다.')
            return
        }

        else 
        if(isApply){
            props.funcAlertMsg('현재 임상시험에 참여중으로 신청이 불가합니다. 참여중인 임상시험이 종료된 이후 신청해 주시기 바랍니다.')
            return
        }

        if(memberInfo){
            props.history.push(`/project/apply/${projectId}`)
        }else{
            onLoginPage()
        }
    }
    // [3] 스크랩 -----------------------------------
    const onScrap = (e) => {
        const projectId = e.target.id
        if(memberInfo){
            // 스크랩
            let params = {
                projectId:projectId
            }
            actionInsertScrap(params).then((res)=>{
                if(res.statusCode===10000){
                    props.toastSuccess(res.message)
                    funcGetProjectInfo()
                }
            })
        }else{
            onLoginPage()
        }
    }

    const onLoginPage = () => {
        const location = `${path}?${queryObj.toString()}`
        setConfirmDialogObject({
            description: ['로그인 후 이용 가능합니다.', '로그인 페이지로 이동하시겠습니까?'],
            leftText: '확인',
            rightText: '취소',
            leftClick: () => {
                setShowConfirmDialog(false);
                props.history.push(`/login?referer=${location}`)
            },
            rightClick: () => {
                setShowConfirmDialog(false);
            },
        })
        setShowConfirmDialog(true)
    }

    const onList = () => {
        if(pathType ==="info"){
            let search = utilGetListSearch(projectInfo);
            props.history.push(`/project?${search}`)
        }else if(pathType ==="scrap"){
            let search = utilGetListSearch(scrap);
            props.history.push(`/mypage/scrap?${search}`)
        }
    }
    return (
        <div className="section-wrap">
            <div className="header-bg"></div>
            <div>
                <div className="inventory">
                    <div>
                        <div className="h1">DTx 모집 공고</div>
                        <div className="subtxt">DTx 임상 프로젝트는 DTVERSE와 함께 하세요.</div>
                    </div>
                </div>
                <div className="con-body">

                    <div className="detail-layer">
                        <div className="detail-report">
                            <div className="flex-align gap10x">
                                <div className={`state ${param?.statusClassName}`}>{param?.statusValue}</div>
                                <div className="wording">{param?.postTitle}</div>
                            </div>
                            <div className="flex-align gap10x">
                                <button className="btn-circle w130xh36" onClick={onInquiry}>1:1문의</button>
                                {
                                    param?.applyYn === 'Y' ?
                                        <button className="btn-circle fill w130xh36" onClick={onApply} disabled={true}>신청완료</button>
                                        :
                                        <button className={`btn-circle fill w130xh36 ${!isRecruit || isRestriction || isApply ? 'disabled' : ''}`}
                                                onClick={onApply} 
                                                // disabled={!isRecruit || isRestriction || isApply}
                                        >
                                            신청하기
                                        </button>
                                }
                                
                            </div>
                        </div>
                        <div className="balance mb16">
                            <div className="people-report">
                                <span>
                                    {
                                        param?.region?.map((x,number)=>{
                                            if(number<2){
                                                const isComma = number < 1 && number+1 !== param?.region?.length
                                                return(
                                                    <span key={number}>{x}{isComma ? ',' : ''}</span>
                                                )
                                            }
                                        })
                                    }
                                    {
                                        param?.restNumRegion > 0 ? <span>외 {param?.restNumRegion}개</span> : ''
                                    } 
                                </span>
                                {
                                    param?.constraintList?.length > 0 ? 
                                    param?.constraintList?.map((constraint , inx_con)=>{
                                        if(constraint?.displayYn == 'Y'){
                                            
                                            const isLimit = constraint?.constraintValue === 'UNLIMIT' ? false : true
                                            switch(constraint?.constraintTypeCd){
                                                case 'AGE' : 
                                                return(
                                                    <span key={inx_con}>
                                                        {
                                                            isLimit ? `${constraint?.limitStartAge}세 ~ ${constraint?.limitEndAge}세`
                                                                : '연령무관'
                                                        }
                                                    </span>
                                                )
                                                break;
                                                case 'GENDER' : 
                                                return(
                                                    <span key={inx_con}>
                                                        {
                                                            isLimit ? constraint?.constraintValue === 'M' ? '남' 
                                                                    : constraint?.constraintValue === 'F' ? '여'
                                                                    : '성별무관'
                                                                : '성별무관'
                                                        }
                                                    </span>
                                                )
                                                break;
                                            }
                                        }
                                    })
                                    : ''
                                }
                                <span>
                                    {
                                        param?.organizationList?.filter(x=>x.organizationTypeCd === 'HOSPITAL')?.length > 0 ? 
                                        param?.organizationList?.filter(x=>x.organizationTypeCd === 'HOSPITAL')?.map((org , inx_org)=>{
                                                if(inx_org < 3){
                                                    const orgs = param?.organizationList?.filter(x=>x.organizationTypeCd === 'HOSPITAL')
                                                    const isComma = inx_org < 2 && inx_org+1 !== orgs?.length
                                                    return(
                                                        <span key={inx_org}>
                                                            {
                                                                org?.organizationNm
                                                            }
                                                             {
                                                                isComma ? ',' : ''
                                                            }
                                                        </span>
                                                    )
                                                }
                                            })
                                            : ''
                                    }
                                    {
                                        param?.restNumOrg > 0 ? <span>외 {param?.restNumOrg}개</span> : ''
                                    }
                                </span>
                            </div>
                            <div className="people-report">
                                <span className="date">
                                    {
                                        param?.recruitStartDate ? 
                                            `${param?.recruitStartDate} ~ ${param?.recruitEndDate}`
                                            : ''
                                    }   
                                </span>
                                <span className="none">모집인원 : <span>{param?.recruitTotalCount}</span>명</span>
                                <div className={`bookmark cursor ${param?.scrapYn === 'Y' ? 'active' : 'inactive'}`} id={param?.id} onClick={onScrap}></div>
                            </div>
                        </div>
                        <div className="flex-align gap10x">
                            {
                                param?.keywordCodeList.length > 0 ?
                                param?.keywordCodeList?.map((key , idx) =>{
                                    return(
                                        <button className="btn-tag uncursor" key={idx}># {key?.commCdNm}</button>
                                    )
                                })
                                : ''
                            }
                        </div>
                    </div>
                    <div className="detail-info">
                        <div className="balance">
                            <div className="txt-title">모집개요</div>
                        </div>
                        <div className="line-box">
                            <div className="grid locate-3x gap40x">
                                <div className="dot-txt tit">임상시험 기간</div>
                                <div>{param?.trialStartDate} ~ {param?.trialEndDate}</div>
                            </div>
                            <div className="grid locate-3x gap40x">
                                <div className="dot-txt tit" title='recruit'>모집기간</div>
                                <div>{param?.recruitStartDate} ~ {param?.recruitEndDate }</div>
                                <div className="txt-color">*기관별로 상이할 수 있습니다.</div>
                            </div>
                            {/* <div className="grid locate-3x gap40x">
                                <div className="dot-txt tit">신청방법</div>
                                <div>{param?.constraintMethodValue}</div>
                            </div> */}
                            <div className="grid locate-3x gap40x">
                                <div className="dot-txt tit">Protocol No.</div>
                                <div>{param?.protocolNo}</div>
                            </div>
                            <div className="grid locate-3x gap40x">
                                <div className="dot-txt tit">임상시험 목적</div>
                                <div>{param?.trialPurpose}</div>
                            </div>
                        </div>
                    </div>
                    <div className="detail-info">
                        <div className="balance">
                            <div className="txt-title">선정기준</div>
                        </div>
                        <div className="line-box">
                            <div>
                                <div>
                                    <div>{param?.selectionInfo}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="detail-info">
                        <div className="balance">
                            <div className="txt-title">제외기준</div>
                        </div>
                        <div className="line-box">
                            <div>
                                <div>
                                    <div>{param?.constraintInfo}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <ComponentOrganization organizationList={param?.organizationList.filter(org => org.organizationTypeCd === 'HOSPITAL' )}/>

                    <div className="detail-info">
                        <div className="balance">
                            <div className="txt-title">사례비 안내</div>
                        </div>
                        <div className="line-box">
                            <div>
                                <div>
                                    {
                                        param?.rewardDisplayYn === 'Y' ? 
                                            <div>{param?.rewardInfo}</div>
                                            : 
                                            <div>
                                                임상시험 사례비의 경우 식약처 규정에 따라 DTVERSE 내 모집공고에 노출할 수 없습니다.<br />
                                                사례비, 교통비 등에 대한 문의는 해당 임상시험 1:1 문의를 통해 문의주시기 바랍니다.
                                            </div>
                                    }
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <ComponentDocument document={param?.documentList.filter(file => file.documentTypeCd === 'NOTICE' )[0]}/>
                    
                    <div className="detail-info">
                        <div className="balance">
                            <div className="txt-title">DTx앱 문의안내</div>
                        </div>
                        <div className="line-box">
                            <div>
                                <div>
                                    <div>{param?.dtxInfo}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="con-footer">
                    <div>
                        <button type="button" className="btn-circle fill" onClick={onList}>목록</button>
                    </div>
                </div>

            </div>
            {/* alert */}
            {
                showConfirmDialog &&
                <ConfirmDialogComponent cancelRef={cancelRef} description={confirmDialogObject.description}
                                        leftText={confirmDialogObject.leftText}
                                        rightText={confirmDialogObject.rightText}
                                        leftClick={confirmDialogObject.leftClick}
                                        rightClick={confirmDialogObject.rightClick}/>
            }
            {/* alert */}
        </div>
    );
};

export default ProjectDetail;