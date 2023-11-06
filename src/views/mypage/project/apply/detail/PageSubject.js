import React, { useEffect, useState } from 'react';
import ComponentApplicantInfo from './components/ComponentApplicantInfo';
import ComponentCancelReason from './components/ComponentCancelReason';
import ComponentScreening from './components/ComponentScreening';
import ComponentConsent from './components/ComponentConsent';
import ComponentCounsel from './components/ComponentCounsel';

const PageSubject = (props) => {
    let { subject , isReject , projectId, subjectId, funcGetSubjectInfo } = props

    return (
        <div className="tab-info mypage-counsel">

            <ComponentApplicantInfo {...props} />
            
            {
                isReject ? 
                    <ComponentCancelReason {...props} />
                    : <></>
            }
            
            <ComponentScreening {...props} />

            <ComponentConsent {...props}  />

        </div>
    );
};

export default PageSubject;