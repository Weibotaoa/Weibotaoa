

import { context } from "../state";
import BrowserWindow from "sketch-module-web-view";
import { PLUGIN_HS_SIDEBAR } from "./constants";

/**
 * getImageURL 获取 icon 路径
 * @param {*} name
 */
export const getImageURL = (name) => {
  const isRetinaDisplay = NSScreen.mainScreen().backingScaleFactor() > 1;
  const suffix = isRetinaDisplay ? "@2x" : "";
  const pluginSketch = context.plugin.url();
  const imageURL = pluginSketch
    .URLByAppendingPathComponent("Contents")
    .URLByAppendingPathComponent("Resources")
    .URLByAppendingPathComponent("icons")
    .URLByAppendingPathComponent(`${name + suffix}.png`);
  return imageURL;
};

/**
 * createImage 创建 NSImage
 * @param {*} imageURL
 * @param {*} size
 */
export const createImage = (imageURL, size) => {
  // NSImage.alloc().initWithSize([width, height])
  const Image = NSImage.alloc().initWithContentsOfURL(imageURL);
  size && Image.setSize(size);
  Image.setScalesWhenResized(true);
  return Image;
};

/**
 * createImageView 创建 NSImageView
 * @param {*} rect
 * @param {*} icon
 * @param {*} size
 */
export const createImageView = (rect, icon, size) => {
  const imageView = NSImageView.alloc().initWithFrame(rect);
  const imageURL = getImageURL(icon);
  const image = createImage(imageURL, size);
  imageView.setImage(image);
  imageView.setAutoresizingMask(5);
  return imageView;
};

/**
 * createImageView 创建 NSBoxSeparator
 */
export const createBoxSeparator = () => {
  // set to 0 in width and height
  const separtorBox = NSBox.alloc().initWithFrame(NSZeroRect);
  // Specifies that the box is a separator
  separtorBox.setBoxType(2 || NSBoxSeparator);
  separtorBox.setBorderColor(NSColor.colorWithHex("#E6E6E6"));
  try {
    separtorBox.setBorderColor(
      NSColor.colorWithSRGBRed_green_blue_alpha(1.0, 1.0, 1.0, 1.0)
    );
  } catch (error) {
    console.error(error);
  }

  // separtorBox.setTransparent(true)
  return separtorBox;
};


/**
 * 创建 bounds
 * @param {*} x
 * @param {*} y
 * @param {*} width
 * @param {*} height
 */
export const createBounds = (x = 0, y = 0, width = 0, height = 0) =>
  NSMakeRect(x, y, width, height);

/**
 * createView 创建 NSPanel
 * @param {*} frame  options
 */
