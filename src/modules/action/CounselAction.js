import axios from "axios";

export async function actionGetCounselHistory(param) {
  let result

  await axios.get(`/api/counsel/history/${param.id}` , {params: param})
    .then(res => {
      result = res.data
    })

  return result
}


export async function actionInsertCounsel(projectId,param) {
  let result

  await axios.post(`/api/counsel/reservation/${projectId}`, param)
    .then(res => {
      result = res.data
    })

  return result
}