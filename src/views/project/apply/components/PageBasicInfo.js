import React, { useEffect, useState } from 'react';
import { dateFormat, getCurrentDate } from '../../../../utiles/date';
import { GENDER, getCodeOption } from '../../../../utiles/code';
import SelectBox from '../../../components/SelectBox';
import Datepicker from '../../../components/picker/Datepicker';


const PageBasicInfo = (props) => {
    let { projectInfo , params , setParams , member 
        ,optionsMethodTypeCd , optionsgender 
    } = props
    
    const today = dateFormat(getCurrentDate())

    // 신청자 구분
    const [ applyType , setApplyType ] = useState([])

    //[1-1] datepicker 
    const [subjectBirthDate, setSubjectBirthDate] = useState('');
    const [birthDateDisable, setBirthDateDateDisable] = useState(false)
    // [1-2] selectBox
    const [subjectGender , setSubjectGender] = useState('')
    

    useEffect(()=>{
        if(projectInfo){
            // 신청자구분(피험자: SUBJECT ,대리인 : REPRESENTATIVE) GROUP_CD : APPLICANT_TYPE
            // const constraintValue = projectInfo?.constraintList.filter(x=>x.constraintTypeCd === 'METHOD')[0]?.constraintValue
            // if(constraintValue === 'UNLIMIT'){
            //     setApplyType(['SUBJECT','REPRESENTATIVE'])
            // }else{
            //     setApplyType([constraintValue])
            // }

            setApplyType(['SUBJECT','REPRESENTATIVE'])

            setSubjectBirthDate(params?.subjectBirthDate ?? '')
            setSubjectGender(params?.subjectGender ?? '')

            setParams({...params , 
                applicantTypeCd : 'SUBJECT',
                protocolNo:projectInfo?.protocolNo,

                subjectRelation : null,
                subjectNm : null,
                subjectBirthDate : null,
                subjectGender : null,

                prenancyYn : null  
            })
        }
    },[projectInfo])

    useEffect(()=>{
        setParams({...params, 
            subjectBirthDate: subjectBirthDate ,
            subjectGender: subjectGender ,
        })
    },[subjectBirthDate , subjectGender])

    // [2] 핸들 --------------------------------
    const handleChange = (e) => {
        if(e.target.type === 'radio'){
            switch (e.target.name) {
                case 'applicantTypeCd':
                    setParams({...params , 
                        applicantTypeCd : e.target.id,
                        protocolNo:projectInfo?.protocolNo,
        
                        subjectRelation : null,
                        subjectNm : null,
                        subjectBirthDate : null,
                        subjectGender : null,

                        prenancyYn : null  
                    })
                    setSubjectGender('')
                    setSubjectBirthDate('')
                    break;
                case 'prenancyYn':
                    setParams({...params , prenancyYn : e.target.id})
                    break;
            }
        }else
        if(e.target.type === 'text'){
            switch (e.target.name) {
                case 'subjectRelation':
                    setParams({...params , subjectRelation : e.target.value})
                    break;
                case 'subjectNm':
                    setParams({...params , subjectNm : e.target.value})
                    break;
            }
        }
    }

    return (
        <>
            <div className="detail-info">
                <div className="balance">
                    <div className="txt-title">참여신청 임상시험 정보</div>
                </div>
                <div className="line-box">
                    <div className="grid locate-3x gap40x">
                        <div className="dot-txt tit">공고제목</div>
                        <div>{projectInfo?.postTitle}</div>
                    </div>
                    <div className="grid locate-3x gap40x">
                        <div className="dot-txt tit">신청일</div>
                        <div>{today}</div>
                    </div>
                </div>
            </div>
            <div className="detail-info">
                <div className="balance">
                    <div className="txt-title">신청자 구분</div>
                </div>
                <div className="vertical-table">
                    <div>
                        <div className="th required">신청자 구분</div>
                        <div className="gap16x">
                            {
                                applyType?.length > 0 ? 
                                applyType?.map((item,idx) => {
                                    return(
                                        <span key={idx}>
                                            <input type="radio" 
                                                   id={item} 
                                                   name='applicantTypeCd'
                                                   onChange={handleChange}
                                                   checked={params?.applicantTypeCd === item}
                                            />
                                            <label htmlFor={item}>{optionsMethodTypeCd?.find(x=>x.value === item)?.label}</label>
                                        </span>
                                    )
                                })
                                : ''
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="detail-info">
                <div className="balance">
                    <div className="txt-title">신청자 정보 확인</div>
                    <button type="button" className="btn-square" onClick={()=>props.history.push('/mypage/privacy')}>개인정보 수정</button>
                </div>
                <div className="vertical-table">
                    <div>
                        <div className="th">성명</div>
                        <div>{member?.memberNm ?? ''}</div>
                    </div>
                    <div>
                        <div className="th">생년월일</div>
                        <div>{member?.birthDate ?? ''}</div>
                    </div>
                    <div>
                        <div className="th">성별</div>
                        <div>{member?.gender === 'M' ? '남' : member?.gender === 'F' ? '여' : ''}</div>
                    </div>
                    <div>
                        <div className="th">휴대폰번호</div>
                        <div>{member?.mobileNo?.replace(/-/g, '').replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')}</div>
                    </div>
                    <div>
                        <div className="th">전화번호</div>
                        <div>
                            {
                                member?.phoneNo ? 
                                    member?.phoneNo?.replace(/-/g, '').replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3') 
                                    : '-'
                            }
                        </div>
                    </div>
                    <div>
                        <div className="th">이메일</div>
                        <div>{member?.email ?? '-'}</div>
                    </div>
                    <div>
                        <div className="th">주소</div>
                        <div>({member?.zipCode}) {member?.address} {member?.addressDetail}</div>
                    </div>
                </div>
            </div>

            {
                params?.applicantTypeCd === 'REPRESENTATIVE' ?
                    <div className="detail-info">
                        <div className="balance">
                            <div className="txt-title">시험대상자 정보 입력</div>
                        </div>
                        <div className="vertical-table">
                            <div>
                                <div className="th required">신청자와의 관계</div>
                                <div className='applicant-input'>
                                    <input 
                                        type="text" 
                                        name="subjectRelation"
                                        placeholder="시험대상자는 신청자와 어떤 관계인지 입력해 주세요."
                                        onChange={handleChange}
                                        value={params?.subjectRelation || ''}
                                        autoComplete='off'
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="th required">시험대상자 성명</div>
                                <div className='applicant-input'>
                                    <input 
                                        type="text" 
                                        name="subjectNm"
                                        placeholder="임상시험에 참여할 당사자의 성명을 입력해 주세요."
                                        onChange={handleChange}
                                        value={params?.subjectNm || ''}
                                        required
                                        autoComplete='off'
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="th required">시험대상자 생년월일</div>
                                <div className="applicant-module">
                                    <Datepicker name='subjectBirthDate' value={subjectBirthDate} setDate={setSubjectBirthDate} disable={birthDateDisable} placeholderText="YYYY-MM-DD" maxYearAdd={10}/>
                                </div>
                            </div>
                            <div>
                                <div className="th required">시험대상자 성별</div>
                                <div className="applicant-module">
                                    <SelectBox options={optionsgender} setValue={setSubjectGender} selectValue={subjectGender} />
                                </div>
                            </div>
                        </div>
                    </div>
                    : ''
            }
            
            {
                params?.applicantTypeCd !== '' 
                    && ( (params?.applicantTypeCd !== 'REPRESENTATIVE' && params?.applicantGender === 'F' ) 
                        || (params?.applicantTypeCd !== 'SUBJECT' && params?.subjectGender === 'F' )) ?
                    <div className="detail-info">
                        <div className="balance">
                            <div className="txt-title">추가사항 입력</div>
                        </div>
                        <div className="vertical-table">
                            <div>
                                <div className="th required">임신여부</div>
                                <div className="gap16x">
                                    <span>
                                        <input type="radio" 
                                                id='N' 
                                                name='prenancyYn'
                                                onChange={handleChange}
                                                checked={params?.prenancyYn === 'N'}
                                        />
                                        <label htmlFor="N">아니오</label>
                                    </span>
                                    <span>
                                        <input type="radio" 
                                                id='Y' 
                                                name='prenancyYn'
                                                onChange={handleChange}
                                                checked={params?.prenancyYn === 'Y'}
                                        />
                                        <label htmlFor="Y">예</label>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <span className="attention">시험대상자가 임신 가능성이 있거나 임신하신 경우 표시하여 주세요.</span>
                    </div>
                    :''
            }
            
        </>
    );
};

export default PageBasicInfo;