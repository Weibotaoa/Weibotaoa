import {
  COMPONENTSYMBOLS,
  DESIGNICONSYMBOLS
} from "./constants";

let sketch = require("sketch");
let dom = require("sketch/dom");
let document = sketch.getSelectedDocument();
let async = require("sketch/async");
let DataSupplier = require("sketch/data-supplier");
let UI = require("sketch/ui");
let Settings = require("sketch/settings");
let Page = sketch.Page;

let componentIcons = []; //缓存基础组件列表
let designIcons = []; // 缓存图标 列表

/**
 *
 * 获取所有页面下的画板
 * @param {*} isAll: boolean true: 页面下的所有画板   false:页面下的选中的画板
 */

function getSelectedArtboardId(list) {
  return list.filter((item) => item.selected === true)[0];
}
// 获取画板列表
function getArtboards() {
  let artboards = [];
  let selectedDocument = dom.getSelectedDocument();
  if (selectedDocument) {
    if (selectedDocument.pages.length > 0) {
      let pages = selectedDocument.pages;
      let currentPageId = getSelectedArtboardId(pages).id
      pages.map((page) => {
        if (page.layers.length > 0) {
          page.layers.map((item) => {
            if (item.type === "Artboard") {
              // let buffer = sketch.export(item, { output: false });
              // let artboardBase64 = buffer.toString("base64");
              let obj = {};
              obj["base64"] = '';
              obj["info"] = {
                id: item.id,
                name: item.name,
                frame: item.frame,
                type: item.type,
                pageId: page.id,
                checked:item.selected
              };
              obj["pageInfo"] = {
                id: page.id,
                name: page.name
              };
              obj["currentPage"] = {
                id: currentPageId
              };
              artboards.push(obj);
            }
          });
        }
      });
    }
  }
  return artboards;

}

function getSelectefArtboardIds() {
  let artboardIds = [];
  let selectedDocument = dom.getSelectedDocument();
  if (selectedDocument) {
    if (selectedDocument.pages.length > 0) {
      let pages = selectedDocument.pages;

      pages.map((page) => {
        if (page.layers.length > 0) {
          page.layers.map((item) => {
            if (item.type === "Artboard" && item.selected === true) {
              artboardIds.push(item.id);
            }
          });
        }
      });
    }
  }
  return artboardIds;
}

// 根据id获取画板图像base64 和 sketchData
function getBase64_sektchData(ids) {
  let arr = [];
  ids = JSON.parse(ids);
  ids.map(artboardId => {
    let artboard = sketch.find('Artboard,[id="' + artboardId + '"]');
    let buffer = sketch.export(artboard[0], {
      formats: 'png',
      output: false
    });
    let artboardBase64 = `data:image/png;base64,${buffer.toString("base64")}`;
    let artboardData = JSON.parse(JSON.stringify(artboard));
    arr.push({
      artboardId,
      artboardBase64,
      artboardData
    })
  })
  return arr;
}

/**
 * 获取选中的图层
 *
 * @return {*}
 */
function getSelectedLayers() {
  let document = require("sketch/dom").getSelectedDocument();
  if (document && document.selectedLayers) {
    return document.selectedLayers.layers;
  }
  return [];
}

function getSymbols(libraryName, callback) {
  let sketch = require("sketch/dom");
  // let Library = sketch.Library;

  // 添加HuxBC-globalstyle-icon库
  // Library.getRemoteLibraryWithRSS(
  //   "https://jingwhale.github.io/sketchlibrary/globalstyle/globalstyle-icon.xml",
  //   (err, library) => {
  //     if (library) {
  //       let document = sketch.getSelectedDocument();
  //       let symbolReferences = library.getImportableSymbolReferencesForDocument(
  //         document
  //       );
  //       let symbolList = [];
  //       symbolReferences.forEach(symbolReference => {
  //           let symbol= symbolReference.import();
  //           let newPage = new Page();
  //           newPage.parent = doc;
  //           symbol.parent = newPage;
  //           let options = { formats: 'png', output: false }
  //           let buffer = sketch.export(symbol,options);
  //           let symboolBase64 = buffer.toString('base64');
  //           newPage.parent = nil; // 删除掉当前页面

  //           let symbolItem = {};
  //           symbolItem["symbolReference"] = symbolReference;
  //           symbolItem["symbolBase64"] = symboolBase64;
  //           symbolList.push(symbolItem);
  //       })
  //       if (callback) {
  //         callback(symbolList);
  //       }
  //     }
  //     if (err) {
  //       UI.message("加载库出错了");
  //     }
  //   }
  // );

  let symbolList = [];
  let symbolReferences = getLibraryIcons(libraryName);

  if (libraryName === COMPONENTSYMBOLS) {
    if (componentIcons.length > 0) {
      symbolReferences = componentIcons;
    } else {
      symbolList = getSymboldData_image(symbolReferences);
    }
  }
  if (libraryName === DESIGNICONSYMBOLS) {
    if (designIcons.length > 0) {
      symbolList = designIcons;
    } else {
      symbolList = getSymboldData_image(symbolReferences);
    }
  }

  if (callback) {
    callback(symbolList);
  }
}

