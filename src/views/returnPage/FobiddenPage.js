import React, { Suspense } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

const FobiddenPage = () => {

  return (
   <div style={{left:"50%", top:"50%", position:"absolute", fontSize:"30px"}}>
     접근 권한이 없습니다.
   </div>
  )
}

export default React.memo(FobiddenPage)
