import React from 'react';
import ComponentCounselHistory from './components/ComponentCounselHistory';
import ComponentCounsel from './components/ComponentCounsel';

const PageCounsel = (props) => {
    return (
        <div className="tab-untact">
            <div className="mb30">
                <div className="balance"><div className="txt-title">비대면상담 안내</div></div>
                <ul className="infor-report gray100">
                    <li className="dot-txt">비대면상담은 임상시험을 진행하면서 주기적으로 시험대상자의 상태를 파악하고 기록하기 위한 상담입니다.</li>
                    <li className="dot-txt">DTx 앱 사용에 관해 문의가 필요할 경우, 모집공고의 앱 관련 안내를 확인, 또는 1:1 문의를 통해 문의하시기 바랍니다.</li>
                </ul>
            </div>

            <ComponentCounsel {...props} />
            
            <ComponentCounselHistory {...props}/>

        </div>
    );
};

export default PageCounsel;