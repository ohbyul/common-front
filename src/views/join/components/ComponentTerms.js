import React, { useEffect, useState } from 'react';
import { actionGetTerms } from '../../../modules/action/MemberAction';

const ComponentTerms = (props) => {
    let { joinInfo, setJoinInfo } = props

    const [isOpenService, setIsOpenService] = useState(false)    //서비스 약관 toggle
    const [isOpenPrivacy, setIsOpenPrivacy] = useState(false)    //개인정본 약관 toggle

    const [isCheckAll, setIsCheckAll] = useState(false)             //all-checked
    const [checkedArr, setCheckedArr] = useState([])                //체크항목 arr

    const checkAllList = ['adult', 'service', 'privacy']

    const [ termsService , setTermsService ] = useState()
    const [ termsPrivacy , setTermsPrivacy ] = useState()
    useEffect(()=>{
        let data = {
            termsTypeCd: 'MEMBER',
            termsKindCd: 'service'
        }
        actionGetTerms(data).then((res) => {
            if (res.statusCode == "10000"){
                setTermsService(res.data)
            }
        })
    },[])

    useEffect(()=>{
        let data = {
            termsTypeCd: 'MEMBER',
            termsKindCd: 'privacy'
        }
        actionGetTerms(data).then((res) => {
            if (res.statusCode == "10000"){
                setTermsPrivacy(res.data)
            }
        })
    },[])

    // [1] 동의 
    const handleAllCheck = (checked) => {
        if (checked) {
            setIsCheckAll(true)
            setCheckedArr(checkAllList)
        } else {
            setIsCheckAll(false)
            setCheckedArr([])
        }
    }

    const handleCheck = (e) => {
        const checked = e.target.checked
        const type = e.target.id

        if (checked) {
            setCheckedArr(checkedArr.concat(type))
        } else {
            setCheckedArr(checkedArr.filter(item => item !== type))
        }

    }

    useEffect(() => {
        let temp = { service: null, privacy: null }
        checkAllList.map(item => {
            let isChecked = checkedArr.includes(item)
            switch (item) {
                case 'adult':
                    temp.adult = isChecked
                    break;
                case 'service':
                    temp.service = isChecked
                    break;
                case 'privacy':
                    temp.privacy = isChecked
                    break;
            }
        })
        setJoinInfo({ ...joinInfo, ...temp })
    }, [checkedArr])

    
    return (
        <div className="detail-info">
            <div className="balance">
                <div className="txt-title">약관동의</div>
            </div>
            <div className="line-box">
                <div className="terms">
                    <div>
                        <div className="chk-array chk-all">
                            <input type='checkbox'
                                name='chkAll'
                                id='chkAll'
                                onChange={(e) => handleAllCheck(e.target.checked)}
                                checked={checkedArr?.length === 3 ? true : false}
                            />
                            <label htmlFor="chkAll">아래 모든 약관에 모두 동의합니다.</label>
                        </div>
                    </div>

                    
                    <div>
                        <div className="chk-array">
                            <span>
                                <input type='checkbox' className='chk-input'
                                    name='adult'
                                    id='adult'
                                    onChange={(e) => handleCheck(e)}
                                    checked={checkedArr.includes('adult')}
                                />
                                <label htmlFor="adult"><span className="require">[필수]</span>만 19세 이상 확인</label>
                            </span>
                        </div>
                    </div>
                    <div>
                        <div className="chk-array standard">
                            <span>
                                <input
                                    type='checkbox'
                                    className='chk-input'
                                    name='service'
                                    id='service'
                                    onChange={(e) => handleCheck(e)}
                                    checked={checkedArr.includes('service')}
                                />
                                <label htmlFor="service">
                                    <span className="require">[필수]</span>서비스 이용약관 동의
                                </label>
                            </span>
                            {/* <span className={`drop-txt ${isOpenService ? 'open' : ''}`} id="service"
                                onClick={(e) => handleDropDown(e)}
                            >
                                약관보기<span className="drop"></span>
                            </span> */}
                            {/* accordion 화살표영역 */}
                            <span className="acc">
                                <input type='checkbox' name='acc' id="isOpenService" />
                                <label htmlFor="isOpenService">약관보기<span></span></label>
                            </span>
                        </div>
                        {/* <div className={`privacy-box ${isOpenService ? 'open' : ''}`}> */}
                        {/* <div className="privacy-box hide" >
                            {joinInfo?.terms?.service?.contents}
                        </div> */}
                        <div className="privacy-box hide"
                            dangerouslySetInnerHTML={{ __html: termsService?.contents }}
                        >
                        </div>
                    </div>
                    <div>
                        <div className="chk-array standard">
                            <span>
                                <input type='checkbox' className='chk-input'
                                    name='privacy'
                                    id='privacy'
                                    onChange={(e) => handleCheck(e)}
                                    checked={checkedArr.includes('privacy')}
                                />
                                <label htmlFor="privacy">
                                    <span className="require">[필수]</span>개인정보 수집 및 이용 동의
                                </label>
                            </span>
                            {/* <span className={`drop-txt ${isOpenPrivacy ? 'open' : ''}`} id="privacy"
                                onClick={(e) => handleDropDown(e)}
                            >
                                약관보기<span className="drop"></span>
                            </span> */}
                            {/* accordion 화살표영역 */}
                            <span className="acc">
                                <input type='checkbox' name='acc' id="isOpenPrivacy" />
                                <label htmlFor="isOpenPrivacy">약관보기<span></span></label>
                            </span>
                        </div>
                        {/* <div className={`privacy-box ${isOpenPrivacy ? 'open' : ''}`}> */}
                        {/* <div className="privacy-box hide">
                            {joinInfo?.terms?.privacy?.contents}
                        </div> */}
                        <div className="privacy-box hide"
                            dangerouslySetInnerHTML={{__html: termsPrivacy?.contents}}
                        >
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ComponentTerms