// 获取不带图片的symbol列表
export function getSymbols_noImage(libraryName, callback) {
  let symbolList = [];
  let symbolReferences = getLibraryIcons(libraryName);

  if (libraryName === COMPONENTSYMBOLS) {
    if (componentIcons.length > 0) {
      symbolReferences = componentIcons;
    } else {
      symbolList = symbolReferences;
    }
  }
  if (libraryName === DESIGNICONSYMBOLS) {
    if (designIcons.length > 0) {
      symbolList = designIcons;
    } else {
      symbolList = symbolReferences;
    }
  }

  if (callback) {
    callback(symbolList);
  }
}

// 根据ids获取symbol对应的图片列表
async function getImagesByIds(symbolIds, libraryName) {
  let symbolReferences = getLibraryIcons(libraryName);
  let symbolReferenceList = symbolReferences.filter(item => symbolIds.indexOf(item.id) > -1);
  let promiseList = [];
  symbolReferenceList.forEach(symbolReference => {
    if (symbolReference) {
      try {
        promiseList.push(new Promise((resolve, reject) => {
          let symbol = symbolReference.import();
          let newPage = new Page();
          newPage.parent = document;
          symbol.parent = newPage;
          let options = {
            formats: "png",
            output: false
          };
          let buffer = sketch.export(symbol, options);
          let symboolBase64 = buffer.toString("base64");
          // images.push({id:symbol.id,symboolBase64})
          newPage.parent = nil; // 删除掉当前页面
          newPage.remove();
          resolve({
            id: symbolReference.id,
            symboolBase64
          })
        }))

      } catch (error) {
        console.log(error);
      }
    }
  })
  let images = await Promise.all(promiseList);

  //    images.map((val)=> {
  //     console.log(val);    
  // });
  return images;
}


//获取图标列表
function getLibraryIcons(libraryName) {
  let libraries = sketch.getLibraries();

  let library = libraries.filter((item) => item.name === libraryName)[0];
  if (library) {
    let document = sketch.getSelectedDocument();
    let symbolReferences =
      library.getImportableSymbolReferencesForDocument(document);
    return symbolReferences;
  } else {
    console.log("图标库不存在");
    return [];
  }
}

function getSymboldData_image(symbolReferences) {
  // symbolReferences = symbolReferences.slice(0,30);
  let symbolList = [];
  symbolReferences.forEach((symbolReference) => {
    let symbol = symbolReference.import();
    let newPage = new Page();
    newPage.parent = document;
    symbol.parent = newPage;
    let options = {
      formats: "png",
      output: false
    };
    let buffer = sketch.export(symbol, options);
    let symboolBase64 = buffer.toString("base64");
    newPage.parent = nil; // 删除掉当前页面
    newPage.remove();

    let symbolItem = {};
    symbolItem["symbolReference"] = symbolReference;
    symbolItem["symbolBase64"] = symboolBase64;
    symbolList.push(symbolItem);
  });
  return symbolList;
}

// 获取sketch文档信息

function getSketchInfo() {
  if (document.path) {
    let path = decodeURI(document.path);
    let index = path.lastIndexOf("/");
    let name = path.slice(index + 1, path.length);
    let id = document.id;
    return {
      name,
      id
    }
  } else {
    UI.message("请先保存文件");
    return null;
  }


}

export {
  getArtboards,
  getSelectedLayers,
  getSymbols,
  getImagesByIds,
  getSketchInfo,
  getBase64_sektchData,
  getSelectefArtboardIds
};