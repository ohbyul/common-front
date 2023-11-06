import React, { useState } from "react";
import { getCookie, decodeJwt } from '../../../utiles/cookie';
import ConfirmDialogComponent from '../../components/ConfirmDialogComponent';

const Inquiry = (props) => {
    const path = location.pathname;
    const useLocation = path.substring(1)

    const token = getCookie("dtverseMember");
    const memberInfo = decodeJwt("dtverseMember");

    //------------------ confirm -----------------
    const cancelRef = React.useRef();
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [confirmDialogObject, setConfirmDialogObject] = useState({
        description: '',
        leftText: '',
        rightText: '',
        leftClick: null,
        rightClick: null
    })
    //------------------ confirm -----------------


    const oninquiry = () => {
        if (token && memberInfo) {
            props.history.push('/cs/inquiry/write')
        } else {
            onLoginPage()

        }
    }

    // 로그인 유무
    const onLoginPage = () => {
        setConfirmDialogObject({
            description: ['로그인 후 이용 가능합니다.', '로그인 페이지로 이동하시겠습니까?'],
            leftText: '확인',
            rightText: '취소',
            leftClick: () => {
                setShowConfirmDialog(false);
                props.history.push(`/login?referer=${useLocation}`)
            },
            rightClick: () => {
                setShowConfirmDialog(false);
            },
        })
        setShowConfirmDialog(true)
    }
    return (
        <>
            <div className="section-wrap">
                <div className="header-bg"></div>
                <div>
                    <div className="inventory">
                        <div>
                            <div className="h1">이용문의</div>
                            <div className="subtxt">DTx 임상 프로젝트는 DTVERSE와 함께 하세요.</div>
                        </div>
                    </div>
                </div>

                <div className="con-body">
                    <div className="detail-info">

                        <div className="line-box mb32">
                            <div className="dot-txt tit">본 이용문의는 DTVERSE 이용관련 문의로 임상 모집공고에 대한 상세 문의는 해당 모집공고 ‘1:1문의’를 통해서 문의 주시기 바랍니다.</div>
                            <div className="dot-txt tit">이용문의는 회원에 한하여 이용 가능하며, 비회원이신 경우 이메일문의 또는 회원가입 후 온라인문의를 이용해 주시기 바랍니다.</div>
                            <div className="dot-txt tit">이용문의 전 ‘고객센터&#62;자주하는 질문’에서 다양하고 신속한 안내를 확인하실 수 있습니다.</div>
                            <div className="dot-txt tit">이용문의에 대한 답변은 ‘마이페이지&#62;문의내역&#62;이용문의’에서 확인 가능합니다.</div>
                            <div className="dot-txt tit">문의주신 사항에 대한 답변은 빠른 시일 내로 답변 드리도록 하겠습니다.</div>
                        </div>


                        <div className="grid col-2x gap36x ask-box">
                            <div>
                                <div className="subtitle3-font">이메일 문의 안내</div>
                                <div className="require">dtverse@urbancorp.co.kr</div>
                                <dl>
                                    <dd className="hyphen">비회원 문의는 이메일 문의를 통해서 문의 주시기 바랍니다.</dd>
                                    <dd className="hyphen">회원가입 후 이용문의를 이용하시면 더욱 편리하게 문의 가능하십니다.</dd>
                                </dl>
                            </div>
                            <div>
                                <div className="subtitle3-font">문의하기</div>
                                <div className="grid col-2x gap8x">
                                    <button className="btn-square more" onClick={() => props.history.push('/cs/faq')}>자주하는 질문</button>
                                    <button className="btn-square more" onClick={() => oninquiry()}>1:1문의</button>
                                </div>
                                <dl>
                                    <dd className="hyphen">‘자주하는 질문’을 통해서 다양한 문의 및 답변을 확인하실 수 있습니다.</dd>
                                    <dd className="hyphen">‘문의하기’는 로그인 후 이용 가능합니다.</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            {/* alert */}
            {
                showConfirmDialog &&
                <ConfirmDialogComponent cancelRef={cancelRef} description={confirmDialogObject.description}
                    leftText={confirmDialogObject.leftText}
                    rightText={confirmDialogObject.rightText}
                    leftClick={confirmDialogObject.leftClick}
                    rightClick={confirmDialogObject.rightClick} />
            }
            {/* alert */}
        </>
    );
};

export default Inquiry;