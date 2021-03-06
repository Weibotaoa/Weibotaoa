import {
  eventEmitter,
  showLoginPopup,
  threadDictionary,
  baseUrl,
} from "./util/common";
import UI from "sketch/ui";
import {
  createBoxSeparator
} from "./util/element";
import {
  openUrlInBrowser,
  toogleBrowerWindow,
  InitContext
} from "./util/func";
import {
  getSelectedLayers,
  getArtboards,
  getSketchInfo,
  isSymbolMaster
} from './util/base';
import {
  PLUGIN_HS_SIDEBAR,
  PLUGIN_HS_SIDEAUTOSHOW,
  PLUGINS_HS_PANEL_WEB,
  PLUGINS_HS_PANEL_ICON,
  PLUGINS_HS_USERINFO,
  PLUGINS_HS_PANEL_UPLOAD,
  PLUGINS_HS_PANEL_PROTOCOL,
  PLUGINS_HS_PANEL_RELEVENCE,
  PLUGINS_HS_PANEL_COMPONENT_LIBRARY
} from "./util/constants";

function throttle(fn, delay) {
  let valid = true
  return function () {
    if (!valid) {
      //休息时间 暂不接客
      return false
    }
    // 工作时间，执行函数并且在间隔期内把状态位设为无效
    valid = false
    setTimeout(() => {
      fn()
      valid = true;
    }, delay)
  }
}

// !! 之后把这个列表放在manifest.json中的commands中，然后读出来 让显示在这里的信息可以是commands的一个子集

