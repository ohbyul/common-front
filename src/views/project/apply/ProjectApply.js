import React, { useEffect, useState } from 'react';

import { actionGetProjectInfo, actionGetMyApplyStatus } from '../../../modules/action/ProjectAction';
import { decodeJwt } from '../../../utiles/cookie';

import { actionGetMemberInfo } from '../../../modules/action/MemberAction';

import PageApplyInfo from './components/PageApplyInfo';
import PageBasicInfo from './components/PageBasicInfo';
import PageComplete from './components/PageComplete';
import { getWesternAge } from '../../../utiles/date';
import ConfirmDialogComponent from '../../components/ConfirmDialogComponent';
import { actionInsertSubject } from '../../../modules/action/SubjectAction';
import { APPLICANT_TYPE, GENDER, getCodeOption } from '../../../utiles/code';

const ProjectApply = (props) => {
    //--------------- session ---------------
    const memberInfo = decodeJwt("dtverseMember");
    //--------------- session ---------------
    //path
    const projectId = props.match.params['id']
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
    // 신청방법
    const [optionsMethodTypeCd, setOptionsMethodTypeCd] = useState()
    useEffect(() => {
        let data = {
            groupCd: APPLICANT_TYPE,
            default: '전체'
        }
        getCodeOption(data).then(res => { if (res) setOptionsMethodTypeCd(res) })
    }, [])

    const [optionsgender, setOptionsgender] = useState([])
    // 남녀 옵션
    useEffect(() => {
        let data = {
            groupCd: GENDER,
            default: '선택'
        }
        getCodeOption(data).then(res => { if (res) setOptionsgender(res) })
    }, [])

    // [1] 탭 ---------------------------------------------------
    const tabArr = [
        { index: 0, number: '01', name: '기본정보 입력', id: 'basic' },
        { index: 1, number: '02', name: '신청정보 입력', id: 'apply' },
        { index: 2, number: '03', name: '신청완료', id: 'complete' },
    ]
    const [tabIndex, setTabIndex] = useState(0)



    const [project, setProject] = useState()
    const [member, setMember] = useState({})
    const [params, setParams] = useState({
        projectId: projectId,
        protocolNo: '',

        applicantTypeCd: '',
        statusCd: 'APPLY',

        applicantNm: '',
        applicantBirthDate: '',
        applicantGender: '',
        applicantMobileNo: '',
        applicantPhoneNo: '',
        applicantEmail: '',
        applicantZipCode: '',
        applicantAddress: '',
        applicantAddressDetail: '',

        subjectRelation: null,
        subjectNm: null,
        subjectBirthDate: null,
        subjectGender: null,

        prenancyYn: null,

        applyTypeCd: 'SYSTEM',

        organizationCd: '',
        screeningDate: '',
        screeningTime: '',

        examinationList: []

    })

    useEffect(async () => {
        const { statusCode, data } = await actionGetMyApplyStatus()
        if (statusCode === 10000) {
            if (memberInfo?.useRestrictionYn === 'Y' || data?.length > 0) {
                props.history.push('/')
                return
            }
        }
        if (!memberInfo) {
            return
        }

        let param = {
            memberId: memberInfo?.memberId
        }
        actionGetMemberInfo(param).then((res) => {
            if (res.statusCode === 10000) {
                const result = res.data
                setMember(result);

                setParams({
                    ...params,
                    applicantNm: result.memberNm,
                    applicantBirthDate: result.birthDate,
                    applicantGender: result.gender,
                    applicantMobileNo: result.mobileNo,
                    applicantPhoneNo: result.phoneNo,
                    applicantEmail: result.email,
                    applicantZipCode: result.zipCode,
                    applicantAddress: result.address,
                    applicantAddressDetail: result.addressDetail,
                })
            }
        })
        if (projectId) {
            funcGetProjectInfo()
        }
    }, [])

    const funcGetProjectInfo = () => {
        let param = {
            projectId: projectId,
            loginYn: memberInfo ? 'Y' : 'N',
            memberId: memberInfo ? memberInfo?.memberId : null
        }
        actionGetProjectInfo(param).then((res) => {
            if (res.statusCode == "10000") {
                let result = res.data

                // String -> 배열 파싱 
                result.keywordList = JSON.parse(result.keywordList)
                result.organizationList.map(org => {
                    org.participantList.map(pt => {
                        if (pt.manageOrgList !== null) {
                            pt.manageOrgList = JSON.parse(pt.manageOrgList)
                        }
                    })
                })
                setProject({ ...result })
            }
        })
    }
    const funcGetMyApplyStatus = () => {
        actionGetMyApplyStatus().then(res => {
            if (res.statusCode === 10000) {
                const result = res.data
                if (memberInfo?.useRestrictionYn === 'Y' || result?.length > 0) {
                    props.history.push('/')
                }

            }
        })
    }

    // [3] NextLeval --------------------------------------
    // [3-1] 필수값 체크
    const onNext = () => {
        if (tabIndex === 0) {
            if (params?.applicantTypeCd === '') {
                props.funcAlertMsg('신청자 구분을 선택해주세요')
                return
            } else
                if (params?.applicantTypeCd === 'REPRESENTATIVE') {
                    if (!params?.subjectRelation || params?.subjectRelation === '') {
                        props.funcAlertMsg('신청자와의 관계을 입력해주세요')
                        document.getElementsByName(`subjectRelation`)[0].focus();
                        return
                    } else
                        if (!params?.subjectNm || params?.subjectNm === '') {
                            props.funcAlertMsg('시험대상자 성명을 입력해주세요')
                            document.getElementsByName(`subjectNm`)[0].focus();
                            return
                        } else
                            if (!params?.subjectBirthDate || params?.subjectBirthDate === '') {
                                props.funcAlertMsg('시험대상자 생년월일을 선택해주세요')
                                return
                            } else
                                if (!params?.subjectGender || params?.subjectGender === '') {
                                    props.funcAlertMsg('시험대상자 성별을 선택해주세요')
                                    return
                                } else
                                    if (params?.subjectGender === 'F' && (!params?.prenancyYn || params?.prenancyYn === '')) {
                                        props.funcAlertMsg('임신여부를 선택해주세요')
                                        return
                                    }
                } else
                    if (params?.applicantTypeCd === 'SUBJECT') {
                        if (params?.applicantGender === 'F' && (!params?.prenancyYn || params?.prenancyYn === '')) {
                            props.funcAlertMsg('임신여부를 선택해주세요')
                            return
                        }
                    }
        } else
            if (tabIndex === 1) {
                const examArr = params?.examinationList.filter(x => x.mandatoryYn === 'Y')
                // 스크리닝
                if (params?.organizationCd === '') {
                    props.funcAlertMsg('방문기관을 선택해주세요.')
                    return
                } else
                    if (params?.screeningDate === '') {
                        props.funcAlertMsg('방문 희망일을 선택해주세요.')
                        return
                    } else
                        if (params?.screeningTime === '') {
                            props.funcAlertMsg('방문 시간을 선택해주세요')
                            return
                        }
                        // 문진
                        else
                            if (examArr?.find(x => x.resultItemId === undefined || x.resultItemId === '' || x.resultItemId === null || x.resultItemId.length === 0)) {
                                props.funcAlertMsg('필수 문진 항목을 선택해주세요.')
                                return
                            }
                            // 임상시험 참여 약관 동의
                            else
                                if (!params?.privacy || !params?.agent) {
                                    props.funcAlertMsg('임상시험 참여 약관 동의는 필수입니다.')
                                    return
                                }
            }
        // 모집제한 체크
        onCheckConstraint()
    }
    // [3-2] 신청제한 체크
    const onCheckConstraint = () => {

        if (tabIndex === 0) {
            const constraintList = project?.constraintList
            // 나이
            const isLimitAge = constraintList?.find(x => x.constraintTypeCd === 'AGE')?.constraintValue === 'UNLIMIT' ? false : true
            const startAge = constraintList?.find(x => x.constraintTypeCd === 'AGE')?.limitStartAge
            const endAge = constraintList?.find(x => x.constraintTypeCd === 'AGE')?.limitEndAge
            // 성별
            const isLimitGender = constraintList?.find(x => x.constraintTypeCd === 'GENDER')?.constraintValue === 'UNLIMIT' ? false : true
            const gender = constraintList?.find(x => x.constraintTypeCd === 'GENDER')?.constraintValue.slice(0, 1)
            // 임신여부
            const isLimitPregnancy = constraintList?.find(x => x.constraintTypeCd === 'PREGNANCY')?.constraintValue === 'IMPOSSIBLE' ? true : false

            let msg

            if (params?.applicantTypeCd === 'REPRESENTATIVE') {
                if (isLimitAge) {
                    const subjectAge = getWesternAge(params?.subjectBirthDate)
                    if (subjectAge < startAge || subjectAge > endAge) {
                        msg = '시험대상자의 연령이 선정기준에 부합되지 않습니다. '
                        onProjectListPage(msg)
                        return
                    }
                }
                if (isLimitGender) {
                    if (gender !== params?.subjectGender) {
                        msg = '시험대상자의 성별이 선정기준에 부합되지 않습니다. '
                        onProjectListPage(msg)
                        return
                    }
                }
                if (params?.subjectGender === 'F' && isLimitPregnancy) {
                    if (params?.prenancyYn === 'Y') {
                        msg = '임산부 또는 임신 가능성이 있으신 분께서는 선정기준에 부합되지 않습니다. '
                        onProjectListPage(msg)
                        return
                    }
                }
            } else
                if (params?.applicantTypeCd === 'SUBJECT') {
                    if (isLimitAge) {
                        const applicantAge = getWesternAge(params?.applicantBirthDate)
                        if (applicantAge < startAge || applicantAge > endAge) {
                            msg = '시험대상자의 연령이 선정기준에 부합되지 않습니다. '
                            onProjectListPage(msg)
                            return
                        }
                    }
                    if (isLimitGender) {
                        if (gender !== params?.applicantGender) {
                            msg = '시험대상자의 성별이 선정기준에 부합되지 않습니다. '
                            onProjectListPage(msg)
                            return
                        }
                    }
                    if (params?.applicantGender === 'F' && isLimitPregnancy) {
                        if (params?.prenancyYn === 'Y') {
                            msg = '임산부 또는 임신 가능성이 있으신 분께서는 선정기준에 부합되지 않습니다. '
                            onProjectListPage(msg)
                            return
                        }
                    }
                }

            setTabIndex(tabIndex + 1)
        } else
            if (tabIndex === 1) {
                const resultExamList = params?.examinationList
                for (let result of resultExamList) {
                    // 아이템
                    const items = result.examinationItemList
                    // 결과값
                    let resultItem = result?.resultItemId

                    const restraintArr = items.filter(x => x.applyRestraintYn === 'Y')?.map(z => { return z.id })

                    if (result.questionTypeCd === 'SINGLE_SELECT') {
                        if (restraintArr.includes(resultItem)) {
                            onProjectListPage()
                            return
                        }
                    }

                    else
                        if (result.questionTypeCd === 'MULTI_SELECT') {
                            for (let x of resultItem) {
                                if (restraintArr.includes(x)) {
                                    onProjectListPage()
                                    return
                                }
                            }
                        }
                }

                onSaveSubject()
            }
    }

    const onProjectListPage = (msg) => {
        let msgArr = ['신청 자격에 부합되지 않습니다. ', ' 다른 모집공고에 신청해 주시기 바랍니다.', ' 확인을 클릭하시면, ', '공고모집 리스트 화면으로 이동됩니다.']
        if (msg) {
            msgArr[0] = msg
        }

        // console.log(msgArr);

        setConfirmDialogObject({
            description: msgArr,
            leftText: '확인',
            rightText: '취소',
            leftClick: () => {
                setShowConfirmDialog(false);
                props.history.push('/project')
            },
            rightClick: () => {
                setShowConfirmDialog(false);
            },
        })
        setShowConfirmDialog(true)
        return
    }

    const onSaveSubject = () => {
        setConfirmDialogObject({
            description: ['신청서를 최종제출 하신 후에는 지원서', '수정이 불가능 하오니 신중하게 작성하시어', '제출해 주시기 바랍니다.', '', '제출 하시겠습니까?'],
            leftText: '확인',
            rightText: '취소',
            leftClick: () => {
                setShowConfirmDialog(false);
                actionInsertSubject(params).then((res) => {
                    if (res.statusCode == "10000") {
                        setTabIndex(tabIndex + 1)
                    }
                })
            },
            rightClick: () => {
                setShowConfirmDialog(false);
            },
        })
        setShowConfirmDialog(true)

    }

    return (
        <div className="section-wrap">
            <div className="header-bg"></div>
            <div>
                <div className="inventory">
                    <div>
                        <div className="h1">DTx 모집 공고 신청하기</div>
                        <div className="subtxt">임상시험 참여 정보를 입력해 주세요.</div>
                    </div>
                </div>
                <div className="con-body">

                    <div className="stage">
                        {/* active */}
                        {
                            tabArr?.map((tab, index) => {
                                return (
                                    <div className={`${tabIndex === tab.index ? 'active' : ''}`} key={index}><span>{tab.number}</span>{tab.name}</div>
                                )
                            })
                        }
                    </div>

                    {
                        tabIndex === 0 ? <PageBasicInfo {...props}
                            projectInfo={project}
                            params={params} setParams={setParams}
                            member={member}
                            optionsMethodTypeCd={optionsMethodTypeCd} optionsgender={optionsgender}
                        />
                            : tabIndex === 1 ? <PageApplyInfo {...props}
                                projectInfo={project}
                                params={params} setParams={setParams}
                                onProjectListPage={onProjectListPage}
                            />
                                : tabIndex === 2 ? <PageComplete {...props}
                                    projectInfo={project}
                                />
                                    : <></>
                    }



                </div>

                <div className="con-footer">
                    <div>
                        {
                            tabIndex === 0 ? <button type="button" className="btn-circle" onClick={() => props.history.push(`/project/info/${projectId}`)}>취소</button>
                                : tabIndex === 1 ? <button type="button" className="btn-circle" onClick={() => { setTabIndex(tabIndex - 1) }}>이전</button>
                                    : tabIndex === 2 ? <button type="button" className="btn-circle" onClick={() => props.history.push('/')}>메인화면</button>
                                        : <></>
                        }

                        {
                            tabIndex === 0 || tabIndex === 1 ? <button type="button" className="btn-circle fill" onClick={onNext}>다음</button>
                                : <button type="button" className="btn-circle fill" onClick={() => props.history.push('/project')}>목록</button>
                        }

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
                    rightClick={confirmDialogObject.rightClick} />
            }
            {/* alert */}
        </div>
    );
};

export default ProjectApply;