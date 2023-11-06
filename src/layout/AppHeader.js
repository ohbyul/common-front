import React, { useEffect, useRef, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Link, withRouter } from "react-router-dom"
import { LOGIN_MEMBER } from "../modules/action/actionTypes";

import { getCookie, setCookie, removeCookie, decodeJwt } from "../utiles/cookie";

import ConfirmDialogComponent from "../views/components/ConfirmDialogComponent";


const AppHeader = (props) => {
    const dispatch = useDispatch();
    //--------------- session ---------------
    const path = location.pathname;
    const token = getCookie("dtverseMember");
    const memberInfo = decodeJwt("dtverseMember");
    //--------------- session ---------------

    //--------------- confirm ---------------
    const cancelRef = React.useRef();
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [confirmDialogObject, setConfirmDialogObject] = useState({
        description: "",
        leftText: "",
        rightText: "",
        leftClick: null,
        rightClick: null
    })
    //--------------- confirm ---------------
    // 드롭다운
    const modalRef = useRef(null);
    const [dropdown, setDropdown] = useState(false)
    const toggleDrop = e => {
        if (dropdown && (!modalRef.current || !modalRef.current.contains(e.target))) setDropdown(false)
    }
    useEffect(() => {
        window.addEventListener('click', toggleDrop);
        return () => {
            window.removeEventListener('click', toggleDrop);
        }
    })


    // 로그아웃
    const onLogout = () => {
        setConfirmDialogObject({
            description: ["로그아웃 하시겠습니까?"],
            leftText: "확인",
            rightText: "취소",
            leftClick: () => {
                setShowConfirmDialog(false);
                hadleLogout()
            },
            rightClick: () => {
                setShowConfirmDialog(false);
            },
        })
        setShowConfirmDialog(true)
    }

    const hadleLogout = () => {
        dispatch({ type: LOGIN_MEMBER, memberInfo: null })          //redux 세팅
        removeCookie("dtverseMember");
        sessionStorage.clear();
        window.location.replace("/")
    }
    const pageLoad = (url) => url.includes(path) ? (window.location = url) : props.history.push(url)
    return (
        <div id="header">
            <div className="header-layer">
                <div className="header-logo">
                    <Link to="/"><img src="/images/logo.svg" /></Link>
                </div>
                <div className="header-grid">
                    <ul className="header-gnb">
                        <li>
                            <div>DTx 임상시험 안내</div>
                            <ul className="header-lnb">
                                <li onClick={() => pageLoad("/dtx/info")}>DTx 임상시험이란?</li>
                                <li onClick={() => pageLoad("/dtx/procedureguidance")}>참여절차 안내</li>
                                {/* <li><a>메타버스 안내</a></li> */}
                            </ul>
                        </li>
                        <li>
                            <div>DTx 임상 모집공고</div>
                            <ul className="header-lnb">
                                <li onClick={() => pageLoad("/project")}>모집공고</li>
                            </ul>
                        </li>
                        <li>
                            <div>고객센터</div>
                            <ul className="header-lnb">
                                <li onClick={() => pageLoad("/cs/notice")}>공지사항</li>
                                <li onClick={() => pageLoad("/cs/faq")}>자주하는 질문</li>
                                <li onClick={() => pageLoad("/cs/inquiry")}>이용문의</li>
                            </ul>
                        </li>
                    </ul>
                    <div className="gnb-bg"></div>
                </div>
                {
                    token ?
                        <ul className="header-utility">
                            {/* active 화살표 토글*/}
                            <li className={`user ${dropdown ? 'active' : ''}`} onClick={() => setDropdown(!dropdown)}>
                                <div><span>{memberInfo?.memberNm}</span> 님</div>
                                {/* opened 드롭다운 토글*/}
                                {dropdown &&
                                    <ul className="dropdown-list opened" ref={modalRef}>
                                        <li onClick={() => pageLoad("/mypage/project")} className="">마이페이지</li>
                                        <li className=""><a onClick={onLogout}>로그아웃</a></li>
                                    </ul>
                                }

                            </li>

                        </ul>
                        :
                        <ul className="header-utility">
                            <li className='icon join' onClick={() => pageLoad("/sign-up")}>회원가입 </li>
                            <li className='icon login' onClick={() => pageLoad("/login")}>로그인</li>
                        </ul>
                }

                {/* confirm */}
                {
                    showConfirmDialog &&
                    <ConfirmDialogComponent cancelRef={cancelRef} description={confirmDialogObject.description}
                        leftText={confirmDialogObject.leftText}
                        rightText={confirmDialogObject.rightText}
                        leftClick={confirmDialogObject.leftClick}
                        rightClick={confirmDialogObject.rightClick} />
                }
                {/* confirm */}
            </div>

        </div>
    )

}

export default withRouter(AppHeader)
