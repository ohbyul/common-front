import axios from "axios";
import { encrypt } from '../../utiles/crypto';
import { timeStamp } from '../../utiles/common';

export async function actionGetCodeList(data) {

  let result;
  await axios.get("/api/common/code-list", { params: data })
    .then(res => {
      result = res.data
    })
  return result
}


//------------------------ [S3] -------------------------
// 다운로드
export async function actionDownloadS3Data(data) {
  const config = {
    responseType: 'blob',
    params: data
  };

  axios.get(`/api/common/s3`, config)
    .then((res) => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', data.originalFileNm); //or any other extension
      document.body.appendChild(link);
      link.click();
      link.remove();
      
    })
    .catch((error) => {
      toast.error('File download failed.');
    });
}


// 파일 데이터
export async function actionGetS3File(data) {
  let result;
  const config = {
    responseType: 'blob',
    params: data
  };

  let ext = data.fileName.slice( data.fileName.lastIndexOf('.')+1)
  
  await axios.get(`/api/common/s3`, config)
    .then((res) => {
      result = new File([res.data], data.fileName, {type: `application/${ext}`});
    })
    .catch((error) => {
      toast.error('File download failed.');
    });

    return result;
}

export async function actionGetUpperCodeList(data) {
  let result;
  await axios.get("/api/common/upper-code-list", {params: data})
    .then(res => {
      result = res.data
    })
    return result
}

export async function actionDownloadAllS3Data(data) {
  let { zipName ,boardId } =data
  let result
  let fileName = zipName.replace(/"."/gi, '_');

  await axios.post(`/api/common/s3/download-all/` + encrypt(boardId) )
      .then((res) => {
        let bytes = new Uint8Array(res.data.zipBuffer.data);
        let blob = new Blob([bytes], {type: "application/zip"});
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `${fileName}_${timeStamp()}.zip`
        link.click();
        link.remove();
      }
  )

  return result
}