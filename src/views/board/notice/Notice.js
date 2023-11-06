import React, { useEffect, useRef, useState } from 'react';
import SelectBox from '../../components/SelectBox';
import Pagination from '../../components/Pagination';
import { actionGetBoardList } from '../../../modules/action/BoardAction';
import { dateFormat } from '../../../utiles/date';
import { actionDownloadAllS3Data } from "../../../modules/action/CommonAction";

const Notice = (props) => {
    //path
    const path = location.pathname;
    const queryObj = new URLSearchParams(location.search);
    const firstUpdate = useRef(true);

    //[1] 공지사항 리스트
    const [notices, setNotices] = useState([]);
    //[1-2] 페이지네이션
    const pageSize = 5;
    const [pageLimit, setPageLimit] = useState(queryObj.get('pageLength') ? Number(queryObj.get('pageLength')) : 10)
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


    // 출력 데이터 
    useEffect(() => {
        funcGetNoticeList();
    }, [props.location.search])

    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        else {
            queryObj.delete('page');
        }

        queryObj.set('pageLength', pageLimit);
        props.history.push(`${path}?` + queryObj.toString())
    }, [pageLimit])

    const funcGetNoticeList = () => {
        let whereOptions = [];
        let orderOptions = [];

        let temp = { where_key: 'BBS_KIND_CD', where_value: 'M_NOTICE', where_type: 'equal' }
        whereOptions.push(temp)

        let display = { where_key: 'DISPLAY_YN', where_value: 'Y', where_type: 'equal' }
        whereOptions.push(display)

        let keyword = queryObj?.get('searchKwd') ? queryObj?.get('searchKwd') : '';
        if (keyword && keyword !== '') {
            let search = { where_key: searchType, where_value: keyword, where_type: 'like' }
            whereOptions.push(search)
        }

        !queryObj.get('page') ? queryObj.set('page', 1) : '';
        queryObj.set('pageLength', queryObj.get('pageLength') ? Number(queryObj.get('pageLength')) : pageLimit);
        setPage(queryObj.get('page') ? parseInt(queryObj.get('page')) : 1)
        setPageLimit(queryObj.get('pageLength') ? Number(queryObj.get('pageLength')) : 15)
        setSearchKwd(queryObj?.get('searchKwd') ? queryObj?.get('searchKwd') : '')
        setSearchType(queryObj?.get('searchType') ? queryObj?.get('searchType') : 'ALL')

        let params = Object.fromEntries(queryObj);
        params.bbsKindCd = 'M_NOTICE';
        params.whereOptions = whereOptions;
        params.orderOptions = orderOptions;

        actionGetBoardList(params).then((res) => {
            if (res.statusCode == "10000") {
                setNotices(res.data);
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
            noticeSearchList()
        }
    }

    //[2-3] 셀렉트 박스
    useEffect(() => {
        setSearchType(searchType)
    }, [searchType])

    //[2-4] 검색
    const noticeSearchList = () => {
        queryObj.delete('page');

        if (searchKwd && searchKwd != '') {
            queryObj.set('searchKwd', searchKwd)
            queryObj.set('searchType', searchType)
        } else if (searchKwd == '') {
            queryObj.delete('searchKwd')
            queryObj.delete('searchType')
        }

        props.history.push(`${path}?` + queryObj.toString())
    }

    // [3] 페이지 이동
    const onDetail = (item) => {
        props.history.push(`/cs/notice/detail/${item.id}?${queryObj.toString()}`)
    }

    const onDownAll = (item) => {
        let params = {
            boardId: item.id,
            zipName: item.title
        }
        actionDownloadAllS3Data(params).then((res) => { })
    }
    // console.log(notices);
    return (
        <>
            <div className="section-wrap">
                <div className="header-bg"></div>
                <div>
                    <div className="inventory">
                        <div>
                            <div className="h1">공지사항</div>
                            <div className="subtxt">DTx 임상 프로젝트는 DTVERSE와 함께 하세요.</div>
                        </div>
                    </div>
                </div>

                <div className="con-body">
                    <div className="con-list">
                        <div className="list-search">
                            <div className="board-total">전체 <span>{totalCount}</span></div>
                            <div className="search-from">
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
                                <button type="button" className="btn-square icon search" onClick={() => noticeSearchList()}>검색</button>
                            </div>
                        </div>
                        <div className="list-table">
                            <table className="default txt-center">
                                <colgroup>
                                    <col style={{ "width": "10%" }} />
                                    <col style={{ "width": "auto" }} />
                                    <col style={{ "width": "10%" }} />
                                    <col style={{ "width": "6%" }} />
                                    <col style={{ "width": "5%" }} />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>No.</th>
                                        <th>제목</th>
                                        <th>등록일</th>
                                        <th>조회수</th>
                                        <th>첨부</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {   notices?.length > 0 ?
                                        notices?.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{totalCount - ((page - 1) * pageLimit) - index}</td>
                                                    <td className="txt-left cursor" onClick={() => onDetail(item)}>{item.title}</td>
                                                    <td>{dateFormat(item.writeDtm)}</td>
                                                    <td>{item.viewCount}</td>
                                                    <td className={item.fileYn == 'Y' ? "board-file" : ''} onClick={() => onDownAll(item)}></td>
                                                </tr>
                                            )

                                        })
                                        :
                                        <tr><td colSpan={5}>등록된 공지사항이 없습니다</td></tr>
                                    }

                                </tbody>
                            </table>
                            {/* <!--끝 리스트영역 --> */}

                        </div>
                    </div>

                    <div className="contents-footer">
                        <div className="paginate">
                            {
                                <Pagination totalPage={totalPage} currentPage={page} pageSize={pageSize} />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Notice;