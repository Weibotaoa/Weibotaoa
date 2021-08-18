import {
  createBrowerWindow,
  createPanel
} from "./element";
import {
  threadDictionary,
  baseUrl
} from "./common";
import {
  getArtboards,
  getSelectedLayers,
  getSymbols,
  getSymbols_noImage,
  getImagesByIds,
  getSketchInfo,
  getBase64_sektchData,
  isSymbolMaster
} from "./base";
import {
  DESIGNICONSYMBOLS,
  COMPONENTSYMBOLS,
  FRAMEWORKSYMBOLS
} from "./constants";
// import { parseSelectArtboard } from "../util/parseArtboard/init";
import {
  parseSelectArtboard
} from '../util/parse/index';

import {
  PLUGINS_HS_PANEL_WEB,
  PLUGINS_HS_PANEL_ICON,
  PLUGINS_HS_PANEL_UPLOAD,
  PLUGINS_HS_PANEL_PROTOCOL,
  PLUGINS_HS_PANEL_RELEVENCE,
  PLUGINS_HS_PANEL_COMPONENT_LIBRARY
} from "./constants";

let UI = require("sketch/ui");
export class InitContext {
  constructor(context) {
    this.pluginSketch = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Resources").URLByAppendingPathComponent("icons");
  }

  /**
   *
   *
   * @param {*} self   按钮的父容器（ 该描述待确认）
   * @param {*} rect   按钮大小
   * @param {*} icon   默认显示的图片
   * @param {*} alternateIcon  激活后显示的图片
   * @param {*} isUrl   icon和alternateIcon 是本地图片 还是图片地址
   * @param {*} buttonName 按钮名称
   * @param {*} onClickListener  事件
   * @return {*}
   * @memberof InitContext
   */
  addButton(
    self,
    rect,
    icon,
    alternateIcon,
    isUrl,
    buttonName,
    onClickListener
  ) {
    var button = NSButton.alloc().initWithFrame(rect);
    //    var button = NSButton.buttonWithTitle_target_action(buttonName,nil,onClickListener);
    if (icon) {
      let image = this.getImage(rect.size, icon, isUrl);
      button.setImage(image);
    }
    if (alternateIcon) {
      let alterIcon = this.getImage(rect.size, alternateIcon);
      button.alternateImage = alterIcon;
    }
    button.setTitle(buttonName);
    button.tag = buttonName;
    // button.highlighted = true;
    button.setBordered(false);
    button.sizeToFit();
    // button.allowsMixedState = true;
    // button.state = 1;
    button.imagePosition = NSImageAbove;
    button.setFont(NSFont.fontWithName_size("Arial", 12));
    button.setButtonType(NSButtonTypeToggle);
    button.setTarget(button);

    button.setAction("onClickListener:");
    button.setCOSJSTargetFunction(onClickListener);

    // 设置按钮字体颜色
    let color = NSColor.whiteColor()
    let colorTitle = NSMutableAttributedString.new().initWithAttributedString(button.attributedTitle())
    let range = NSMakeRange(0, colorTitle.length())
    colorTitle.addAttribute_value_range(NSForegroundColorAttributeName, color, range)
    button.attributedTitle = colorTitle

    // button.alternateTitle = '变了';

    // let font = NSFont.systemFontOfSize(12);
    // let attrs = NSDictionary.dictionaryWithObjectsAndKeys(font,NSFontAttributeName,NSColor.redColor,NSForegroundColorAttributeName,nil);
    // let attributedString = NSAttributedString.alloc().initWithString_attributes(buttonName,attrs);
    // button.setAttributedTitle = attributedString;

    // !! 为什么不生效 change text color
    // let attrTitle = NSMutableAttributedString.alloc().initWithAttributedString(buttonName);
    // let len = attrTitle.length;
    // let range = NSMakeRange(0,len);
    // attrTitle.addAttribute_value_range(NSForegroundColorAttributeName,NSColor.redColor,range);
    // attrTitle.fixAttributesInRange(range);
    // button.setAttributedTitle(attrTitle);
    return button;
  }

