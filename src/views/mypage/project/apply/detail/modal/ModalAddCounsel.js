import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { AlertDialogOverlay } from '@reach/alert-dialog';
import ConfirmDialogComponent from '../../../../../components/ConfirmDialogComponent';
import Datepicker from '../../../../../components/picker/Datepicker';
import SelectBox from '../../../../../components/SelectBox';
import { APPLY_REASON, getCodeOption } from '../../../../../../utiles/code';
import { requiredValueCheck } from '../../../../../../utiles/common';
import { onlyNum } from '../../../../../../utiles/regex';
import { dateFormat, dateTimeFormat, getCurrentDate } from '../../../../../../utiles/date';
import { actionInsertCounsel } from '../../../../../../modules/action/CounselAction';


const ModalAddCounsel = (props) => {
    let { cancelRef, setShowModal 
        , selectItem , onReload
        , subject , isReject, projectId , funcGetSubjectInfo
    } = props
    
    //--------------- confirm ---------------
    const cancelConfirmRef = React.useRef();
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [confirmDialogObject, setConfirmDialogObject] = useState({
        description: '',
        leftText: '',
        rightText: '',
        leftClick: null,
        rightClick: null
    })
    //--------------- confirm ---------------
    const [param, setParam] = useState({
        subjectId : null,
        organizationCd:'',
        applyCounselDate: '',
        applyCounselTime: '' ,
        applyCounselTimeHour : '' ,
        applyCounselTimeMin : '' ,
        statusCd : 'APPLY',
        applyReasonCd: '' , 
        isCreate : false,
        counselId:null,
    })
    //[1-1] datepicker 
    const [applyCounselDate, setApplyCounselDate] = useState('');
    const [applyCounselDateDisable, setApplyCounselDateDisable] = useState(false)
    // [1-2] selectBox
    const [applyReasonCd , setApplyReasonCd] = useState('');
    const [optionapplyReasons , setOptionapplyReasons] = useState([])
    
    // [1] 데이터 조회 ---------------------------------------
    useEffect(()=>{
        if(selectItem){
            // [1] 예약 존재 - 수정
            if(selectItem.counselId){
                
                setParam({...param
                    ,subjectId:selectItem?.subjectId
                    ,organizationCd:selectItem?.organizationCd
                    ,organizationNm:selectItem?.organizationNm                //기관명 세팅
                    ,counselId:selectItem?.counselId
                    ,applyCounselDate:selectItem?.applyCounselDate
                    ,applyCounselTimeHour : selectItem.applyCounselTime ? moment(`2020-01-01 ${selectItem.applyCounselTime}`).format('HH') : ''
                    ,applyCounselTimeMin : selectItem.applyCounselTime ? moment(`2020-01-01 ${selectItem.applyCounselTime}`).format('mm') : ''
                    ,applyCounselTime:selectItem?.applyCounselTime
                    ,applyReasonCd:selectItem?.applyReasonCd
                })
                setApplyCounselDate(selectItem?.applyCounselDate ?? '')
                setApplyReasonCd(selectItem?.applyReasonCd ?? '')
            }
            // [2] 예약 미존재 - 생성
            else{
                setParam({...param
                    ,subjectId:selectItem?.subjectId
                    ,organizationCd:selectItem?.organizationCd
                    ,organizationNm:selectItem?.organizationNm
                    ,isCreate: true
                })
            }
        }
    },[selectItem])


    useEffect( () => {
        let data = {
            groupCd : APPLY_REASON,
            default : '선택'
        }
        getCodeOption(data).then(res=>{if(res)setOptionapplyReasons(res)})
    },[])


    //[2] 입력 데이터 세팅 -------------------------------------------------------------
    const handleChange = (e) => {
        switch (e.target.name) {
            case 'applyCounselTimeHour':
                if(e.target.value?.length <= 2){
                    setParam({...param
                        , applyCounselTimeHour: e.target.value.replace(onlyNum,'')
                        , applyCounselTime: `${e.target.value.replace(onlyNum,'')}:${param?.applyCounselTimeMin}:00`
                })
                }
                break;
            case 'applyCounselTimeMin':
                if(e.target.value?.length <= 2){
                    setParam({...param
                        , applyCounselTimeMin: e.target.value.replace(onlyNum,'')
                        , applyCounselTime: `${param?.applyCounselTimeHour}:${e.target.value.replace(onlyNum,'')}:00`
                    })
                }
                break;
        }
    }

    //[2-3] 날짜 / 셀렉트박스
    useEffect( () => {
        if(param?.subjectId){
            setParam({...param
                , applyCounselDate: applyCounselDate
                , applyReasonCd : applyReasonCd
            })   
        }
    }, [ applyCounselDate , applyReasonCd ])

    // [4] 등록 --------------------------------
    const onsave = () => {
        //필수값 체크
        const validObj = requiredValueCheck(param)
        let unRequired = ['counselId']
        // console.log(validObj);
        if(validObj && !unRequired.includes(validObj.id)){
            if (validObj.id == 'applyReasonCd') {
                document.getElementById(`${validObj.id}`).setAttribute('tabindex', -1);
                document.getElementById(`${validObj.id}`).focus();
            }

            else
            if(validObj.id == 'applyCounselTime'){
                document.getElementsByName('applyCounselTimeHour')[0].focus();
            }
            else {
                document.getElementsByName(`${validObj.id}`)[0].focus();
            }
            props.funcAlertMsg(validObj.msg)
            return
        }

        // 날짜 체크
        const today = dateTimeFormat(getCurrentDate())
        const reservationTime = dateTimeFormat(param?.applyCounselDate + ' ' + param?.applyCounselTime)
        if(today >= reservationTime){
            props.funcAlertMsg('상담예약은 현재 이후날짜부터 가능합니다.')
            return
        }

        const isCreate = param?.isCreate
        let msg = []
        if(isCreate){
            msg =  ['비대면 상담을 신청하시겠습니까?']
        }else{
            msg = [`비대면 상담 신청을 변경 하시겠습니까?`]
        }
        setConfirmDialogObject({
            description: msg ,
            leftText: '확인',
            rightText: '취소',
            leftClick: () => {
              setShowConfirmDialog(false);
              funcSaveCounsel()
            },
            rightClick: () => {
              setShowConfirmDialog(false);
            },
        })
        setShowConfirmDialog(true)
    }

    const funcSaveCounsel = () => {
        actionInsertCounsel(projectId,param).then((res) => {
            if (res.statusCode == "10000") {
                props.toastSuccess(res.message)
                onReload()
                setShowModal(false)
            }
        })
    }

    return (
        <AlertDialogOverlay>
        <div className="popup-layer">
            <div className="popup-content column popup-mini">
                <div className="popup-header">
                    <div className="popup-title">비대면상담 예약</div>
                    <button type="button" className="popup-cls" onClick={()=>setShowModal(false)}>팝업닫기</button>
                </div>

                <div className="popup-body">
                    <div>
                        <table className='project-table'>
                            <colgroup><col/><col/></colgroup>
                            <tbody>
                                <tr>
                                    <th className="txt-center">신청자 성명</th>
                                    <td>{selectItem?.applicantNm}</td>
                                </tr>
                                <tr>
                                    <th className="txt-center">시험대상자 성명</th>
                                    <td>{selectItem?.subjectNm}</td>
                                </tr>
                                <tr>
                                    <th className="txt-center required">비대면상담 일정</th>
                                    <td>
                                        <span className="grid time-4x gap5x">
                                            <Datepicker name='applyCounselDate' value={applyCounselDate} setDate={setApplyCounselDate} disable={applyCounselDateDisable} placeholderText="YYYY-MM-DD" maxYearAdd={10}/>
                                            <input 
                                                type="text" 
                                                name="applyCounselTimeHour"
                                                placeholder="시"
                                                onChange={handleChange}
                                                value={param?.applyCounselTimeHour || ''}
                                                required
                                            />
                                            :
                                            <input 
                                                type="text" 
                                                name="applyCounselTimeMin"
                                                placeholder="분"
                                                onChange={handleChange}
                                                value={param?.applyCounselTimeMin || ''}
                                                required
                                            />
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <th className="txt-center required">신청 사유</th>
                                    <td>
                                        <SelectBox id="applyReasonCd" options={optionapplyReasons} setValue={setApplyReasonCd} selectValue={applyReasonCd} />
                                    </td>
                                </tr>
                                <tr>
                                    <th className="txt-center">기관</th>
                                    <td>{param?.organizationNm}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="popup-footer">
                    <button type="button" className="btn-square fill" onClick={onsave}>신청</button>
                    <button type="button" className="btn-square" ref={cancelRef}  onClick={()=>setShowModal(false)}>취소</button>
                </div>
            </div>
            {
                showConfirmDialog &&
                <ConfirmDialogComponent cancelRef={cancelConfirmRef} description={confirmDialogObject.description}
                                        leftText={confirmDialogObject.leftText}
                                        rightText={confirmDialogObject.rightText}
                                        leftClick={confirmDialogObject.leftClick}
                                        rightClick={confirmDialogObject.rightClick}/>
            }
        </div>
        </AlertDialogOverlay>
    );
};

export default ModalAddCounsel;