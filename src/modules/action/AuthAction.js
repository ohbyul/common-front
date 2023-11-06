import axios from "axios";
import { LOGIN_MEMBER } from './actionTypes'

export async function actionLoginMember(data) {

  let result;
  await axios.post("/api/auth/login", data)
    .then(res => {
      result = res.data
    })
    return {
      type: LOGIN_MEMBER,
      payload: result
    }
}

export async function actionAutoLogin(data) {

  let result;
  await axios.post("/api/auth/auto-login", data)
    .then(res => {
      result = res.data
    })
    return {
      type: LOGIN_MEMBER,
      payload: result
    }
}


export async function actionCreateAuthCode(data) {
  let result

  await axios.post("/api/auth/auth-code", data)
    .then(res => {
      result = res.data
    })

  return result
}

export async function actionGetAuthCode(data) {
  let result

  await axios.get(`/api/auth/auth-code`, {params: data})
    .then(res => {
      result = res.data
    })

  return result
}

export async function actionGetFindId(data) {
  let result
  await axios.get(`/api/auth/id/${data}`)
    .then(res => {
      result = res.data
    })

  return result
}

export async function actionGetMemberId(data) {
  let result
  await axios.get(`/api/auth/member/${data}`)
    .then(res => {
      result = res.data
    })
  
    return result
}

export async function actionUpdatePw(data) {
  let result

  await axios.put("/api/auth/password", data)
    .then(res => {
      result = res.data
    })
  return result
}
