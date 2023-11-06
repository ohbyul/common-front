import axios from "axios";

export async function actionGetProjectBoardList(data) {
  let result
  await axios.get(`/api/projectboard/${data.bbsKindCd}`,{params: data} )
    .then(res => {
      result = res.data
    })
  return result
}
// 상세
export async function actionGetProjectBoardInfo(data) {
  let result 
  await axios.get(`/api/projectboard/${data.bbsKindCd}/info/${data.id}`, {params: data})
    .then(res => {
      result = res.data
    })
    return result
}
// 삭제
export async function actionDeleteProjectBoard(data) {
  let result 
  await axios.delete(`/api/projectboard/${data?.id}`)
    .then(res => {
      result = res.data
    })
    return result
}

// 수정
export async function actionUpdateProjectBoard(param, data) {
  let result
  await axios.put(`/api/projectboard/${data.get('bbsKindCd')}/${param?.id}`, data, { headers : {'Content-Type' : 'multipart/form-data'}})
    .then( res => {
      result = res.data
    })
    return result
}

// 등록
export async function actionInsertProjectBoard(param,data) {
  let result

  await axios.post(`/api/projectboard/${data.get('bbsKindCd')}`, data, { headers : {'Content-Type' : 'multipart/form-data'}})
    .then(res => {
      result = res.data
  })

  return result
}