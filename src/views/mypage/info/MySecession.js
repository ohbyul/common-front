import React, { useEffect, useState, useRef } from "react";
import ComponentMemberCheck from "./components/ComponentMemberCheck";
import { decodeJwt } from "../../../utiles/cookie";
import ComponentSecession from "./components/ComponentSecession";
import ComponentCompleteSecession from "./components/ComponentCompleteSecession";


const MySecession = (props) => {
    //--------------- session ---------------
    const memberInfo =  decodeJwt("dtverseMember");
    //--------------- session ---------------
    const memberId = memberInfo?.memberId
    const [index, setIndex] = useState(0);

    return(
        <>
            {
                index === 0 ? 
                    <ComponentMemberCheck {...props} memberId={memberId} index={index} setIndex={setIndex}/>
                    :   index === 1 ?
                        <ComponentSecession {...props} index={index} memberId={memberId} setIndex={setIndex} />
                        :   <ComponentCompleteSecession {...props} />
            }
        </>
    )
}

export default MySecession