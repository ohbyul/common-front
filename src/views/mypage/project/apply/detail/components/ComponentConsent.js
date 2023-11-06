import React, { useEffect, useState } from 'react';
import { dateTimeFormat, getWesternAge } from '../../../../../../utiles/date';
import { actionDownloadS3Data } from '../../../../../../modules/action/CommonAction';
import { actionInsertConsentDownloadHistory } from '../../../../../../modules/action/ConsentAction';

const ComponentConsent = (props) => {
    let { subject } = props

    // **해당신청자의 조건에 맞는 동의서 폼
    const [ consentForm , setConsentForm ] = useState()

    useEffect(()=>{
        if(!subject) return
   
        const consentSignList = subject?.consentSignList

        // 조건에 맞는 동의서
        // const applicantTypeCd = subject?.applicantTypeCd       
        // let consents = consentSignList?.filter(x=>x.formTypeCd === applicantTypeCd)
        // if(applicantTypeCd === 'REPRESENTATIVE'){
        //     const subjectAge = getWesternAge(subject?.subjectBirthDate)
        //     if(subjectAge < 19){
        //         let temp = consentSignList?.filter(x=>x.formTypeCd === 'CHILD')
        //         // [선택] 소아용 동의서 존재시 호출 / 없을시 대리용 호출
        //         if(temp?.length > 0){
        //             consents = temp
        //         }
        //     }
        // }

        // [2] 서명된 것만 (서명중 + 서명완료)
        let consents = consentSignList
        consents = consents.filter(x=>x.statusCd)

        setConsentForm(consents)
    },[subject])

    // [3] 다운로드  -------------------------------------------------------------
    const onDownload = (item) => {
        // console.log(item);
        let filePath = item.consentSignFilePath.slice(item.consentSignFilePath.indexOf('/')+1,item.consentSignFilePath.lastIndexOf('/'))
        let saveFileNm =  item.consentSignFilePath.slice(item.consentSignFilePath.lastIndexOf('/')+1)

        let params = {
            path: filePath , 
            fileName: saveFileNm,
            originalFileNm: item.consentSignOriginalFileNm
        }
        actionDownloadS3Data(params).then((res)=>{})
        onHistory(item)
    }

    // 다운로드 이력
    const onHistory = (item) => {
        let params = {
            consentSignId : item?.consentSignId , 
            downloadTypeCd : 'APPLICANT'
        }
        actionInsertConsentDownloadHistory(params).then((res)=>{})
    }

    return (
        <div className='breakpoint'>
            <div className="balance">
                <div className="txt-title">동의서 목록</div>
            </div>
            <div className="mypage-info-box">
                <table className="default txt-center">
                    <colgroup className="consent-col">
                        <col /><col /><col /><col /><col /><col /><col />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>분류</th>
                            <th>버전</th>
                            <th>구분</th>
                            <th>신청자</th>
                            <th>연구자</th>
                            <th>연구책임자</th>
                            <th>동의서</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            consentForm?.length > 0 ?
                            consentForm?.map((item,index) => {

                                // const formTypeCd = item.formTypeCd
                                // 동의서 구분
                                // const isRequire = formTypeCd === 'SUBJECT' || formTypeCd === 'REPRESENTATIVE' ?true : false
                                // let consentTypeClassName = 'require'
                                // let consentTypeName = '필수'
                                // if(!isRequire){
                                //     consentTypeClassName = 'choice'
                                //     consentTypeName = '선택'
                                // }

                                return(
                                    <tr key={index}>
                                        {/* <td className='txt-left' title={`${consentTypeName} ${item.formTypeCdNm}`}><span className={`pr4 ${consentTypeClassName}`}>[{consentTypeName}]</span>{item.formTypeCdNm}</td> */}
                                        <td>{item.formTypeCdNm}</td>
                                        <td title={item.version}>{item.version}</td>
                                        <td>{item.consentTypeCdNm}</td>
                                        <td>
                                            <span className="signchk">
                                                <span>{item.applicantNm}</span>
                                                <span>
                                                    {   
                                                        item.consentTypeCd === 'PAPER' ? 
                                                            dateTimeFormat(item.createDtm)
                                                            : dateTimeFormat(item.applicantSignDtm)
                                                    } 
                                                </span>
                                            </span>
                                        </td>
                                        <td>
                                            <span className="signchk">
                                                <span>{item.researcherUserNm ?? ''} </span>
                                                <span>
                                                    {
                                                        item.consentTypeCd === 'PAPER' ? 
                                                            '-'
                                                            : dateTimeFormat(item.researcherSignDtm) ?? ''
                                                    } 
                                                </span>
                                            </span>
                                        </td>
                                        <td>
                                            <span className="signchk">
                                                <span>{item.managerUserNm ?? ''} </span>
                                                <span>
                                                    {
                                                        item.consentTypeCd === 'PAPER' ? 
                                                            '-'
                                                            : dateTimeFormat(item.managerSignDtm) ?? ''
                                                    } 
                                                </span>
                                            </span>
                                        </td>
                                        <td>
                                            <span className="middle-center">
                                                {item.statusCdNm ?? '미서명'}
                                                {
                                                    item?.statusCd === 'COMPLETE' ? 
                                                        <button type="button" className="btn-square btn-h32" onClick={()=>onDownload(item)}>다운로드</button>
                                                    : ''
                                                }                                            
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })
                            : <tr><td colSpan={7}>등록된 동의서가 없습니다.</td></tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ComponentConsent;