import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";// 슬라이드 임포트
import { Autoplay, Pagination, Navigation } from "swiper";// 슬라이드 임포트
import "swiper/css";// 슬라이드 임포트
import "swiper/css/pagination";// 슬라이드 페이지네비
import 'swiper/css/navigation';// 슬라이드 좌우네비
import { actionGetInterestList, actionInsertScrap } from '../../../../modules/action/ProjectAction';
import moment from 'moment';

const ComponentInterests = (props) => {
    let { memberInfo , today , deadLine , funcProjectList,loadCount } = props

    const [interests , setInterests ] = useState()
    const [totalCount, setTotalCount] = useState(0)
    const [keywords ,setKeywords] = useState()
    //출력 데이터
    useEffect(() => {
        funcGetInterestList();
    }, [])

    useEffect(() => {
        if(loadCount === 0 ) return;
        funcGetInterestList();
    }, [loadCount])

    const funcGetInterestList = () => {
        actionGetInterestList().then((res) => {
            if (res.statusCode === 10000) {
                setKeywords(res.keywords)
                setInterests(res.data)
                setTotalCount(res.totalCount)
            }
        })
    }

    // 스크랩 -----------------------------------
    const onScrap = (e) => {
        const projectId = e.target.id
        // 스크랩
        let params = {
            projectId: projectId
        }
        actionInsertScrap(params).then((res) => {
            if (res.statusCode === 10000) {
                props.toastSuccess(res.message)
                funcProjectList()
                funcGetInterestList()
            }
        })
    }

    // [4] 페이지 이동 --------------------------------------------
    const onDetailPage = (id) => {
        props.history.push(`/project/info/${id}`)
    }
    return (
        <div className="slide-layer">
            <div className="member-nm">
                <span>{memberInfo?.memberNm}</span>님의 관심분야 모집공고</div>
            <Swiper className="project-slide" 
                spaceBetween={30}
                navigation={true}
                pagination={{ type: 'fraction', }}
                modules={[Autoplay, Pagination, Navigation]}
            >
            
            {
                keywords?.length > 0 ?
                    interests?.length > 0 ?
                        interests?.map((item, index) => {
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
                                <SwiperSlide className="swiper-slide" key={index}>
                                <div className="slide-list" >
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
                                                            <button className="btn-tag uncursor" key={idx}># {key?.commCdNm}</button>
                                                        )
                                                    })
                                                    : ''
                                            }
                                        </div>
                                    </div>
                                </div>
                                </SwiperSlide>
                            )
                        })
                        : <div className='alarm'>
                            <div className='empty'>관심분야와 일치하는 모집공고가 없습니다.</div>
                        </div>
                    : 
                    <div className='alarm'>
                        <div className='empty'>관심있는 분야가 있으신가요? DTVERSE가 바로 알려드릴게요!</div>
                        <button className="btn-circle w130xh36" onClick={()=>{props.history.push('/mypage/privacy')}}>관심분야 설정</button>
                    </div>
            }
            </Swiper>
        </div>
    );
};

export default ComponentInterests;