import { actionDownloadS3Data } from "../modules/action/CommonAction"

export function valideSizeCheck(file) {
    //업로드파일 사이즈 체크 10MB
    const maxSize = 10 * 1024 * 1024    //10MB
    const fileSize = file.size
    if (fileSize > maxSize) {
        return false
    } else {
        return true
    }
}

export function checkFileExt(file_ext) {
    let ext = (file_ext).replace('.', '')
    let fileClass = 'file'
    if (ext == 'jpg' || ext == 'jpge' || ext == 'png' || ext == 'gif') {
        fileClass = 'img'
    } else if (ext == 'pdf') {
        fileClass = 'pdf'
    } else if (ext == 'txt') {
        fileClass = 'txt'
    } else if (ext == 'hwp') {
        fileClass = 'hwp'
    } else if (ext == 'pptx') {
        fileClass = 'pptx'
    } else if (ext == 'xlsx') {
        fileClass = 'xlsx'
    }
    return fileClass;
}

export function upLoadFile(file) {
    const fileArr = file?.split('.').reverse();
    const ext = fileArr[0]
    let fileClass = 'file'

    if (ext === 'jpg' || ext == 'jpeg' || ext == 'png' || ext == 'gif') {
        fileClass = 'img'
    } else if (ext == 'pdf' || ext == 'rtf') {
        fileClass = 'pdf'
    } else if (ext == 'xls' || ext == 'xlsx') {
        fileClass = 'xlsx'
    } else if (ext == 'ppt' || ext == 'pptx') {
        fileClass = 'pptx'
    } else if (ext == 'hwp') {
        return true
    } else if (ext == 'txt') {
        fileClass = 'txt'
    }
    return fileClass;
}

export const getByteSize = (file_size) => {

    let size = String(file_size).length < 7 ? `${(file_size / 1024).toFixed(2)} KB` : `${(file_size / 1024000).toFixed(2)} MB`;

    return size;
};


export const onDownS3 = (file) => {
    let params = {
        path: file.filePath.slice(file.filePath.lastIndexOf('/') + 1),
        fileName: file.saveFileNm,
        originalFileNm: file.originalFileNm
    }
    actionDownloadS3Data(params).then((res) => { })
}