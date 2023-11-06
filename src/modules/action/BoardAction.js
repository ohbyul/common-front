import axios from "axios";
import { encrypt } from '../../utiles/crypto';
import { timeStamp } from '../../utiles/common';

export async function actionGetBoardList(data) {
    let result
    await axios.get(`/api/board/public/${data.bbsKindCd}`,{params: data} )
      .then(res => {
        result = res.data
      })
  
    return result
}

export async function actionGetAuthBoardList(data) {
  let result
  await axios.get(`/api/board/auth/${data.bbsKindCd}`,{params: data} )
    .then(res => {
      result = res.data
    })

  return result
}

export async function actionGetBoardInfo(data) {
  let result 
  await axios.get(`/api/board/public/${data.bbsKindCd}/${data.id}`, {params: data})
    .then(res => {
      result = res.data
    })

    return result
}

export async function actionInsertBoard(param,data) {
  let result

  await axios.post(`/api/board/${data.get('bbsKindCd')}`, data, { headers : {'Content-Type' : 'multipart/form-data'}})
    .then(res => {
      result = res.data
  })

  return result
}

export async function actionDeleteBoard(data) {
  let result 
  await axios.delete(`/api/board/${data?.id}`)
    .then(res => {
      result = res.data
    })
    return result
}

export async function actionUpdateBoard(param, data) {
  let result
  await axios.put(`/api/board/${data.get('bbsKindCd')}/${param?.id}`, data, { headers : {'Content-Type' : 'multipart/form-data'}})
    .then( res => {
      result = res.data
    })
    return result
}

export async function actionUpdateDisplayBoard(data) {
  let result
  await axios.put(`/api/board/displayYn`, data)
    .then( res => {
      result = res.data
    })
    return result
}

// 에디터 이미지 getUrl
export async function actionUploadEditorImage(data) {
  let result

  await axios.post(`/api/board/editor/image`, data, { 
    headers : {'Content-Type' : 'multipart/form-data'}
  }).then(res => {
      result = res.data
  })

  return result
}
