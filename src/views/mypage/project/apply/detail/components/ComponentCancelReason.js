import React from 'react';
import { dateTimeFormat } from '../../../../../../utiles/date';

const ComponentCancelReason = (props) => {
    let { subject } = props

    return (
        <>
        {
            subject?.statusCd === 'CANCEL' ? 
            <div className='breakpoint'>
                <div className="balance"><div className="txt-title">참여취소 사유</div></div>
                <div className="mypage-info-box">
                    <table className="project-table">
                        <colgroup><col /><col /><col /><col /></colgroup>
                        <tbody>
                            <tr>
                                <th className="txt-center">취소사유</th>
                                <td colSpan="3">
                                    {subject?.cancelReasonCdNm}
                                    { 
                                        subject?.cancelReasonCd === '9999' ?
                                            `( ${subject?.cancelReasonEtc} )`
                                        : ''
                                    }
                                </td>
                            </tr>
                            <tr>
                                <th className="txt-center">취소자</th>
                                <td>
                                    { subject?.cancelerTypeCd === 'APPLICANT' ? '신청자 ' : subject?.cancelerTypeCd === 'RESEARCHER' ? '연구원 ' : '' }
                                    [{ subject?.cancelerTypeCd === 'APPLICANT' ? subject?.subjectNm : subject?.cancelUserNm}]
                                </td>
                                <th className="txt-center">처리일시</th>
                                <td>{dateTimeFormat(subject?.cancelDtm)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div> 
            :
            <div className='breakpoint'>
                <div className="balance"><div className="txt-title">탈락처리</div></div>
                <div className="mypage-info-box">
                    <table className="project-table">
                        <colgroup><col /><col /><col /><col /></colgroup>
                        <tbody>
                            <tr>
                                <th className="txt-center">탈락사유</th>
                                <td colSpan="3">{subject?.rejectReason}</td>
                            </tr>
                            <tr>
                                <th className="txt-center">탈락처리자</th>
                                <td>연구원[{subject?.rejectUserNm}]</td>
                                <th className="txt-center">탈락일시</th>
                                <td>{dateTimeFormat(subject?.rejectDtm)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        }
        </>
    );
};

export default ComponentCancelReason;