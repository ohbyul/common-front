import React, { useEffect, useRef, useState } from 'react';
import { actionGetProjectList, actionInsertScrap } from '../../../modules/action/ProjectAction';
import SelectBox from '../../components/SelectBox';
import { decodeJwt } from '../../../utiles/cookie';
import Pagination from '../../components/Pagination';
import { dateFormat, getCurrentDate } from '../../../utiles/date';
import ConfirmDialogComponent from '../../components/ConfirmDialogComponent';
import moment from 'moment';
import { SYSTEM_VARIABLE, projectInfo } from '../../../utiles/code';
import { utilSetListSearch } from '../../../utiles/common';
import { actionGetCodeList } from '../../../modules/action/CommonAction';
import ComponentInterests from './components/ComponentInterests';



const Project = (props) => {
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
    //[1] 프로젝트 리스트
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statusCount, setStatusCount] = useState()
    //[1-2] 페이지네이션
    const pageSize = 5;
    const [pageLimit, setPageLimit] = useState(10)
    const [page, setPage] = useState()
    const [totalPage, setTotalPage] = useState([])
    const [totalCount, setTotalCount] = useState(0)
    //[1-3] 기본검색
    const [searchKwd, setSearchKwd] = useState();
    const [searchType, setSearchType] = useState(queryObj?.get('searchType') ? queryObj?.get('searchType') : 'POST_TITLE')
    const [optionsSearchType, setOptionsSearchType] = useState([
        // { value: 'ALL', label: '공고명 + 내용' },
        { value: 'POST_TITLE', label: '모집공고명' },
        { value: 'CONTENTS', label: '내용' },
    ])
    //[1-4] sort
    const [sortOrder, setSortOrder] = useState(queryObj?.get('sortOrder') ? queryObj?.get('sortOrder') : 'RECRUIT_START_DATE')
    const [optionsSortOrder, setOptionsSortOrder] = useState([
        { value: 'RECRUIT_START_DATE', label: '최신순' },
        { value: 'RECRUIT_END_DATE', label: '마감임박순' },
    ])

    // [1-5] 모집공고 상태조회
    const [optionsRecruitStatus, setOptionsRecruitStatus] = useState([
        { value: 'ING', label: '모집중' },
        { value: 'DUE', label: '모집예정' },
        { value: 'END', label: '모집종료' },
        { value: 'ALL', label: '전체' },
    ]);
    const [recruitStatus, setRecruitStatus] = useState(queryObj?.get('recruitStatus') ? queryObj?.get('recruitStatus') : 'ING');
    const today = dateFormat(getCurrentDate())

    // 데드라인
    const [deadLine, setDeadLine] = useState()
    useEffect(() => {
        let data = {
            groupCd: SYSTEM_VARIABLE,
        }
        actionGetCodeList(data).then(res => {
            if (res) {
                let result = res.data[0].commCdNm
                setDeadLine(Number(result))
            }
        })
    }, [])

    //출력 데이터
    useEffect(() => {
        funcProjectList();
    }, [props.location.search])

    const funcProjectList = () => {
        //where options
        let whereOptions = [];

        // 검색어
        let keyword = queryObj?.get('searchKwd') ? queryObj?.get('searchKwd') : '';
        if (keyword && keyword !== '') {
            let temp = { where_key: searchType, where_value: keyword, where_type: 'like' }
            whereOptions.push(temp)
        }
        // 상태
        let status = queryObj?.get('recruitStatus') ? queryObj?.get('recruitStatus') : 'ING';
        if (status && status !== '') {
            let temp = { where_key: 'STATUS_CD', where_value: status, where_type: 'between' }
            whereOptions.push(temp)
        }

        //order options
        let orderOptions = [];
        if (queryObj?.get('sortOrder') && queryObj?.get('sortOrder') !== 0) {
            let obj = {
                column_name: queryObj?.get('sortOrder'),
                orderOption: `${queryObj?.get('sortOrder') == 'RECRUIT_START_DATE' ? 'DESC' : 'ASC'}`,
            };
            orderOptions.push(obj);
        }

        setPage(queryObj.get('page') ? parseInt(queryObj.get('page')) : 1)
        setSearchKwd(queryObj?.get('searchKwd') ? queryObj?.get('searchKwd') : '')
        setSearchType(queryObj?.get('searchType') ? queryObj?.get('searchType') : 'POST_TITLE')
        setSortOrder(queryObj?.get('sortOrder') ? queryObj?.get('sortOrder') : 'RECRUIT_START_DATE')
        setRecruitStatus(queryObj?.get('recruitStatus') ? queryObj?.get('recruitStatus') : 'ING')

        let params = {}

        params.page = queryObj.get('page') ? parseInt(queryObj.get('page')) : 1
        params.pageLength = pageLimit
        params.whereOptions = whereOptions;
        params.orderOptions = orderOptions;
        let temp = {
            isLogin: memberInfo ? true : false,
            memberId: memberInfo ? memberInfo?.memberId : null
        }
        params.member = temp;

        actionGetProjectList(params).then((res) => {
            if (res.statusCode === 10000) {
                setProjects(res.data);
                setStatusCount([
                    { value: 'ING', count: res.statusCount.ingCount },
                    { value: 'DUE', count: res.statusCount.dueCount },
                    { value: 'END', count: res.statusCount.endCount },
                    { value: 'ALL', count: res.statusCount.allCount },
                ])

                if (res.totalCount > 0) {
                    setTotalCount(res.totalCount)
                    const total = Math.ceil(res.totalCount / pageLimit);
                    const array = []
                    for (let i = 0; i < total; i++) {
                        array.push(i + 1)
                    }
                    setTotalPage(array)
                } else {
                    setTotalCount(0)
                    setTotalPage([])
                }
            }
        }).then(() => setLoading(true))
    }


    //[2] 검색  -------------------------------------------------------------
    //[2-1] input박스 데이터 세팅
    const handleChange = (e) => {
        switch (e.target.name) {
            case 'searchKwd':
                setSearchKwd(e.target.value)
                break;
        }
    }

    const handleStatus = (e) => {
        const item = e.target.id
        setRecruitStatus(item)
    }

    //[2-2] 검색 엔터키
    const enterKey = () => {
        if (window.event.keyCode == 13) {
            searchList()
        }
    }

    //[2-3] 셀렉트박스
    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        searchList()
    }, [sortOrder, recruitStatus])

    //[2-4] 검색
    const searchList = () => {

        if (searchKwd && searchKwd != '') {
            queryObj.set('searchKwd', searchKwd);
            queryObj.set('searchType', searchType);
            queryObj.delete('page');
        }
        else if (searchKwd == '') {
            queryObj.delete('searchKwd');
            queryObj.delete('searchType');
            queryObj.delete('page');
        }

        if (recruitStatus && recruitStatus != '') {
            queryObj.set('sortOrder', sortOrder);
            queryObj.set('recruitStatus', recruitStatus);
        }

        props.history.push(`${path}?` + queryObj.toString())
    }

    // [3] 스크랩 -----------------------------------
    const [loadCount, setLoadCount] = useState(0)
    const onScrap = (e) => {
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
                    setLoadCount(loadCount + 1)
                }
            })
        } else {
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
    }

    // [4] 페이지 이동 --------------------------------------------
    const onDetailPage = (id) => {
        utilSetListSearch(projectInfo)
        props.history.push(`/project/info/${id}`)
    }

    // [5] 해시태그 기능
    const onHashTag = (keyword) => {

        setSearchType('CONTENTS')
        queryObj.set('searchKwd', keyword);
        queryObj.set('searchType', 'CONTENTS');
        queryObj.delete('page');

        if (recruitStatus && recruitStatus != '') {
            queryObj.set('sortOrder', sortOrder);
            queryObj.set('recruitStatus', recruitStatus);
        }

        props.history.push(`${path}?` + queryObj.toString())
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

                {
                    memberInfo ?
                        <ComponentInterests {...props}
                            memberInfo={memberInfo}
                            today={today} deadLine={deadLine}
                            funcProjectList={funcProjectList}
                            loadCount={loadCount}
                        />
                        : <></>
                }

                <div className="con-body">
                    <div className="list-sort">
                        <div className="sort-tab">
                            {
                                optionsRecruitStatus?.map((status, index) => {
                                    let count = statusCount?.find(x => x.value === status?.value)?.count
                                    return (
                                        <div className={recruitStatus === status?.value ? 'onair' : ''}
                                            key={index}
                                            onClick={handleStatus}
                                            id={status?.value}
                                        >
                                            {status?.label} ({count})
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="sort-view">
                            <div className="search-from">
                                <SelectBox options={optionsSearchType} setValue={setSearchType} selectValue={searchType} />
                                <input type="text"
                                    placeholder="검색어를 입력하세요."
                                    name="searchKwd"
                                    id="searchKwd"
                                    onChange={handleChange}
                                    value={searchKwd || ''}
                                    onKeyUp={enterKey}
                                    autoComplete="off"
                                />
                                <button type="button" className="btn-square icon search" onClick={() => searchList()}>검색</button>
                            </div>
                            <div>
                                <SelectBox options={optionsSortOrder} setValue={setSortOrder} selectValue={sortOrder} />
                            </div>
                        </div>
                    </div>

                    {
                        loading ?
                            projects?.length > 0 ?
                                projects?.map((item, index) => {
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
                                        }
                                        else if (item.recruitEndDate < today) {
                                            postStatus = '모집종료'
                                            classNm = 'end'
                                        }
                                        else if (item.recruitStartDate <= today && item.recruitEndDate >= today) {
                                            let deadLineCode = `-${deadLine}`
                                            const before2weeksDay = moment(item.recruitEndDate).add(deadLineCode, 'd').format('YYYY-MM-DD')
                                            if (today >= before2weeksDay) {
                                                postStatus = '마감임박'
                                                classNm = 'expect'
                                            } else {
                                                postStatus = '모집중'
                                                classNm = 'ing'
                                            }
                                        }
                                        else {
                                            postStatus = ''
                                            classNm = ''
                                        }
                                    }

                                    //지역
                                    const orgs = item?.organizationList?.filter(x => x.organizationTypeCd === 'HOSPITAL')
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
                                            <div className="grid-layer">
                                                <div className="word-box">
                                                    {/*
                                                standby----- 모집예정 / 모집기간 전인 경우
                                                ing----- 모집중 / 모집기간  중
                                                expect----- 마감임박 / 모집종요일 14일이하 남은 경우
                                                end----- 모집종료 / 모집기간이 지나거나 완료인 경우
                                                */}

                                                    <div className={`state ${classNm}`} title={`${item.recruitStartDate} ~ ${item.recruitEndDate}`}>{postStatus}</div>
                                                    <div className="inventory-title cursor" onClick={() => onDetailPage(item.id)}>{item?.postTitle}</div>
                                                </div>
                                                <div className="listinfo-box">
                                                    <div className="date">
                                                        {
                                                            item?.recruitStartDate ?
                                                                `${item?.recruitStartDate} ~ ${item?.recruitEndDate}`
                                                                : ''
                                                        }
                                                    </div>
                                                    <div className={`bookmark cursor ${item?.scrapYn === 'Y' ? 'active' : 'inactive'}`} id={item.id} onClick={onScrap}></div>
                                                </div>
                                            </div>
                                            <div className="inventory-txt">{item?.trialPurpose}</div>
                                            <div className="text-and">
                                                <div className="people-report">
                                                    <span>
                                                        {
                                                            region?.map((x, number) => {
                                                                if (number < 2) {
                                                                    const isComma = number < 1 && number + 1 !== region?.length
                                                                    return (
                                                                        <span key={number}>{x}{isComma ? ',' : ''}</span>
                                                                    )
                                                                }
                                                            })
                                                        }
                                                        {
                                                            restNum > 0 ? <span>외 {restNum}개</span> : ''
                                                        }
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
                                                                        const isComma = inx_org < 2 && inx_org + 1 !== orgs?.length
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
                                                <div className="listinfo-box">
                                                    {
                                                        item?.keywordCodeList.length > 0 ?
                                                            item?.keywordCodeList?.map((key, idx) => {
                                                                return (
                                                                    <button className="btn-tag" key={idx} onClick={() => onHashTag(key.commCdNm)}># {key?.commCdNm}</button>
                                                                )
                                                            })
                                                            : ''
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                                : <div className='empty'>등록된 모집공고가 없습니다.</div>
                            :
                            <></>
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
            {/* alert */}
            {
                showConfirmDialog &&
                <ConfirmDialogComponent cancelRef={cancelRef} description={confirmDialogObject.description}
                    leftText={confirmDialogObject.leftText}
                    rightText={confirmDialogObject.rightText}
                    leftClick={confirmDialogObject.leftClick}
                    rightClick={confirmDialogObject.rightClick}
                />
            }
            {/* alert */}
        </div>
    );
};

export default Project;