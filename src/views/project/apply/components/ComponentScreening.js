import React, { useEffect, useState } from 'react';
import Datepicker from '../../../components/picker/Datepicker';
import { dateFormat, dateFormatValid, getCurrentDate } from '../../../../utiles/date';
import moment from 'moment';

const ComponentScreening = (props) => {
    let {orgs , params , setParams} = props

    const today = dateFormat(getCurrentDate())

    // 스크리닝
    const [ orginfo , setOrginfo ] = useState({})
    //[1-1] datepicker 
    const [screeningDate, setScreeningDate] = useState('');
    const [screeningDateDisable, setScreeningDateDisable] = useState(false)
    const [ times , setTimes ] = useState([
        {label : '오전 09:00' , value : '09:00:00' }, 
        {label : '오전 10:00' , value : '10:00:00' }, 
        {label : '오전 11:00' , value : '11:00:00' }, 
        {label : '정오 12:00' , value : '12:00:00' }, 
        {label : '오후 01:00' , value : '13:00:00' }, 
        {label : '오후 02:00' , value : '14:00:00' },
        {label : '오후 03:00' , value : '15:00:00' },
        {label : '오후 04:00' , value : '16:00:00' },
        {label : '오후 05:00' , value : '17:00:00' },
        {label : '오후 06:00' , value : '18:00:00' },
    ])
    const [ isRecruit , setIsRecruit ] = useState(false)

     // [2] handle--------------------------------------------------------------------
    //  기관
     const handleChange = (e) => {
        if(e.target.type === 'radio'){
            setParams({...params, 
                organizationCd : e.target.id,
                screeningDate : '' , 
                screeningTime : '' ,
            })
            setScreeningDate('')
            
            let temp = orgs?.find(x=>x.organizationCd === e.target.id)
            setOrginfo(temp)

            // 모집기간 체크
            const recruitStartDate =temp?.recruitStartDate
            const recruitEndDate = temp?.recruitEndDate
            if( recruitStartDate <= today && recruitEndDate >=today){
                // 모집기간O
                setIsRecruit(true)
                setScreeningDateDisable(false)
            }else{
                // 모집기간X
                setIsRecruit(false)
                setScreeningDateDisable(true)
            }
        }
    }

    // 날짜
    useEffect(()=>{
        if(screeningDate === '' || !dateFormatValid(screeningDate)){
            setParams({...params , 
                screeningDate : '' , 
                screeningTime : ''
            })
            return
        }
        const startData = orginfo?.screeningStartDate
        const endData = orginfo?.screeningEndDate
        if(startData > screeningDate 
            || endData < screeningDate 
            || today > screeningDate
        ){
            setScreeningDate('')
            setParams({...params , 
                screeningDate : '' , 
                screeningTime : ''
            })
            props.funcAlertMsg('선택 가능한 방문일이 아닙니다.')
            return
        }

        setParams({...params , 
            screeningDate : screeningDate , 
            screeningTime : ''
        })
    },[screeningDate])

    // 시간
    const onSelectTime = (e) => {
        if(!params?.screeningDate){
            return
        }
        setParams({...params , 
            screeningTime : e.target.id
        })
    }

    return (
        <div className="line-box">
            <div className="grid-start locate-2x gap40x mt10">
                <div className="dot-txt tit">방문 기관 선택</div>
                <div className="flex-wrap gap8x52 radio-align">
                    {
                        orgs?.length > 0 ? 
                        orgs?.map((org , index)=>{
                            return(
                                <span key={index}>
                                    <input type="radio" 
                                            name='organizationCd'
                                            id={org?.organizationCd}
                                            onChange={handleChange}
                                            checked={params?.organizationCd === org?.organizationCd}
                                    />
                                    <label htmlFor={org?.organizationCd}>{org?.organizationNm}</label>
                                </span>
                            )
                        })
                        : ''
                    }
                </div>
            </div>
            <div>
                <div className="dot-txt tit">희망 방문일 선택</div>
                {
                    params?.organizationCd ? 
                    <dl className="linebar">
                        <dt>스크리닝 안내</dt>
                        <dd>방문 선택 기관 : {orginfo?.organizationNm}</dd>
                        <dd>
                            <span title='recruit'>모집 일자</span> : 
                            {
                                orginfo?.recruitStartDate ? 
                                    `${orginfo?.recruitStartDate} ~ ${orginfo?.recruitEndDate}`
                                    :''
                            }

                        </dd>
                        <dd>
                            <span title='screening'>선택 가능 방문일자</span> : 
                            {
                                orginfo?.screeningStartDate ? 
                                    `${orginfo?.screeningStartDate} ~ ${orginfo?.screeningEndDate}`
                                    :''
                            }
                        </dd>
                        <dd>운영시간 : {orginfo?.screeningTime}</dd>

                        <dt>참고사항</dt>
                        <dd>선택하신 일자는 확정일이 아니며, 기관과의 협의에 따라 변경될 수 있습니다.</dd>
                        <dd>방문일 및 시간은 기관으로부터 개별연락 시 스케줄 확인 후 확정될 예정입니다.</dd>
                        <dd>스크리닝은 시험대상자별로 한 번만 진행됩니다.</dd>

                        <div className="mt30 flex-align">
                            <div>방문 희망일</div>
                            <div className="flex-wrap gap5x ml16">
                                <Datepicker name='screeningDate' value={screeningDate} setDate={setScreeningDate} disable={screeningDateDisable} placeholderText="YYYY-MM-DD" maxYearAdd={10}/>
                            </div>
                            {
                                ! isRecruit ?
                                    <span className="data-not">&#40;모집 기간이 아닙니다.&#41;</span>
                                    : ''
                            }

                        </div>

                        <dt className="mb6">방문 시간</dt>
                        <div className="flex-wrap gap5x" onClick={onSelectTime} >
                            {
                                times?.length > 0 ? 
                                times?.map((timeBtn , index) => {
                                    return(
                                        <button key={index} 
                                                type="button" 
                                                className={`btn-square h32x ${params?.screeningTime === timeBtn?.value ? 'fill' : ''}`}
                                                id={timeBtn?.value}
                                                onClick={onSelectTime}
                                                disabled={!params?.screeningDate}
                                        >
                                            {timeBtn?.label}
                                        </button>
                                    )
                                })
                                : ''
                            }
                            
                        </div>
                    </dl>
                        :
                        <div className="linebar">
                            <div className="nodata">방문 기관을 먼저 선택해 주세요.</div>
                        </div>
                }
                
            </div>
        </div>
    );
};

export default ComponentScreening;