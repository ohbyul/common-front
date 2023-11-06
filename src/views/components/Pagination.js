import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Pagination({totalPage, currentPage, pageSize}) {
  //totalPage : 총 페이지 개수, currentPage : 현재 페이지, pageSize : 보여줄 페이지 번호 개수
  const [ target , setTarget] = useState()
  const [ upHref ,setUpHref] = useState('')
  const [ downHref ,setdownHref] = useState('')

  const [firstPage , setFirstPage] = useState()
  const [lastPage , setLastPage] = useState()

  const params =  new URLSearchParams(location.search);  

  
  useEffect( () => {
    let up_href;
    let down_href;

    let up_val;
    let down_val;

    if(totalPage.length == 1){
      up_val = 1
      down_val = 1
    }else if(currentPage == totalPage.length){
      up_val = currentPage-1
      down_val = totalPage.length
    }else{
      up_val = currentPage-1
      down_val = currentPage+1
    }

    up_val < 1? up_val = 1:'';
    
    params.set("page", up_val);
    up_href =`${location.pathname}?${params.toString()}`
    
    params.set("page",down_val);
    down_href =`${location.pathname}?${params.toString()}`

    setUpHref(up_href)
    setdownHref(down_href)
    
    const currentPageNum =Math.floor((currentPage + pageSize -1) / pageSize)
    // 맨처음 
    let prePage = ((currentPageNum - 1)* pageSize) - (pageSize -1)
    if(prePage < 0) {
      prePage = 1
    }
    //맨마지막
    let nextPage = ( currentPageNum * pageSize) + 1
    if(totalPage.length < nextPage){
      nextPage = totalPage.length
    }

    params.set("page" , prePage)
    setFirstPage(`${location.pathname}?${params.toString()}`)
    params.set("page" , nextPage)
    setLastPage(`${location.pathname}?${params.toString()}`)

    let offset = Math.floor(currentPage / pageSize);
    currentPage % pageSize == 0 ? offset -= 1 : offset;
    let start = 0 + pageSize * offset;
    let end = 0 + pageSize * offset + pageSize;
    setTarget(totalPage?.slice(start, end))
  },[totalPage])


  return (
    <>
    {
      totalPage.length > 0 ?
        <div>
          <Link className={currentPage === 1? "direction double-left disabled" : "direction double-left"} to={firstPage} disabled={currentPage === 1} ></Link>
          <Link className={currentPage === 1? "direction left disabled" : "direction left"} to={upHref} disabled={currentPage === 1}></Link>
          {
            target?.map((item, i) => {
              params.set("page", item);
              let href =`${location.pathname}?${params.toString()}`
              return (
                <Link className={currentPage === item ? "selected" : ""} to={href} key={i}>{item}</Link>
              )
            })
          }
          <Link className={currentPage === totalPage?.length? "direction right disabled" : "direction right"} to={downHref} disabled={currentPage === totalPage.length}></Link>
          <Link className={currentPage === totalPage?.length? "direction double-right disabled" : "direction double-right"} to={lastPage} disabled={currentPage === totalPage.length}></Link>
        </div>
        : ''
    }
    </>
  );
}

export default Pagination;


