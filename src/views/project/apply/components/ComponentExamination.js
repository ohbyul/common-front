import React, { useEffect } from 'react';

const ComponentExamination = (props) => {
    let {examinationList , params , setParams , onProjectListPage} = props
    
    // [2] handle--------------------------------------------------------------------
    const handleChange = (e, exam , item) => {

        if(item.applyRestraintYn==='Y'){
            onProjectListPage()
            return
        }

        if(e.target.type === 'radio'){
            exam['resultItemId'] = item.id
            setParams({...params})
        }
        
        else
        if(e.target.type === 'checkbox'){
            // console.log(exam);
            // console.log(item);
            let arr = exam?.resultItemId ?? []
            if(e.target.checked){
                arr.push(item.id)
            }else{
                arr = arr.filter(x=> x!==item.id)
            }
            // console.log(arr);
            exam['resultItemId'] = arr
            setParams({...params})
        }
        
    }
    return (
        <div className="line-box">
            {
                params?.examinationList?.length > 0 ? 
                params?.examinationList?.map((exam,index)=>{
                    return(
                        <div key={index}>
                            <div className={`tit decimal`}>
                                <span className={exam.mandatoryYn === 'Y' ? 'required' : ''}>{exam.sortOrder}.</span>
                                {exam.questionNm}
                            </div>
                            <div className="lineup">
                                {
                                    exam.examinationItemList?.length > 0 ? 
                                    exam.examinationItemList?.map((item , itemIndex) => {
                                        // 답변유형(단일선택: SINGLE_SELECT,복수선택 : MULTI_SELECT)
                                        if(exam.questionTypeCd === 'SINGLE_SELECT'){
                                            return(
                                                <div key={itemIndex}>
                                                    <input type="radio" 
                                                            id={item.id}
                                                            name={exam.id}
                                                            checked={exam?.resultItemId === item.id}
                                                            onChange={(e)=>handleChange(e,exam , item)}
                                                    />
                                                    <label htmlFor={item.id}>{item.itemNm}</label>
                                                </div>
                                            )
                                        }else if (exam.questionTypeCd === 'MULTI_SELECT'){
                                            return(
                                                <div key={itemIndex}>
                                                    <input type="checkbox" 
                                                            id={item.id}
                                                            name={exam.id}
                                                            checked={exam?.resultItemId?.includes(item.id) ? true : false}
                                                            onChange={(e)=>handleChange(e,exam , item)}
                                                    />
                                                    <label htmlFor={item.id}>{item.itemNm}</label>
                                                </div>
                                            )
                                        }
                                    })
                                    : ''
                                }
                            </div>
                        </div>
                    )
                })
                : ''
            }
        </div>
    );
};

export default ComponentExamination;