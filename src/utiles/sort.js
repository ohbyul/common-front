export function onSortData({props, e, queryObj, path, sortState, setSortState}){
    queryObj.delete('page');

    const name = e.target.getAttribute("name");

    if(!name){
        return;
    }
    const key = sortState.key
    const value = sortState.value
    
    if(key === name){
        if(value + 1 > 2){
            setSortState({key : name, value : 0 })
            queryObj.delete('sortKey')
            queryObj.delete('sortValue')
        }else{
            setSortState({key : name, value : value+1 })
            queryObj.set('sortKey',name)
            queryObj.set('sortValue', value+1)
        }
    }else{
        setSortState({key : name, value : 1 })
        queryObj.set('sortKey',name)
        queryObj.set('sortValue', 1)
    }

    props.history.push(`${path}?` + queryObj.toString())
}
