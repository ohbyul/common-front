import React, { useEffect, useState } from 'react';
import { actionGetScreeningHistory } from '../../../../../../modules/action/ScreeningAction';
import { dateTimeFormat } from '../../../../../../utiles/date';

const ComponentScreening = (props) => {
    let { subject , projectId } = props

    const [ history , setHistory ] = useState([])
    const [totalCount, setTotalCount] = useState(0)

    useEffect(()=>{
        if(projectId && subject){
            funcGetScreeningHistory()
        }
    },[projectId,subject])

    const funcGetScreeningHistory = () => {

        let params = {
            id: projectId,
            subjectId : subject?.id
        }
        actionGetScreeningHistory(params).then((res) => {
            if (res.statusCode == "10000") {
                // console.log(res.data);
                setHistory(res.data)
                setTotalCount(res.data.length)
            }
        })
    }


    return (
        <div className='breakpoint'>
            <div className="balance"><div className="txt-title">방문예약 정보</div></div>
            <div className="mypage-info-box">
                <table className="project-table">
                    <colgroup><col /><col /><col /><col /></colgroup>
                    <tbody>
                        <tr>
                            <th className="txt-center">예약상태</th>
                            <td colSpan={3}>{subject?.screening?.statusCdNm}</td>
                        </tr>
                        <tr>
                            <th className="txt-center">스크리닝 기관</th>
                            <td>{subject?.screening?.organizationNm}</td>
                            <th className="txt-center">스크리닝 일정</th>
                            <td>{subject?.screening?.screeningDate} {subject?.screening?.screeningTime}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className='standard'>
                <div className="sub-accordion-box">
                    <div className="txt-title">방문예약 이력</div>
                    <div className="accordion">
                        <input type='checkbox' name='accordion' id="SCREENINGHISTORY" />
                        <label htmlFor="SCREENINGHISTORY"><span></span></label>
                    </div>
                </div>
                <div className="mypage-info-box hide">
                    <div className="con-list history">
                        <div className="board-total">전체 <span>{totalCount}</span></div>
                        <table className="default txt-center">
                            <colgroup>
                                <col style={{ "width": "4%" }} />
                                <col style={{ "width": "17%" }} />
                                <col style={{ "width": "17%" }} />
                                <col style={{ "width": "8%" }} />
                                <col style={{ "width": "17%" }} />
                                <col style={{ "width": "17%" }} />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>기관</th>
                                    <th>스크리닝 일정</th>
                                    <th>상태</th>
                                    <th>처리자</th>
                                    <th>처리일시</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    history?.length > 0 ?
                                    history?.map((item,index)=>{
                                        let screeningRequest
                                        if (item.requestTypeCd == "RESEARCHER") {
                                            screeningRequest = item.requestTypeCdNm + ` [${item.changeUserNm}]`
                                        } else if(item.requestTypeCd == "APPLICANT") {
                                            screeningRequest = item.requestTypeCdNm + ` [${item.changeMemberNm}]`
                                        }
                                        return(
                                            <tr key={index}>
                                                <td>{totalCount-(index)}</td>
                                                <td>{item?.organizationNm}</td>
                                                <td>{item?.screeningDate} {item?.screeningTime}</td>
                                                <td>{item?.statusCdNm}</td>
                                                <td>{screeningRequest}</td>
                                                <td>{dateTimeFormat(item?.changeDtm)}</td>
                                            </tr>
                                        )
                                    })
                                    : <tr><td colSpan="6">방문예약 이력이 존재하지 않습니다.</td></tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComponentScreening;