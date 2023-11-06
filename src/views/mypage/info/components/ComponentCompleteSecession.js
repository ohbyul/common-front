import React, { useEffect, useState } from 'react';

const ComponentCompleteSecession = (props) => {
    return(
        <>
            <div>
                <div>
                    <div className="inventory">
                        <div>
                            <div className="h1">회원탈퇴 완료</div>
                        </div>
                    </div>
                    <div className="detail-info quit mt50">
                        <div className="final-img"></div>
                        <div className="txt-title txt-center">
                            그 동안 DTVERSE를 이용해주셔서 감사합니다.<br />
                            다음기회에 DTVERSE를 다시 찾아주세요.
                        </div>
                    </div>
                </div>
                <div className="con-footer">
                    <div>
                        <button type="button" className="btn-circle fill" onClick={()=>props.history.push('/')}>메인으로</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ComponentCompleteSecession;