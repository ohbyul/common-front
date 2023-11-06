import axios from "axios";


export async function actionInsertConsentDownloadHistory(data) {
  let result

  await axios.post(`/api/consent/download/history`, data )
    .then(res => {
      result = res.data
    })

  return result
}