import React, { useEffect, useState } from 'react';
import { AlertDialogOverlay } from '@reach/alert-dialog';
import DaumPostcode from 'react-daum-postcode';

const ModalAdress = (props) => {
    let { cancelRef, setShowModal 
        , onSelectAddress
    } = props

    return (
        <AlertDialogOverlay >
            <div className="popup-layer">
                <div className="popup-content">
                    <div className="popup-header">
                        <div className="popup-title">우편번호 찾기</div>
                        <button type="button" className="popup-cls" onClick={()=>setShowModal(false)}>팝업닫기</button>
                    </div>
                    <div className="popup-body">
                        <div id='popupDom'>
                            <DaumPostcode
                                onComplete={onSelectAddress}    // 값을 선택할 경우 실행되는 이벤트
                                autoClose={true}               // 값을 선택할 경우 사용되는 DOM을 제거하여 자동 닫힘 설정
                                defaultQuery=''                 // 팝업을 열때 기본적으로 입력되는 검색어 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AlertDialogOverlay>
    );
};

export default ModalAdress;