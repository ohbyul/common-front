//input 태그 replace용
export const onlyNum = /[^0-9]/i                            //숫자
export const onlyKor = /[^ㄱ-ㅎㅏ-ㅣ가-힣]/i                 //한글
export const onlyKorSpace = /[^ㄱ-ㅎㅏ-ㅣ가-힣\s]/i          //한글 + 공백
export const onlyKorEngSpace = /[^ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z\s]/i //한글 + 영어 + 공백
export const NotSpace = /[\s]/i                             //공백
export const onlyKorEngNum = /[^\sㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9]/i //한글 + 영어 + 숫자
export const onlyKorEng = /[^ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z]/i        //한글 + 영어
export const onlyKorEngNumUnBarHypSpace = /[^\sㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9_-]/i //한글 + 영어 + 숫자 + 언더바 + 하이픈
export const onlyEngNum = /[^a-z0-9]*/i                     //영어 + 숫자
export const onlyEngNumUnBar = /[^a-z0-9_]*/i               //영어 + 숫자 + 언더바
export const onlyNumPeriod = /[^0-9\.]*/i                   //숫자 + .
export const NotSpaceKor = /[^A-Za-z0-9_\`\~\!\@\#\$\%\^\&\*\(\)\-\=\+\\\{\}\[\]\'\"\;\:\<\,\>\.\?\/]/gm;   //한글,공백 제외
export const onlyNumBar = /[^0-9\-]/i                       //숫자 + -
export const onlyEngKor = /[^a-zA-Zㄱ-ㅎ가-힣]*/i            //영어 + 숫자
export const onlyEmail = /[^a-zA-Z0-9@_.-]/i                //이메일
export const onlyId = /[^a-zA-Z0-9_.-]/gi                   //영어 + 숫자 +특수문자3개


//검증용
export const regex_UserId = /^[a-z0-9_-]{5,20}$/                //영문으로 시작하고 영문+숫자 최대 4~8자
export const regex_LoginId = /^[a-z]+[a-z0-9]{5,14}$/            //영문으로 시작하고 영문+숫자 최대 6~15자
export const regex_StationName = /^[ㄱ-ㅎㅏ-ㅣ가-힣]{2,8}$/     //한글 최대 2~8자
export const regex_IPAddress = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
// export const regex_RTSP_IPAddress = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/[0-9]+\/high$/
export const regex_RTSP_IPAddress = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
export const regex_cameraNm = /^[\sㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9_-]{2,20}$/ //한글 + 영어 + 숫자 + 언더바 + 하이픈 최대 2~10자
export const regex_ObjectName = /^[\sㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9]*$/   //한글,영어,숫자
export const regex_onlyEngNum = /^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z]*$/        //한글,영어
export const regex_phoneNumber =/^\d{3}-\d{3,4}-\d{4}$/            //핸드폰번호 + 하이픈
// export const regex_email = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;  //이메일
export const regex_email =/^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
export const regex_bplc = /^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z]{2,10}$/         //한글,영어 최대 6~10자 (임의로 2-10)
export const regex_cameraLoginId = /^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9]{0,10}$/   //한글, 영어, 숫자 최대 2~10자 (임의로 2-10)
export const regex_cameraPort = /^[0-9]*$/                        //숫자
export const regex_wpno = /^\d{3}-\d{3,4}-\d{4}$/
export const regex_tpno = /^\d{2,3}-\d{3,4}-\d{4}$/
export const regex_mobile_input = /^[0-9\b -]{0,13}$/;          //입력시 val
export const regex_mobile = /^[0-9\b -]{12,13}$/;         //검사시
export const regex_phone = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/  
// 최소 8 자 및 최대 20 자, 하나 이상의 대문자, 하나의 소문자, 하나의 숫자 및 하나의 특수 문자 정규식
// export const regex_pwd = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#.~_-])[A-Za-z\d@$!%*?&#.~_-]{8,20}$/
export const regex_pwd = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&#.~_-])[A-Za-z\d@$!%*?&#.~_-]{8,20}$/