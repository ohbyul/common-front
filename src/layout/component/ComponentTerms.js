import React, { useEffect, useState } from 'react';
import { AlertDialogOverlay } from '@reach/alert-dialog';
import { actionGetTerms } from '../../modules/action/MemberAction';
const ComponentTerms = (props) => {
    let {
        termsType,
        setShowModal
    } = props;
    const [ termsList , setTermsList ] = useState(); //이력의 전체 리스트
    
    useEffect(()=> {
        
        let data = {
            termsTypeCd: 'MEMBER',
            termsKindCd: termsType
        }
        if (termsType === 'SERVICE') {
            actionGetTerms(data).then((res) => {
                if (res.statusCode == "10000") {
                    const termsData = res.data;
                    
                    setTermsList(termsData.contents);
                }
            })
        }
        else if (termsType == 'PRIVACY') {
            actionGetTerms(data).then((res) => {
                const termsData = res.data;
                if (res.statusCode == "10000") {
                    setTermsList(termsData.contents);
                }
            })
        }
    },[])
    
    return (
        <AlertDialogOverlay>
            <div className="popup-layer">
                <div className="popup-content popup-terms">
                    <div className="popup-header">
                        <div className="popup-title">
                            { termsType == "SERVICE" ? "이용약관" :  "개인정보처리방침" }
                        </div>
                        <button type="button" className="popup-cls" onClick={()=>setShowModal(false)}>팝업닫기</button>
                    </div>
                    <div className="popup-body">
                        <div className="rejection">
                            <span className="ql-editor" dangerouslySetInnerHTML={{ __html: termsList}}></span>
                        </div>
                    </div>
                    <div className="popup-footer">
                        <button type="button" className="btn-square" onClick={()=>setShowModal(false)}>닫기</button>
                    </div>
                </div>
            </div>
        </AlertDialogOverlay>
    );
};

export default ComponentTerms;