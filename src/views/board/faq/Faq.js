import React, { useEffect, useRef, useState } from 'react';
import { actionGetBoardList } from '../../../modules/action/BoardAction';
import { actionGetUpperCodeList } from '../../../modules/action/CommonAction';
import Pagination from '../../components/Pagination';
import parse from 'html-react-parser'
import SelectBox from '../../components/SelectBox';

const Faq = (props) => {
    const firstUpdate = useRef(true);
    const [selectTab, setSelectTab] = useState('ALL')
    const onTab = (data) => {
        setOpenIdx()
        queryObj.delete('page')
        queryObj.set('page', 1)
        queryObj.set('tabId', data)
        if (data == 'ALL') {
            funcGetFaqList()
        } else {
            funcGetFaqList(data)
        }
        props.history.push(`${path}?` + queryObj.toString())
        setSelectTab(data)
    }
    //아코디언 open
    const [openIdx, setOpenIdx] = useState()
    //path
    const path = location.pathname;
    const queryObj = new URLSearchParams(location.search);

    //[1] Faq 리스트
    const [faqList, setFaqList] = useState([]);
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
        { value: 'ALL', label: '제목 + 내용' },
        { value: 'TITLE', label: '제목' },
        { value: 'CONTENTS', label: '내용' },
    ])
    //공통Code
    const [codeList, setCodeList] = useState()

    useEffect(() => {
        let data = {
            groupCd: 'POST_CLASSIFICATION',
            upperCommCd: 'M_FAQ'
        }
        actionGetUpperCodeList(data).then((res) => {
            if (res.statusCode == "10000") {
                setCodeList(res.data)
            }
        })
    }, [])

    //출력 데이터 
    useEffect(() => {
        let tabId = queryObj.get('tabId')
        if (tabId == 'ALL' || tabId == null) {
            funcGetFaqList();
            setSelectTab('ALL')
        } else {
            funcGetFaqList(tabId);
            setSelectTab(tabId)
        }
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
    }, [pageLimit])

    const funcGetFaqList = (code) => {
        let whereOptions = [];
        let orderOptions = [];
        if (code) {
            let codeType = { where_key: 'POST_CLASSIFICATION_CD', where_value: code, where_type: 'equal' }
            whereOptions.push(codeType);
        }

        let temp = { where_key: 'BBS_KIND_CD', where_value: 'M_FAQ', where_type: 'equal' }
        whereOptions.push(temp)

        let display = { where_key: 'DISPLAY_YN', where_value: 'Y', where_type: 'equal' }
        whereOptions.push(display)

        let keyword = queryObj?.get('searchKwd') ? queryObj?.get('searchKwd') : '';
        if (keyword && keyword !== '') {
            let search = { where_key: searchType, where_value: keyword, where_type: 'like' }
            whereOptions.push(search)
        }

        !queryObj.get('page') ? queryObj.set('page', 1) : '';
        setPage(queryObj.get('page') ? parseInt(queryObj.get('page')) : 1)
        setSearchKwd(queryObj?.get('searchKwd') ? queryObj?.get('searchKwd') : '')
        setSearchType(queryObj?.get('searchType') ? queryObj?.get('searchType') : 'ALL')

        let params = Object.fromEntries(queryObj);
        params.bbsKindCd = 'M_FAQ';
        params.whereOptions = whereOptions;
        params.orderOptions = orderOptions;
        params.pageLength = pageLimit;
        params.postClassification = code;

        actionGetBoardList(params).then((res) => {
            if (res.statusCode == "10000") {
                setFaqList(res.data)
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
            faqSearchList()
        }
    }
    //[2-3] 셀렉트 박스
    useEffect(() => {
        setSearchType(searchType)
    }, [searchType])

    //[2-4] 검색
    const faqSearchList = () => {
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

    //아코디언 Open
    const onOpenClick = (item) => {
        if (openIdx === item.id) {
            setOpenIdx(null)
        } else {
            setOpenIdx(item.id)
        }
    }
    return (
        <>
            <div className="section-wrap">
                <div className="header-bg"></div>
                <div>
                    <div className="inventory">
                        <div>
                            <div className="h1">자주하는 질문</div>
                            <div className="subtxt">DTx 임상 프로젝트는 DTVERSE와 함께 하세요.</div>
                        </div>
                    </div>
                </div>
                <div className="con-body">
                    <div className="list-search faq-choice">
                        <div className="board-total">
                            전체 <span>{totalCount}</span>
                        </div>
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
                            <button type="button" className="btn-square icon search" onClick={() => faqSearchList()}>검색</button>
                        </div>
                    </div>

                    <div className="buttons">
                        <div key="ALL" className="radio-square">
                            <input
                                type="radio"
                                id="ALL"
                                name="tabResearcher"
                                onChange={() => onTab("ALL")}
                                checked={selectTab == "ALL"}
                            />
                            <label htmlFor="ALL">전체</label>
                        </div>
                        {
                            codeList?.map((item) => {
                                return (
                                    <div key={item.commCd} className="radio-square">
                                        <input type="radio"
                                            id={item.commCd}
                                            name="tabResearcher"
                                            onChange={() => onTab(item.commCd)}
                                            checked={selectTab === item.commCd}
                                        />
                                        <label htmlFor={item.commCd}>{item.commCdNm}</label>
                                    </div>
                                )
                            })
                        }
                    </div>
                        
                    <div className="con-qna">
                        {
                            faqList?.length > 0 ?
                                faqList?.map((item, index) => {
                                    let code = codeList.filter(code => code.commCd == item.postClassificationCd)
                                    let open = openIdx == item.id ? 'open' : ''
                                    return (
                                        <div className={`con-layer standard ${open}`} key={index} index={item.id} onClick={() => onOpenClick(item)} >
                                            <div className="title-field cursor">
                                                <div className="subgroup">
                                                    <span className="important3">{code[0].commCdNm}</span>
                                                    <span>{item.title}</span>
                                                </div>
                                                <div className="drop"></div>
                                            </div>
                                            <div className="con-form">{parse(item.contents)}</div>
                                        </div>
                                    )
                                })
                                :
                                <div className="con-tip">
                                    <div className="empty">등록된 질문이 없습니다</div>
                                </div>
                        }
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
        </>
    );
};

export default Faq;