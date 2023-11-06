import React, { useEffect, useRef, useState } from 'react';
import SelectBox from '../../../components/SelectBox';
import Pagination from '../../../components/Pagination';
import { actionGetProjectBoardList } from '../../../../modules/action/ProjectBoardAction';
import { getUpperCodeOption } from "../../../../utiles/code";
import { dateFormat } from '../../../../utiles/date';
import { utilSetListSearch } from '../../../../utiles/common';
import { inquiry } from "../../../../utiles/code";


const Inquiry = (props) => {
    //path
    const path = location.pathname;
    const firstUpdate = useRef(true);
    const queryObj = new URLSearchParams(location.search);

    //[1] Inquire 
    const [inquire, setInquire] = useState([]);
    //[1-2] 페이지네이션
    const pageSize = 5;
    const [pageLimit, setPageLimit] = useState(10)
    const [page, setPage] = useState()
    const [totalPage, setTotalPage] = useState([])
    const [totalCount, setTotalCount] = useState(0)
    //[1-3] 기본검색
    const [searchKwd, setSearchKwd] = useState();
    const [searchType, setSearchType] = useState(queryObj?.get('searchType') ? queryObj?.get('searchType') : 'ALL');
    const [optionsSearchType, setOptionsSearchType] = useState([
        { value: 'ALL', label: '제목+내용' },
        { value: 'TITLE', label: '제목' },
        { value: 'CONTENTS', label: '내용' },
    ])
    //[1-4] 분류
    const [postClassification, setPostClassification] = useState(queryObj?.get('postClassification') ? queryObj?.get('postClassification') : '')
    const [postClassificationType, setPostClassificationType] = useState()

    //게시상태
    const [answerYn, setAnswerYn] = useState(queryObj?.get('answerYn') ? queryObj?.get('answerYn') : '');
    const [boardAnswerType, setBoardAnswerType] = useState([
        { value: '', label: '전체' },
        { value: 'Y', label: '답변완료' },
        { value: 'N', label: '답변대기' },
    ])

    useEffect(() => {
        let data = {
            groupCd: 'POST_CLASSIFICATION',
            upperCommCd: "P_QNA",
            default: '전체'
        }
        getUpperCodeOption(data).then(res => { if (res) setPostClassificationType(res) })

    }, [])

    //출력 데이터 
    useEffect(() => {
        funcGetInquireList();
    }, [props.location.search])

    const funcGetInquireList = () => {
        let whereOptions = [];

        let temp = { where_key: 'BBS_KIND_CD', where_value: "P_QNA", where_type: 'equal' }
        whereOptions.push(temp)

        let keyword = queryObj?.get('searchKwd') ? queryObj?.get('searchKwd') : '';
        if (keyword && keyword !== '') {
            let search = { where_key: searchType, where_value: keyword, where_type: 'like' }
            whereOptions.push(search)
        }

        let postClass = queryObj?.get('postClassification') ? queryObj?.get('postClassification') : ''
        if (postClass && postClass !== '') {
            let postType = { where_key: 'POST_CLASSIFICATION_CD', where_value: postClass, where_type: 'equal' }
            whereOptions.push(postType)
        }

        let answerYn = queryObj?.get('answerYn') ? queryObj?.get('answerYn') : ''
        if (answerYn && answerYn !== '') {
            let commentType = { where_key: 'ANSWER_YN', where_value: answerYn, where_type: 'equal' }
            whereOptions.push(commentType)
        }

        !queryObj.get('page') ? queryObj.set('page', 1) : '';
        setPage(queryObj.get('page') ? parseInt(queryObj.get('page')) : 1)
        setSearchKwd(queryObj?.get('searchKwd') ? queryObj?.get('searchKwd') : '')
        setAnswerYn(queryObj?.get('answerYn') ? queryObj?.get('answerYn') : '');
        setPostClassification(queryObj?.get('postClassification') ? queryObj?.get('postClassification') : '')

        let params = Object.fromEntries(queryObj);
        params.bbsKindCd = "P_QNA";
        params.whereOptions = whereOptions;
        params.pageLength = pageLimit;

        actionGetProjectBoardList(params).then((res) => {
            if (res.statusCode == "10000") {
                setInquire(res.data);
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

    //[2] 검색
    //[2-1] input박스 데이터 셋팅
    const handleChange = (e) => {
        switch (e.target.name) {
            case 'searchKwd':
                setSearchKwd(e.target.value)
                break;
        }
    }
    //[2-2] 검색 엔터키 
    const enterKey = () => {
        if (window.event.keyCode == 13) {
            inquireSearchList()
        }
    }

    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        inquireSearchList()
    }, [postClassification, answerYn])


    //[2-3] 검색
    const inquireSearchList = () => {
        //검색어
        if (searchKwd && searchKwd != '') {
            queryObj.set('searchKwd', searchKwd)
            queryObj.set('searchType', searchType)
            queryObj.delete('page');
        } else if (searchKwd == '') {
            queryObj.delete('searchKwd')
            queryObj.delete('searchType')
        }

        //처리상태
        if (answerYn && answerYn != '') {
            queryObj.set('answerYn', answerYn)
            queryObj.delete('page');
        } else if (answerYn == '') {
            queryObj.delete('answerYn')
        }

        //구분
        if (postClassification && postClassification != '') {
            queryObj.set('postClassification', postClassification)
            queryObj.delete('page');
        } else if (postClassification == '') {
            queryObj.delete('postClassification')
        }

        props.history.push(`${path}?` + queryObj.toString())
    }

    // [3] 페이지 이동
    const onDetail = (item) => {
        utilSetListSearch(inquiry)
        props.history.push(`/mypage/inquiry/project/detail/${item.id}`)
    }
    
    return (
        <div>
            <div className="inventory">
                <div>
                    <div className="h1">모집공고문의</div>
                    <div className="subtxt">DTx 임상 프로젝트는 DTVERSE와 함께 하세요.</div>
                </div>
            </div>
            <div className="con-body">

                <div className="mydetail-info">
                    <ul className="infor-report gray100 mb30">
                        <li className="dot-txt">임상시험 모집공고의 ‘1:1문의’에 대한 답변을 확인할 수 있습니다.</li>
                        <li className="dot-txt">부적절한 게시물 또는 욕설, 비방 등의 게시물을 등록할 경우 게시물 삭제 또는 DTVERSE 이용이 제한 될 수 있습니다.</li>
                        <li className="dot-txt">DTVERSE 이용과 관련된 문의는 ‘고객센터 	&#62; 이용문의’를 통해 문의 주시기 바랍니다.</li>
                    </ul>

                    <div className="list-search">
                        <div className="board-total">전체 <span>{totalCount}</span></div>

                        <div className="search-from">
                            <span className="flex gap5x mr16">
                                <span>처리상태</span>
                                {
                                    postClassificationType &&
                                    <SelectBox id="answerYn" options={boardAnswerType} setValue={setAnswerYn} selectValue={answerYn} />
                                }
                                <span>분류</span>
                                {
                                    postClassificationType &&
                                    <SelectBox id="postClassification" options={postClassificationType} setValue={setPostClassification} selectValue={postClassification} />
                                }
                            </span>
                            <SelectBox options={optionsSearchType} setValue={setSearchType} selectValue={searchType} />
                            <input
                                type="text"
                                placeholder="검색어를 입력하세요."
                                name="searchKwd"
                                id="searchKwd"
                                onChange={handleChange}
                                value={searchKwd || ''}
                                onKeyUp={enterKey}
                                autoComplete="off"
                            />
                            <button type="button" className="btn-square icon search" onClick={() => inquireSearchList()}>검색</button>
                        </div>
                    </div>
                    <div className="min-h402x">
                        <table className="default txt-center">
                            <colgroup>
                                <col style={{ "width": "6%" }} />
                                <col style={{ "width": "8%" }} />
                                <col style={{ "width": "10%" }} />
                                <col style={{ "width": "auto" }} />
                                <col style={{ "width": "auto" }} />
                                <col style={{ "width": "12%" }} />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>상태</th>
                                    <th>분류</th>
                                    <th>모집 공고명</th>
                                    <th>제목</th>
                                    <th>등록일</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inquire?.length > 0 ?
                                    inquire?.map((item, index) => {

                                        let postClassificationCd
                                        postClassificationType?.map((post) => {
                                            if (post.value == item.postClassificationCd) {
                                                return postClassificationCd = post.label
                                            }
                                        })

                                        return (
                                            <tr key={index} onClick={() => onDetail(item)}>
                                                <td>{totalCount - ((page - 1) * pageLimit) - index}</td>
                                                <td>
                                                    <span className="flex-align flex-center">
                                                        {item.answerYn == 'N' ?
                                                            <span className="state ing">답변대기</span>
                                                            :
                                                            <span className="state end">답변완료</span>
                                                        }
                                                    </span>
                                                </td>
                                                <td>{postClassificationCd}</td>
                                                <td className="txt-left cursor" title={item.answerPostTitle}>
                                                    {item.answerPostTitle}
                                                </td>
                                                <td className="txt-left cursor" title={item.title}>
                                                    {item.title}
                                                </td>

                                                <td>{dateFormat(item.writeDtm)}</td>
                                            </tr>
                                        )
                                    }) :
                                    <tr>
                                        <td colSpan={6}>등록된 게시물이 없습니다</td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="con-footer">
                <div className="paginate">
                    {
                        <Pagination totalPage={totalPage} currentPage={page} pageSize={pageSize} />
                    }
                </div>
            </div>
        </div>
    );
};

export default Inquiry;