import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function PaginationModal({totalPage, currentPage, setPage, pageSize}) {
    //totalPage : 총 페이지 개수, limit : 한 페이지에 담는 데이터 수, currentPage : 현재 페이지, start : 페이지 시작, end : 페이지 종료, pageLimit : 보여줄 페이지 번호 개수
  const [ target , setTarget] = useState()
  const toLink = location
  
  const previous = () => {
    if (currentPage === 1) {
      return
    }
    setPage(currentPage - 1)
  }
  const next = () => {
    if(currentPage  === totalPage.length){
      return
    }
    setPage(currentPage + 1)
  }

  useEffect( () => {
    let offset = Math.floor(currentPage / pageSize);
    currentPage % pageSize == 0 ? offset -= 1 : offset;
    let start = 0 + pageSize * offset;
    let end = 0 + pageSize * offset + pageSize;
    setTarget(totalPage?.slice(start, end))
  },[totalPage])

    return (
        <>
            <div>
                <Link className={currentPage === 1 ? "direction left disabled" : "direction left"} to={toLink} onClick={previous} disabled={currentPage === 1}></Link>
                {
                    target?.map((item, i) => {
                        return (
                            <Link className={currentPage === item ? "selected" : ""} to={toLink} key={i} onClick={() => setPage(item)}>{item}</Link>
                        )
                    })
                }
                <Link className={currentPage === totalPage?.length ? "direction right disabled" : "direction right"} to={toLink} onClick={next} disabled={currentPage === totalPage.length}></Link>
            </div>
        </>
    );
}

export default PaginationModal


