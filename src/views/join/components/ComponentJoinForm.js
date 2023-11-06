import React, { useEffect, useState } from 'react';
import { actionGetCodeList } from '../../../modules/action/CommonAction';
import { NotSpace, regex_LoginId, regex_mobile, regex_mobile_input, regex_pwd, onlyKorEng } from '../../../utiles/regex';
import ModalAdress from '../../components/address/ModalAdress';
import Datepicker from '../../components/picker/Datepicker';
import SelectBox from '../../components/SelectBox';
import { actionCreateAuthCode, actionGetAuthCode, actionGetMemberLoginId } from '../../../modules/action/MemberAction';
import moment from 'moment';

const ComponentJoinForm = (props) => {
    let { joinInfo , setJoinInfo ,error , setError
        , isUse , setIsUse , keywordList , directInput , setDirectInput ,
    } = props

    const [ authInfo , setAuthInfo] = useState({
        memberId: '',
        mobileNo:'',    
        authMobileNo:'',        //휴대폰 인증번호
        authType : '',           //인증 타입
        memberNm : ''             //사용자명
    })
    // modal on/off - 주소
    const cancelModalRef = React.useRef();
    const [ showModal , setShowModal ] = useState(false);

    const [ authNoTest , setAuthNoTest] = useState()
    //[1-1] datepicker 
    const [birth, setBirth] = useState('');
    const [birthDisable, setBirthDateDisable] = useState(false)
    //[1-2] selectBox
    const [ codeList , setCodeList ] = useState([])
    useEffect(()=>{
        let data = {
            groupCd: 'GENDER'
        }
        let codeArray = []
        codeArray.push({value : '' , label: '선택'})
        actionGetCodeList(data).then((response)=>{
            if(response.statusCode == "10000"){
                response?.data?.map((item,index)=>{
                    return(
                        codeArray.push({ value : item.commCd , label : item.commCdNm})
                    )
                })
                setCodeList(codeArray)
            }
        })
    },[])
    const [ gender , setGender ] = useState(joinInfo?.gender || '');
    //[2] 입력 데이터 셋팅
    const handleChange = (e) => {
        switch (e.target.name) {
            case 'memberId':
                setJoinInfo({...joinInfo, memberId: e.target.value.replace(NotSpace,'')})
                break;
            case 'memberPwd':
                setJoinInfo({...joinInfo, memberPwd: e.target.value.replace(NotSpace, '')})
                break;
            case 'memberPwdChk':
                setJoinInfo({...joinInfo, memberPwdChk: e.target.value.replace(NotSpace, '')})
                break;
            case 'memberNm':
                setJoinInfo({...joinInfo, memberNm: e.target.value.replace(onlyKorEng,'')})
                setAuthInfo({...authInfo, memberNm: e.target.value.replace(onlyKorEng,'')})
                break;
            case 'mobileNo':
                const value = e.target.value.replace(NotSpace,'').replaceAll('-','')
                if (regex_mobile_input.test(e.target.value)) {
                    if(value.length === 10){
                        setJoinInfo({...joinInfo, mobileNo: e.target.value.replace(/-/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')})
                        setAuthInfo({...authInfo, mobileNo: e.target.value.replace(/-/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')})
                        break;
                    }else if(value.length === 11){
                        setJoinInfo({...joinInfo, mobileNo: e.target.value.replace(/-/g, '').replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')})
                        setAuthInfo({...authInfo, mobileNo: e.target.value.replace(/-/g, '').replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')})
                        break;
                    }else{
                        setJoinInfo({...joinInfo, mobileNo: value})
                        setAuthInfo({...authInfo, mobileNo: value})
                        break;
                    }
                }
                break;
            case 'addressDetail':
                setJoinInfo({...joinInfo, addressDetail: e.target.value})
                break;
            case 'authMobileNo':
                setAuthInfo({...authInfo, authMobileNo: e.target.value.replace(NotSpace,'')})
                break;
            case 'directInput':
                setDirectInput({...directInput , value : e.target.value , disabled : false})
                let keyword = joinInfo?.keywordList
                let temp = keyword?.map((item) => {
                    if(!keywordList?.find(x => x.commCd===item)){
                        return e.target.value
                    }else{
                        return item
                    }
                })
                setJoinInfo({...joinInfo, keywordList: temp})
                break;
            case 'phoneNo' :
                setJoinInfo({...joinInfo, phoneNo: e.target.value})
                break;
            case 'email' :
                setJoinInfo({...joinInfo, email: e.target.value})
        }
    }

    const onKeyword = (e) => {
        const clickNm = e.target.name
        const select = clickNm ==='write'? directInput?.value : clickNm
        let keywords = joinInfo?.keywordList ?? []
        const isInclude = keywords?.includes(select) ? true : false
        
        if(!isInclude){
            if(keywords?.length >= 3){
                props.funcAlertMsg('관심분야는 최대 3개까지 선택 가능합니다.')
                return
            }
            if(clickNm === 'write'){
                setDirectInput({...directInput,disabled : false })   //활성화
            }
            keywords.push(select)
        }else{
            if(clickNm === 'write'){
                setDirectInput({value : '',disabled : true })   //초기화
            }
            keywords = keywords.filter(item=>item!==select)
        }

        setJoinInfo({...joinInfo, keywordList: keywords})
    }

    useEffect(()=>{
        setJoinInfo({...joinInfo, 
            birth: birth ,
            gender: gender ,
        })
    },[birth , gender])

    //[3] validation  -------------------------------------------------------------
    useEffect(()=> {
        const today = moment();
        const birthDate = birth ? moment(birth) : '';
        const age = today.diff(birthDate, 'years');
        let ageError
        if (birthDate == '' || birth.length < 10) {
            ageError = { error : null , msg : null , class : '' }
        } else {
            if (birthDate.isAfter(today)) {
                ageError = { error: true, msg: '미래 날짜는 선택할 수 없습니다.', class: 'warning' };
            } else if (age < 19) {
                ageError = { error : true , msg : '만 19세 미만은 가입 할 수 없습니다.' , class : 'warning' } 
            } else {
                ageError = { error : false , msg : '가입 가능한 나이 입니다.' , class : 'confirm' } 
            }
        }
        setError({...error , birth : ageError })
    },[joinInfo?.birth])

    useEffect(()=>{
        const id = joinInfo?.memberId;
        let idError         //아이디 에러

        if(id == ''){
            idError = { error : null , msg : null , class : '' , isAuth : false , isAuthComplete : false }
        }else{
            if(!regex_LoginId.test(id)){
                idError = { error : true , msg : '영문 소문자, 숫자 조합으로 5~15자리 입력해 주시기 바랍니다.' , class : 'warning' } 
            }else{
                idError = { error : false , msg : '올바른 아이디 형식입니다.' , class : 'confirm' } 
            }
        }
        setError({...error , memberId : idError })
        setIsUse(null)
    },[joinInfo?.memberId])

    useEffect(()=>{
        if(isUse!==null){
            let idError         //아이디 중복 에러

            if(isUse){
                idError = { error : false , msg : '사용가능한 아이디입니다.' , class : 'confirm' } 
            }else{
                idError = { error : true , msg : '사용 불가능한 아이디입니다.' , class : 'warning' } 
            }
            setError({...error , memberId : idError })
        }
    },[isUse])

    useEffect(()=>{
        const mobile = joinInfo?.mobileNo;
        let mobileError         //휴대폰번호 에러

        if(mobile == ''){
            mobileError = { error : null , msg : null , class : '' , isAuth : false , isAuthComplete : false }
        }else{
            // 휴대폰 형식 변환
            let mobileNo
            if(mobile?.length === 10){
                mobileNo = mobile?.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
            }
            else 
            if(mobile?.length === 11){
                mobileNo = mobile?.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
            }
            else {
                mobileNo = mobile
            }

            if(!regex_mobile.test(mobileNo)){
                mobileError = { error : true , msg : '올바른 휴대폰 번호 형식이 아닙니다.' , class : 'warning'  } 
            }else{
                mobileError = { error : false , msg : '사용 가능한 휴대폰 번호입니다.' , class : 'confirm' , isAuth : false , isAuthComplete : false} 
            }
        }
        setError({...error , mobileNo : mobileError })
        
    },[joinInfo?.mobileNo])

    useEffect(()=>{
        const pw = joinInfo?.memberPwd;
        const checkPw = joinInfo?.memberPwdChk;

        let pwd         //비밀번호 에러
        let pwdChk      //비밀확인 에러
        if(pw == ''){
            pwd = { error : null , msg : null , class : '' }
        }else{
            if(!regex_pwd.test(pw)){
                pwd = { error : true , msg : '영문자, 숫자, 특수문자 조합으로 8~15자리' , class : 'warning' } 
            }else{
                pwd = { error : false , msg : '사용 가능한 비밀번호입니다.' , class : 'confirm' } 
            }
        }

        if(checkPw == ''){
            pwdChk = { error : null , msg : null , class : '' }
        }else{
            if(pw===checkPw){
                pwdChk = { error : false , msg : '비밀번호가 일치합니다.' , class : 'confirm' }
            }else{
                pwdChk = { error : true , msg : '비밀번호가 일치하지 않습니다.' , class : 'warning' } 
            }
        }

        setError({...error , memberPwd : pwd , memberPwdChk : pwdChk })
        
    },[joinInfo?.memberPwd,joinInfo?.memberPwdChk])


    // [3-1] 중복체크 -------------------------------------
    const onCheck = () => {

        if(!joinInfo?.memberId || joinInfo?.memberId ===''){
            props.funcAlertMsg('아이디를 입력해주세요.')
            document.getElementsByName('memberId')[0].focus();
            return
        }
        else if(!regex_LoginId.test(joinInfo?.memberId)){
            let idError = { error : true , msg : '올바른 아이디 형식이 아닙니다.' , class : 'warning' } 
            setError({...error , memberId : idError })
            return
        } 

        actionGetMemberLoginId(joinInfo?.memberId).then((res) => {
            if (res.statusCode == "10000") {
                const result = res.data
                setIsUse(result.isUse)
            }
        })
    }


    // [4] 인증 코드 발송 ---------------------------------------------
    const onAuth = (e) => {
        const type = e.target.name
        if(error?.mobileNo.error == null || error?.mobileNo.error){
            return;
        }
        authInfo.authType = type
        authInfo['mobileNo'] = joinInfo?.mobileNo.replace(/-/g,'')
        actionCreateAuthCode(authInfo).then((response) => {
            if (response.statusCode == "10000") {
                setAuthInfo({...authInfo, authMobileNo : ''})
                let temp 
                let tempAuthNo = { error : null , msg : null , class : '' }  // 재인증 시 인증번호 초기화
                if(response.data.isChk){
                    temp = { error : false , msg : response.message , class : 'confirm' , isAuth : true , isAuthComplete : false } 
                    setAuthNoTest({...authNoTest , mobile : authInfo.authMobileNo})          // TEST : 보낸 인증번호 저장
                }else{
                    temp = { error : true , msg : response.message , class : 'warning' , isAuth : false , isAuthComplete : false } 
                }
                setError({...error , mobileNo : temp , authMobileNo : tempAuthNo  })
                return
            }
        })
    }
    // [4-1] 인증 확인 ---------------------------------------------
    const onAuthCheck = (e) => {
        if(authInfo.authMobileNo == ''){
            return
        }
        actionGetAuthCode(authInfo).then((response) => {
            if (response.statusCode == "10000") {
                let temp 
                if(response.data.isChk){
                    error.mobileNo.isAuthComplete = true
                    temp = { error : false , msg : response.message , class : 'confirm' } 
                }else{
                    error.mobileNo.isAuthComplete = false
                    temp = { error : true , msg : response.message , class : 'warning' } 
                }
                setError({...error , authMobileNo : temp})
                return
            }
        })
    }
    // [5] 주소 ---------------------------------------------
    const onAddress = () => {
        setShowModal(true)
    }
    const onSelectAddress = (data) => {
        setJoinInfo({...joinInfo,
            zipCode: data.zonecode,
            address:`${data.address} ${data.buildingName}`,

        })
        setShowModal(false)
    }
    return ( 
        <div className="detail-info">
            <div className="balance">
                <div className="txt-title">회원정보 입력</div>
            </div>
            <div className="line-box">
                <div className="from">
                    <div className="tr">
                        <div className="th required">성명</div>
                        <div >
                            <input 
                                type="text" 
                                placeholder="이름을 입력해주세요." 
                                name="memberNm"
                                onChange={handleChange}
                                value={joinInfo?.memberNm || ''}
                                required
                                autoComplete='off'
                            />
                        </div>
                    </div>
                    <div className="tr">
                        <div className="th required">생년월일</div>
                        <div >
                            <Datepicker name='birth' value={birth} setDate={setBirth} disable={birthDisable} placeholderText="YYYY-MM-DD" maxYearAdd={10}/>
                        </div>
                        <div>
                            {
                                error?.birth?.error !==null ?
                                    <span className={`${error.birth.class}`}>{error.birth.msg}</span>
                                : ''
                            }
                        </div>
                    </div>
                    <div className="tr">
                        <div className="th required">성별</div>
                        <div >
                            <SelectBox id='gender' options={codeList} setValue={setGender} selectValue={gender} />
                        </div>
                    </div>
                    <div className="tr">
                        <div className="th required">아이디</div>
                        <div >
                            <input 
                                type="text" 
                                name="memberId"
                                placeholder="아이디 입력(5~15자 이내의 영문, 숫자 조합)"
                                onChange={handleChange}
                                value={joinInfo?.memberId || ''}
                                required
                            />
                        </div>
                        {/*  confirm   warning */}
                        <div className='flex gap5x'>
                            <button type="button" className="btn-square" onClick={onCheck}>중복검색</button>
                            {
                                error?.memberId?.error !==null ?
                                    <span className={`${error.memberId.class}`}>{error.memberId.msg}</span>
                                : ''
                            }
                        </div>
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
                                value={joinInfo?.memberPwd || ''}
                                autoComplete='one-time-code'
                                required
                            />
                        </div>
                        <div>
                            {
                                error?.memberPwd?.error !==null ?
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
                                value={joinInfo?.memberPwdChk || ''}
                                autoComplete='one-time-code'
                                required
                            />
                        </div>
                        <div>
                                {
                                    error?.memberPwdChk?.error !==null ?
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
                                value={joinInfo?.mobileNo || ''}
                                required
                            />
                        </div>
                        <div className='flex gap5x'>
                            {
                                !error?.mobileNo?.isAuth ? 
                                    <button type='button' className='btn-square' name='mobile' onClick={onAuth}>인증하기</button>
                                    : <button type='button' className='btn-square' name='mobile' onClick={onAuth}>재인증</button>
                            }
                            {
                                error?.mobileNo?.error !==null ?
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
                                    error?.authMobileNo?.error !==null ?
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
                                value={joinInfo?.phoneNo || ''}
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
                                value={joinInfo?.email || ''}
                            />
                        </div>
                    </div>
                    <div className="tr">
                        <div className="th required h150">주소</div>
                        <div className="address">
                            <button type="button" className="btn-square" onClick={onAddress}>우편번호 찾기</button>
                            <input type="text" placeholder="우편번호" name="zipCode" value={joinInfo?.zipCode || ''} disabled />
                            <input type="text" placeholder="기본 주소" name="address" value={joinInfo?.address || ''} disabled />
                            <input 
                                type="text" 
                                name="addressDetail"
                                placeholder="상세 주소 입력"
                                onChange={handleChange}
                                value={joinInfo?.addressDetail || ''}
                                required
                            />
                        </div>
                    </div>
                    <div className="tr">
                        <div className="th branch">관심분야<br />
                            <span className="count">&#40; <span>{joinInfo?.keywordList?.length}</span>/3 &#41;</span>
                        </div>
                        <div>
                            <span className="tag">
                                {
                                    keywordList?.length > 0 ? 
                                        keywordList?.map((item,index) =>{
                                            const isCheck = joinInfo?.keywordList?.includes(item.commCd) 
                                            return(
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
                                <button className={`btn-tag ${joinInfo?.keywordList?.filter(x =>!keywordList?.find(item => item.commCd===x)).length > 0 ? 'select' : '' }`}
                                        name={'write'} 
                                        onClick={onKeyword}
                                >
                                    # 직접입력
                                </button>
                                <input
                                    type="text"
                                    placeholder="키워드 입력하세요."
                                    value={directInput.value}
                                    onChange={handleChange}
                                    name="directInput"
                                    disabled={directInput.disabled}
                                />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            {/* 우편번호 찾기 */} 
            {
                showModal && 
                <ModalAdress {...props} cancelRef={cancelModalRef} setShowModal={setShowModal} onSelectAddress={onSelectAddress} />
            }
        </div>
    )
}

export default ComponentJoinForm