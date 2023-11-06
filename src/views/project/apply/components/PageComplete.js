import React from 'react';
import { dateFormat, getCurrentDate } from '../../../../utiles/date';

const PageComplete = (props) => {
    let {projectInfo} = props
    const today = dateFormat(getCurrentDate())
    return (
        <>
            <div className="mant">
                <div className="project-final"></div>
                <div>임상시험 참여 신청이 완료 되었습니다.</div>
                <div>
                    추후 시험대상자로 선발될 경우, 별도 안내될 예정이오니<br />
                    안내에 따라 참여해 주시기 바랍니다.
                </div>
            </div>
            <div className="detail-info">
                <div className="balance">
                    <div className="txt-title">참여신청 임상시험 정보</div>
                </div>
                <div className="line-box">
                    <div className="grid locate-3x gap40x">
                        <div className="dot-txt tit">공고제목</div>
                        <div>{projectInfo?.postTitle}</div>
                    </div>
                    <div className="grid locate-3x gap40x">
                        <div className="dot-txt tit">신청일</div>
                        <div>{today}</div>
                    </div>
                </div>
            </div>
            <div className="detail-info">
                <div className="balance">
                    <div className="txt-title">참고사항</div>
                </div>
                <div className="line-box">
                    <div className="grid">
                        <div className="dot-txt tit">대상자로 선발되시는 경우 해당 기관에서 개별적으로 연락이 갈수 있으니, 전화 또는 문자를 잘 확인해 주시기 바랍니다.</div>
                        <div className="dot-txt tit">일정 변경 또는 기타 문의사항이 있는 경우, 해당 기관의 문의전화를 통해 연락 부탁 드립니다.</div>
                        <div className="dot-txt tit">임상관련 문의는 'DTVERSE &#62; 마이페이지 &#62; 신청내역 &#62; 1:1문의'를 통해서도 가능합니다.</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PageComplete;