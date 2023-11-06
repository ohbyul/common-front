import React, { useEffect, useState } from 'react';


const AppFooter = () => {
    return (
        <div id='footer'>
            <div>
                <div className='footer-logo'>
                    {/* <a href='/' className='logo-link'><img src='/images/logo_footer.svg' /></a> */}
                </div>
                <div className='footer-txt'>
                    <div>
                        {/* <span><a data-type="PRIVACY" onClick={onModal}>개인정보처리방침</a></span> */}
                        {/* <span><a data-type="SERVICE" onClick={onModal}>이용약관</a></span> */}
                    </div>
                    <div>
                        {/* <span>common</span> */}
                        {/* <span>대표자 : 안치성</span> */}
                        {/* <span>서울특별시 중구 창경궁로 240-7 A&A TOWER 2층</span> */}
                        {/* <span>E-Mail : common@urbancorp.co.kr</span> */}
                    </div>
                    <div className="copyright">COPYRIGHTⒸ 2023 BYUL.OH CO All rights reserved</div>
                </div>
            </div>
        </div>
    )
}

export default React.memo(AppFooter)
