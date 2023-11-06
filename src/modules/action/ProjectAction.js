import axios from "axios";

//------------------------ [프로젝트] -------------------------
export async function actionGetProjectList(data) {
  let result

  await axios.get("/api/project/post",{params: data})
    .then(res => {
      result = res.data
    })

  return result
}

export async function actionGetInterestList() {
  let result

  await axios.get("/api/project/interest")
    .then(res => {
      result = res.data
    })

  return result
}

export async function actionInsertScrap(data) {
  let result

  await axios.post(`/api/project/scrap/${data.projectId}`, data)
    .then(res => {
      result = res.data
    })

  return result
}

export async function actionGetProjectInfo(data) {
  let result

  await axios.get(`/api/project/clinical-trial/${data.projectId}` , {params:data})
    .then(res => {
      result = res.data
    })

  return result
}

//------------------------- [마이페이지] -------------------------
export async function actionGetMyProjectList() {
  let result

  await axios.get("/api/project/apply-list")
    .then(res => {
      result = res.data
    })

  return result
}

export async function actionGetMyApplyStatus() {
  let result

  await axios.get("/api/project/apply-status")
    .then(res => {
      result = res.data
    })

  return result
}
