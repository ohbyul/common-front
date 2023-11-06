import React, { useEffect, useRef, useState } from 'react';
import SelectBox from '../../components/SelectBox';
import Reactquill from '../../components/ReactQuill';
import { actionGetUpperCodeList } from '../../../modules/action/CommonAction';
import { requiredValueCheck } from '../../../utiles/common';
import { valideSizeCheck, getByteSize, upLoadFile } from '../../../utiles/file';
import { actionInsertBoard } from '../../../modules/action/BoardAction';

const InquiryWrite = (props) => {
    const path = location.pathname;
    const pathArr = path?.split('/')

    //[1] inquiryWrite
    const [param, setParam] = useState({
        postClassificationCd: '',
        title: '',
        contents: inquiryContents,
        files: fileList,
        bbsKindCd: "M_QNA",
        displayYn: 'Y',
    })
    //[1-2] files
    const fileRef = useRef(null);
    const [fileList, setFileList] = useState([]);
    const [deleteFiles, setDeleteFiles] = useState([]);
    //[1-3] editer 
    const [inquiryContents, setinquiryContents] = useState('')

    //[1-4] selectBox Options
    const [postClassificationCd, setPostClassificationCd] = useState('')
    const [codeList, setCodeList] = useState([])
    useEffect(() => {
        let data = {
            groupCd: 'POST_CLASSIFICATION',
            upperCommCd: 'M_QNA'
        }
        actionGetUpperCodeList(data).then((res) => {
            if (res.statusCode == "10000") {
                let codeArray = []
                codeArray.push({ value: '', label: '선택' })
                res?.data?.map((item, index) => {
                    codeArray.push({
                        value: item.commCd,
                        label: item.commCdNm,
                    })
                })
                setCodeList(codeArray)
            }
        })
    }, [])

    //[2] 파일 
    //[2-1] upload file
    const onLoadFile = (e) => {
        let files = Array.from(e.target.files)  //불러온 파일 정보 가져오기
        e.target.value = '';    // 동일 파일 선택시 적용되도록 초기화
        
        let maxFileCnt = 5;   // 첨부파일 최대 개수
        let attFileCnt = document.querySelectorAll('.underline').length;
        var remainFileCnt = maxFileCnt - attFileCnt;    // 추가로 첨부가능한 개수
        var curFileCnt =  files.length;  // 현재 선택된 첨부파일 개수
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
                // console.log("1--",fileRef.current.value);
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
        setParam({ ...param, postClassificationCd: postClassificationCd, contents: inquiryContents, files: fileList,  })
    }, [inquiryContents, fileList, postClassificationCd])

    //[4] 등록
    const onWriteinquiry = () => {
        //[1-1] 필수값 체크
        const validObj = requiredValueCheck(param)
        // console.log(validObj)
        if (validObj) {
            const onNm = validObj.id
            if (onNm == 'postClassificationCd') {
                document.getElementById(`${onNm}`).setAttribute('tabindex', -1);
                document.getElementById(`${onNm}`).focus();
            }
            else if (onNm == 'title') {
                document.getElementsByName(`${onNm}`)[0].focus();
            }
            else if (onNm == 'contents') {
                document.getElementById(`${onNm}`).getElementsByClassName('ql-editor')[0].setAttribute('tabindex', -1);
                document.getElementById(`${onNm}`).getElementsByClassName('ql-editor')[0].focus();
            }
            props.funcAlertMsg(validObj.msg)
            return
        }
        
        // [2] 폼데이터 세팅
        const formData = new FormData();
        formData.append("body", JSON.stringify(param))
        if (fileList.length > 0) {
            fileList.map((item, index) => {
                formData.append(`files`, item);
            })
        }
        formData.append('bbsKindCd', "M_QNA");
        // console.log(param);

        actionInsertBoard(param, formData).then((res) => {
            if (res.statusCode == "10000") {
                let id = res.data
                props.history.push(`/mypage/inquiry/user/detail/${id}`)
                props.toastSuccess(res.message) //토스트 팝업
            }
        })
    }
    const onCancel = () => {
        props.history.goBack();
    }
    return (
        <>
            <div className="section-wrap">
                <div className="header-bg"></div>
                <div>
                    <div className="inventory">
                        <div>
                            <div className="h1">이용문의</div>
                            <div className="subtxt">궁금하신 내용을 남겨주시면 성심껏 답변하겠습니다.</div>
                        </div>
                    </div>
                </div>

                <div className="con-body">
                    <div className="notice-body">
                        <div className="title-field">
                            <div>이용문의 등록</div>
                            <button type="button" className="btn-square icon list" onClick={() => props.history.push('/mypage/inquiry')}>목록</button>
                        </div>
                        <table className="project-table">
                            <colgroup>
                                <col />
                                <col />
                                <col />
                                <col />
                            </colgroup>
                            <tbody>
                                <tr>
                                    <th className="txt-center required">분류</th>
                                    <td colSpan="3">
                                        <span className="grid select-1x">
                                            <SelectBox options={codeList} setValue={setPostClassificationCd} selectValue={postClassificationCd} id='postClassificationCd'/>
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <th className="txt-center required">제목</th>
                                    <td colSpan="3">
                                        <input
                                            type="text"
                                            name="title"
                                            value={param?.title || ''}
                                            onChange={handleChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th className="txt-center required">내용</th>
                                    <td colSpan="3">
                                        <Reactquill id='inquiryContents' value={inquiryContents} setVlaue={setinquiryContents} />
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
                                            {
                                                fileList?.length > 0 ?
                                                <div className='filelistbox'>
                                                    {   Array.from(fileList)?.map((item, index) => {
                                                        return (
                                                            <div className="space-between" key={index}>
                                                                <div className={`file-itme file-${upLoadFile(item.name)}`}>
                                                                    <span className='underline' title={item.name}>{item.name}</span>
                                                                    <span className='filesize'>{getByteSize(item.size)}</span>
                                                                </div>
                                                                <button className="btn-square icon single mr8 close" onClick={() => onDeleteFile(item)}></button>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                                : <></>
                                            }
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <dl className="attention mt30">
                            <dt className="info">문의 시 유의사항</dt>
                            <dd>부적절한 게시물 또는 욕설, 비방 등의 게시물을 등록할 경우 게시물 삭제 또는 이용에 제한이 생길 수 있습니다.</dd>
                            <dd>홈페이지 이용에 대한 문의가 있으신 경우 ‘고객센터 &#62; 이용문의’를 통해서 문의 주시기 바랍니다.</dd>
                            <dd>문의에 대한 답변은 '마이페이지 &#62; 문의내역 &#62; 모집공고' 1:1문의내역 에서 확인할 수 있습니다.</dd>
                        </dl>
                    </div>
                </div>

                <div className="con-footer">
                    <div>
                        <button type="button" className="btn-circle" onClick={onCancel}>취소</button>
                        <button type="button" className="btn-circle fill" onClick={onWriteinquiry}>저장</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default InquiryWrite;