  // add a image
  addImage(rect, name) {
    var view = NSImageView.alloc().initWithFrame(rect),
      image = this.getImage(rect.size, name);
    view.setImage(image);
    return view;
  }

  getImage(size, name, isUrl) {
    // var isRetinaDisplay = NSScreen.mainScreen().backingScaleFactor() > 1 ? true : false;
    // var suffix = isRetinaDisplay ? '@2x' : '';
    // console.log( this.pluginSketch.URLByAppendingPathComponent("Resources"));
    // console.log( this.pluginSketch.URLByAppendingPathComponent('Contents'));

    var imageURL = this.pluginSketch.URLByAppendingPathComponent("".concat(name, ".png"));
    var image = NSImage.alloc().initWithContentsOfURL(imageURL);
    size && image.setSize(size);
    image.setScalesWhenResized = true;
    return image;
  }
}

// 浏览器打开对应url
export function openUrlInBrowser(url) {
  NSWorkspace.sharedWorkspace().openURL(NSURL.URLWithString(url));
}

/**
 *：点击按钮时，获取满足目的的所有panel的identifier,判断在threadDictionary中是否存在，存在则从threadDictionary中删除，并根据返回值删除
 *  该方法清除 除了自己之外的其他panel
 * 目前被用于 tooglePanel方法
 */

function clearOthersWindow(currentIdentifier) {
  let identifierList = [
    PLUGINS_HS_PANEL_WEB,
    PLUGINS_HS_PANEL_ICON,
    PLUGINS_HS_PANEL_UPLOAD,
    PLUGINS_HS_PANEL_PROTOCOL,
    PLUGINS_HS_PANEL_RELEVENCE,
    PLUGINS_HS_PANEL_COMPONENT_LIBRARY
  ];
  identifierList
    .filter((item) => threadDictionary[item] && item !== currentIdentifier)
    .forEach((item) => {
      let prevPanel = threadDictionary[item];
      // const existingWebview = getWebview(item);
      // if(existingWebview){
      //     existingWebview.close();
      // }
      threadDictionary.removeObjectForKey(item);
      prevPanel.close();
    });
}

function showBrowerWindowByIdentifier(params) {
  let {
    title,
    width,
    height,
    url,
    identifier
  } = params;
  try {
    clearOthersWindow(identifier); // 清除掉放在数组里面的除了自己之外的所有window
    let browserWindow = createBrowerWindow({
      identifier,
      title,
      width,
      height
    });
    // NSApplication.sharedApplication.addChildWindow_ordered(panel,NSWindowAbove);
    implementFunc(browserWindow, title);
    browserWindow.loadURL(url);
    threadDictionary[identifier] = browserWindow;
    
  } catch (error) {
    console.log(error);
  }
}

export function toogleBrowerWindow(
  source,
  context,
  container,
  url,
  identifier,
  title,
  width,
  height
) {
  clearOthersWindow(identifier); // 清除掉放在数组里面的除了自己之外的所有window
  //  登录弹框用browserWindow，功能弹框用panel
  let browserWindow = threadDictionary[identifier];
  if (!browserWindow) {
    browserWindow = createBrowerWindow({
      source,
      identifier,
      title,
      width,
      height,
    });
    // NSApplication.sharedApplication.addChildWindow_ordered(panel,NSWindowAbove);
    implementFunc(browserWindow, title);
    browserWindow.loadURL(url);
    threadDictionary[identifier] = browserWindow;
  } else {
    threadDictionary.removeObjectForKey(identifier);
    browserWindow.close();
  }
}

