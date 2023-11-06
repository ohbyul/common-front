import React from 'react';


const ComponentJoinComplete = (props) => {
    const onNextStep = () => {
        props.history.push('/')
    }
    return (
        <>
            <div className="con-body">
                <div className="mant">
                    <div className="join_final"></div>
                    <div>회원가입이 완료 되었습니다.</div>
                        <ul>
                            <li className="dot">이제부터 DTVERSE의 모든 서비스를 이용하실 수 있습니다.</li>
                            <li className="dot">홈페이지 이용에 대한 문의사항은 고객센터를 통해 문의 주시기 바랍니다.</li>
                            <li className="dot">서비스 이용을 원하시는 경우, <span>로그인</span>해 주시기 바랍니다.</li>
                        </ul>
                </div>
            </div>
            <div className="con-footer">
                <div>
                    <button type="button" className="btn-circle" onClick={onNextStep}>메인화면</button>
                    <button type="button" className="btn-circle fill" onClick={()=> {props.history.push('/login')}}>로그인</button>
                </div>
            </div>
        </>
    )
}

export default ComponentJoinComplete