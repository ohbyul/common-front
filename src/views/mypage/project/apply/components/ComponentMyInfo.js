import React, { useEffect, useState } from 'react';

const ComponentMyInfo = (props) => {
    let { memberInfo ,status } = props
    
    const context = [
        {index : 1 , status : 'POSSIBLE' ,      title : '지원가능' ,  classNm : 'standby' ,   contents : '현재 참여 진행 중인 임상시험이 없습니다.<br />DTx 임상 모집공고를 통해서 원하시는 모집공고를 신청해 주세요.' } , 
        {index : 2 , status : 'APPLY' ,         title : '지원중' ,    classNm : 'ing' ,       contents : '현재 신청하였거나 스크리닝 또는 임상에 참여 중인 임상 시험이 있습니다. <br />임상시험 신청은 지원 또는 참여 중인 임상 시험이 없어야만 가능합니다.' } , 
        {index : 3 , status : 'IMPOSSIBLE' ,    title : '지원불가' ,  classNm : 'end' ,       contents : '현재 참여신청이 불가한 상태입니다.<br />고객센터>이용문의를 통해 문의 주시기 바랍니다.' } , 
    ]

    const [ item , setItem ] = useState({})

     //내 참여 상태 POSSIBLE : 지원가능 , APPLY : 지원중 , IMPOSSIBLE : 지원불가
    useEffect(()=>{
        if(status){
            const result = context?.find(x=>x.status===status)
            setItem(result)
        }
    },[status])

    return (
        <div className="member-info">
            <div className="user-profile">
                <div className="contents1-font"><span className="subtitle3-font">{memberInfo?.memberNm}</span> 님</div>
                <div className="contents2-font">{memberInfo?.memberId}</div>
            </div>

            <div className="user-project">
                <div className="flex-align gap10x">
                    <span className="contents1-font">임상시험 참여신청</span>
                    <span className={`state ${item?.classNm}`}>{item?.title}</span>
                </div>
                <div className="contents2-font" dangerouslySetInnerHTML={{__html: item?.contents}}></div>
            </div>
            
        </div>
    );
};

export default ComponentMyInfo;