function switchToolBar(context, loginInfo) {
  let commonContext = new InitContext(context);
  // Make a view for your view controller
  // todo 待实现功能
  let toolbarAuto =
    NSUserDefaults.standardUserDefaults().objectForKey(
      PLUGIN_HS_SIDEAUTOSHOW
    ) || false;
  let hsInfo = loginInfo ?
    loginInfo :
    NSUserDefaults.standardUserDefaults().objectForKey(PLUGINS_HS_USERINFO) ||
    "";
  // todo 待进一步完善优化
  // 第一次进来 1.给container设置一个唯一标识符存储到线程字典中
  //           2.获取用户默认设置唯一标识对应的数据，（判断是否自动显示container）
  // 判断如果container 不存在，则创建container 然后把创建好的container 放入线程字典对应的标识符
  //如果container存在 判断用户设置 NSUserDefaults 是否自动显示 不自动显示则删除 自动显示则不进行任何操作（在代码中写else来执行对应操作）
  let container = threadDictionary[PLUGIN_HS_SIDEBAR];
  let isLogin = threadDictionary["isLogin"]; // 代表通过监听执行的函数

  // logo click event
  function logoAction() {
    // openUrlInBrowser("https://www.baidu.com/");
  }


  // web click event
  function webAction(self) {
    let url = `${baseUrl}/webPlat`;
    toogleBrowerWindow(
      self,
      context,
      container,
      url,
      PLUGINS_HS_PANEL_WEB,
      "webPlat",
      376,
      672
    );
    // toogleColor(self, "webPlat");
    // let gestureRecoginizer = NSClickGestureRecognizer.alloc()
    // let singleTap = NSClickGestureRecognizer.alloc().initWithTarget_action(self,sender=>{
    //   let point = sender.locationInView(self.view);
    //   console.log("----------");
    //   console.log(point);
    // })
    // self.view.addGestureRecognizer(singleTap);
    // singleTap.delegate == self;
    // singleTap.cancelsTouchesInView = false;
    // singleTap.release();

    // let hsInfo = loginInfo
    //   ? loginInfo
    //   : NSUserDefaults.standardUserDefaults().objectForKey(
    //       PLUGINS_HS_USERINFO
    //     ) || "";
    // if (hsInfo) {
    //   let url = `${baseUrl}/webPlat`;
    //   toogleBrowerWindow(
    //     self,
    //     context,
    //     container,
    //     url,
    //     PLUGINS_HS_PANEL_WEB,
    //     "webPlat",
    //     376,
    //     652
    //   );
    // } else {
    //   showLoginPopup();
    // }
  }

  function componentLibraryAction(self) {
    let url = `${baseUrl}/componentLibrary`;
    toogleBrowerWindow(
      self,
      context,
      container,
      url,
      PLUGINS_HS_PANEL_COMPONENT_LIBRARY,
      "componentLibrary",
      280,
      635
    );
    // toogleColor(self, "componentLibrary");
    // let hsInfo = loginInfo
    //   ? loginInfo
    //   : NSUserDefaults.standardUserDefaults().objectForKey(
    //       PLUGINS_HS_USERINFO
    //     ) || "";
    // if (hsInfo) {
    //   let url = `${baseUrl}/componentLibrary`;
    //   toogleBrowerWindow(
    //     self,
    //     context,
    //     container,
    //     url,
    //     PLUGINS_HS_PANEL_COMPONENT_LIBRARY,
    //     "componentLibrary",
    //     280,
    //     635
    //   );
    // } else {
    //   showLoginPopup();
    // }
  }
  // upload click event
  function iconAction(self) {
    let url = `${baseUrl}/designIcon`;
    toogleBrowerWindow(
      self,
      context,
      container,
      url,
      PLUGINS_HS_PANEL_ICON,
      "icon",
      288,
      510);
    // toogleColor(self, "icon");
    // let hsInfo = loginInfo
    //   ? loginInfo
    //   : NSUserDefaults.standardUserDefaults().objectForKey(
    //       PLUGINS_HS_USERINFO
    //     ) || "";
    // if (hsInfo) {
    //   let url = `${baseUrl}/designIcon`;
    //   toogleBrowerWindow(
    //     self,
    //     context,
    //     container,
    //     url,
    //     PLUGINS_HS_PANEL_ICON,
    //     "icon",
    //     288,
    //     510
    //   );
    // } else {
    //   showLoginPopup();
    // }
  }

  function uploadAction(self) {
    let url = `${baseUrl}/upload`;
    toogleBrowerWindow(
      self,
      context,
      container,
      url,
      PLUGINS_HS_PANEL_UPLOAD,
      "upload",
      280,
      637
    );
    // toogleColor(self, "upload");
    // let hsInfo = loginInfo
    //   ? loginInfo
    //   : NSUserDefaults.standardUserDefaults().objectForKey(
    //       PLUGINS_HS_USERINFO
    //     ) || "";
    // if (hsInfo) {
    //   let url = `${baseUrl}/upload`;
    //   toogleBrowerWindow(
    //     self,
    //     context,
    //     container,
    //     url,
    //     PLUGINS_HS_PANEL_UPLOAD,
    //     "upload",
    //     280,
    //     637
    //   );
    // } else {
    //   showLoginPopup();
    // }
  }

  // sign click event
  function protocolAction(sender) {
    let url = `${baseUrl}/protocol`;
    toogleBrowerWindow(
      self,
      context,
      container,
      url,
      PLUGINS_HS_PANEL_PROTOCOL,
      "protocol",
      280,
      637
    );
    // UI.message("signAction");
    // buttonClicked(sender)
    // toogleColor(sender, "protocol");

    // let hsInfo = loginInfo
    //   ? loginInfo
    //   : NSUserDefaults.standardUserDefaults().objectForKey(
    //       PLUGINS_HS_USERINFO
    //     ) || "";
    // if (hsInfo) {
    //   let url = `${baseUrl}/protocol`;
    //   toogleBrowerWindow(
    //     self,
    //     context,
    //     container,
    //     url,
    //     PLUGINS_HS_PANEL_PROTOCOL,
    //     "protocol",
    //     280,
    //     637
    //   );
    // } else {
    //   showLoginPopup();
    // }
  }

  function buttonClicked(sender) {
    let popover = NSPopover.alloc().init();
    popover.behavior = NSPopoverBehaviorTransient;
    popover.animates = false;
    let vc = NSViewController.alloc().init();
    let view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 80, 40));
    view.wantsLayer = true;
    view.layer().backgroundColor = NSColor.redColor().CGColor();
    vc.view = view;
    popover.contentViewController = vc;
    popover.showRelativeToRect_ofView_preferredEdge(
      sender.bounds(),
      sender,
      NSMaxXEdge
    );
  }

  function relevenceAction(sender) {
    let url = `${baseUrl}/componentRelevence`;
    toogleBrowerWindow(
      self,
      context,
      container,
      url,
      PLUGINS_HS_PANEL_RELEVENCE,
      "relevence",
      280,
      635
    );
    // toogleColor(sender, "relevence");
    // let hsInfo = loginInfo
    //   ? loginInfo
    //   : NSUserDefaults.standardUserDefaults().objectForKey(
    //       PLUGINS_HS_USERINFO
    //     ) || "";
    // if (hsInfo) {
    //   let url = `${baseUrl}/componentRelevence`;
    //   toogleBrowerWindow(
    //     self,
    //     context,
    //     container,
    //     url,
    //     PLUGINS_HS_PANEL_RELEVENCE,
    //     "relevence",
    //     280,
    //     635
    //   );
    // } else {
    //   showLoginPopup();
    // }
    // UI.message("relevenceAction");
    // !! 以下代码也是侧边栏
    // framework('WebKit')

    // let configuration = WKWebViewConfiguration.alloc().init()
    // configuration.preferences().setValue_forKey(true, "developerExtrasEnabled")
    // let myWebView = WKWebView.alloc().initWithFrame_configuration(NSMakeRect(0, 0, 400, 0), configuration)

    // let controller = NSViewController.alloc().init()
    // controller.setView(myWebView)

    // let url = NSURL.alloc().initWithString("https://www.sketch.com")
    // let request = NSURLRequest.alloc().initWithURL(url)
    // myWebView.loadRequest(request)

    // let splitViewItem = NSSplitViewItem.splitViewItemWithViewController(controller)
    // context.document.splitViewController().insertSplitViewItem_atIndex(splitViewItem, 1)
  }

  // tool click event
  function avatarAction() {
    UI.message("avatarAction");
  }

  let navList = [{
      name: "",
      action: logoAction,
      icon: "logo",
      alternateIcon: "logo",
      isUrl: false,
    },
    {
      name: "web端",
      action: webAction,
      icon: "icon_web_default",
      alternateIcon: "icon_web_active",
      isUrl: false,
    },
    {
      name: "图标",
      action: iconAction,
      icon: "icon_design_default",
      alternateIcon: "icon_design_active",
      isUrl: false,
    },
    // {
    //   name: "协议",
    //   action: protocolAction,
    //   icon: "artboard",
    //   alternateIcon: "artboard-active",
    //   isUrl: false,
    // },
    {
      name: "关联",
      action: relevenceAction,
      icon: "icon_relevence_default",
      alternateIcon: "icon_relevence_active",
      isUrl: false,
    },
    {
      name: "上传",
      action: uploadAction,
      icon: "icon_upload_default",
      alternateIcon: "icon_upload_active",
      isUrl: false,
    },
    {
      name: "关联库",
      action: componentLibraryAction,
      icon: "icon_libraryRelevence_default",
      alternateIcon: "icon_libraryRelevence_active",
      isUrl: false,
    }
    // ,
    // {
    //   id: "userAvatar",
    //   name: "",
    //   action: avatarAction,
    //   icon: "defaultAvatar",
    //   alternateIcon: "defaultAvatar",
    //   isUrl: false,
    // },
  ];
  if (!container) {
    coscript.setShouldKeepAround(true);
    container = NSBox.alloc().initWithFrame(NSMakeRect(0, 0, 10, 400));
    container.translatesAutoResizingMaskIntoConstraints = false;
    container.boxType = NSBoxCustom;
    // container.fillColor = NSColor.systemPinkColor();

    //container.boxType = NSBoxPrimary;
    container.fillColor = NSColor.colorWithRed_green_blue_alpha(
      53 / 255 ,
      64 / 255,
      79 / 255,
      1
    );

    // Make some button for demo
    let buttons = [];

    if (hsInfo) {
      navList
        .filter((item) => item.id === "userAvatar")
        .map((item) => {
          let userInfo = JSON.parse(hsInfo);
          // !! 按钮添加本地图片可以， 添加图片链接在找办法
          // item.icon = userInfo.avatar;
          // item.alternateIcon =  userInfo.avatar;
          item.name = userInfo.name;
          item.isUrl = true;
        });
    }

    navList.map((item, key) => {
      let menuButton = commonContext.addButton(
        container,
        NSMakeRect(0, 0, 20, 20),
        item.icon,
        item.alternateIcon,
        item.isUrl,
        item.name,
        item.action
      );
      // 给需要替换头像的元素存储一下，之后替换
      if (item.id === "userAvatar") {
        threadDictionary["replace_avatar"] = menuButton;
      }
      buttons.push(menuButton);
      if (key === 0 || key === 2 || key === 5) {
        buttons.push(createBoxSeparator());
      }
    });

    // Put buttons in a stack view
    let stack = NSStackView.stackViewWithViews(buttons);

    // let stack = UILayoutGuide.alloc().init();
    // layoutGuide.addLayoutGuide(buttons)


    stack.spacing = 25; // 每个元素的间隔
    stack.orientation = NSUserInterfaceLayoutOrientationVertical; // NS用户界面布局方向垂直
    stack.edgeInsets = NSEdgeInsetsMake(80, 0, 0, 0); // 与顶部的距离是10

    // Add stack view to main container view
    container.addSubview(stack);

    // ----------
    // Autolayout! The good stuff
    // ----------
    const viewsDictionary = {
      container: container,
      stack: stack
    };
    const horizontalConstraints = NSLayoutConstraint.constraintsWithVisualFormat_options_metrics_views(
      "H:|-0-[stack]-0-|",
      0,
      nil,
      viewsDictionary
    );

    container.addConstraints(horizontalConstraints);
    // console.log("123");
    // console.log(container);

    
    stack
      .topAnchor()
      .constraintEqualToAnchor(container.topAnchor())
      .setActive(true);
    // ----------

    // Make a view controller

    const viewController = NSViewController.alloc().init();
    viewController.view = container;

    // Make a split view item
    const splitViewItem = NSSplitViewItem.splitViewItemWithViewController(
      viewController
    );

    // Insert the split view item at the appropriate index
    context.document
      .splitViewController()
      .insertSplitViewItem_atIndex(splitViewItem, 2);

    threadDictionary[PLUGIN_HS_SIDEBAR] = container; // 把contaiber存储到线程字典中
    // var ga = new Analytics(context);
    // if (ga) ga.sendEvent('toolbar', 'open');

    threadDictionary["replace_stackview"] = stack;
    NSUserDefaults.standardUserDefaults().setObject_forKey(
      true,
      PLUGIN_HS_SIDEAUTOSHOW
    );
  } else if (container && isLogin == "true") {
    let oldView = threadDictionary["replace_avatar"];
    // 获取数组中定义的对应的avatar的基本数据
    let oldObj = navList.filter((item) => item.id === "userAvatar")[0];
    if (hsInfo) {
      let userInfo = JSON.parse(hsInfo);
      // !! 按钮添加本地图片可以， 添加图片链接在找办法
      // item.icon = userInfo.avatar;
      // item.alternateIcon =  userInfo.avatar;
      oldObj.name = userInfo.name;
      oldObj.isUrl = true;
    }
    let parentView = threadDictionary["replace_stackview"];
    let newView = commonContext.addButton(
      container,
      NSMakeRect(0, 0, 20, 20),
      oldObj.icon,
      oldObj.alternateIcon,
      oldObj.isUrl,
      oldObj.name,
      oldObj.action
    );

    parentView.replaceSubview_with(oldView, newView);
    // parentView.didAddSubview(oldView);
  } else {
    container.remove();
    container.parentView = nil;
    // UI.message("else的事件");
    // coscript.setShouldKeepAround(false);
    //  threadDictionary["replace_stackview"].hidden = true;
    // container.hidden = !container.hidden;
    // container.removeFromSuperview();
    threadDictionary.removeObjectForKey("replace_stackview");
    threadDictionary.removeObjectForKey("replace_avatar");
    // threadDictionary.removeObjectForKey(PLUGIN_HS_SIDEBAR);
    // NSBox.removeFromSuperview(); // 删除整个盒子
    // !! 怎么用 dismissController
    // NSViewController.hidden = true;
    // self.button.target = self;
  }
  threadDictionary["isLogin"] = "false"; // 不管怎么判断都去恢复默认参数值
}

