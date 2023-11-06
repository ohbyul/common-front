import axios from "axios";

export async function actionInsertSubject(data) {
  let result

  await axios.post(`/api/subject/apply`, data)
    .then(res => {
      result = res.data
    })

  return result
}

export async function actionGetSubjectInfo(param) {
  let result

  await axios.get(`/api/subject/info/${param.id}` , {params: param})
    .then(res => {
      result = res.data
    })

  return result
}

export async function actionUpdateSubjectStatus(param) {
  let result

  await axios.put(`/api/subject/status/${param?.subjectId}`, param)
    .then(res => {
      result = res.data
    })

  return result
}