import React, { useState } from 'react';
import { actionInsertSurvey } from '../../../../../../modules/action/SurveyAction';
import ConfirmDialogComponent from '../../../../../components/ConfirmDialogComponent';

const ComponentWriteSurvey = (props) => {
    let { survey , setSurvey , subject , funcGetSubjectInfo , isCompleteSurvey} = props

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
    // [2] handle--------------------------------------------------------------------
    const handleChange = (e, exam , item) => {

        if(e.target.type === 'radio'){
            item['surveyItemId']=item.id
            exam['resultItem'] = [item]
            setSurvey([...survey])
        }
        
        else
        if(e.target.type === 'checkbox'){
            let arr = exam?.resultItem ?? []
            if(e.target.checked){
                item['surveyItemId']=item.id
                arr.push(item)
            }else{
                arr = arr.filter(x=> x.id!==item.id)
            }
            exam['resultItem'] = arr
            setSurvey([...survey])
        }

        else
        if(e.target.type === 'text'){
            if(exam.questionTypeCd === 'INPUT'){
                exam['resultItem'] = [{...exam ,inputValue : e.target.value , surveyItemId : e.target.id}]
                setSurvey([...survey])
            }
            
            else{
                let arr = exam?.resultItem
                arr?.map(x=>{
                    if(x.id === item.id){
                        x['addInputValue']=e.target.value
                    }
                })
                exam['resultItem'] = arr
                setSurvey([...survey])
            }
            
        }
    }

    // [3] 저장 --------------------------------------
    const onSave = () => {
        // 필수값 체크
        survey?.map(item =>{
            if(item.mandatoryYn === 'Y' && item.resultItem?.length === 0){
                props.funcAlertMsg('필수항목을 입력해주세요.')
                return
            }   
        })

        setConfirmDialogObject({
            description: ['제출 후 수정이 불가합니다. 제출하시겠습니까?'],
            leftText: '확인',
            rightText: '취소',
            leftClick: () => {
                setShowConfirmDialog(false);
                funcInsertSurvey()
            },
            rightClick: () => {
                setShowConfirmDialog(false);
            },
        })
        setShowConfirmDialog(true)
    }

    const funcInsertSurvey = () => {
        let param = {
            subjectId:subject?.id,
            surveyList : survey
        }
        
        actionInsertSurvey(param).then((res) => {
            if (res.statusCode == "10000") {
                props.toastSuccess(res.message)
                funcGetSubjectInfo()
            }
        })
    }

    return (
        <>
        <dl className="info-box mypage-survey">
            {
                survey?.length > 0 ?
                survey?.map((exam,index)=>{
                    const result = exam.resultItem
                    const resultArr = [];
                    result?.map((item) => {
                        resultArr.push(item.surveyItemId)
                    })
                    return(
                        <dd className="flex-wrap" key={exam.sortOrder}>
                            <div className={`tit mb10 ${exam.mandatoryYn === 'Y' ? 'required' : ''}`}>
                                <span>{exam.sortOrder}.</span>{exam.questionNm}
                            </div>
                            <div>
                                <div className="lineup">
                                {
                                    exam.surveyItemList?.length > 0 ? 
                                    exam.surveyItemList?.map((item , itemIndex) => {
                                        // 답변유형(단일선택: SINGLE_SELECT,복수선택 : MULTI_SELECT, 주관식 : INPUT) GROUP_CD : SUVERY_QUESTION_TYPE
                                        if(exam.questionTypeCd === 'SINGLE_SELECT'){
                                            return(
                                                <div key={itemIndex}>
                                                    <input type="radio" 
                                                            id={item.id}
                                                            name={exam.id}
                                                            checked={resultArr.includes(item.id)}
                                                            onChange={(e)=>handleChange(e,exam , item)}
                                                            disabled={isCompleteSurvey}
                                                    />
                                                    <label htmlFor={item.id}>{item.itemNm}</label>
                                                    {
                                                        item.addInputYn === 'Y' ? 
                                                        <span>
                                                            <input type="text" 
                                                                    placeholder="답변을 입력하세요." 
                                                                    id={item.id}
                                                                    name={exam.id}
                                                                    value={
                                                                        resultArr.includes(item.id) ?
                                                                            result?.find(x=>x.surveyItemId === item.id)?.addInputValue || ''
                                                                            : ''
                                                                    }
                                                                    onChange={(e)=>handleChange(e , exam , item)}
                                                                    disabled={!resultArr.includes(item.id) || isCompleteSurvey}
                                                            />
                                                        </span>
                                                        : ''
                                                    }
                                                </div>
                                            )
                                        }else if (exam.questionTypeCd === 'MULTI_SELECT'){
                                            return(
                                                <div key={itemIndex}>
                                                    <input type="checkbox" 
                                                            id={item.id}
                                                            name={exam.id}
                                                            checked={resultArr?.includes(item.id) ? true : false}
                                                            onChange={(e)=>handleChange(e , exam , item)}
                                                            disabled={isCompleteSurvey}
                                                    />
                                                    <label htmlFor={item.id}>{item.itemNm}</label>
                                                    {
                                                        item.addInputYn === 'Y' ? 
                                                        <span>
                                                            <input type="text" 
                                                                    placeholder="답변을 입력하세요." 
                                                                    id={item.id}
                                                                    name={exam.id}
                                                                    value={
                                                                        resultArr.includes(item.id) ?
                                                                            result?.find(x=>x.surveyItemId === item.id)?.addInputValue || '' 
                                                                            : ''
                                                                    }
                                                                    onChange={(e)=>handleChange(e , exam , item)}
                                                                    disabled={!resultArr.includes(item.id) || isCompleteSurvey}
                                                            />
                                                        </span>
                                                        : ''
                                                    }
                                                </div>
                                            )
                                        }
                                    })
                                    : ''
                                }
                                {
                                    exam.questionTypeCd === 'INPUT' ?
                                    <span className='input-txt'>
                                        <input type="text" 
                                                placeholder="답변을 입력하세요."
                                                id={exam.id}
                                                name={exam.id} 
                                                value={result[0]?.inputValue || ''}
                                                onChange={(e)=>handleChange(e , exam , null)}
                                                disabled={isCompleteSurvey}
                                        />
                                    </span>
                                    : ''
                                }
                                </div>
                            </div>
                        </dd>
                    )
                })
                : <div className="empty">설문이 존재하지 않습니다.</div>
            }
            </dl>
            {
                !isCompleteSurvey ? 
                    <div className="con-footer">
                        <div>
                            <button type="button" className="btn-circle fill" onClick={onSave} >제출</button>
                        </div>
                    </div>
                    : 
                    ''
            }
            
            {/* alert */}
            {
                showConfirmDialog &&
                <ConfirmDialogComponent cancelRef={cancelRef} description={confirmDialogObject.description}
                                        leftText={confirmDialogObject.leftText}
                                        rightText={confirmDialogObject.rightText}
                                        leftClick={confirmDialogObject.leftClick}
                                        rightClick={confirmDialogObject.rightClick}/>
            }
            {/* alert */}
        </>
    );
};

export default ComponentWriteSurvey;