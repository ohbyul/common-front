import React, { useEffect, useState } from 'react';
import { AlertDialogOverlay } from '@reach/alert-dialog';
import { CANCEL_REASON, getCodeOption } from '../../../../../../utiles/code';
import SelectBox from '../../../../../components/SelectBox';
import { actionUpdateSubjectStatus } from '../../../../../../modules/action/SubjectAction';

const ModalCancelReason = (props) => {
    let { cancelRef, setShowModal 
        , subject ,funcGetSubjectInfo
        , projectId
    } = props
    // [1-1] select-box
    const [optionsCancelReason , setOptionsCancelReason] = useState([])
    const [cancelReasonCd , setCancelReasonCd] = useState('')
    const [params , setParams] = useState({
        projectId : projectId,
        subjectId : subject?.id , 
        statusCd : 'CANCEL',
        surveyYn : subject?.surveyYn , 
        cancelReasonCd : '' , 
        cancelerTypeCd: 'APPLICANT',
        cancelReasonEtc : null
    })
    // 국내외 개발
    useEffect( () => {
        let data = {
            groupCd : CANCEL_REASON,
            default : '선택'
        }
        getCodeOption(data).then(res=>{if(res)setOptionsCancelReason(res)})
    },[])

    // [1] 데이터세팅 --------------------------------------
    const handleChange = (e) => {
        setParams({...params , cancelReasonEtc: e.target.value })
    }
    useEffect(()=>{
        setParams({...params 
            , cancelReasonCd: cancelReasonCd 
            , cancelReasonEtc : null
        })
    },[cancelReasonCd])

    // [2] 저장 --------------------------------------
    const onSave = () => {
        if(params?.cancelReasonCd===''){
            props.funcAlertMsg("취소사유를 선택해주세요.")
            return
        }
        if(params?.cancelReasonCd==='9999' && !params?.cancelReasonEtc){
            props.funcAlertMsg("기타에 취소사유를 작성해 주세요.")
            document.getElementsByName('cancelReasonEtc')[0].focus();
            return
        }
        actionUpdateSubjectStatus(params).then((res) => {
            if (res.statusCode == "10000") {
                props.toastSuccess(res.message)
                setShowModal(false)
                funcGetSubjectInfo()
            }
        })

    }
    return (
        <AlertDialogOverlay >
        <div className="popup-layer">
            <div className="popup-content column popup-mini">
                <div className="popup-header">
                    <div className="popup-title">참여취소 처리</div>
                    <button type="button" className="popup-cls" onClick={()=>setShowModal(false)}>팝업닫기</button>
                </div>

                <div className="popup-body overflow-visible">
                    <div>

                        <table className="project-table">
                            <colgroup>
                                <col />
                                <col />
                            </colgroup>
                            <tbody>
                                <tr>
                                    <th className="required txt-center">취소사유</th>
                                    <td className="overflow-visible">
                                        <SelectBox id='cancelReasonCd' options={optionsCancelReason} setValue={setCancelReasonCd} selectValue={cancelReasonCd} />
                                    </td>
                                </tr>
                                <tr>
                                    <th className="txt-center align-top">기타</th>
                                    <td>
                                        <textarea 
                                            type="text" 
                                            name="cancelReasonEtc"
                                            placeholder="취소사유 입력"
                                            onChange={handleChange}
                                            value={params?.cancelReasonEtc || ''}
                                            disabled={params?.cancelReasonCd === '9999' ? false : true}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="popup-footer">
                    <button type="button" className="btn-square fill" onClick={onSave}>저장</button>
                    <button type="button" className="btn-square" ref={cancelRef}  onClick={()=>setShowModal(false)}>취소</button>
                </div>
            </div>
        </div>
        </AlertDialogOverlay>
    );
};

export default ModalCancelReason;