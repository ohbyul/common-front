import React, { useEffect, useState, useRef } from "react";
import { KEYWORD, getCodeOption } from "../../../utiles/code";
import { NotSpace, regex_mobile, regex_mobile_input, regex_pwd, onlyKorEng } from "../../../utiles/regex";
import Datepicker from "../../components/picker/Datepicker";
import SelectBox from "../../components/SelectBox";
import { actionCreateAuthCode, actionGetAuthCode, actionGetMemberInfo, actionUpdateMember } from "../../../modules/action/MemberAction";
import { decodeJwt } from "../../../utiles/cookie";
import { actionGetCodeList } from "../../../modules/action/CommonAction";
import ModalAdress from "../../components/address/ModalAdress";
import { requiredValueCheck } from "../../../utiles/common";
import { getWesternAge } from "../../../utiles/date";

const MyProfile = (props) => {
    //--------------- session ---------------
    const memberInfo = decodeJwt("dtverseMember");
    //--------------- session ---------------
    const memberId = memberInfo?.memberId
    //[1] myInfo
    const [myInfo, setMyInfo] = useState({
        memberNm: '',
        birth: '',
        gender: '',
        memberId: '',
        memberPwd: '',
        memberPwdChk: '',

        mobileNo: '',
        phoneNo: '',
        email: '',
        zipCode: '',
        address: '',
        addressDetail: '',
        keywordList: [],
    })
    //[1-2] authInfo
    const [authInfo, setAuthInfo] = useState({
        loginId: null,
        mobileNo: null,
        authMobileNo: null,                //휴대폰 인증번호
        authType: 'mobile',           //인증 타입
    })
    // modal on/off - 주소
    const cancelModalRef = React.useRef();
    const [showModal, setShowModal] = useState(false);
    const [isChange, setIsChange] = useState(false)

    const [keywordList, setKeywordList] = useState() //키워드cd
    const [directInput, setDirectInput] = useState({ value: '', disabled: true })  //직접입력 키워드
    //[1-1] datepicker 
    const [birth, setBirth] = useState('');
    const [birthDisable, setBirthDateDisable] = useState(false)
    //[1-2] selectBox
    const [genderCode, setGenderCode] = useState([])
    const [gender, setGender] = useState('')
    //[1-3] validation
    const [error, setError] = useState({
        mobileNo: { error: null, msg: null, class: '', isAuth: false, isAuthComplete: false },
        authMobileNo: { error: null, msg: null, class: '' },
        memberPwd: { error: null, msg: null, class: '' },
        memberPwdChk: { error: null, msg: null, class: '' },
    })

    // 키워드
    useEffect(() => {
        let data = {
            groupCd: KEYWORD
        }
        actionGetCodeList(data).then(res => { if (res) setKeywordList(res.data) })
    }, [])

    //성별 
    useEffect(() => {
        let data = {
            groupCd: 'GENDER',
            default: '선택'
        }
        getCodeOption(data).then(res => { if (res) setGenderCode(res) })
    }, [])

    //출력 데이터 
    useEffect(() => {
        if (memberId && keywordList) {
            funcGetMyInfo()
        }
    }, [memberId, keywordList])

    //[2] 데이터 출력
    const funcGetMyInfo = () => {
        let params = {
            memberId: memberId
        }
        actionGetMemberInfo(params).then((res) => {
            if (res.statusCode == "10000") {
                let result = res.data

                setAuthInfo({ ...authInfo, loginId: result?.loginId })
                // String -> 배열 파싱 
                result.keywordList = JSON.parse(result.keywordList) ?? []
                result.memberId = result.loginId
                result.memberPwd = ''
                result.memberPwdChk = ''

                setMyInfo({ ...myInfo, ...result })
                // 기존 데이터 존재시 세팅
                //select
                setGender(result?.gender)
                //data
                setBirth(result?.birthDate)
                //keyword
                let directInput = result?.keywordList?.filter(x => !keywordList?.find(item => item.commCd === x))[0]
                let isDirect = result?.keywordList?.filter(x => !keywordList?.find(item => item.commCd === x)).length > 0 ? true : false
                if (isDirect) {
                    setDirectInput({ ...directInput, value: directInput, disabled: false })
                }
            }
        })
    }

    //[3] 입력 데이터 셋팅
    const handleChange = (e) => {
        const value = e.target.value
        switch (e.target.name) {
            case 'memberPwd':
                setMyInfo({ ...myInfo, memberPwd: value.replace(NotSpace, '') })
                break;
            case 'memberPwdChk':
                setMyInfo({ ...myInfo, memberPwdChk: value.replace(NotSpace, '') })
                break;
            case 'memberNm':
                setMyInfo({ ...myInfo, memberNm: value.replace(onlyKorEng, '') })
                setAuthInfo({ ...authInfo, memberNm: value.replace(onlyKorEng, '') })
                break;
            case 'mobileNo':
                const mobileValue = value.replace(NotSpace, '').replaceAll('-', '')
                if (regex_mobile_input.test(value)) {
                    if (mobileValue.length <= 11) {
                        setMyInfo({ ...myInfo, mobileNo: mobileValue })
                        setAuthInfo({ ...authInfo, mobileNo: mobileValue })
                    }
                }
                break;
            case 'addressDetail':
                setMyInfo({ ...myInfo, addressDetail: e.target.value })
                break;
            case 'authMobileNo':
                setAuthInfo({ ...authInfo, authMobileNo: e.target.value.replace(NotSpace, '') })
                break;
            case 'directInput':
                // 직접입력 글자 제한 15자
                if (e.target.value.length < 16) {
                    setDirectInput({ ...directInput, value: e.target.value, disabled: false })
                    let keyword = myInfo?.keywordList
                    let temp = keyword?.map((item) => {
                        if (!keywordList?.find(x => x.commCd === item)) {
                            return e.target.value
                        } else {
                            return item
                        }
                    })
                    setMyInfo({ ...myInfo, keywordList: temp })
                }
                break;
            case 'phoneNo':
                setMyInfo({ ...myInfo, phoneNo: e.target.value })
                break;
            case 'email':
                setMyInfo({ ...myInfo, email: e.target.value })
        }
    }

    const onKeyword = (e) => {
        const clickNm = e.target.name
        const select = clickNm === 'write' ? directInput?.value : clickNm
        let keywords = myInfo?.keywordList ?? []
        const isInclude = keywords?.includes(select) ? true : false

        if (!isInclude) {
            if (keywords?.length >= 3) {
                props.funcAlertMsg('키워드는 최대 3대까지 선택 가능합니다.')
                return
            }
            if (clickNm === 'write') {
                setDirectInput({ ...directInput, disabled: false })   //활성화
            }
            keywords.push(select)
        } else {
            if (clickNm === 'write') {
                setDirectInput({ ...directInput, value: '', disabled: true })   //초기화
            }
            keywords = keywords.filter(item => item !== select)
        }
        setMyInfo({ ...myInfo, keywordList: keywords })
    }

    useEffect(() => {
        setMyInfo({
            ...myInfo,
            birth: birth,
            gender: gender,
        })
    }, [birth, gender])

    //[4] validation
    useEffect(() => {
        if (isChange) {
            const mobile = myInfo?.mobileNo;
            let mobileError         //핸드폰 에러

            if (mobile == '') {
                mobileError = { error: null, msg: null, class: '', isAuth: false, isAuthComplete: false }
            } else {
                let temp = mobile
                if (mobile?.length === 10) {
                    temp = mobile.replace(/-/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
                } else
                    if (mobile?.length === 11) {
                        temp = mobile.replace(/-/g, '').replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
                    }

                if (!regex_mobile.test(temp)) {
                    mobileError = { error: true, msg: '올바른 휴대폰 번호 형식이 아닙니다.', class: 'warning' }
                } else {
                    mobileError = { error: false, msg: '사용 가능한 휴대폰 번호입니다.', class: 'confirm', isAuth: false, isAuthComplete: false }
                }
            }
            setError({ ...error, mobileNo: mobileError })
        }
    }, [myInfo?.mobileNo])

    useEffect(() => {
        const pw = myInfo?.memberPwd;
        const checkPw = myInfo?.memberPwdChk;

        let pwd         //비밀번호 에러
        let pwdChk      //비밀확인 에러

        if (!pw || pw == '') {
            pwd = { error: null, msg: null, class: '' }
        } else {
            if (!regex_pwd.test(pw)) {
                pwd = { error: true, msg: '영문자, 숫자, 특수문자 중 2종류 조합으로 8~16자리', class: 'warning' }
            } else {
                pwd = { error: false, msg: '사용 가능한 비밀번호입니다.', class: 'confirm' }
            }
        }

        if (!checkPw || checkPw == '') {
            pwdChk = { error: null, msg: null, class: '' }
        } else {
            if (pw === checkPw) {
                pwdChk = { error: false, msg: '비밀번호가 일치합니다.', class: 'confirm' }
            } else {
                pwdChk = { error: true, msg: '비밀번호가 일치하지 않습니다.', class: 'warning' }
            }
        }

        setError({ ...error, memberPwd: pwd, memberPwdChk: pwdChk })

    }, [myInfo?.memberPwd, myInfo?.memberPwdChk])

    // [5] 인증  ---------------------------------------------
    const onModifyMobileNo = () => {
        setIsChange(!isChange)
        let mobileError = { error: false, msg: null, class: '', isAuth: false, isAuthComplete: false }
        setError({ ...error, mobileNo: mobileError })
    }

    const onAuth = (e) => {
        const type = e.target.name

        if (type === 'mobile') {
            if (error?.mobileNo.error == null || error?.mobileNo.error) {
                return;
            }
            authInfo.authType = type
            authInfo.mobileNo = myInfo?.mobileNo
            actionCreateAuthCode(authInfo).then((res) => {
                if (res.statusCode == "10000") {
                    setAuthInfo({ ...authInfo, authMobileNo: '' })
                    let temp
                    let tempAuthNo = { error: null, msg: null, class: '' }  // 재인증 시 인증번호 초기화
                    if (res.data.isChk) {
                        temp = { error: false, msg: res.message, class: 'confirm', isAuth: true, isAuthComplete: false }
                        tempAuthNo = { error: true, msg: null, class: '' }
                    } else {
                        temp = { error: true, msg: res.message, class: 'warning', isAuth: false, isAuthComplete: false }
                    }
                    setError({ ...error, mobileNo: temp, authMobileNo: tempAuthNo })
                    return
                }
            })
        }
    }

    //[5-2] 인증 확인
    const onAuthCheck = (e) => {
        const type = e.target.name

        if (type === 'mobile') {
            if (authInfo.authMobileNo == '') {
                return
            }
            actionGetAuthCode(authInfo).then((response) => {
                if (response.statusCode == "10000") {
                    let temp
                    if (response.data.isChk) {
                        error.mobileNo.isAuthComplete = true
                        temp = { error: false, msg: response.message, class: 'confirm' }
                    } else {
                        error.mobileNo.isAuthComplete = false
                        temp = { error: true, msg: response.message, class: 'warning' }
                    }
                    setError({ ...error, authMobileNo: temp })
                    return
                }
            })
        }
    }

    // [6] 주소 ---------------------------------------------
    const onAddress = () => {
        setShowModal(true)
    }
    const onSelectAddress = (data) => {
        setMyInfo({
            ...myInfo,
            zipCode: data.zonecode,
            address: `${data.address} ${data.buildingName}`,
        })
        setShowModal(false)
    }

    //[7] 저장 ---------------------------------------------
    const onSave = () => {
        //[1-1] 필수값 체크
        if (!myInfo?.memberNm || myInfo?.memberNm === '') {
            document.getElementsByName('memberNm')[0].focus();
            props.funcAlertMsg('성명은 필수입니다.')
            return
        }
        if (!myInfo?.birth || myInfo?.birth === '') {
            document.getElementsByName('birth')[0].focus();
            props.funcAlertMsg('생년월일은 필수입니다.')
            return
        }
        if (!myInfo?.gender || myInfo?.gender === '') {
            // document.getElementsByName('gender')[0].focus();
            document.getElementById('gender').setAttribute('tabindex', -1);
            document.getElementById('gender').focus();
            props.funcAlertMsg('성별은 필수입니다.')
            return
        }
        if (!myInfo?.mobileNo || myInfo?.mobileNo === '') {
            document.getElementsByName('mobileNo')[0].focus();
            props.funcAlertMsg('휴대폰 번호는 필수입니다.')
            return
        }
        if (!myInfo?.zipCode || myInfo?.zipCode === '') {
            document.getElementsByName('zipCode')[0].focus();
            props.funcAlertMsg('주소는 필수입니다.')
            return
        }
        if (!myInfo?.addressDetail || myInfo?.addressDetail === '') {
            document.getElementsByName('addressDetail')[0].focus();
            props.funcAlertMsg('주소상세는 필수입니다.')
            return
        }

        if (myInfo?.memberPwd && (!myInfo?.memberPwdChk || myInfo?.memberPwdChk === '')) {
            document.getElementsByName('memberPwdChk')[0].focus();
            props.funcAlertMsg('비밀번호 확인은 필수입니다.')
            return
        }

        const age = getWesternAge(myInfo?.birth)
        if (age < 19) {
            document.getElementsByName('birth')[0].focus();
            props.funcAlertMsg('19세 미만으로 수정 불가합니다.')
            return
        }

        //[1-2] 비밀번호 및 휴대폰 인증오류 체크
        for (const [key, value] of Object.entries(error)) {
            // mobileNo
            if (key === 'authMobileNo' || key === 'mobileNo') {
                if (value.error) {
                    document.getElementsByName(`${key}`)[0].focus();
                    props.funcAlertMsg(value.msg ?? '휴대폰 인증은 필수입니다.')
                    return
                }
            }

            // pwd
            else
                if (key === 'memberPwd' || key === 'memberPwdChk') {
                    if (value.error) {
                        document.getElementsByName(`${key}`)[0].focus();
                        props.funcAlertMsg(value.msg)
                        return
                    }
                }
        }

        actionUpdateMember(myInfo).then((res) => {
            if (res.statusCode == "10000") {
                if (res.data.isCheck) {
                    props.toastSuccess(res.message)
                    onReset()
                }

                else {
                    props.funcAlertMsg(res.message)
                    setMyInfo({ ...myInfo, memberPwd: '', memberPwdChk: '' })
                    document.getElementsByName('memberPwd')[0].focus();
                    return
                }

            }
        })
    }

    const onReset = () => {
        funcGetMyInfo()
        //reset
        setError({
            ...error,
            mobileNo: { error: null, msg: null, class: '', isAuth: false, isAuthComplete: false },
            authMobileNo: { error: null, msg: null, class: '' },
            memberPwd: { error: null, msg: null, class: '' },
            memberPwdChk: { error: null, msg: null, class: '' },
        })
        if (isChange) {
            setIsChange(!isChange)
        }
    }
    return (
        <div>
            <div className="inventory">
                <div>
                    <div className="h1">개인정보 관리</div>
                    <div className="subtxt">DTx 임상 프로젝트는 DTVERSE와 함께 하세요.</div>
                </div>
            </div>
            <div className="con-body ">
                <div className="from privacy">
                    <div className="tr">
                        <div className="th required">성명</div>
                        <div>
                            <input
                                type="text"
                                placeholder="이름을 입력해주세요."
                                name="memberNm"
                                onChange={handleChange}
                                value={myInfo?.memberNm || ''}
                                required
                                autoComplete='off'
                            />
                        </div>
                    </div>
                    <div className="tr">
                        <div className="th required">생년월일</div>
                        <div >
                            <Datepicker name='birth' value={birth} setDate={setBirth} disable={birthDisable} placeholderText="YYYY-MM-DD" maxYearAdd={10} />
                        </div>
                        <div>
                        </div>
                    </div>
                    <div className="tr">
                        <div className="th required">성별</div>
                        <div>
                            <SelectBox id='gender' options={genderCode} setValue={setGender} selectValue={gender} />
                        </div>
                    </div>
                    <div className="tr">
                        <div className="th required">아이디</div>
                        <div><input type="text" value={myInfo?.memberId} disabled={true} /></div>
                    </div>
                    <div className="tr">
                        <div className="th required">비밀번호</div>
                        <div >
                            <input
                                type="password"
                                name="memberPwd"
                                placeholder="비밀번호 입력 (8~16자 이내의 영문, 숫자, 특수문자 2개 조합)"
                                maxLength={15}
                                onChange={handleChange}
                                value={myInfo?.memberPwd || ''}
                                autoComplete='one-time-code'
                                required
                            />
                        </div>
                        <div>
                            {
                                error?.memberPwd?.error !== null ?
                                    <span className={`${error.memberPwd.class}`}>{error.memberPwd.msg}</span>
                                    : ''
                            }
                        </div>
                    </div>
                    <div className="tr">
                        <div className="th required">비밀번호 확인</div>
                        <div >
                            <input
                                type="password"
                                name="memberPwdChk"
                                placeholder="비밀번호 재입력"
                                maxLength={15}
                                onChange={handleChange}
                                value={myInfo?.memberPwdChk || ''}
                                autoComplete='one-time-code'
                                required
                            />
                        </div>
                        <div>
                            {
                                error?.memberPwdChk?.error !== null ?
                                    <div className={`${error.memberPwdChk.class}`}>{error.memberPwdChk.msg}</div>
                                    : ''
                            }
                        </div>
                    </div>
                    <div className="tr">
                        <div className="th required">휴대폰 번호</div>
                        <div >
                            <input
                                type="text"
                                name="mobileNo"
                                placeholder="휴대폰번호 입력"
                                onChange={handleChange}
                                value={
                                    myInfo?.mobileNo?.length === 10 ? myInfo?.mobileNo.replace(/-/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
                                        : myInfo?.mobileNo?.length === 11 ? myInfo?.mobileNo.replace(/-/g, '').replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
                                            : myInfo?.mobileNo || ''
                                }
                                disabled={!isChange}
                                required
                            />
                        </div>
                        <div className='flex gap5x'>
                            {
                                isChange ?
                                    <button type='button' className='btn-square' name='mobile' onClick={onAuth}>인증하기</button>
                                    :
                                    <button type='button' className='btn-square' name='mobile' onClick={onModifyMobileNo} >변경</button>
                            }
                            {
                                error?.mobileNo?.error !== null ?
                                    <div className={`${error.mobileNo.class}`}>{error.mobileNo.msg}</div>
                                    : ''
                            }
                        </div>
                    </div>
                    {
                        error?.mobileNo?.isAuth ?
                            <div className="tr">
                                <div className="th required">인증번호</div>
                                <div >
                                    <input
                                        type="text"
                                        name="authMobileNo"
                                        placeholder="인증번호 입력"
                                        onChange={handleChange}
                                        value={authInfo?.authMobileNo || ''}
                                        disabled={error?.mobileNo?.isAuthComplete}
                                        required
                                    />

                                </div>
                                <div className='flex gap5x'>
                                    {
                                        error?.mobileNo?.isAuthComplete ?
                                            <button type='button' className='btn-square' disabled>인증완료</button>
                                            : <button type='button' className='btn-square' name='mobile' onClick={onAuthCheck}>인증확인</button>
                                    }
                                    {
                                        error?.authMobileNo?.error !== null ?
                                            <div className={`${error.authMobileNo.class}`}>{error.authMobileNo.msg}</div>
                                            : ''
                                    }
                                </div>
                            </div>
                            :
                            ''
                    }
                    <div className="tr">
                        <div className="th">전화번호</div>
                        <div >
                            <input
                                type="text"
                                name="phoneNo"
                                placeholder="전화번호 입력"
                                onChange={handleChange}
                                value={myInfo?.phoneNo || ''}
                            />
                        </div>
                    </div>
                    <div className="tr">
                        <div className="th">이메일</div>
                        <div >
                            <input
                                type="text"
                                name="email"
                                placeholder="이메일 주소 입력"
                                onChange={handleChange}
                                value={myInfo?.email || ''}
                            />
                        </div>
                    </div>
                    <div className="tr original">
                        <div className="th required h150">주소</div>
                        <div className="address">
                            <button type="button" className="btn-square" onClick={onAddress}>우편번호 찾기</button>
                            <input type="text" placeholder="우편번호" name="zipCode" value={myInfo?.zipCode || ''} disabled />
                            <input type="text" placeholder="기본 주소" name="address" value={myInfo?.address || ''} disabled />
                            <input
                                type="text"
                                name="addressDetail"
                                placeholder="상세 주소 입력"
                                onChange={handleChange}
                                value={myInfo?.addressDetail || ''}
                                required
                            />
                        </div>
                    </div>
                    <div className="tr original">
                        <div className="th branch">관심분야<br />
                            <span className="count">&#40; <span>{myInfo?.keywordList?.length ?? 0}</span>/3 &#41;</span>
                        </div>
                        <div>
                            <span className="tag">
                                {
                                    keywordList?.length > 0 ?
                                        keywordList?.map((item, index) => {
                                            const isCheck = myInfo?.keywordList?.includes(item.commCd)
                                            return (
                                                <button
                                                    className={`btn-tag ${isCheck ? 'select' : ''}`}
                                                    key={item.commCd}
                                                    name={item.commCd}
                                                    onClick={onKeyword}
                                                >
                                                    # {item.commCdNm}
                                                </button>
                                            )
                                        })
                                        : ''
                                }
                            </span>
                            <span className="tag-input">
                                <button className={`btn-tag ${myInfo?.keywordList?.filter(x => !keywordList?.find(item => item.commCd === x)).length > 0 ? 'select' : ''}`}
                                    name={'write'}
                                    onClick={onKeyword}
                                >
                                    # 직접입력
                                </button>
                                <input
                                    type="text"
                                    placeholder="키워드 입력하세요."
                                    value={directInput?.value}
                                    onChange={handleChange}
                                    name="directInput"
                                    disabled={directInput?.disabled}
                                />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="con-footer">
                <div>
                    <button type="button" className="btn-circle fill" onClick={onSave}>저장</button>
                    <span className="secession">
                        <button type="button" className="btn-circle" onClick={() => props.history.push('/mypage/secession')}>회원탈퇴</button>
                    </span>
                </div>
            </div>
            {/* 우편번호 찾기 */}
            {
                showModal &&
                <ModalAdress {...props} cancelRef={cancelModalRef} setShowModal={setShowModal} onSelectAddress={onSelectAddress} />
            }
        </div>
    );
}

export default MyProfile;