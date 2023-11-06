import React, { useEffect, useRef, useState } from 'react';
import { actionGetProjectBoardInfo, actionDeleteProjectBoard } from '../../../../modules/action/ProjectBoardAction';
import { actionGetUpperCodeList, actionDownloadAllS3Data } from '../../../../modules/action/CommonAction';
import { dateFormat } from '../../../../utiles/date';
import { onDownS3,getByteSize, checkFileExt } from '../../../../utiles/file';
import ConfirmDialogComponent from '../../../components/ConfirmDialogComponent';
import parse from 'html-react-parser'
import { utilGetListSearch } from '../../../../utiles/common';
import { inquiry } from "../../../../utiles/code";

const InquiryDetail = (props) => {
    const boardId = props.match.params['boardId']

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

    const [inquireInfo, setInquireInfo] = useState([]);
    const [inquireComment, setInquireComment] = useState({});
    const [content, setContent] = useState('');
    const [inquireFile, setInquireFile] = useState([]);
    const [inquireCode, setInquireCode] = useState('');

    const [codeList, setCodeList] = useState([])
    useEffect(() => {
        let data = {
            groupCd: 'POST_CLASSIFICATION',
            upperCommCd: "P_QNA"
        }
        actionGetUpperCodeList(data).then((res) => {
            if (res.statusCode == "10000") {
                setCodeList(res.data)
            }
        })
    }, [])

    useEffect(() => {
        setInquireCode(codeList.filter(code => code.commCd == inquireInfo.postClassificationCd))

    }, [codeList, inquireInfo])
    useEffect(() => {
        funcGetInquireInfo()
    }, [])

    const funcGetInquireInfo = () => {
        let params = {
            bbsKindCd: "P_QNA",
            viewCountYn: 'Y',
            id: boardId,
        }

        actionGetProjectBoardInfo(params).then((res) => {
            if (res.statusCode == "10000") {
                let result = res.data
                
                setInquireInfo(result);
                setContent(parse(result.contents));
                setInquireFile(result.boardFile);
                setInquireComment(result.boardCommentInfo[0]);
            }
        }).catch(() => props.history.push('/'))
    }

    // [삭제 api]
    const onDeleteBoard = (item) => {
        let param = {
            id: item.id,
        }
        actionDeleteProjectBoard(param).then((res) => {
            if (res.statusCode == "10000") {
                props.history.push('/mypage/inquiry/project')
            }
        })
    }
// [삭제]
    const onDelete = (item) => {
        let msg = '게시물을 삭제하실 경우, 복구가 불가합니다.\n삭제하시겠습니까?'
        setConfirmDialogObject({
            description: [msg],
            leftText: '확인',
            rightText: '취소',
            leftClick: () => {
                setShowConfirmDialog(false);
                onDeleteBoard(item)
            },
            rightClick: () => {
                setShowConfirmDialog(false);
            },
        })
        setShowConfirmDialog(true)
    }

    //수정 페이지 이동
    const onModify = () => {
        let updateId = inquireInfo?.id
        props.history.push(`/mypage/inquiry/project/update/${updateId}`)
    }
    const onDownAll = () => {
        let params = {
            boardId: boardId,
            zipName: inquireInfo?.answerPostTitle
        }
        actionDownloadAllS3Data(params).then((res) => { })
    }

    const onList = () => {
        let search = utilGetListSearch(inquiry);
        props.history.push(`/mypage/inquiry/project?${search}`)
    }
    return (
        <div>
            <div className="inventory">
                <div>
                    <div className="h1">모집공고 문의</div>
                    <div className="subtxt">궁금하신 내용을 남겨주시면 성심껏 답변하겠습니다.</div>
                </div>
            </div>
            <div className="con-body">
                <div>
                    <div className="title-field">
                        <div>모집공고 문의 상세</div>
                        <button
                            type="button"
                            className="btn-square icon list"
                            onClick={onList}
                        >목록</button>
                    </div>
                    <table className="project-table">
                        <colgroup><col /><col /><col /><col /></colgroup>
                        <tbody>
                            <tr>
                                <th className="txt-center">공고명</th>
                                <td colSpan="3">{inquireInfo.answerPostTitle}</td>
                            </tr>
                            <tr>
                                <th className="txt-center">문의분류</th>
                                <td>{inquireCode[0]?.commCdNm}</td>
                                <th className="txt-center">등록일</th>
                                <td>{dateFormat(inquireInfo?.writeDtm)}</td>
                            </tr>
                            <tr>
                                <th className="txt-center">제목</th>
                                <td colSpan="3">{inquireInfo.title}</td>
                            </tr>
                            <tr>
                                <th className="txt-center align-top">문의내용</th>
                                <td colSpan="3">
                                    <span className="textarea">
                                        <span className='ql-editor' dangerouslySetInnerHTML={{ __html: inquireInfo.contents }}></span>
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <th className="txt-center align-top">첨부파일</th>
                                <td colSpan="3">
                                    {inquireFile?.length > 0 ?
                                        <>
                                            <span className="flex mb10"><button className="alldown" onClick={onDownAll}>전체 다운로드</button></span>
                                            <span className="filelistbox">
                                                {inquireFile?.map((item, index) => {
                                                    return (
                                                        <div className="space-between" key={index}>
                                                            <div className={`file-itme file-${checkFileExt(item.extensionNm)}`}>
                                                                <span className='underline' onClick={() => onDownS3(item)}>{item.originalFileNm}</span>
                                                                <span className='filesize'>
                                                                    {item.fileSize ? getByteSize(item.fileSize) : getByteSize(item.size)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </span>
                                        </>
                                        : <div className="flex gap16x">첨부파일이 없습니다.</div>
                                    }

                                </td>
                            </tr>
                            <tr>
                                <th className="txt-center align-top">답변상태</th>
                                <td>{inquireInfo?.answerYn == 'N' ? "답변대기" : "답변완료"}</td>
                                <th className="txt-center align-top">답변일자</th>
                                <td>{dateFormat(inquireComment?.writeDtm) || '-'}</td>
                            </tr>
                            {inquireInfo?.answerYn == 'N' ?
                                <></>
                                :
                                <tr>
                                    <th className="txt-center align-top">답변내용</th>
                                    <td colSpan="3">
                                        <span className="answer-textarea">
                                            <span dangerouslySetInnerHTML={{ __html: inquireComment.contents }}></span>
                                        </span>
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="con-footer">
                <div>
                    <button type="button" className="btn-circle" onClick={() => onDelete(inquireInfo)}>삭제</button>
                    {
                        inquireInfo?.answerYn == 'N' &&
                        <button type="button" className="btn-circle fill" onClick={onModify}>문의글 수정</button>
                    }
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

export default InquiryDetail;