import React, { useEffect, useMemo, useRef, useState } from "react"
import { actionUploadEditorImage } from "../../modules/action/BoardAction";

import ReactQuill , {Quill} from "react-quill"
import '../../assets/css/quill.snow.css'

import ImageResize from '@looop/quill-image-resize-module-react';
import { ImageDrop } from "quill-image-drop-module";

Quill.register('modules/ImageResize', ImageResize);
Quill.register("modules/imageDrop", ImageDrop);

function Reactquill({id, value, setVlaue}) {

    const quillRef = useRef(null);

    useEffect(() => {
        const quill = quillRef.current;

        const handleImage = () => {
            // 이미지 핸들 로직
            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");
            input.click();

            input.onchange = async () => {
                const file = input.files[0];

                // 현재 커서 위치 저장
                // const range = getEditor().getSelection(true);
                const range = quill.selection

                // 서버에 올려질때까지 표시할 로딩 placeholder 삽입
                quill.getEditor().insertEmbed(range.index, "image", `/images/loading.gif`);
                
                
                try {
                    // S3에 업로드 한뒤 이미지 태그에 삽입할 url을 반환받도록 구현
                    const formData = new FormData();
                    formData.append('file' , file)
                    const result = await actionUploadEditorImage(formData); 
                    const url = result.data
                    // console.log(url);
                    // 정상적으로 업로드 됐다면 로딩 placeholder 삭제
                    quill.getEditor().deleteText(range.index, 1);
                    // 받아온 url을 이미지 태그에 삽입
                    quill.getEditor().insertEmbed(range.index, "image", url);
                    
                    // 사용자 편의를 위해 커서 이미지 오른쪽으로 이동
                    quill.getEditor().setSelection(range.index + 1);
                } catch (e) {
                    quill.getEditor().deleteText(range.index, 1);
                }
            };
        }
        
        if (quillRef.current) {
            // const { getEditor } = quillRef.current;
            const toolbar = quill.getEditor().getModule("toolbar");
            toolbar.addHandler("image", handleImage);
        }
    }, []);
    
    const toolbarOptions = [
        // [{ 'font': [] }],    //웹사이즈 기본폰트를 사용하기위해 제거
        [{ header: "1" }, { header: "2" }, { 'header': [1, 2, 3, 4, false] }],
        ['bold', 'italic', 'underline','strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'list': 'check'}],
        [{'indent': '-1'}, {'indent': '+1'}],
        [{ 'align': [] } , { direction: "rtl" }],
        ['link' , 'image'],
        ["code-block"],
        [{ script: "sub" }, { script: "super" }],
        ['clean']                                         // remove formatting button
    ]
    const formats = [
        // 'font',
        'header',
        'bold', 'italic', 'underline', 'strike',
        'color', 'background',
        'list', 'bullet', ,'check',
        'indent',
        'align', 'direction',
        'link', 'image',
        "code-block",
        'script',
        'clean'
    ]

    const modules = useMemo(()=>{
        return {
            toolbar: {
                container: toolbarOptions,
            },
            // ImageResize: { modules: ['Resize'] },
            imageDrop: true,
            clipboard: {
                matchVisual: false              // toggle to add extra line breaks when pasting HTML:
            },

        }
    })

    return (
        <ReactQuill
            id={id}
            ref={quillRef}
            className="form-control text-editor"
            theme = 'snow'
            modules = {modules}
            formats = {formats}
            value = {value || ''}
            onChange = {(content, delta, source, editor) => setVlaue(editor.getHTML())}
            style = {{width: '100%'}}
        />
    )
} 

export default Reactquill;