function implementFunc(browserWindow, title) {
  //   myView.evaluateJavaScript_completionHandler(`sketchUploadArtboard(123)`,function(PLUGINS_HS_PANEL_UPLOAD,error){
  //     console.log(error);
  // });
  const webContents = browserWindow.webContents;
  if (title === 'webPlat') {
    handleWebComponent(webContents,COMPONENTSYMBOLS);
    handleWebFramework(webContents,FRAMEWORKSYMBOLS)
  }
  if (title === "upload") {
    // 查看设计
    webContents.on('lookDesign',() => {
      openUrlInBrowser("http://10.20.145.85:8088/frame-layout/D2CPlatform/#/plat/pageManager");
    })
    let artboardList = getArtboards();
    let info = getSketchInfo();
    webContents
      .executeJavaScript(`getArtboardList(${JSON.stringify({info,artboardList})})`)
      .catch(console.error);
    // 点击上传
    webContents.on("uploadArtboard", function (ids) {
      try {
        let list = getBase64_sektchData(ids);
        webContents
          .executeJavaScript(`getBase64Data(${JSON.stringify(list)})`)
          .catch(console.error);
      } catch (error) {
        console.log(error);
      }
      //parseSelectArtboard(1);
      // !!这部分不需要发送给webview,然后webview在走真正的上传数据库逻辑
      // parseSelectArtboard(function(codeDSL){
      //   console.log(codeDSL);
      //   webContents.executeJavaScript(`getCodeDSL(${JSON.stringify(codeDSL)})`) 
      //   .catch(console.error);
      // });


    })
  }
  if (title === "protocol") {
    let allLayers = getSelectedLayers();
    webContents
      .executeJavaScript(`getLayersList(${JSON.stringify(allLayers)})`)
      .catch(console.error);
  }
  if (title === "icon") {
    let iconList = [];
    getSymbols_noImage(DESIGNICONSYMBOLS, (symbolReferences) => {
      iconList = symbolReferences;
      webContents
        .executeJavaScript(`getSymbols(${JSON.stringify(iconList)})`)
        .catch(console.error);
    });

    webContents.on("getImagesByIds", async function (symbolId) {
      let images = await getImagesByIds(symbolId, DESIGNICONSYMBOLS);
      webContents
        .executeJavaScript(`getSymbolImage(${JSON.stringify(images)})`)
        .catch(console.error);
    })

    // 
    webContents.on("symbolDrag", (params) => {

      try {
        let {
          symbolID,
          color,
          opacity,
          size
        } = JSON.parse(params);
        let sketch = require("sketch/dom");
        let document = sketch.getSelectedDocument();

        // 清除移进来的位图
        let image = sketch.find("Image,[name='位图']");
        let x = 0;
        let y = 0;
        let parent = null;
        image.forEach((item) => {
          parent = item.parent;
          x = item.frame.x;
          y = item.frame.y;
          item.parent = nil;
          item.remove();
        });

        // if (symbolList.length > 0) {
        //   symbolReferences = symbolList;
        // } else {
        //   let libraries = require("sketch/dom").getLibraries();

        //   let library = libraries.filter(
        //     (item) => item.name === DESIGNICONSYMBOLS
        //   )[0];
        //   if (library) {
        //     symbolReferences = library.getImportableSymbolReferencesForDocument(
        //       document
        //     );
        //   }
        // }
        let dragSymbol = iconList.filter((item) => {
          return item.id === symbolID;
        })[0];

        if (dragSymbol) {
          let page = document.selectedPage;

          let symbolMaster = dragSymbol.import();
          let symbolInstance = symbolMaster.createNewInstance();

          if (color) {
            symbolInstance.style.fills = [color];
          }
          if (opacity) {
            symbolInstance.style.opacity = opacity;
          }
          if (size) {
            symbolInstance.frame.width = size;
            symbolInstance.frame.height = size;
          }
          if (parent) {
            if (parent.type === 'Artboard') {
              symbolInstance.frame.x = x;
              symbolInstance.frame.y = y;
              symbolInstance.parent = parent;
              parent.parent = page;
              //document.sketchObject.inspectorController().reload()
              // artboard.adjustToFit();
            } else if (parent.type === 'Page') {
              symbolInstance.frame.x = x;
              symbolInstance.frame.y = y;
              symbolInstance.parent = page;
            } else {
              console.log("拖拽到了一个非画板和页面的元素,开发者没有想到呢啊.联系程序员改bug");
            }
          } else {
            console.log("拖拽没有移入进来。因为它没有父元素啊");
          }
        } else {
          console.log(symbolID + "图标找不到了");
        }
      } catch (error) {
        console.log(error);
      }
    });
  }
  if (title === "relevence") {
    let allLayers = getSelectedLayers();
    let info = getSketchInfo();
    let isSymbolMasterLibrary = isSymbolMaster();
   
    webContents
      .executeJavaScript(`getLayersList(${JSON.stringify({allLayers,info,isSymbolMasterLibrary})})`)
      .catch(console.error);


    webContents.on('openWeb', openWeb);
    webContents.on('openDevLibrary', openDevLibrary)
  }
  if (title === 'componentLibrary') {
    let info = getSketchInfo();
    if (info) {
      webContents
        .executeJavaScript(`getSketchInfo(${JSON.stringify(info)})`)
        .catch(console.error);
    }

    webContents.on("openComponentRelevence", openComponentRelevence);
    webContents.on('openWeb', openWeb);
  }
}

