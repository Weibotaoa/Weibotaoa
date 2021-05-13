
let sketch = require("sketch");
let dom = require("sketch/dom");
let async = require("sketch/async");
let DataSupplier = require("sketch/data-supplier");
let UI = require("sketch/ui");
let Settings = require("sketch/settings");

/**
 *
 * 获取所有页面下的画板
 * @param {*} isAll: boolean true: 页面下的所有画板   false:页面下的选中的画板
 */

function getSelectedArtboardId(list) {
  return list.filter((item) => item.selected === true)[0];
}

function getArtboards() {
  let artboards = [];
  let selectedDocument = dom.getSelectedDocument();
  if (selectedDocument) {
    if (selectedDocument.pages.length > 0) {
      let pages = selectedDocument.pages;
      // let selectedPages = pages.filter(item => item.selected === true);
      pages.map((page) => {
        if (page.layers.length > 0) {
          page.layers.map((item) => {
            let buffer = sketch.export(item,{output:false});
              let artboardBase64 = buffer.toString('base64');
            if (item.type === "Artboard") {
              let obj = {};
              obj["base64"] = artboardBase64;
              obj["info"] = item;
              obj["pageInfo"] = page;
              obj["currentPage"] = getSelectedArtboardId(pages);
              artboards.push(obj);
            }
          });
        }
      });
    }
  }
  return artboards;
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

function getSymbols(libraryName,callback) {
  let sketch = require("sketch/dom");
  let Library = sketch.Library;
  let Page = sketch.Page;
  let doc = sketch.getSelectedDocument();
  //添加HuxBC-globalstyle-icon库
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

  var libraries = require("sketch/dom").getLibraries();

  let library = libraries.filter(
    (item) => item.name === libraryName
  )[0];
  let symbolList = [];
  if (library) {
    let document = sketch.getSelectedDocument();
    let symbolReferences = library.getImportableSymbolReferencesForDocument(
      document
    );
    symbolReferences.forEach(symbolReference => {
        let symbol= symbolReference.import();
        let newPage = new Page();
        newPage.parent = doc;
        symbol.parent = newPage;
        let options = { formats: 'png', output: false }
        let buffer = sketch.export(symbol,options);
        let symboolBase64 = buffer.toString('base64');
        newPage.parent = nil; // 删除掉当前页面
        newPage.remove();
       
        let symbolItem = {};
        symbolItem["symbolReference"] = symbolReference;
        symbolItem["symbolBase64"] = symboolBase64;
        symbolList.push(symbolItem);
    })
  }else{
    console.log("图标库不存在");
  }
  if (callback) {
    callback(symbolList);
  }
}

export { getArtboards, getSelectedLayers, getSymbols };
