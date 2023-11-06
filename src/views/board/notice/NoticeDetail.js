import React, { useEffect, useState } from "react";
import parse from 'html-react-parser'
import { actionDownloadAllS3Data } from "../../../modules/action/CommonAction";
import { actionGetBoardInfo } from "../../../modules/action/BoardAction";
import { dateFormat } from "../../../utiles/date";
import { onDownS3, getByteSize, checkFileExt } from "../../../utiles/file";


const NoticeDetail = (props) => {
    
    const queryObj = new URLSearchParams(location.search);    
    const boardId = props.match.params['boardId']

    const [noticeInfo, setNoticeInfo] = useState([]);
    const [content, setContent] = useState('');
    const [noticeFile, setNoticeFile] = useState([]);

    useEffect(() => {
        funcGetNoticeInfo();
    }, [])

    const funcGetNoticeInfo = () => {
        let params = {
            bbsKindCd: 'M_NOTICE',
            viewCountYn: 'Y',
            id: boardId,
        }

        actionGetBoardInfo(params).then((res) => {
            if (res.statusCode == "10000") {
                const result = res.data;
                // console.log(result)
                if(result.displayYn === 'N') throw new Error('비공개 공지사항 잘못된 접근')
                setNoticeInfo(result);
                setContent(parse(result.contents));
                setNoticeFile(result.boardFile);
            }
        }).catch(() => props.history.push('/'))
    }

    const onNoticeList = () => {
        props.history.push(`/cs/notice?${queryObj.toString()}`)
    }
    const onDownAll = () => {
        let params = {
            boardId: boardId,
            zipName: noticeInfo?.title
        }
        actionDownloadAllS3Data(params).then((res) => { })
    }
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
                    <div className="notice-body">
                        <div className="title-field">
                            <div>공지사항 상세</div>
                            <button type="button" className="btn-square icon list" onClick={onNoticeList}>목록</button>
                        </div>
                        <table className="project-table">
                            <colgroup>
                                <col style={{ width: "10%" }} />
                                <col />
                                <col style={{ width: "10%" }} />
                                <col style={{ width: "10%" }} />
                            </colgroup>
                            <tbody>
                                <tr>
                                    <th className="txt-center">제목</th>
                                    <td>{noticeInfo?.title}</td>
                                    <th className="txt-center">등록일</th>
                                    <td className="txt-center">{dateFormat(noticeInfo?.writeDtm)}</td>
                                </tr>
                                <tr>
                                    <th className="txt-center align-top">내용</th>
                                    <td colSpan="3">
                                        <span className="textarea">
                                            <span className='ql-editor'>{content}</span>
                                        </span>
                                    </td>
                                </tr>
                                {noticeFile?.length > 0 ?
                                    <tr>
                                        <th className="txt-center align-top">첨부파일</th>
                                        <td colSpan="3">
                                            <span className="flex mb10"><button className="alldown" onClick={onDownAll}>전체 다운로드</button></span>
                                            <span className="filelistbox">
                                                {noticeFile?.map((item, index) => {
                                                    return (
                                                        <div className="space-between" key={index}>
                                                            <div className={`text-under file-${checkFileExt(item.extensionNm)}`}>
                                                                <span className='underline' onClick={() => onDownS3(item)}>{item.originalFileNm}</span>
                                                                <span className='filesize'>
                                                                    {item.fileSize ? getByteSize(item.fileSize) : getByteSize(item.size)}
                                                                </span>
                                                            </div>
                                                            <div className="single-down" onClick={() => onDownS3(item)}></div>
                                                        </div>
                                                    )
                                                })}
                                            </span>
                                        </td>
                                    </tr>
                                    : null
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="con-footer"></div>
            </div>
        </>
    );
};

export default NoticeDetail;