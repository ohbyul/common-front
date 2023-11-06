import React, { useEffect, useState } from 'react';
import { actionGetCounselHistory } from '../../../../../../modules/action/CounselAction';
import moment from 'moment';
import { dateFormat, dateTimeFormat, dateTimeSubtract, getCurrentDate, hourFormat } from '../../../../../../utiles/date';

const ComponentCounselHistory = (props) => {
    let { subject , isReject, projectId ,subjectId, onGetCounselList } = props

    const [ counsel , setCounsel ] = useState([])
    const [totalCount, setTotalCount] = useState(0)
    const nowTime = dateTimeFormat(getCurrentDate())
    const [ counselTotalTime , setCounselTotalTime ] = useState({hour : 0 , min : 0})

    useEffect(()=>{
        if(projectId ){
            funcGetCounselHistory()
        }
    },[projectId])


    const funcGetCounselHistory = () => {
        let params = {
            id: projectId,
            subjectId : subjectId,
        }
        actionGetCounselHistory(params).then((res) => {
            if (res.statusCode == "10000") {
                // console.log(res.data);
                let result = res.data

                // 필터
                let temp = []
                for(let item of result){
                    const counselDateTime =item.applyCounselDate + ' ' +item.applyCounselTime
                    const pass30minTime = moment(counselDateTime).add(30,'minutes').format('YYYY-MM-DD HH:mm:ss')
                    // const isPass = counselDateTime < nowTime && pass30minTime > nowTime ? true : false
                    const isCheck =  pass30minTime < nowTime ? true : false
                    const isCancel = item.statusCd === 'CANCEL' ? true : false
                    const isComplete = item.statusCd === 'COMPLETE' ? true : false

                    if(isCheck || isCancel || isComplete){
                        temp.push(item)
                    }
                }
                
                setCounsel(temp)
                setTotalCount(temp.length)

                // 총 상담시간 계산
                let totalTimeMin = 0
                const counselArr = temp?.filter((x=>x.statusCd === 'COMPLETE'))   

                counselArr?.map((item =>{
                    const subtractMin= dateTimeSubtract(item.counselStartDtm,item.counselEndDtm)
                    totalTimeMin = totalTimeMin+subtractMin
                }))
                const hour = Math.floor(totalTimeMin/60)
                const min = (totalTimeMin%60).toFixed(0)
                setCounselTotalTime({hour : hour , min : min})
            }
        })
    }
    return (
        <div className="mb30">
            <div className="balance"><div className="txt-title">비대면상담 이력</div></div>
            <div>
                <div className="board-total">전체 <span>{totalCount}</span></div>
            </div>
            <table className="default txt-center">
                <colgroup className="untactdetail-col">
                    <col /><col /><col /><col /><col /><col /><col /><col /><col />
                </colgroup>
                <thead>
                    <tr>
                        <th>회차</th>
                        <th>요청자</th>
                        <th>연구간호사</th>
                        <th>신청사유</th>
                        <th>진행여부</th>
                        <th>상담일자</th>
                        <th>상담시작일자</th>
                        <th>상담완료일자</th>
                        <th>상담시간</th>
                    </tr>
                </thead>
                <tbody>
                {
                    counsel?.length > 0 ? 
                    counsel?.map((item , index)=>{
                        const counselDateTime =item.applyCounselDate + ' ' +item.applyCounselTime
                        const pass30minTime = moment(counselDateTime).add(30,'minutes').format('YYYY-MM-DD HH:mm:ss')
                        const isPass = counselDateTime < nowTime && pass30minTime > nowTime ? true : false

                        let status = item.statusCdNm
                        if(item.statusCd === 'RESERVATION' && !isPass){
                            status = '미진행'
                        }
                        
                        // 상담시간
                        const subtractMin= dateTimeSubtract(item.counselStartDtm,item.counselEndDtm)
                        const hour = Math.floor(subtractMin/60)
                        const min = (subtractMin%60).toFixed(0)
                        return(
                            <tr key={index}>
                                <td>{totalCount-index}</td>
                                <td className='txt-left' >
                                    <span>{ item?.requestTypeCd === 'APPLICANT' ? '신청자 ' : item?.requestTypeCd === 'RESEARCHER' ? '연구원 ' : '' }</span>
                                    [{ item?.requestTypeCd === 'APPLICANT' ? item?.subjectNm : item?.writeUserNm}]
                                </td>
                                <td>{item.participantNm}</td>
                                <td>{item.applyReasonCdNm}</td>
                                <td>{status}</td>
                                <td>
                                    <span className="signchk">
                                        <span>{dateFormat(`${item.applyCounselDate} ${item.applyCounselTime}`)}</span>
                                        <span>{hourFormat(`${item.applyCounselDate} ${item.applyCounselTime}`)}</span>
                                    </span>
                                </td>
                                <td>
                                    <span className="signchk">
                                        <span>{dateFormat(item.counselStartDtm)}</span>
                                        <span>{hourFormat(item.counselStartDtm)}</span>
                                    </span>
                                </td>
                                <td>
                                    <span className="signchk">
                                        <span>{dateFormat(item.counselEndDtm)}</span>
                                        <span>{hourFormat(item.counselEndDtm)}</span>
                                    </span>
                                </td>
                                <td>
                                    {
                                        subtractMin ? 
                                            `${hour}시간 ${min}분`
                                            : ''
                                    }
                                </td>
                            </tr>
                        )
                    })
                    : <tr><td colSpan={9}>비대면 이력이 존재하지 않습니다.</td></tr>
                }
                </tbody>
            </table>
            <div className="time-total">총 상담시간 <span>{counselTotalTime?.hour}시간 {counselTotalTime?.min}분</span></div>
        </div>
    );
};

export default ComponentCounselHistory;