import axios from "axios";

export async function actionGetMemberInfo(data) {
    let result
  
    await axios.get(`/api/member/info/${data.memberId}`)
      .then(res => {
        result = res.data
      })
  
    return result
  }
  

//------------------------ [가입] -------------------------
export async function actionGetMemberLoginId(id) {
  let result

  await axios.get(`/api/member/id/${id}`)
    .then(res => {
      result = res.data
    })

  return result
}

export async function actionCreateAuthCode(data) {
  let result

  await axios.post("/api/member/auth-code", data)
    .then(res => {
      result = res.data
    })

  return result
}

export async function actionGetAuthCode(data) {
  let result

  await axios.get(`/api/member/auth-code`, {params: data})
    .then(res => {
      result = res.data
    })

  return result
}

export async function actionCreateMember(data) {
  let result

  await axios.post("/api/member/join", data)
    .then(res => {
      result = res.data
    })

    return result
}

export async function actionGetTerms(data) {
  let result

  await axios.get("/api/common/terms", {params: data})
    .then(res => {
      result = res.data
    })
  
  return result
}

export async function actionGetCheckMember(data) {
  let result

  await axios.get(`/api/member/check` , {params: data})
    .then(res => {
      result = res.data
    })

  return result
}

export async function actionUpdateMember(data) {
  let result
  
  await axios.put("/api/member", data)
    .then(res => {
      result = res.data
    })
  
  return result
}


export async function actionDeleteMember(data) {
  let result
  await axios.put(`/api/member/secession`, data)
    .then(res => {
      result = res.data
    })

  return result
}

export async function actionUpdateLastPwChgDate(data) {
  let result
  
  await axios.put("/api/member/last-pw-chg-date", data)
    .then(res => {
      result = res.data
    })
  
  return result
}