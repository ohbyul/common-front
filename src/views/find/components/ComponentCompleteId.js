import React from 'react';

const ComponentCompleteId = (props) => {
    const { findInfo } = props 
    const onLogIn = () => {
        props.history.push('/login')
    }
    const onFirst = () => {
        // props.history.push('/find')
        location.reload();
    }
    return (
        <>
            <div className="tab">
                <div className="find-header">고객님의 정보와 일치하는 아이디입니다.</div>
                <div className='find-body'>
                    <div className="certify-find">
                        <div className="required">아이디</div>
                            <div>
                                <input type="text" value={findInfo?.memberId} disabled  />
                            </div>
                            <div className="comment">가입일 : {findInfo?.memberJoinDate} </div>
                    </div>
                </div>
                <div className="con-footer">
                    <div>
                        <button type='button' className='btn-circle' onClick={onFirst}>처음으로</button>
                        <button type='button' className='btn-circle fill' onClick={onLogIn}>로그인</button>
                    </div>
                </div>
            </div>
            
        </>
    );
};

export default ComponentCompleteId;