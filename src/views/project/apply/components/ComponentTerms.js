import React, { useEffect, useState } from 'react';
import { actionGetTerms } from '../../../../modules/action/MemberAction';


const ComponentTerms = (props) => {
    let { projectInfo, params, setParams, } = props

    const [isOpenPrivacy, setIsOpenPrivacy] = useState(false)    //정보 수집 약관 toggle
    const [isOpenAgent, setIsOpenAgent] = useState(false)        //제3자 약관 toggle

    const [isCheckAll, setIsCheckAll] = useState(false)             //all-checked
    const [checkedArr, setCheckedArr] = useState([])                //체크항목 arr

    const checkAllList = ['privacy', 'agent']
    
    const [ termsCollection , setTermsCollection ] = useState()
    const [ termsAgreement , setTermsAgreement ] = useState() 

    // [1] 전체동의 
    const handleAllCheck = (checked) => {
        if (checked) {
            setIsCheckAll(true)
            setCheckedArr(checkAllList)
        } else {
            setIsCheckAll(false)
            setCheckedArr([])
        }
    }

    // [2] 부분동의
    const handleCheck = (e) => {
        const checked = e.target.checked
        const type = e.target.id
        if (checked) {
            setCheckedArr(checkedArr.concat(type))
        } else {
            setCheckedArr(checkedArr.filter(item => item !== type))
        }
    }

    // [3] params 세팅
    useEffect(() => {
        let temp = { privacy: null, agent: null }
        checkAllList.map(item => {
            let isChecked = checkedArr.includes(item)
            switch (item) {
                case 'privacy':
                    temp.privacy = isChecked
                    break;
                case 'agent':
                    temp.agent = isChecked
                    break;
            }
        })
        setParams({ ...params, ...temp })

    }, [checkedArr])



    
    useEffect(()=>{
        let data = {
            termsTypeCd: 'TRIAL',
            termsKindCd: 'COLLECTION'
        }
        actionGetTerms(data).then((res) => {
            if (res.statusCode == "10000"){
                setTermsCollection(res.data.contents)
            }
        })
    },[])

    useEffect(()=>{
        let data = {
            termsTypeCd: 'TRIAL',
            termsKindCd: '3RD'
        }
        actionGetTerms(data).then((res) => {
            if (res.statusCode == "10000"){
                let orgsName = projectInfo?.organizationList?.map(org=>org.organizationNm).join(",")
                let contents = res.data.contents.replace("#{organization_list}", orgsName)
                setTermsAgreement(contents)
            }
        })
    },[])

    return (
        <div className="line-box">
            <div className='terms'>
                <div>
                    <div className='chk-array chk-all'>
                        <input type='checkbox'
                            name='chkAll'
                            id='chkAll'
                            onChange={(e) => handleAllCheck(e.target.checked)}
                            checked={checkedArr?.length === 2 ? true : false}
                        />
                        <label htmlFor='chkAll'>아래 모든 약관에 모두 동의합니다.</label>
                    </div>
                </div>
                <div>
                    <div className='chk-array standard'>
                        <span>
                            <input type='checkbox' className='chk-input'
                                name='privacy'
                                id='privacy'
                                onChange={(e) => handleCheck(e)}
                                checked={checkedArr.includes('privacy')}
                            />
                            <label htmlFor='privacy'>
                                <span className='require'>[필수]</span>정보 수집 이용 동의
                            </label>
                        </span>
                        <span className="acc">
                            <input type='checkbox' name='acc' id="isOpenService" />
                            <label htmlFor="isOpenService">약관보기<span></span></label>
                        </span>
                    </div>
                    <div className="privacy-box hide"
                        dangerouslySetInnerHTML={{ __html: termsCollection }}
                    >
                    </div>
                </div>
                <div>
                    <div className='chk-array standard'>
                        <span>
                            <input type='checkbox' className='chk-input'
                                name='agent'
                                id='agent'
                                onChange={(e) => handleCheck(e)}
                                checked={checkedArr.includes('agent')}
                            />
                            <label htmlFor='agent'>
                                <span className='require'>[필수]</span>정보 제3자 제공 동의
                            </label>
                        </span>
                        <span className="acc">
                            <input type='checkbox' name='acc' id="isOpenPrivacy" />
                            <label htmlFor="isOpenPrivacy">약관보기<span></span></label>
                        </span>
                    </div>
                    <div className="privacy-box hide"
                        dangerouslySetInnerHTML={{__html: termsAgreement}}
                    >
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComponentTerms;