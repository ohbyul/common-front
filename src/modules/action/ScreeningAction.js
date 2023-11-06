import axios from "axios";

export async function actionGetScreeningHistory(param) {
  let result

  await axios.get(`/api/screening/history/${param.id}`,{params: param})
    .then(res => {
      result = res.data
    })

  return result
}


