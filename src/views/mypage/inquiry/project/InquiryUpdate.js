import React, { useEffect, useState, useRef } from 'react';
// import { actionGetBoardInfo, actionUpdateBoard } from '../../../../modules/action/BoardAction';
import { actionGetProjectBoardInfo, actionUpdateProjectBoard } from '../../../../modules/action/ProjectBoardAction';
import { actionGetUpperCodeList } from '../../../../modules/action/CommonAction';
import { valideSizeCheck, getByteSize, checkFileExt, upLoadFile } from '../../../../utiles/file';
import SelectBox from '../../../components/SelectBox';
import Reactquill from '../../../components/ReactQuill';

const InquiryUpdate = (props) => {
    const boardId = props.match.params['boardId']

    //[1] inquireModify
    const [param, setParam] = useState({
        postClassificationCd: '',
        bbsKindCd: "P_QNA",
        id: boardId,
        title: '',
        contents: inquireContents,
        files: fileList,
        deleteFiles: deleteFiles,
        displayYn: 'Y',
    })
    const [inquireInfo, setInquireInfo] = useState({})
    //[1-2] files
    const fileRef = useRef(null);
    const [fileList, setFileList] = useState([]);
    const [deleteFiles, setDeleteFiles] = useState([]);
    //[1-3] editer 
    const [inquireContents, setInquireContents] = useState('')
    //[1-4] selectBox Options
    const [postClassificationCd, setPostClassificationCd] = useState('0101')
    const [codeList, setCodeList] = useState([])
    useEffect(() => {
        let data = {
            groupCd: 'POST_CLASSIFICATION',
            upperCommCd: 'P_QNA'
        }
        actionGetUpperCodeList(data).then((res) => {
            if (res.statusCode == "10000") {
                let codeArray = res?.data?.map((item, index) => {
                    return (
                        { value: item.commCd, label: item.commCdNm }
                    )
                })
                setCodeList(codeArray)
            }
        })
    }, [])

    useEffect(() => {
        funcGetInquireDetail()
    }, [])
    //출력 데이터 셋팅
    const funcGetInquireDetail = () => {
        let params = {
            bbsKindCd: 'P_QNA',
            viewCountYn: 'N',
            id: boardId,
        }

        actionGetProjectBoardInfo(params).then((res) => {
            if (res.statusCode == "10000") {
                let result = res.data
                // console.log(result);
                
                setInquireInfo(result)
                setInquireContents(result.contents)
                setFileList(result.boardFile)
                setPostClassificationCd(result.postClassificationCd)
            }
        })
    }

    //[2] 파일 
    //[2-1] upload file
    const onLoadFile = (e) => {
        let files = Array.from(e.target.files)
        e.target.value = '';    // 동일 파일 선택시 적용되도록 초기화
        
        let maxFileCnt = 5;   // 첨부파일 최대 개수
        let attFileCnt = document.querySelectorAll('.underline').length;
        var remainFileCnt = maxFileCnt - attFileCnt;    // 추가로 첨부가능한 개수
        var curFileCnt = files.length;  // 현재 선택된 첨부파일 개수
        // 첨부파일 개수 확인
        if (curFileCnt > remainFileCnt) {
            // alert("첨부파일은 최대 " + maxFileCnt + "개 까지 첨부 가능합니다.");
            props.funcAlertMsg("첨부파일은 최대 " + maxFileCnt + "개 까지 첨부 가능합니다.")
            return
        }

        for (const file of files) {
            if (!valideSizeCheck(file)) {
                props.funcAlertMsg(file.name + ' 파일 용량이 10MB를 초과하였습니다.')
                fileRef.current.value = null;
                return
            }
        }

        for (const fileArray of fileList) {
            files = files.filter(item => item.name !== fileArray.name);
        }
        setFileList(fileList => [...fileList, ...files]);
    }

    //[2-2] 파일 인덱스 추가
    useEffect(() => {
        Array.from(fileList)?.map((item, index) => {
            item.no = index;
        })
    }, [fileList])

    //[2-3] delete one
    const onDeleteFile = (item) => {
        if (item.id) {
            item['delete'] = 'Y'
            deleteFiles.push(item.id);
        }
        setFileList(fileList.filter(arr => arr.no !== item.no));
    };

    //[3] 입력 데이터 셋팅
        //[3-1] input 
        const handleChange = (e) => {
            switch (e.target.name) {
                case 'title':
                    setParam({ ...param, title: e.target.value })
                    break;
            }
        }
    //[3-2] 셀렉트박스/에디터
    useEffect(() => {
        setParam({
            ...param,
            id: boardId,
            postClassificationCd: postClassificationCd,
            answerPostTitle: inquireInfo.answerPostTitle,
            title: inquireInfo.title,
            contents: inquireContents,
            files: fileList,
            deleteFiles: deleteFiles,
        })
    }, [postClassificationCd, inquireContents, fileList, boardId, deleteFiles, inquireInfo])

    //[4] 수정
    const onUpdateInquire = () => {
        // [1] 폼데이터 세팅
        const formData = new FormData();

        formData.append("body", JSON.stringify(param))
        if (fileList.length > 0) {
            fileList.map((item, index) => {
                formData.append(`files`, item);
            })
        }
        formData.append('bbsKindCd', "P_QNA");

        actionUpdateProjectBoard(param, formData).then((res) => {
            if (res.statusCode == "10000") {
                props.history.push(`/mypage/inquiry/project/detail/${boardId}`)
            }
        })
    }
    const onCancel = () => {
        props.history.goBack();
    }
    return (
        <>
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
                            <div>모집공고 문의 수정</div>
                            <button type="button"
                                className="btn-square icon list"
                                onClick={() => props.history.push(`/mypage/inquiry/project`)}
                            >목록</button>
                        </div>
                        <table className="project-table">
                            <colgroup><col /><col /><col /><col /></colgroup>
                            <tbody>
                                <tr>
                                    <th className="txt-center required">공고명</th>
                                    <td colSpan="3">{param?.answerPostTitle}</td>
                                </tr>
                                <tr>
                                    <th className="txt-center required">문의분류</th>
                                    <td colSpan="3">
                                        <SelectBox options={codeList} setValue={setPostClassificationCd} selectValue={postClassificationCd} />
                                    </td>
                                </tr>
                                <tr>
                                    <th className='txt-center required'>제목</th>
                                    <td colSpan="3">
                                        <input type="text" name="title"
                                            value={param.title || ""}
                                            onChange={handleChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th className="txt-center align-top required">문의내용</th>
                                    <td colSpan="3">
                                        <Reactquill id='inquireContents' value={inquireContents} setVlaue={setInquireContents} />
                                    </td>
                                </tr>
                                <tr>
                                    <th className="txt-center align-top">첨부파일</th>
                                    <td colSpan="3">
                                        <span>
                                            <div className="file-uploed">
                                                <input
                                                    type="file"
                                                    id="file"
                                                    onChange={e => { onLoadFile(e) }}
                                                    multiple={true}
                                                    ref={fileRef}
                                                />
                                                <label onClick={() => fileRef.current?.click()}>파일업로드</label>
                                                <div className="file-count info">첨부파일은 최대 5개 파일까지, 파일당 최대 10MB까지 첨부 가능합니다</div>
                                            </div>
                                            {fileList?.length > 0 ?
                                                <div className='filelistbox'>
                                                    {Array.from(fileList)?.map((item, index) => {
                                                        return (
                                                            <div className="space-between" key={index}>
                                                                <div className={`file-itme file-${item.extensionNm ? checkFileExt(item.extensionNm):upLoadFile(item.name)}`}>
                                                                    <span className='underline' title="">
                                                                        {item.originalFileNm ? item.originalFileNm : item.name}
                                                                    </span>
                                                                    <span className='filesize'>
                                                                        {item.fileSize ? getByteSize(item.fileSize) : getByteSize(item.size)}
                                                                    </span>
                                                                </div>
                                                                <button className="btn-square icon close mr8 single" onClick={() => onDeleteFile(item)}></button>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                                : <></>
                                            }
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <th className="txt-center align-top">답변상태</th>
                                    <td>답변대기</td>
                                    <th className="txt-center align-top">답변일자</th>
                                    <td>-</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="con-footer">
                    <div>
                        <button type="button" className="btn-circle" onClick={onCancel}>취소</button>
                        <button type="button" className="btn-circle fill" onClick={onUpdateInquire}>저장</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default InquiryUpdate;