function openComponentRelevence() {
  let identifier = PLUGINS_HS_PANEL_RELEVENCE;
  // 打开对应弹框
  let url = `${baseUrl}/componentRelevence`;
  let width = 280;
  let height = 635;
  let title = 'relevence';
  showBrowerWindowByIdentifier({
    identifier,
    title,
    url,
    width,
    height
  });
}

function openWeb() {
  let identifier = PLUGINS_HS_PANEL_WEB;
  // 打开对应弹框
  let url = `${baseUrl}/webPlat`;
  let width = 376;
  let height = 652;
  let title = 'webPlat';
  showBrowerWindowByIdentifier({
    identifier,
    title,
    url,
    width,
    height
  });
}

function openDevLibrary() {
  let identifier = PLUGINS_HS_PANEL_COMPONENT_LIBRARY;
  // 打开对应弹框
  let url = `${baseUrl}/componentLibrary`;
  let width = 280;
  let height = 635;
  let title = 'componentLibrary';
  showBrowerWindowByIdentifier({
    identifier,
    title,
    url,
    width,
    height
  });
}

function handleWebComponent(webContents,navName){
  let componentList = [];

  getSymbols_noImage(navName, (symbolReferences) => {
    // let list = symbolReferences.filter(item => item.symbolReference.name.indexOf("common") < 0);
    componentList = symbolReferences.filter(item => item.name.indexOf("common") < 0);
      webContents
      .executeJavaScript(`getSymbols(${JSON.stringify(componentList)})`)
      .catch(console.error);
  })
    
    webContents.on("componentDrag", (id) => {


      try {
        let sketch = require("sketch/dom");
        let document = sketch.getSelectedDocument();

        // 清除移进来的位图
        let image = sketch.find("Image,[name='位图']");
        let x = 0;
        let y = 0;
        let parent = null;
        image.forEach((item) => {
          parent = item.parent;
          console.log("有啊");
          console.log(parent);
          x = item.frame.x;
          y = item.frame.y;
          item.parent = nil;
          item.remove();
        });

        console.log("是不是");
        console.log(parent);

        // if (symbolList.length > 0) {
        //   symbolReferences = symbolList;
        // } else {
        //   let libraries = require("sketch/dom").getLibraries();

        //   let library = libraries.filter(
        //     (item) => item.name === COMPONENTSYMBOLS
        //   )[0];
        //   if (library) {
        //     symbolReferences = library.getImportableSymbolReferencesForDocument(
        //       document
        //     );
        //   }
        // }

        console.log("数据啊");
        console.log(componentList);
        console.log(id)

        let dragSymbol  = componentList.filter((item) => {
          return item.id === id;
        })[0];
        

        if (dragSymbol) {
          let page = document.selectedPage;

          let symbolMaster = dragSymbol.import();
          let symbolInstance = symbolMaster.createNewInstance();
          if (parent) {
            if (parent.type === 'Page') {
              symbolInstance.frame.x = x;
              symbolInstance.frame.y = y;
              symbolInstance.parent = page;
            } else {
              symbolInstance.frame.x = x;
              symbolInstance.frame.y = y;
              symbolInstance.parent = parent;
              parent.parent = page;
            }
            // if(parent.type === 'Artboard'){
            //   symbolInstance.frame.x = x;
            //   symbolInstance.frame.y =  y;
            //   symbolInstance.parent = parent;
            //   parent.parent = page;
            //   //document.sketchObject.inspectorController().reload()
            //   // artboard.adjustToFit();
            // }else if(parent.type === 'Page'){
            //   symbolInstance.frame.x = x;
            //   symbolInstance.frame.y = y;
            //   symbolInstance.parent = page;
            // }
            // else {
            //   console.log("拖拽到了一个非画板和页面的元素,开发者没有想到呢啊.联系程序员改bug");
            // }
          } else {
            UI.message("拖拽没有移入进来。因为它没有父元素啊");
          }
        } else {
          UI.message(id + "图标找不到了");
        }
      } catch (error) {
        console.log(error);
      }
    });

    webContents.on("getImagesByIds", function (symbolId) {
      getImagesByIds(symbolId, navName).then(res => {
        webContents
          .executeJavaScript(`getSymbolImage(${JSON.stringify(res)})`)
          .catch(console.error);
      });

    })
}


