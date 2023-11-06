import React, { useEffect, useState, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf/dist/esm/entry.webpack5';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useElementSize } from 'usehooks-ts'
import { actionGetS3File } from '../../../../modules/action/CommonAction';
import { onDownS3 } from '../../../../utiles/file';

const ComponentDocument = (props) => {
    let { document } = props
    
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(null);

    const [pdfSizeRef, { width, height }] = useElementSize();
    const canvasRef = useRef();

    const [file, setFile] = useState()
    const options = {
        cMapUrl: 'cmaps/',
        cMapPacked: true,
        standardFontDataUrl: 'standard_fonts/',
    };

    useEffect(()=>{
        if(document){
            let params = {
                path: document.filePath.slice(document.filePath.lastIndexOf('/')+1),
                fileName: document.saveFileNm
            }
    
            actionGetS3File(params).then((res)=>{
                setFile(res)
            })
        }
    },[document])

    function onDocumentLoadSuccess({ numPages: nextNumPages }) {
        setNumPages(nextNumPages);
        setPageNumber(1)
    }

    const onDown = () => {
        onDownS3(document)
    }

    return (
        <div className="detail-info">
            <div className="balance">
                <div className="txt-title">
                    모집공고 상세 안내
                    <span>* 상세모집내용은 공고문 다운로드 또는 아래 내용을 통해 확인해 주세요.</span>
                </div>
                <button type="button" className="btn-square icon down" onClick={onDown}>다운로드</button>
            </div>
            <div className="line-box" style={{height:'700px' , overflowY:'scroll'}}>
                <div className="pdf-layer" ref={pdfSizeRef}>
                    <Document file={file} onLoadSuccess={onDocumentLoadSuccess} options={options}>
                        {Array.from(new Array(numPages), (el, index) => (
                            <div key={index} className="pdf-canvas">
                                <Page inputRef={canvasRef} width={width-6} pageNumber={index + 1} renderTextLayer={false} loading={''}>
                                </Page>
                            </div>

                        ))}

                    </Document>
                </div>
            </div>
            <div className="sub-info">
                * 본 시험정보는 해당 IRB(임상시험심사위원회)에 승인된 공고이며, [약사법]에 따른 식약처 임상시험 대상자 모집공고문 표준안을 준수합니다.<br />
                단, 약사법 개정 전(2018년 10월) 정보는 개정 이전 약사법을 준수합니다.
            </div>
        </div>
    );
};

export default ComponentDocument;