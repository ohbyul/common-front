import React, { useEffect, useState } from 'react';
import routes from '../../routes';

const ContentsNavi = (props) => {
    let {prop} = props;
    const [pathData, setPathData] = useState()

    useEffect( ()=> {
        // [1] 쿼리 스트링 , path
        const path = prop.location.pathname
        const query = prop.location.search
        const queryObj =  new URLSearchParams(query);

        // [2] url 슬라이드 배열 
        let pathArr = path?.split('/')
        pathArr = pathArr.filter(item => {
            if(item !== '' && isNaN(Number(item))){
                return item
            }
        })

        //[3] 코딩페이지 여부
        const codingPageCheck = pathArr.includes('coding')

        let pathResult = []
        // pathArr.map((item)=>{
        //     routes?.navi.map((navi) => {
        //         if(item === navi.key){
        //             if(navi.urlYn){
        //                 let urlStr = navi.url;
        //                 if(navi.url.includes('projectId')){
        //                     const projectId = queryObj?.get('project') ?? 0
        //                     urlStr = urlStr.replace('projectId',projectId)
        //                 }
        //                 pathResult.push( {path : navi.value , urlYn : navi.urlYn , url : urlStr } )
        //             }else{
        //                 let projectCheck = pathArr.find(item => item === 'project')
        //                 let subjectCheck = pathArr.find(item => item === 'subject')
        //                 if(item === 'detail' && projectCheck && !subjectCheck){
        //                     const tab = queryObj?.get('tab') ?? 'detail'
        //                     let value = '';
        //                     if(tab === 'detail') value = '과제 정보'
        //                     if(tab === 'participant') value = '연구자 정보'
        //                     if(tab === 'subject') value = '연구 대상자'
        //                     pathResult.push( {path : value , urlYn : false} )
        //                 }else{
        //                     pathResult.push( {path : navi.value , urlYn : false} )
        //                 }
        //             }
        //         }
        //     })
        // })
        pathArr.map((item)=>{
            let navi = routes?.navi.find(data => data.key === item)
            if(navi){
                if(navi.urlYn){
                    let urlStr = navi.url;
                    pathResult.push( {path : navi.value , urlYn : navi.urlYn , url : urlStr } )
                }else{
                    if(!codingPageCheck){
                        pathResult.push( {path : navi.value , urlYn : false} )    
                    }else{
                        if(navi.value === '코딩관리'){
                            pathResult.push( {path : navi.value , urlYn : false} )
                        }
                    }
                    
                }
            }
        })
        setPathData(pathResult)
    },[prop])

    

    return (
            <div className="contents-navi">
                {
                    pathData?.map((item , index)=>{
                        return(
                            item.urlYn ? 
                            <span key={index}>
                                <a href={item.url} className="nav__right-arrow">{item.path}</a>
                            </span>
                            : <span key={index}>{item.path}</span>
                        )
                    })
                }
            </div>
    );
};

export default ContentsNavi;