export const timeStamp = () => {
    let sampleTimestamp = Date.now();                   //현재시간 타임스탬프 13자리 예)1599891939914
    let date = new Date(sampleTimestamp);               //타임스탬프를 인자로 받아 Date 객체 생성
    let year = date.getFullYear().toString();           //년도 뒤에 두자리
    let month = ("0" + (date.getMonth() + 1)).slice(-2);//월 2자리 (01, 02 ... 12)
    let day = ("0" + date.getDate()).slice(-2);         //일 2자리 (01, 02 ... 31)
    let hour = ("0" + date.getHours()).slice(-2);       //시 2자리 (00, 01 ... 23)
    let minute = ("0" + date.getMinutes()).slice(-2);   //분 2자리 (00, 01 ... 59)
    let second = ("0" + date.getSeconds()).slice(-2);   //초 2자리 (00, 01 ... 59)
    return  year  + month  + day  + hour  + minute  + second;
};

export const addComma = (value) => {
    if (value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
    else {
        return value;
    }
}

export const addZero = (value, cnt) => {
    if (value) {
        return String(value).padStart(cnt, '0')
    }
    else {
        return value;
    }
}

export const capitalize = (word) => {
    if (word) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    }
}

export const makeRandomNumber = (num) => {
    const characters ='0123456789';

    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

//------------------------- [ 공통 필수값 checker ]  -------------------------
export const requiredValueCheck = (param,type) => {
    for (const [key, value] of Object.entries(param)) {

        // console.log(param);
        // console.log(`${key} : [${value}]`);
        
        if(!unRequiredKey.includes(key)){
            if(value ===undefined || value === null || String(value).replaceAll(' ','') === '' ){
                return {id: key, msg: `${transKey(key)}을 입력해주세요.`};
            }
        }
    }
}

const unRequiredKey = [ 
    'files' , 'id'
    // 회원가입
    , 'department' , 'position' , 'job' , 'officePhoneNo' , 'emailReceiveYn' , 'smsReceiveYn' , 'service' , 'privacy','requiredValueCheck'
    ,'approvalLoginId','approvalDtm', 'email',
    // 프로젝트개설
    , 'productCd' , 'keywordList'
    , 'protocolNo' , 'emailSendDtm' , 'manageOrgList' , 'participantRole'
    , 'participantLoginId'
    , 'postEndDate' , 'constraintList', 'examinationItemList'
    , 'sortOrder', 'roleCdNm'
    // 기관별 정보
    , 'nickname' , 'screeningTime' , 'refer'
    , 'consentFormList' , 'consentTypeNm'
    // 스크리닝 일정
    , 'subjectId' , 'item'
    // 비대면상담
    , 'counselPassword'
    // 기관등록
    , 'phoneNo'
]


export const transKey = (key) => {
    const keys = [
        { key : 'postClassificationCd' , value : '분류' },
        { key : 'title' , value: '제목'},
        { key : 'contents' , value : '내용' },

        { key : 'memberNm' , value : '성명' },
        { key : 'birth'    , value : '생년월일'},
        { key : 'gender'   , value : '성별'},
        { key : 'memberId' , value : '아이디' },
        { key : 'mobileNo' , value : '휴대폰 번호' },
        { key : 'memberPwdPre' , value : '기존 비밀번호' },
        { key : 'memberPwd' , value : '비밀번호' },
        { key : 'memberPwdChk' , value : '비밀번호 확인' },

        { key : 'zipCode' , value : '주소'},
        { key : 'addressDetail' , value: '상세주소'},
        { key : 'service' , value : '서비스 이용약관' },
        { key : 'privacy' , value : '개인정보 이용약관' },

        // 비대면 예약
        { key : 'applyCounselDate' , value : '비대면상담 일정' },
        { key : 'applyCounselTime' , value : '비대면상담 일정' },
        { key : 'applyCounselTimeMin' , value : '비대면상담 일정' },
        { key : 'applyReasonCd' , value : '신청 사유' },
    ]
    let result = keys.find(item => item.key === key )
    if(result){
        return result.value
    }else{
        return '필수값'
    }
}

export const utilSetListSearch = (pathType) => {
    let search = location.search;
    let searchArr;

    if (search.substring(0, 1) === '?') {
        search = search.slice(1)
    }

    searchArr = search.split('&');
    search = [...new Set(searchArr)].join('&')

    window.localStorage.setItem('listSearch', JSON.stringify({pathType: pathType, search: search}))
}

export const utilGetListSearch = (pathType) => {
    let objSearch = JSON.parse(window.localStorage.getItem('listSearch'));

    if (objSearch?.pathType === pathType) {
        return objSearch.search;
    }
    else {
        return '';
    }
}

export const utilClearListSearch = () => {
    window.localStorage.setItem('listSearch', JSON.stringify({}))
}
