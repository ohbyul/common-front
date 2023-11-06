import React, { useEffect, useRef, useState } from 'react';
import { decodeJwt } from '../../../utiles/cookie';
import { dateFormat, getCurrentDate } from '../../../utiles/date';
import { actionGetProjectList, actionInsertScrap } from '../../../modules/action/ProjectAction';
import Pagination from '../../components/Pagination';
import moment from 'moment';
import { utilSetListSearch } from '../../../utiles/common';
import { scrap } from '../../../utiles/code';
import ConfirmDialogComponent from '../../components/ConfirmDialogComponent';

const MyProjectScrap = (props) => {
    //--------------- session ---------------
    const memberInfo = decodeJwt("dtverseMember");
    //--------------- session ---------------
    //path
    const path = location.pathname;
    const queryObj = new URLSearchParams(location.search);
    const firstUpdate = useRef(true);

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

    //[1] 스크랩 리스트
    const [scraps, setScraps] = useState([]);
    //[1-2] 페이지네이션
    const pageSize = 5;
    const [pageLimit, setPageLimit] = useState(10)
    const [page, setPage] = useState()
    const [totalPage, setTotalPage] = useState([])
    const [totalCount, setTotalCount] = useState(0)
    //[1-3] 모집공고 상태조회
    const [optionsRecruitStatus, setOptionsRecruitStatus] = useState([
        { value: 'ALL', label: '전체' },
        { value: 'ING', label: '모집중' },
        { value: 'DUE', label: '모집예정' },
        { value: 'END', label: '모집종료' },
    ]);
    const [recruitStatus, setRecruitStatus] = useState(queryObj?.get('recruitStatus') ? queryObj?.get('recruitStatus') : 'ALL');
    const today = dateFormat(getCurrentDate())

    //출력 데이터
    useEffect(() => {
        funcProjectList();
    }, [props.location.search])

    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        else {
            queryObj.delete('page');
        }

        props.history.push(`${path}?` + queryObj.toString())
    }, [])

    // 출력 데이터 셋팅
    const funcProjectList = () => {
        //where options
        let whereOptions = [];
        // 상태
        let status = queryObj?.get('recruitStatus') ? queryObj?.get('recruitStatus') : 'ALL';
        if (status && status !== '') {
            let temp = { where_key: 'STATUS_CD', where_value: status, where_type: 'between' }
            whereOptions.push(temp)
        }
        let scrap = { where_key: 'SCRAP_YN', where_value: 'Y', where_type: 'equal' }
        whereOptions.push(scrap)
        //order options
        let orderOptions = [];

        setPage(queryObj.get('page') ? parseInt(queryObj.get('page')) : 1)
        setRecruitStatus(queryObj?.get('recruitStatus') ? queryObj?.get('recruitStatus') : 'ALL')

        let params = {}
        params.page = queryObj.get('page') ? parseInt(queryObj.get('page')) : 1
        params.pageLength = pageLimit
        params.whereOptions = whereOptions;
        params.orderOptions = orderOptions;

        let temp = {
            isLogin: memberInfo ? true : false,
            memberId: memberInfo ? memberInfo?.memberId : null,
            scrapYn: "Y",
        }
        params.member = temp;

        actionGetProjectList(params).then((res) => {

            if (res.statusCode === 10000) {
                const resultData = res.data;
                setScraps(resultData)

                if (res.totalCount > 0) {
                    setTotalCount(res.totalCount)
                    var total = Math.ceil(res.totalCount / pageLimit);
                    var array = []
                    for (let i = 0; i < total; i++) {
                        array.push(i + 1)
                    }
                    setTotalPage(array)
                } else {
                    setTotalCount(0)
                    setTotalPage([])
                }
            }
        })
    }

    const handleStatus = (e) => {
        const item = e.target.id
        setRecruitStatus(item)
        queryObj.set('recruitStatus', item)
        props.history.push(`${path}?` + queryObj.toString())
    }

    // [2] 스크랩 -----------------------------------
    const onScrap = (e) => {

        setConfirmDialogObject({
            description: ['스크랩을 취소하시겠습니까?'],
            leftText: '확인',
            rightText: '취소',
            leftClick: () => {
                setShowConfirmDialog(false);

                const projectId = e.target.id
                if (memberInfo) {
                    // 스크랩
                    let params = {
                        projectId: projectId
                    }
                    actionInsertScrap(params).then((res) => {
                        if (res.statusCode === 10000) {
                            props.toastSuccess(res.message)
                            funcProjectList()
                        }
                    })
                }

            },
            rightClick: () => {
                setShowConfirmDialog(false);
            },
        })
        setShowConfirmDialog(true)
    }

    // [3] 페이지 이동 --------------------------------------------
    const onDetailPage = (id) => {
        utilSetListSearch(scrap)
        props.history.push(`/project/scrap/${id}`)
    }
    return (
        <>
            <div>
                <div className="inventory">
                    <div>
                        <div className="h1">스크랩한 공고</div>
                        <div className="subtxt">DTx 임상 프로젝트는 DTVERSE와 함께 하세요.</div>
                    </div>
                </div>
                <div className="con-body">
                    <div className="list-sort">
                        <div className="sort-tab">
                            {
                                optionsRecruitStatus?.map((status, index) => {
                                    return (
                                        <div className={recruitStatus === status?.value ? 'onair' : ''}
                                            key={index}
                                            onClick={handleStatus}
                                            id={status?.value}
                                        >
                                            {status?.label}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    {
                        scraps?.length > 0 ?
                            scraps?.map((item, index) => {
                                //모집 상태 (조건  : 작성완료 & 모집시작일 / 모집종료일)
                                let postStatus
                                let classNm
                                if (item.trialCloseYn === 'Y' || item.trialEndDate < today) {
                                    postStatus = '모집종료' //임상종료
                                    classNm = 'end'
                                } else {
                                    if (item.recruitStartDate > today || item.recruitStartDate === null) {
                                        postStatus = '모집예정'
                                        classNm = 'standby'
                                    } else if (item.recruitEndDate < today) {
                                        postStatus = '모집종료'
                                        classNm = 'end'
                                    } else if (item.recruitStartDate <= today && item.recruitEndDate >= today) {
                                        postStatus = '모집중'
                                        classNm = 'ing'
                                    } else {
                                        postStatus = ''
                                        classNm = ''
                                    }
                                }

                                //지역
                                const orgs = item?.organizationList?.filter(x=>x.organizationTypeCd === 'HOSPITAL')
                                let region = orgs?.map(x => {
                                    return x.region
                                })
                                region = region.filter((item, pos) => region.indexOf(item) === pos);    //중복제거
                                let totalRegion = region?.length
                                let restNum = totalRegion - 2

                                // 기관
                                let totalOrg = orgs?.length
                                let restNumOrg = totalOrg - 3

                                return (
                                    <div className="list-layer" key={index}>
                                        <div className="state-layer">
                                            <div className="flex">
                                                {/*
                                                    standby----- 모집예정 / 모집기간 전인 경우
                                                    ing----- 모집중 / 모집기간  중
                                                    end----- 모집종료 / 모집기간이 지나거나 완료인 경우
                                                */}

                                                <div className={`state ${classNm}`} title={`${item.recruitStartDate} ~ ${item.recruitEndDate}`}>{postStatus}</div>
                                                <div className="date">
                                                    {   item?.recruitStartDate ?
                                                        `${item?.recruitStartDate} ~ ${item?.recruitEndDate}`
                                                        : ''
                                                    }
                                                </div>
                                            </div>
                                            <div className={`bookmark cursor ${item?.scrapYn === 'Y' ? 'active' : 'inactive'}`} id={item.id} onClick={onScrap}></div>
                                        </div>

                                        <div className="inventory-title cursor" onClick={() => onDetailPage(item.id)}>{item?.postTitle}</div>
                                        <div className="inventory-txt">{item?.trialPurpose}</div>
                                        <div className="people-report">
                                            <span>
                                                {
                                                    region?.map((x, number) => {
                                                        if (number < 2) {
                                                            const isComma = number < 1 && number+1 !== region?.length
                                                            return (
                                                                <span key={number}>{x}{isComma ? ',' : ''}</span>
                                                            )
                                                        }
                                                    })
                                                }
                                                { restNum > 0 ? <span>외 {restNum}개</span> : '' }
                                            </span>
                                            {
                                                item?.constraintList?.length > 0 ?
                                                    item?.constraintList?.map((constraint, inx_con) => {
                                                        if (constraint?.displayYn == 'Y') {

                                                            const isLimit = constraint?.constraintValue === 'UNLIMIT' ? false : true
                                                            const isLimitPregnancy = constraint?.constraintValue === 'POSSIBLE' ? false : true

                                                            switch (constraint?.constraintTypeCd) {
                                                                case 'AGE':
                                                                    return (
                                                                        <span key={inx_con}>
                                                                            {
                                                                                isLimit ? `${constraint?.limitStartAge}세 ~ ${constraint?.limitEndAge}세`
                                                                                    : '연령무관'
                                                                            }
                                                                        </span>
                                                                    )
                                                                    break;
                                                                case 'GENDER':
                                                                    return (
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
                                                    orgs?.length > 0 ?
                                                        orgs?.map((org, inx_org) => {
                                                            if (inx_org < 3) {
                                                                const isComma = inx_org < 2 && inx_org+1 !== orgs?.length
                                                                return (
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
                                                    restNumOrg > 0 ? <span>외 {restNumOrg}개</span> : ''
                                                }
                                            </span>
                                        </div>
                                    </div>
                                )
                            })
                            : <div className='empty'>스크랩한 모집공고가 없습니다.</div>
                    }
                </div>
                <div className="con-footer">
                    <div className="paginate">
                        {
                            <Pagination totalPage={totalPage} currentPage={page} pageSize={pageSize} />
                        }
                    </div>

                </div>
            </div>
            {
                showConfirmDialog &&
                <ConfirmDialogComponent cancelRef={cancelRef} description={confirmDialogObject.description}
                                        leftText={confirmDialogObject.leftText}
                                        rightText={confirmDialogObject.rightText}
                                        leftClick={confirmDialogObject.leftClick}
                                        rightClick={confirmDialogObject.rightClick} 
                />
            }
        </>
    );
};

export default MyProjectScrap