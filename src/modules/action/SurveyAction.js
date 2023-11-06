import axios from "axios";

export async function actionInsertSurvey(data) {
  let result

  await axios.post(`/api/survey/${data.subjectId}`, data)
    .then(res => {
      result = res.data
    })

  return result
}