export function onStartup() {
  // UI.message("该命令生效了");
}

export function onArtboardChanged() {
  // UI.message("画板有改变");
  changeRelevence();
  changeUpload();
}

// 画板改变时，上传的功能
function changeUpload() {
  let browserWindow = threadDictionary[PLUGINS_HS_PANEL_UPLOAD];
  if (browserWindow) {
    const webContents = browserWindow.webContents;
    let artboardList = getArtboards();
    let info = getSketchInfo();
    
    // console.log("监听了画板改变");
    // console.log(allArtBoards);
    webContents
      .executeJavaScript(`getArtboardList(${JSON.stringify({info,artboardList})})`)
      .catch(console.error);
  }
}

// 画板改变时 组件关联的功能
function changeRelevence() {
  let browserWindow = threadDictionary[PLUGINS_HS_PANEL_RELEVENCE];
  if (browserWindow) {
    const webContents = browserWindow.webContents;
    let allLayers = getSelectedLayers();
    let info = getSketchInfo();
    let isSymbolMasterLibrary = isSymbolMaster();
    webContents
      .executeJavaScript(`getLayersList(${JSON.stringify({allLayers,info,isSymbolMasterLibrary})})`)
      .catch(console.error);
  }
}
//     try {
//       const uploadWindow = threadDictionary[PLUGINS_HS_PANEL_UPLOAD];
//     if(uploadWindow){
//       let allArtBoards = getArtboards();
//       console.log(allArtBoards);
//       let webContents = uploadWindow.webContents;
//       webContents
//       .executeJavaScript(`getArtboardList(${JSON.stringify(allArtBoards)})`).then(res => {
//         console.log(res);
//       })
//       .catch(console.error)
//     //   myView.evaluateJavaScript_completionHandler(`sketchUploadArtboard(123)`,function(PLUGINS_HS_PANEL_UPLOAD,error){
//     //     console.log(error);
//     // });
//     }
//     } catch (error) {
//       console.log("this is : "+error);
//     }
// }
// export function onOpenDocument(){
//   console.log("打开文档了");
//   let allArtBoards = getArtboards();
//     console.log(allArtBoards);
//     NSUserDefaults.standardUserDefaults().setObject_forKey(allArtBoards,'allArtBoards')



