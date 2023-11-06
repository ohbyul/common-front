import React from 'react';

const ComponentCompletePw = (props) => {
    const onLogIn = () => {
        props.history.push('/login')
    }

    const onFirst = () => {
        // props.history.push('/find')
        location.reload();
    }

    return (
        <div className="tab">
            <div className="find-header">
                비밀번호 재설정이 완료되었습니다.<br />
                재설정한 비밀번호로 로그인 해 주시기 바랍니다.
            </div>
            <div className="find-body"></div>
            <div className="con-footer">
                <div>
                    <button type="button" className="btn-circle" onClick={onFirst}>처음으로</button>
                    <button type="button" className="btn-circle fill" onClick={onLogIn}>로그인</button>
                </div> 
            </div>
        </div>
    );
};

export default ComponentCompletePw;