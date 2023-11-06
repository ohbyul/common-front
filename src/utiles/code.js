// import { actionGetCodeList } from "../modules/action/CommonAction"
import { actionGetCodeList, actionGetUpperCodeList } from "../modules/action/CommonAction"

//조회된 코드값을 콤보 옵션 리스트 형태로 변환
export async function getCodeOption(param) {
    let result = []

    await actionGetCodeList(param).then((res) => {
        if(res.statusCode === 10000){
            let data = res.data
            if(data.length > 0){
                result.push({value: '', label: param.default})
                data.map((item)=>{
                    result.push({value: item.commCd, label: item.commCdNm})
                })
            }
        }
    })
    return result
}
//조회된 코드값을 콤보 옵션 리스트 형태로 변환 Board
export async function getUpperCodeOption(param) {
    let result = []

    await actionGetUpperCodeList(param).then((res) => {
        if(res.statusCode === 10000){
            let data = res.data
            if(data.length > 0){
                result.push({value: '', label: param.default})
                data.map((item)=>{
                    result.push({value: item.commCd, label: item.commCdNm})
                })
            }
        }
    })
    return result
}
// 옵션리스트-> 코드Nm 값
export function transCode(optionList , value) {
    if(!value || !optionList){
        return ''
    }
    const data = optionList.find(option => option.value === value)
    if(data){
        return data.label
    }else{
        return data
    }
}

// 기관
export const ORGANIZATION_TYPE = "ORGANIZATION_TYPE";

// 유저
export const USER_AUTH = "USER_AUTH";
export const USER_STATUS = "USER_STATUS";
export const USER_DELETE_REASON = "USER_DELETE_REASON";

// 프로젝트 개설
export const TRIAL_STEP_TYPE = "TRIAL_STEP_TYPE";
export const NATION_TYPE = "NATION_TYPE";
export const NATION_DTL_TYPE = "NATION_DTL_TYPE";
export const KEYWORD = "KEYWORD"
export const ROLE = "ROLE"
export const QUESTION_TYPE = "QUESTION_TYPE"

// 신청자 상세
export const CANCEL_REASON = "CANCEL_REASON"

// 임상완료 설문
export const SUVERY_QUESTION_TYPE = "SUVERY_QUESTION_TYPE"

// 비대면 신청
export const APPLY_REASON = "APPLY_REASON"

// 성별
export const GENDER = "GENDER"

// 신청방식
export const METHOD_TYPE = "METHOD_TYPE"
export const APPLICANT_TYPE = "APPLICANT_TYPE"

// 데드라인
export const SYSTEM_VARIABLE = "SYSTEM_VARIABLE"




// -----------------list search ------------------------
export const inquiryuser = "inquiryuser" //이용문의
export const projectInfo = "projectInfo" //프로젝트 모집공고
export const inquiry = "inquiry" //모집문의
export const scrap = "scrap" //마이페이지 모집공고