export function onOpenDocument() {}


// export function onOpenDocument(){
//     console.log("打开文档了");

// }

// 关闭文档 清除弹框panel
export function onCloseDocument() {
  // 清除弹框列表
  let clearList = [
    PLUGINS_HS_PANEL_WEB,
    PLUGINS_HS_PANEL_ICON,
    PLUGINS_HS_PANEL_UPLOAD,
    PLUGINS_HS_PANEL_PROTOCOL,
    PLUGINS_HS_PANEL_RELEVENCE,
    PLUGINS_HS_PANEL_COMPONENT_LIBRARY

  ];
  clearList.forEach((item) => {
    if (threadDictionary[item]) {
      threadDictionary[item].close();
      threadDictionary.removeObjectForKey(item);
    }
  });

  // 清除侧边栏
  if (threadDictionary[PLUGIN_HS_SIDEBAR]) {
    threadDictionary.removeObjectForKey(PLUGIN_HS_SIDEBAR);
  }
}

export default function (context) {
  console.log("菜单栏显示了")
  // !! 获取用户默认设置，是否需要直接显示侧边栏  这个应该是监听文档打开事件。当文档打开的时候，创建一个侧边栏
  switchToolBar(context);
  // 监听事件 如果有登录信息则刷新则给hsInfo赋值
  // eventEmitter.on("emmiter_hsLogin", (loginInfo) => {
  //   NSUserDefaults.standardUserDefaults().setObject_forKey(
  //     loginInfo,
  //     PLUGINS_HS_USERINFO
  //   );
  //   threadDictionary["isLogin"] = "true";
  //   switchToolBar(context, loginInfo);
  // });
}