function handleWebFramework(webContents,navName){
  let componentList = [];
  getSymbols(navName,(symbolReferences) => {
    componentList = symbolReferences;
    webContents
    .executeJavaScript(`getSymbols_framework(${JSON.stringify(componentList)})`)
    .catch(console.error);
  })

  webContents.on("frameworkDrag", (id) => {

    try {
      let sketch = require("sketch/dom");
      let document = sketch.getSelectedDocument();

      // 清除移进来的位图
      let image = sketch.find("Image,[name='位图']");
      let x = 0;
      let y = 0;
      let parent = null;
      image.forEach((item) => {
        parent = item.parent;
        x = item.frame.x;
        y = item.frame.y;
        item.parent = nil;
        item.remove();
      });

      // if (symbolList.length > 0) {
      //   symbolReferences = symbolList;
      // } else {
      //   let libraries = require("sketch/dom").getLibraries();

      //   let library = libraries.filter(
      //     (item) => item.name === COMPONENTSYMBOLS
      //   )[0];
      //   if (library) {
      //     symbolReferences = library.getImportableSymbolReferencesForDocument(
      //       document
      //     );
      //   }
      // }

      let  dragSymbol = componentList.filter((item) => {
        return item.symbolReference.id === id;
      })[0].symbolReference;;
      
      

      if (dragSymbol) {
        let page = document.selectedPage;

        let symbolMaster = dragSymbol.import();
        let symbolInstance = symbolMaster.createNewInstance();
        if (parent) {
          if (parent.type === 'Page') {
            symbolInstance.frame.x = x;
            symbolInstance.frame.y = y;
            symbolInstance.parent = page;
          } else {
            symbolInstance.frame.x = x;
            symbolInstance.frame.y = y;
            symbolInstance.parent = parent;
            parent.parent = page;
          }
          // if(parent.type === 'Artboard'){
          //   symbolInstance.frame.x = x;
          //   symbolInstance.frame.y =  y;
          //   symbolInstance.parent = parent;
          //   parent.parent = page;
          //   //document.sketchObject.inspectorController().reload()
          //   // artboard.adjustToFit();
          // }else if(parent.type === 'Page'){
          //   symbolInstance.frame.x = x;
          //   symbolInstance.frame.y = y;
          //   symbolInstance.parent = page;
          // }
          // else {
          //   console.log("拖拽到了一个非画板和页面的元素,开发者没有想到呢啊.联系程序员改bug");
          // }
        } else {
          UI.message("拖拽没有移入进来。因为它没有父元素啊");
        }
      } else {
        UI.message(id + "图标找不到了");
      }
    } catch (error) {
      console.log(error);
    }
  });

  webContents.on("getFrameworksByIds", function (symbolId) {
    getImagesByIds(symbolId, navName).then(res => {
      webContents
        .executeJavaScript(`getSymbolImage(${JSON.stringify(res)})`)
        .catch(console.error);
    });

  })
}