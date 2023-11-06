import React, { useState } from 'react';
import ComponentFindId from './components/ComponentFindId';
import ComponentFindPw from './components/ComponentFindPw';
import ComponentCompleteId from './components/ComponentCompleteId';
import ComponentCompletePw from './components/ComponentCompletePw';

const findAccount = (props) => {
    //[1] FindInfo
    const [findInfo, setFindInfo] = useState({
        mobileNo: '',
        memberId : '',
        memberPwd : '',
        memberPwdChk : '',
        memberJoinDate : ''
    });

    //[1-2] validation
    const [ error , setError ] = useState({
        memberId :       { error : null , msg : null , class : '' , isAuthComplete : false } ,
        mobileNo :     { error : null , msg : null , class : '' , isAuth : false , isAuthComplete : false } , 
        authMobileNo : { error : null , msg : null , class : '' } , 
        memberPwd :      { error : null , msg : null , class : '' } , 
        memberPwdChk :   { error : null , msg : null , class : '' } , 
    });

    const [ selectedTap , setSelectedTap ] = useState('id');

    const [ isComplete , setIsComplete ] = useState(false);

    const handleTabChange = (e) => {
        setSelectedTap(e.target.name);
        setIsComplete(false);
        setFindInfo({...findInfo , mobileNo:'', memberId:'', memberPwd:'', memberPwdChk:'', memberJoinDate:''})
    }

    return (
        <>
            <div className="user-wrap">
                <div className="con-header">
                    <div>
                        <div className="h1">아이디/비밀번호 찾기</div>
                        <div className="subtxt">아이디/비밀번호를 잊어 버리셨나요?</div>
                        <ul>
                            <li></li>
                            <li></li>
                            <li></li>
                        </ul>
                    </div>
                </div>

                <div className="con-body">
                    <div className="user-info">
                        <div className='tabs'>
                            <input type='radio' id='tab-id' name="id" onChange={handleTabChange} checked={selectedTap === 'id'}  />
                            <label htmlFor='tab-id'>아이디 찾기</label>
                            { isComplete && selectedTap === 'id' ? <ComponentCompleteId {...props} findInfo={findInfo}/> :
                            selectedTap === 'id' && <ComponentFindId {...props} findInfo={findInfo} setFindInfo={setFindInfo} setIsComplete={setIsComplete} error={error} setError={setError} selectedTap={selectedTap} />}

                            <input type='radio' id='tab-pw' name="pw" onChange={handleTabChange} checked={selectedTap === 'pw'}/>
                            <label htmlFor='tab-pw'>비밀번호 찾기</label>
                            { isComplete && selectedTap === 'pw' ? <ComponentCompletePw {...props} /> :
                            selectedTap === 'pw' && <ComponentFindPw {...props} findInfo={findInfo} setFindInfo={setFindInfo} setIsComplete={setIsComplete} error={error} setError={setError} selectedTap={selectedTap}/>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default findAccount