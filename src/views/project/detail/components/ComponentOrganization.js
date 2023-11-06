import React, { useState } from 'react';

const ComponentOrganization = (props) => {
    let { organizationList } = props

    // const [ accordion , setAccordion ] = useState([])
    
    // const onActive = (orgCd) => {
    //     const isInclude = accordion?.find(x=>x===orgCd) ? true : false
    //     if(isInclude){
    //         const newArr = accordion?.filter(x=>x!==orgCd)
    //         setAccordion(newArr)
    //     }else{
    //         setAccordion(prev => [...prev , orgCd])
    //     }
    // }

    return (
        <div className="detail-info">
            <div className="balance">
                <div className="txt-title">스크리닝(건강검진) 기관 안내</div>
            </div>
            <div className="div-table">
                <div className="table-header">
                    <div>지역</div>
                    <div>병원</div>
                    <div>신청 가능 기간</div>
                    <div>전화문의</div>
                    <div>스크리닝 참고사항</div>
                </div>
                {
                    organizationList?.length > 0 ? 
                    organizationList?.map((item,index) => {
                        // 병원 노출,비노출 여부 추가
                        if(item?.displayYn === 'Y'){
                            return(
                                // <div className="table-body" key={index} onClick={()=>onActive(item.organizationCd)}>
                                <div className="table-body" key={index}>
                                    <div>{item?.region}</div>
                                    <div>{item?.organizationNm}</div>
                                    <div>{item?.recruitStartDate} ~ {item?.recruitEndDate}</div>
                                    <div>{item?.contactNo}</div>
                                    {/* <div className={`flex-middle gap24x ${accordion.includes(item.organizationCd)? 'open' : ''}`} >자세히 보기 <div className="drop"></div></div> */}
    
                                    <div className="flex-middle gap24x">
                                            자세히 보기
                                            {/* accordion 화살표영역 */}
                                            <span className="moreplus">
                                                <input type='checkbox' name='acc' id={index} />
                                                <label htmlFor={index}>
                                                    <span></span>
                                                </label>
                                            </span>
                                        </div>
    
    
                                    <div className="td-free span-5x hide">
                                        <div className="flex-align gap8x">
                                            <div className="dot-txt">주소 :</div>
                                            <div>{item.zipCode ? `[${item.zipCode}]`:''} {item.address} {item.addressDetail}</div>
                                        </div>
                                        <div className="indent">
                                            <div className="dot-txt">스크리닝 참고사항</div>
                                            <div>{item.refer}</div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        
                    })
                    : '' 
                }
            </div>
        </div>
    );
};

export default ComponentOrganization;