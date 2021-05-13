

import { createBrowerWindow, createPanel } from "./element";
import { threadDictionary } from "./common";
import { getArtboards, getSelectedLayers, getSymbols } from "./base";

import {
  PLUGINS_HS_PANEL_WEB,
  PLUGINS_HS_PANEL_ICON,
  PLUGINS_HS_PANEL_UPLOAD,
  PLUGINS_HS_PANEL_PROTOCOL,
  PLUGINS_HS_PANEL_RELEVENCE,
} from "./constants";

let UI = require("sketch/ui");
export class InitContext {
  constructor(context) {
    this.pluginSketch = context.plugin
      .url()
      .URLByAppendingPathComponent("Contents")
      .URLByAppendingPathComponent("Sketch")
      .URLByAppendingPathComponent("library");
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
    button.setButtonType(NSMomentaryChangeButton);
    button.setTarget(button);

    button.setAction("onClickListener:");
    button.setCOSJSTargetFunction(onClickListener);

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
    console.log(this.pluginSketch);
    // var isRetinaDisplay = NSScreen.mainScreen().backingScaleFactor() > 1 ? true : false;
    // var suffix = isRetinaDisplay ? '@2x' : '';
    var imageURL = this.pluginSketch
      .URLByAppendingPathComponent("toolbar")
      .URLByAppendingPathComponent(name + ".png");
      console.log(imageURL);
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
function clearOthersPanel(currentIdentifier) {
  let identifierList = [
    PLUGINS_HS_PANEL_WEB,
    PLUGINS_HS_PANEL_ICON,
    PLUGINS_HS_PANEL_UPLOAD,
    PLUGINS_HS_PANEL_PROTOCOL,
    PLUGINS_HS_PANEL_RELEVENCE,
  ];
  identifierList
    .filter((item) => threadDictionary[item] && item !== currentIdentifier)
    .forEach((item) => {
      let prevPanel = threadDictionary[item];
      threadDictionary.removeObjectForKey(item);
      prevPanel.close();
    });
}

function clearOthersWindow(currentIdentifier) {
  let identifierList = [
    PLUGINS_HS_PANEL_WEB,
    PLUGINS_HS_PANEL_ICON,
    PLUGINS_HS_PANEL_UPLOAD,
    PLUGINS_HS_PANEL_PROTOCOL,
    PLUGINS_HS_PANEL_RELEVENCE,
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
      console.log(prevPanel);
      prevPanel.close();
    });
}

/**
 *
 *
 * @export
 * @param {*} context  执行组件的context
 * @param {*} container  按钮所在的容器
 * @param {*} url   panel 加载的页面的路径
 * @param {*} identifier  按钮对应的panel的唯一标识符
 * @param {*} title  按钮所对应的panel的标题
 */
export function tooglePanel(
  source,
  context,
  container,
  url,
  identifier,
  title,
  panelWidth,
  panelHeight
) {
  // let commonContext =  new InitContext(context);
  clearOthersPanel(identifier); // 清除掉放在数组里面的除了自己之外的所有panel

  //  登录弹框用browserWindow，功能弹框用panel
  let panel = threadDictionary[identifier];
  if (!panel) {
    let width = panelWidth || 800;
    let height = panelHeight || 600;
    panel = createPanel({ source, identifier, title, width, height });
    // NSApplication.sharedApplication.addChildWindow_ordered(panel,NSWindowAbove);
    console.log(context);
    console.log(context.document);

    let contentView = panel.contentView();
    // webview内容
    let webView = WKWebView.alloc().initWithFrame(
      NSMakeRect(0, 0, width, height)
    );
    let request = NSURLRequest.requestWithURL(NSURL.URLWithString(url));
    webView.loadRequest(request);
    implementFunc_panel(webView, title);
    console.log(webView.URL());
    contentView.addSubview(webView);
    threadDictionary[identifier] = panel;
  } else {
    threadDictionary.removeObjectForKey(identifier);
    panel.close();
  }

  //   let closeButton = commonContext.addButton(container,NSMakeRect(20, 53, 31, 31), "miaow","miaowActive","关闭弹框",
  //    function (sender) {
  //        panel.close();
  //    });
  //    contentView.addSubview(closeButton);
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
  if(title === 'webPlat'){
    getSymbols('HuxBC-component',(symbolReferences) => {
      let list = symbolReferences.filter(item => item.symbolReference.name.indexOf("common") < 0);
      webContents
        .executeJavaScript(`getSymbols(${JSON.stringify(list)})`)
        .catch(console.error);
    });
    webContents.on("componentDrag", (id) => {
      let symbolList = [];
      let symbolReferences = [];
      
      try {
        let sketch = require("sketch/dom");
        let document = sketch.getSelectedDocument();

        // 清除移进来的位图
        let image = sketch.find("Image,[name='位图']");
        let x = 0;
        let y = 0;
        let parent = null;
        image.forEach((item) => {
          console.log("位图信息");
          console.log(item);
          parent = item.parent;
          x = item.frame.x;
          y = item.frame.y;
          item.parent = nil;
          item.remove();
        });

        if (symbolList.length > 0) {
          symbolReferences = symbolList;
        } else {
          let libraries = require("sketch/dom").getLibraries();

          let library = libraries.filter(
            (item) => item.name === "HuxBC-component"
          )[0];
          if (library) {
            symbolReferences = library.getImportableSymbolReferencesForDocument(
              document
            );
          }
        }

        let dragSymbol = symbolReferences.filter((item) => {
          return item.id === id;
        })[0];

        if (dragSymbol) {
          let page = document.selectedPage;
          
          let symbolMaster = dragSymbol.import();
          let symbolInstance = symbolMaster.createNewInstance();
          
          if (parent) {
              if(parent.type === 'Artboard'){
                symbolInstance.frame.x = x;
                symbolInstance.frame.y =  y;
                symbolInstance.parent = parent;
                parent.parent = page;
                //document.sketchObject.inspectorController().reload()
                // artboard.adjustToFit();
              }else if(parent.type === 'Page'){
                symbolInstance.frame.x = x;
                symbolInstance.frame.y = y;
                symbolInstance.parent = page;
              }else {
                console.log("拖拽到了一个非画板和页面的元素,开发者没有想到呢啊.联系程序员改bug");
              }
          } else{
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
  if (title === "upload") {
    let allArtBoards = getArtboards();
    webContents
      .executeJavaScript(`getArtboardList(${JSON.stringify(allArtBoards)})`)
      .catch(console.error);
  }
  if (title === "protocol") {
    let allLayers = getSelectedLayers();
    webContents
      .executeJavaScript(`getLayersList(${JSON.stringify(allLayers)})`)
      .catch(console.error);
  }
  if (title === "icon") {
    getSymbols('HuxBC-globalstyle-icon',(symbolReferences) => {
      webContents
        .executeJavaScript(`getSymbols(${JSON.stringify(symbolReferences)})`)
        .catch(console.error);
    });

    // 
    webContents.on("symbolDrag", (params) => {
      let symbolList = [];
      let symbolReferences = [];
      
      try {
        let { symbolID, color, opacity, size } = JSON.parse(params);
        let sketch = require("sketch/dom");
        let document = sketch.getSelectedDocument();

        // 清除移进来的位图
        let image = sketch.find("Image,[name='位图']");
        let x = 0;
        let y = 0;
        let parent = null;
        image.forEach((item) => {
          console.log("位图信息");
          console.log(item);
          parent = item.parent;
          x = item.frame.x;
          y = item.frame.y;
          item.parent = nil;
          item.remove();
        });

        if (symbolList.length > 0) {
          symbolReferences = symbolList;
        } else {
          let libraries = require("sketch/dom").getLibraries();

          let library = libraries.filter(
            (item) => item.name === "HuxBC-globalstyle-icon"
          )[0];
          if (library) {
            symbolReferences = library.getImportableSymbolReferencesForDocument(
              document
            );
          }
        }

        let dragSymbol = symbolReferences.filter((item) => {
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
              if(parent.type === 'Artboard'){
                symbolInstance.frame.x = x;
                symbolInstance.frame.y =  y;
                symbolInstance.parent = parent;
                parent.parent = page;
                //document.sketchObject.inspectorController().reload()
                // artboard.adjustToFit();
              }else if(parent.type === 'Page'){
                symbolInstance.frame.x = x;
                symbolInstance.frame.y = y;
                symbolInstance.parent = page;
              }else {
                console.log("拖拽到了一个非画板和页面的元素,开发者没有想到呢啊.联系程序员改bug");
              }
          } else{
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
    webContents
      .executeJavaScript(`getLayersList(${JSON.stringify(allLayers)})`)
      .catch(console.error);
  }
}


function pointInArtboard(artboardList,point){
  let {x,y,parent} = point;
  console.log("这是位图的parent");
  console.log();
  return artboardList.filter(artboard => {
      let Xmin = artboard.frame.x;
      let Ymax = artboard.frame.y;
      let Xmax = Xmin + artboard.frame.width;
      let Ymin = Ymax - artboard.frame.height;
       // condition: Xmin < x < Xmax  && Ymin < y < Ymax
       if(Xmin < x < Xmax  && Ymin < y < Ymax){
          return artboard;
       }
  })[0] 
}

// !! 与createPanel等可以一起删除
function implementFunc_panel(myView, title) {
  if (title === "upload") {
    let allArtBoards = getArtboards();
    console.log(allArtBoards);
    myView.evaluateJavaScript_completionHandler(
      `getArtboardList(${JSON.stringify(allArtBoards)})`,
      nil
    );
  }
}
