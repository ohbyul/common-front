import React, { useRef, useEffect } from 'react';
import Paper from 'paper';

const PaperCanvas = (props) => {
    let { regionsArr, page, regionInfo, dbCoordinatesList, updateRegionCount } = props;

    const canvasRef = useRef(null)

    const hitOptions = {
        segments: true,
        // stroke: true,
        fill: true,
        handles: true,
        tolerance: 5
    };

    const pathOptions = {
        strokeColor : "black",
        strokeWidth : 1,
        fillColor : 'rgba(255, 255, 0, 0.5)'
    }

    let hitResult;
    let region = {
        page: '',
        path:'', 
        lbSign: '',
        btnClose: '',
        lbAreaName: ''
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
        
        Paper.setup(canvas);
        Paper.settings.handleSize = 8;
            
        eventHandler();
    }, []);
    
    const eventHandler = () => {

        Paper.view.onMouseDown = (event) => {
            // which 1: 좌클릭, 2: 휠클릭, 3: 우클릭
            if (event.event.which != 1) {
                return false;
            }

            // 마우스를 누른 캔버스로 project 세팅
            Paper.project = event.currentTarget._project

            let point = event.point
            hitResult = Paper.project.hitTest(point, hitOptions);

            console.log(hitOptions);
            console.log(hitResult);
            console.log("regionInfo",regionInfo);

            // 서명자 영역 버튼을 클릭하지 않은 경우
            if (!hitResult && Object.keys(regionInfo).length === 0) {
                clearSelectReg();
                return false;
            }

            console.log(hitResult);

            clearSelectReg();

            // 도형, tag, 닫기버튼 클릭시
            if (hitResult) {
                // {type: 'fill', item: Path}
                // {type: 'fill', item: PointText}
                // {type: 'pixel', item: Raster, offset: Point}

                // X 이미지 클릭시
                if (hitResult.type == 'pixel') {
                    deleteReg();
                }
                
                else {
                    selectReg()
                }
            }

            // 맨땅 클릭시 hitResult null
            else {

                if (region.path) {
                    region.path.fullySelected = false;
                }

                newReg(point, point);

                // Paper.projects[0].view.draw();
            }
        };

        Paper.view.onMouseDrag = (event) => {
            // which 1: 좌클릭, 2: 휠클릭, 3: 우클릭
            if (event.event.which != 1) {
                return false;
            }

            // 서명자 영역 버튼을 클릭하지 않은 경우
            if (!hitResult && Object.keys(regionInfo).length === 0) {
                return false;
            }

            // 닫기 버튼 클릭시 드래그 방지
            if (hitResult?.item.className == 'Raster') {
                return;
            }

            // 캔버스 영역 내 마우스의 실제 좌표
            let point = event.point
            // 캔버스 영역 내 마우스가 얼마나 움직였는지 좌표
            // let dpoint = event.delta
            let dpoint = {x: event.event.movementX, y: event.event.movementY};

            let segments = region.path.segments;


            // hitResult null ==> 맨땅 클릭 (새로 그릴때)
            if (!hitResult) {
                if (point.x < 0) {
                    point.x = 0;
                }
                if (point.x > canvasRef.current.width) {
                    point.x = canvasRef.current.width;
                }
                if (point.y < 0) {
                    point.y = 0;
                }
                if (point.y > canvasRef.current.height) {
                    point.y = canvasRef.current.height;
                }

                segments[0].point.y = point.y;
                segments[2].point.x = point.x;
                segments[3].point.x = point.x;
                segments[3].point.y = point.y;
            }
            else {
                // 점 컨트롤시 ==> 도형 크기 변경
                if (hitResult.type == 'segment') {
                    if (hitResult.segment.point.x + dpoint.x < 0) dpoint.x = 0;
                    if (hitResult.segment.point.y + dpoint.y < 0) dpoint.y = 0;
                    if (hitResult.segment.point.x + dpoint.x > canvasRef.current.width) dpoint.x = 0;
                    if (hitResult.segment.point.y + dpoint.y > canvasRef.current.height) dpoint.y = 0;

                    switch (hitResult.segment.point) {
                        case segments[0].point: {
                            segments[1].point.x += dpoint.x;
                            segments[3].point.y += dpoint.y;
                            segments[0].point.x += dpoint.x;
                            segments[0].point.y += dpoint.y;
                            break;
                        }x``
                        case segments[1].point: {
                            segments[0].point.x += dpoint.x;
                            segments[2].point.y += dpoint.y;
                            segments[1].point.x += dpoint.x;
                            segments[1].point.y += dpoint.y;
                            break;
                        }
                        case segments[2].point: {
                            segments[1].point.y += dpoint.y;
                            segments[3].point.x += dpoint.x;
                            segments[2].point.x += dpoint.x;
                            segments[2].point.y += dpoint.y;
                            break;
                        }
                        case segments[3].point: {
                            segments[0].point.y += dpoint.y;
                            segments[2].point.x += dpoint.x;
                            segments[3].point.x += dpoint.x;
                            segments[3].point.y += dpoint.y;
                            break;
                        }
                    }
                }
                // 도형, tag 컨트롤시 ==> 도형 이동
                else {
                    if (region.path.fullySelected) {
                        for (let seg of segments) {
                            if (seg.point.x + dpoint.x < 0) dpoint.x = 0;
                            if (seg.point.y + dpoint.y < 0) dpoint.y = 0;
                            if (seg.point.x + dpoint.x > canvasRef.current.width) dpoint.x = 0;
                            if (seg.point.y + dpoint.y > canvasRef.current.height) dpoint.y = 0;
                        }

                        region.path.position.x += dpoint.x;
                        region.path.position.y += dpoint.y;
                    }
                }

                let pointMinMax = calcPointMinMax();
        
                region.btnClose.position.x = pointMinMax.width > 80? pointMinMax.maxX : pointMinMax.minX + 80;
                region.btnClose.position.y = pointMinMax.minY - 10;
                region.lbSign.position.x = pointMinMax.minX + 35;
                region.lbSign.position.y = pointMinMax.minY - 10;
                region.lbAreaName.position = region.path.position;
            }
            // Paper.projects[0].view.draw();
        };

        Paper.view.onMouseUp = (event) => {
            // which 1: 좌클릭, 2: 휠클릭, 3: 우클릭
            if (event.event.which != 1) {
                return false;
            }

            // 서명자 영역 버튼을 클릭하지 않은 경우
            if (!hitResult && Object.keys(regionInfo).length === 0) {
                return false;
            }

            if (!hitResult) {
                // 뒤집어서 그려지는 경우 좌표 순서가 바뀌어서 min, max값 다시 계산
                let pointMinMax = calcPointMinMax();

                // 기존 도형 삭제 후 다시 생성
                region.path.remove();

                newReg(new Paper.Point(pointMinMax.minX, pointMinMax.minY), new Paper.Point(pointMinMax.maxX, pointMinMax.maxY))
                newRegItems(region);
                
                updateRegionCount();
                // props.regions.push({path: region.path, btnClose: raster, lbSign: lbSign})
            }
            console.log(regionsArr)
            // console.log(props.regions)
            
            // this?.draw();
        };
        // Paper.view.draw();
        // this?.draw();
    };


    useEffect(() => {
        let listCoordinates = dbCoordinatesList;
        let signTypeCd;
        let arrName;
        let arrSign;
        let arrDate;

        if (listCoordinates) {
            for (var item of listCoordinates) {
                signTypeCd = item.signTypeCd;
                arrName = item.nameCoordinate;
                arrSign = item.signCoordinate;
                arrDate = item.dateCoordinate;
    
                switch(signTypeCd) {
                    case 'SUBJECT': regionInfo.signType = 'SUBJECT'; regionInfo.signName = '시험대상자'; break;
                    case 'RESEARCHER': regionInfo.signType = 'RESEARCHER'; regionInfo.signName = '연구자'; break;
                    case 'MANAGER': regionInfo.signType = 'MANAGER'; regionInfo.signName = '연구책임자'; break;
                }
                
                if (arrName) {
                    regionInfo.areaType = 'name'; 
                    regionInfo.areaName = '성함';
                    parseArrCoordinate(arrName);
                }
                
                if (arrSign) {
                    regionInfo.areaType = 'sign'; 
                    regionInfo.areaName = '서명란';
                    parseArrCoordinate(arrSign);
                }
    
                if (arrDate) {
                    regionInfo.areaType = 'date'; 
                    regionInfo.areaName = '날짜';
                    parseArrCoordinate(arrDate);
                }
            }
            clearSelectReg();
    
            for (let key in regionInfo) {
                delete regionInfo[key]
            }
        }
    }, [props.dbCoordinatesList]);

    const parseArrCoordinate = (item) => {
        let arrCoordinate = JSON.parse(item)
        
        for (var arrItem of arrCoordinate) {
            if (page == arrItem.page) {
                var point1 = new Paper.Point(arrItem.X1 * canvasRef.current.width, arrItem.Y1 * canvasRef.current.height);
                var point2 = new Paper.Point(arrItem.X2 * canvasRef.current.width, arrItem.Y2 * canvasRef.current.height);
                newRegItems(newReg(point1, point2))
            }
        }

        updateRegionCount();
    }

    const newReg = (pointFrom, pointTo) => {
        // 사각형 좌표 배열 reg.path.segments(4)
        // [1] [2]
        // [0] [3] 순서
        var newPath = Paper.Path.Rectangle(pointFrom, pointTo);
        newPath.strokeColor = pathOptions.strokeColor;
        newPath.strokeWidth = pathOptions.strokeWidth;
        newPath.fillColor = pathOptions.fillColor;

        newPath.fullySelected = true;
        
        region = {};
        region.path = newPath;

        return region;
    }

    const newRegItems = (region) => {
        let seq = regionsArr.filter(item => item.areaType == regionInfo.areaType && item.signType == regionInfo.signType).length + 1;

        let segments = region.path.segments;
        let pointMinMax = calcPointMinMax(segments);

        // 삭제 버튼
        let tempWidth = pointMinMax.maxX - pointMinMax.minX;
        
        var raster = new Paper.Raster('/images/icon_close.svg');
        raster.position = new Paper.Point(tempWidth > 80 ? segments[2].point.x : segments[1].point.x + 80, segments[2].point.y-10);

        // 상단 서명자 (서명대상자, 연구자, 연구책임자)
        var lbSign = new Paper.PointText({
            type: 'sign',
            content: `${regionInfo.signName} ${seq}`,
            justification: 'left'
        });
        lbSign.fillColor = 'black';
        lbSign.position = new Paper.Point(segments[1].point.x+35, segments[1].point.y-10);

        // 가운데 구분 텍스트 (이름, 서명, 날짜)
        var lbAreaName = new Paper.PointText({
            type: 'area',
            content: `${regionInfo.areaName}`,
            justification: 'center'
        });
        lbAreaName.fillColor = 'black';
        lbAreaName.position = region.path.position;

        regionsArr.push({page: page, 
            areaType: regionInfo.areaType, areaName: regionInfo.areaName, 
            signType: regionInfo.signType, signName: regionInfo.signName, 
            path: region.path, btnClose: raster, lbSign: lbSign, lbAreaName: lbAreaName
        })
    }

    const calcPointMinMax = (segments) => {
        var minX;
        var minY;
        var maxX;
        var maxY;

        if (!segments) {
            segments = region.path.segments;
        }

        minX = segments[0].point.x;
        minY = segments[0].point.y;
        maxX = segments[0].point.x;
        maxY = segments[0].point.y;

        for (var seg of segments) {
            if (minX > seg.point.x) {
                minX = seg.point.x;
            }

            if (minY > seg.point.y) {
                minY = seg.point.y;
            }

            if (maxX < seg.point.x) {
                maxX = seg.point.x;
            }

            if (maxY < seg.point.y) {
                maxY = seg.point.y;
            }
        }

        return {minX: minX, minY: minY, maxX: maxX, maxY: maxY, width: maxX - minX, height: maxY - minY}
    }

    const deleteReg = () => {
        let itemType;
        switch (hitResult?.item.className) {
            case 'Raster': itemType = 'btnClose'; break;
        }

        let areaType;
        let signName;

        for (let index in regionsArr) {
            if (regionsArr[index][itemType] == hitResult?.item) {
                page = regionsArr[index]['page'];
                areaType = regionsArr[index]['areaType'];
                signName = regionsArr[index]['signName'];

                regionsArr[index]['path'].remove();
                regionsArr[index]['lbSign'].remove();
                regionsArr[index]['lbAreaName'].remove();
                regionsArr[index]['btnClose'].remove();
                // regionsArr = regionsArr.filter(item => item != objReg);
                // 배열 제거
                regionsArr.splice(index, 1);

                let cnt = 1;
                for (let objReg of regionsArr) {
                    if (objReg['areaType'] == areaType && objReg['signName'] == signName) {
                        objReg['lbSign'].content = `${signName} ${cnt}`;
                        cnt++;
                    }
                }

                break;
            }
        }

        updateRegionCount();

        // regionsArr.filter(item => item.type == regionInfo.type && item.sign == regionInfo.sign).length + 1;
    }

    const clearSelectReg = () => {
        for (let objReg of regionsArr) {
            objReg.path.fullySelected = false;
        }
    }

    const selectReg = () => {
        clearSelectReg();

        let itemType;
        switch (hitResult?.item.className) {
            case 'Path': itemType = 'path'; break;
            case 'PointText': {
                if (hitResult.item.type == "sign") {
                    itemType = 'lbSign';
                }
                else if (hitResult.item.type == "area") {
                    itemType = 'lbAreaName';
                }
                break;
            }
            case 'Raster': itemType = 'btnClose'; break;
        }

        for (let objReg of regionsArr) {
            if (objReg[itemType] == hitResult?.item) {
                objReg.path.fullySelected = true;
                region = objReg;
            }
        }
    }

    return (
        // <div  style={{position: 'absolute', top: 0, width: '100%', height: '100%'}}>
<canvas ref={canvasRef} id={props.id} resize="true" style={{position: 'absolute', top: 0}}/>
        // </div>
    
    )
    // return <canvas ref={props.ref} {...props} id={props.id} resize="true" width={600} height={300} />
}

export default PaperCanvas;