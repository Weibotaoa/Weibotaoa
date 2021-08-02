/*
 * @Author: wbt
 * @Date: 2021-05-26 14:15:55
 * @LastEditTime: 2021-06-02 21:36:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /sketch/hs-plugin/src/util/parse/index.js
 */
import sketch from "sketch";
import UI from "sketch/ui";
import {
  isRectangle,
  isContain,
  isContainAny,
  sortRect,
  getParentList,
} from "./common/index.js";

export function parseSelectArtboard(type) {
  try {
    const document = sketch.getSelectedDocument();
    let artboards = [];
    if (type === 1) {
      artboards = document.selectedLayers.layers.filter(
        (layer) => layer.type === "Artboard"
      );
    } else {
      document.pages.forEach((layer) => {
        artboards = [
          ...artboards,
          ...layer.layers.filter((item) => item.type === "Artboard"),
        ];
      });
    }
    //console.log(artboards);
    // 去组 如果type是group,不计入列表中
    let list = JSON.parse(JSON.stringify(artboards));
    list.forEach((artboard) => {
      let arr = deleteGroup(artboard.layers);
      let { rectList, noGroupList } = arr;
      let newGroupTree = sortRect(rectList);
      noGroupList.forEach((ele) => {
        recombineGroup(newGroupTree, rectList, ele);
      });
      console.log("----这是去组重组之后的数据");
      console.log(JSON.stringify(newGroupTree));
    });
  } catch (error) {
    console.log(error);
  }
}

//去组 将所有的元素放入同一个数组
export function deleteGroup(
  layers,
  parentX = 0,
  parentY = 0,
  noGroupList = [],
  rectList = []
) {
  layers.forEach((layer) => {
    let { x = 0, y = 0, width, height } = layer.frame;
    if (layer.type === "Group") {
      let childList = layer.layers || layer.overrides;
      if (childList.length > 0) {
        deleteGroup(childList, x + parentX, y + parentY, noGroupList, rectList);
      }
    } else {
      layer.frame = {
        x: x + parentX,
        y: y + parentY,
        width: width,
        height: height,
      };
      noGroupList.push(Object.assign({}, layer, { layers: [] }));
      if (isRectangle(layer)) {
        rectList.push(Object.assign({}, layer, { layers: [] }));
      }
    }
  });
  //console.log(noGroupList);
  return { noGroupList, rectList };
}

// 将一维的元素按照最小原则放入矩形中
// !! 此逻辑性能不好改为下列逻辑 递归遍历树，如果树的当前节点包含该元素，则把元素放入节点中， 然后判断当前节点的父元素是否存在，如果存在（隐藏逻辑：矩形树的子元素包含某一元素，则父元素必然包含）
// 递归遍历树，如果树的当前节点包含该元素 然后获取当前元素的父级矩形列表，判断父级矩形列表的第二个（矩形列表从小到大一次排列）的id是否等于当前节点的id，等于则是最小矩形，然后吧元素放入该矩形
function recombineGroup(rectTree, rectList, ele) {
  rectTree.forEach((rect) => {
    if (!isRectangle(ele) && isContain(ele, rect)) {
      // rect.layers.push(ele);
      // 获取当前元素的父级矩形列表
      let { parentList } = isContainAny(getParentList(rectList, ele));
      
      // 第一层的父元素只有自己本身，所以length===1 并且判断id相等
      let condition =
        (parentList.length > 1 && rect.id === parentList[parentList.length - 1].id) ||
        (parentList.length === 1 && rect.id === parentList[0].id);
      if (condition) {
        rect.layers.push(ele);
      }

      //console.log(parentList);
      // if(parentList.length > 1){
      //   deleteEle(parentList[1].layers,ele);
      // }
      if (rect.children && rect.children.length > 0) {
        recombineGroup(rect.children, rectList, ele);
      }
    }
  });
  return rectTree;
}

// 从父元素删除存在于子元素的数据
function deleteEle(arr, ele) {
  return arr.filter((item) => item.id !== ele.id);
}

// export function recombineGroup(rectList, ele) {
//   let parentList = getSmallestRect(rectList,ele);
//   if (parentList.length > 0) {
//     if (parentList.length === 1) {
//        parentList[0].layers.push(ele);
//     } else {
//       // 获取包含元素的最小矩形
//       let smallest = isContainAny(parentList)[0];
//       smallest.layers.push(ele);
//     }
//   }
//   return rectList;
// }

// // 获取包含元素的最小矩形
// function getSmallestRect(rectList,ele){
//   let parentList = [];
//   rectList.forEach((rect) => {
//     if (isContain(ele, rect)) {
//       parentList.push(rect);
//     }
//   });
//   let smallest = isContainAny(parentList)[0];
//   return smallest;
// }
