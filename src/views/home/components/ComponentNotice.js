import React, { useEffect, useState } from 'react'
import { actionGetBoardList } from '../../../modules/action/BoardAction';
import { dateFormat } from '../../../utiles/date';


const ComponentNotice = (props) => {
    //[1] noticesInfo
    const [notices, setNotices] = useState([]);
    //[1-2] 페이지네이션
    const [pageLimit, setPageLimit] = useState(2);


    //출력 데이터
    useEffect(() => {
        funcGetNoticeList()
    }, [])

    const funcGetNoticeList = () => {
        let whereOptions = [];
        let orderOptions = [];

        let temp = { where_key: 'BBS_KIND_CD', where_value: 'M_NOTICE', where_type: 'equal' }
        whereOptions.push(temp)
        let display = { where_key: 'DISPLAY_YN', where_value: 'Y', where_type: 'equal' }
        whereOptions.push(display)
        let params = {
            whereOptions: whereOptions,
            orderOptions: orderOptions,
            page: 1,
            pageLength: pageLimit,
            bbsKindCd: 'M_NOTICE',
        }

        actionGetBoardList(params).then((response) => {
            if (response.statusCode == "10000") {
                setNotices(response.data);
            }
        })
    }
    //[2] 전체보기 
    const onNoticePage = () => {
        props.history.push('/cs/notice')
    }
    //[3] 페이지 이동 
    const onDetail = (item) => {
        props.history.push(`/cs/notice/detail/${item.id}`)
    }

    return (
        <div className="main-notice">
            {notices?.length > 0 ?
                notices?.map((item, index) => {
                    // console.log(notices);
                    let content = item?.contents?.replace(/(<([^>]+)>)/ig, "");
                    return (
                        <div key={index}>
                            <div className="headline2-font cursor" id={item.id} onClick={() => onDetail(item)}>{item.title}</div>
                            <div id={item.id} onClick={() => onDetail(item)}>{content}</div>

                            <div className="space-between">
                                <span className="contents1-font">{dateFormat(item.writeDtm)}</span>
                                <button className="button-more ">
                                    <span className="bigcross" id={item.id} onClick={() => onDetail(item)}>더보기</span>
                                </button>
                            </div>
                        </div>
                    )
                })
                :
                <div className="ellipsis"> 게시글이 존재하지 않습니다</div>
            }
        </div>
    )
}

export default ComponentNotice;