export const createPanel = (params) => {
  let options = {
    minWidth: params.width || 0,
    minHeight: params.height + 30 || 0,
    maxWidth: params.width || 800,
    maxHeight: params.height + 30 || 600,
    // x: 600,
    // y: 600,
    vibrancy: true,
  };
  options["identifier"] = params.identifier || "sketch-panel";
  options["title"] = params.title || "panel";
  options["width"] = params.width || 280;
  options["height"] = params.height + 30 || 600;

  COScript.currentCOScript().setShouldKeepAround(true);
  const threadDictionary = NSThread.mainThread().threadDictionary();
  // const mainScreenRect = NSScreen.screens()
  //   .firstObject()
  //   .frame()

  // const Bounds = NSMakeRect(
  //   options.x ? options.x : Math.round((NSWidth(mainScreenRect) - options.width) / 2),
  //   options.y ? NSHeight(mainScreenRect) - options.y : Math.round((NSHeight(mainScreenRect) - options.height) / 2),
  //   options.width,
  //   options.height
  // )

  const panel = NSPanel.alloc().init();
  // panel.setFrame_display(Bounds, true)
  panel.setOpaque(0);
  threadDictionary[options.identifier] = panel;

  // NSWindowStyleMaskDocModalWindow 直角
  panel.setStyleMask(
    NSWindowStyleMaskFullSizeContentView |
      NSBorderlessWindowMask |
      NSResizableWindowMask |
      NSTexturedBackgroundWindowMask |
      NSTitledWindowMask |
      NSClosableWindowMask |
      NSFullSizeContentViewWindowMask |
      NSWindowStyleMaskResizable
  );
  panel.setBackgroundColor(
    NSColor.whiteColor() || NSColor.windowBackgroundColor()
  );

  // panel.hidesOnDeactivate = true;  //一个布尔值，指示当窗口的应用程序变为非活动状态时是否将其从屏幕上删除。
  // panel.canHide = true; // 一个布尔值，指示当窗口的应用程序变为隐藏状态时（NSApplicationhide:方法执行期间），是否可以隐藏该窗口。
  // panel.title = options.title
  panel.movableByWindowBackground = true;
  panel.titleVisibility = NSWindowTitleHidden;
  panel.center();

  // panel.setFrameTopLeftPoint(CGPointMake(250,200)); // todo 设置panel的位置  y轴没有起作用
  // panel.cascadeTopLeftFromPoint(CGPointMake(2200,700));

  let mousePos = NSEvent.mouseLocation(); // !! 这个api终于找到了，真的是太猛了，又学到一招
  console.log(mousePos);
  // let locationInWindow = NSEvent.locationInWindow();
  // let localPoint = locationInWindow.convertPoint_formView(mousePos,params.source);
  // console.log(localPoint);
  panel.setFrame_display(
    NSMakeRect(
      mousePos.x - options.width - params.source.frame().size.width,
      mousePos.y - options.height,
      options.width,
      options.height
    ),
    true
  );
  panel.standardWindowButton(params.source);
  panel.makeKeyAndOrderFront(null);
  panel.setLevel(NSFloatingWindowLevel);
  panel.minSize = NSMakeSize(options.minWidth, options.minHeight);

  panel.titlebarAppearsTransparent = false; // panel的title是否显示
  // 左上角的三个按钮
  panel.standardWindowButton(NSWindowZoomButton).setHidden(true);
  panel.standardWindowButton(NSWindowMiniaturizeButton).setHidden(true);
  panel.standardWindowButton(NSWindowCloseButton).setHidden(true);

  // Some third-party macOS utilities check the zoom button's enabled state to
  // determine whether to show custom UI on hover, so we disable it here to
  // prevent them from doing so in a frameless app window.
  panel.standardWindowButton(NSWindowZoomButton).setEnabled(false);

  // The fullscreen button should always be hidden for frameless window.
  if (panel.standardWindowButton(NSWindowFullScreenButton)) {
    panel.standardWindowButton(NSWindowFullScreenButton).setHidden(true);
  }

  panel.floatingPanel = true; // 一个布尔值，指示接收方是否为浮动面板。 false则程序失去焦点层级不起作用
  panel.showsToolbarButton = false;
  panel.movableByWindowBackground = true;
  panel.hasShadow = true; // 一个布尔值，指示窗口是否具有阴影。

  if (options.vibrancy) {
    // Create the blurred background
    const effectView = NSVisualEffectView.alloc().initWithFrame(
      NSMakeRect(0, 0, options.width, options.height)
    );
    effectView.setMaterial(NSVisualEffectMaterialPopover);
    effectView.setAutoresizingMask(NSViewWidthSizable | NSViewHeightSizable);
    effectView.setAppearance(
      NSAppearance.appearanceNamed(NSAppearanceNameVibrantLight)
    );
    effectView.setBlendingMode(NSVisualEffectBlendingModeBehindWindow);

    // Add it to the panel
    panel.contentView().addSubview(effectView);

    // const contentView = context.document.documentWindow().contentView();
    // const sketchShell = contentView.subviews().objectAtIndex(0);
    // const sketchShellSubviews = sketchShell.subviews();
    // console.log("+++++++++++++")
    // let finalShellSubviews = [];
    // let webviewAdded = false;
    // console.log("---------")
    // console.log(sketchShellSubviews)
    // console.log("hahahahahhahahh")
    // sketchShellSubviews.forEach(subview => {
    //     finalShellSubviews.push(subview);
    //     console.log(subview.identifier());

    //     // Injecting our browser windows webview into the array - note the underscore
    //     if (!webviewAdded && subview.identifier() == 'view_canvas') {
    //         finalShellSubviews.push(panel);
    //         webviewAdded = true;
    //     }
    // });

    // // Finally, update the subviews and refresh
    // sketchShell.subviews = finalShellSubviews;
    // sketchShell.adjustSubviews();
  }

  // const closeButton = panel.standardWindowButton(NSWindowCloseButton)
  // closeButton.setCOSJSTargetFunction(sender => {
  //   log(sender)
  //   panel.close()
  //   // Remove the reference to the panel
  //   threadDictionary.removeObjectForKey(options.identifier)

  //   // Stop this Long-running script
  //   COScript.currentCOScript().setShouldKeepAround(false)
  // })
  return panel;
};

