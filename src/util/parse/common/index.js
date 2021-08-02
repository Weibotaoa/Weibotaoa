/*
 * @Author: wbt
 * @Date: 2021-05-27 09:18:38
 * @LastEditTime: 2021-06-02 21:31:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /sketch/hs-plugin/src/util/parse/common/index.js
 */

/**
 * 依据两点坐标计算两点与原点之间连线的夹角
 *
 * @param {*} startX 第一个点X轴坐标
 * @param {*} startY 第一个点Y轴坐标
 * @param {*} endX 第二个点X轴坐标
 * @param {*} endY 第二个点Y轴坐标
 * @returns
 */

 export function twoPointsAngle (startX, startY, endX, endY){
    const x = endX - startX;
    const y = endY - startY;

    if (x > 0 && y == 0) {
        return Math.PI * 0.5;
    }

    if (x < 0 && y == 0) {
        return Math.PI * 1.5;
    }

    if (y > 0 && x == 0) {
        return 0;
    }

    if (y < 0 && x == 0) {
        return Math.PI;
    }

    if (x >= 0 && y >= 0) {
        return Math.atan(x / y);
    }

    if (x >= 0 && y < 0) {
        return Math.PI + Math.atan(x / y);
    }

    if (x < 0 && y > 0) {
        return 2 * Math.PI + Math.atan(x / y);
    }

    if (x < 0 && y <= 0) {
        return Math.PI + Math.atan(x / y);
    }
};

/**
 * 获取夹角
 *
 * @param {Object} startPoint 起始点
 * @param {Object} midPoint 焦点
 * @param {Object} endPoint 结束点
 * @returns
 */

 const getAngle = (startPoint, midPoint, endPoint) => (twoPointsAngle(midPoint.x, midPoint.y, endPoint.x, endPoint.y)
 - twoPointsAngle(startPoint.x, startPoint.y, midPoint.x, midPoint.y));
 
/**
 * 判断是的为矩形
 *
 * @param {Array} pointArr 4个点数据组信息
 * @returns
 */
export function isRect (pointArr) {
    /**
     * 四边形4个点顺时针依次为 A,B,C,D
     * {
     *   x:0,
     *   y:0
     * }
     */

    const { point: pointA } = pointArr[0];
    const { point: pointB } = pointArr[1];
    const { point: pointC } = pointArr[2];
    const { point: pointD } = pointArr[3];

    // 计算4个角度对应的点
    const anglePointArr = [
        [pointA, pointB, pointC],
        [pointB, pointC, pointD],
        [pointC, pointD, pointA],
        [pointD, pointA, pointB],
    ];

    for (let i = 0; i < anglePointArr.length; i++) {
        if ((Math.abs(Math.abs(getAngle(anglePointArr[i][0], anglePointArr[i][1], anglePointArr[i][2])) - Math.PI / 2) > 0.02)
            && (Math.abs(Math.abs(getAngle(anglePointArr[i][0], anglePointArr[i][1], anglePointArr[i][2])) - Math.PI * 1.5) > 0.02)) {
            return false;
        }
    }

    return true;
};

// 判断是否是正规的矩形
export function isRectangle (layer){
    const { points,type,shapeType,hidden } = layer;
    // if(points){
    //     if (points.length != 4) {
    //         return false;
    //     }
    
    //     for (let i = 0; i < points.length; i++) {
    //         const { pointType } = points[i];
    
    //         // 非直点属于不规则矩形
    //         if (pointType !== 'Straight') {
    //             return false;
    //         }
    //     }
    
    //     return isRect(points);
    // }
    // return false;
    if(type === "ShapePath" && shapeType === 'Rectangle' && hidden === false){
        return true;
    }
    return false;
    
};

/**
 * 判断是否有包含或者重叠
 *
 * @param {*} target
 * @param {*} container
 * @returns
 */
 export function isContain (target, container) {
    if (!target.frame || !container.frame) {
        return false;
    }
    target = target.frame;
    container = container.frame;
    let targetLeft = target.x,
        targetRight = target.x + target.width,
        targetTop = target.y,
        targetBottom = target.y + target.height,
        containerLeft = container.x,
        containerRight = container.x + container.width,
        containerTop = container.y,
        containerBottom = container.y + container.height;
    if (((targetLeft >= containerLeft) && (targetTop >= containerTop)) &&
        ((targetRight <= containerRight) && (targetBottom <= containerBottom))) {
        return true;
    }
    return false;
};

// 对比任意两个元素的包含关系，按照子->父排序
export function isContainAny(arr){
    if(arr.length === 0){
        return [];
    }
    if(arr.length === 1){
        return arr[0];
    }
        let i = arr.length,
          j;
        let tempExchangVal;
        while (i > 0) {
          for (j = 0; j < i - 1; j++) {
            let a = arr[j];
            let b = arr[j + 1];
            if (isContain(b,a)) {
              tempExchangVal = arr[j];
              arr[j] = arr[j + 1];
              arr[j + 1] = tempExchangVal;
            }
          }
          i--;
        }
        return arr;
}

// 获取最大的矩形 
export function getLargestRect(rectList){
    let largest;
    rectList.forEach(item => {
        let {parentList} = getParentList(rectList,item);
        if(parentList.length === 1 && parentList[0].id === item.id){
            largest = item;
        }
    })
    return largest;
}

//获取元素的所有父元素的列表
export function getParentList(rectList,ele){
    let parentList = [];
    let ids = [];
   rectList.forEach(rect => {
       if(isContain(ele,rect)){
            parentList.push(rect);
            ids.push(rect.id);
       }
   })
   return {parentList,ids};
}

// 获取元素的所有子元素的id列表
function getChildIdsList(rectList,ele){
    let ids = [];
    rectList.forEach(rect => {
        if(isContain(rect,ele)){
            ids.push(rect.id);
        }
    })
    return {ids};
}

// 获取交集
function getMixed(list,ids){
    return list.filter(function (item) { return ids.indexOf(item.id) > -1 });
}

// 矩形排序
export function sortRect(rectList,level = 1){
    let temp;
    let tree = [];
    rectList.forEach(rect => {
       let {parentList} = getParentList(rectList,rect);
       if(parentList.length === level){
        temp = sortRect(rectList,level+1)
        if(temp.length > 0 ){
                let {ids} = getChildIdsList(rectList,rect);
                rect.children = getMixed(temp,ids);
        }
        tree.push(rect);
       }
    })
    return tree;
}