export const createBrowerWindow = (params) => {
  let options = {
    id: params.identifier,
    frame: false,
    resizable: false,
    with: params.width,
    height: params.height,
    minWidth: params.width,
    maxWidth: params.width,
    minHeight: params.heght,
    maxHeight: params.heght,
  };

  COScript.currentCOScript().setShouldKeepAround(true);
  const threadDictionary = NSThread.mainThread().threadDictionary();
  const browserWindow = new BrowserWindow(options);
  browserWindow.center();
  // threadDictionary[options.identifier] = browserWindow;
  let window = NSApp.mainWindow();
  browserWindow.setAlwaysOnTop(true);
  browserWindow.isMovable(true);
  let sidebar = threadDictionary[PLUGIN_HS_SIDEBAR];
  //侧边栏相对app的x坐标
  let relativeToApp = sidebar.superview().frame();
  let pos = window.convertPointToScreen(relativeToApp.origin)
  browserWindow.setSize(params.width, params.height);
  browserWindow.setPosition(pos.x - params.width, pos.y);
  browserWindow.setMovable(true);
  browserWindow.once("ready-to-show", () => {
    browserWindow.show();
  });
  return browserWindow;
};

/**
 * createView 创建 NSView
 * @param {*} frame  NSMakeRect(0, 0, 40, 40)
 */
export const createView = (frame) => {
  const view = NSView.alloc().initWithFrame(frame);
  view.setFlipped(1);
  return view;
};

/**
 * createBox 创建 NSBox
 * @param {*} frame  NSMakeRect(0, 0, 40, 40)
 */
export const createBox = (frame) => {
  const box = NSBox.alloc().initWithFrame(frame);
  box.setTitle("");
  return box;
};

/**
 * createBox 创建 createTextField
 * @param {*} string
 * @param {*} frame NSMakeRect(0, 0, 40, 40)
 */
export const createTextField = (string, frame) => {
  const field = NSTextField.alloc().initWithFrame(frame);

  field.setStringValue(string);
  field.setFont(NSFont.systemFontOfSize(12));
  field.setTextColor(
    NSColor.colorWithCalibratedRed_green_blue_alpha(0, 0, 0, 0.7)
  );
  field.setBezeled(0);
  field.setBackgroundColor(NSColor.windowBackgroundColor());
  field.setEditable(0);

  return field;
};

export default class InitContext {
  constructor(context) {
    this.pluginSketch = context.plugin
      .url()
      .URLByAppendingPathComponent("Contents")
      .URLByAppendingPathComponent("Sketch")
      .URLByAppendingPathComponent("library");
  }

  addButton(self, rect, icon, alternateIcon, buttonName, onClickListener) {
    var button = NSButton.alloc().initWithFrame(rect);
    //    var button = NSButton.buttonWithTitle_target_action(buttonName,nil,onClickListener);
    if (icon) {
      let image = this.getImage(rect.size, icon);
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
    button.setButtonType(NSButtonTypePushOnPushOff);
    button.setTarget(self);
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

  getImage(size, name) {
    // var isRetinaDisplay = NSScreen.mainScreen().backingScaleFactor() > 1 ? true : false;
    // var suffix = isRetinaDisplay ? '@2x' : '';
    var imageURL = this.pluginSketch
      .URLByAppendingPathComponent("toolbar")
      .URLByAppendingPathComponent(name + ".png");
    var image = NSImage.alloc().initWithContentsOfURL(imageURL);
    size && image.setSize(size);
    image.setScalesWhenResized = true;
    return image;
  }
}
