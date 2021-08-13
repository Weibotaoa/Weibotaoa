/*
 * @Author: wbt
 * @Date: 2021-04-07 22:52:37
 * @LastEditTime: 2021-08-12 19:22:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /sketch/hs-plugin/src/util/constants.js
 */
let str = '';
if(NSApp.mainWindow()){
    str = (NSApp.mainWindow()+"").split(":")[1].trim();
}
console.log(NSApp.mainWindow());
console.log("这是啥啊");
let PLUGIN_HS_SIDEBAR = str === '' ? '' :  str.slice(0,str.length - 1); // 插件的侧边导航栏标识符
const PLUGINS_HS_LOGIN =  'com.plugins.hs.login'; // 登录的webview标识符
const PLUGINS_HS_USERINFO = 'com.plugins.hs.userInfo'; // 登录插件的信息

// const PLUGIN_HS_SIDEBAR = 'com.plugins.hs.sidebar'; 
const PLUGIN_HS_SIDEAUTOSHOW = 'com.plugins.hs.sidebarautoshow'; // 判断侧边导航栏是否默认显示

// 通过按钮点击toggle panel,并根据identifier存储在dictionary中
const PLUGINS_HS_PANEL_WEB = 'com.plugins.hs.menu.web'; // 右侧导航栏的web端显示的panel的标识符
const PLUGINS_HS_PANEL_ICON = 'com.plugins.hs.menu.icon'; // 右侧导航栏的icon显示的panel的标识符
const PLUGINS_HS_PANEL_UPLOAD = 'com.plugins.hs.menu.upload'; //右侧导航栏上传显示的panel的标识符
const PLUGINS_HS_PANEL_PROTOCOL = 'com.plugins.hs.menu.protocol'; //右侧导航栏协议显示的panel的标识符
const PLUGINS_HS_PANEL_RELEVENCE = 'com.plugins.hs.menu.relevence'; //右侧导航栏关联显示的panel的标识符
const PLUGINS_HS_PANEL_COMPONENT_LIBRARY = 'com.plugins.hs.menu.componentLibrary'; //右侧导航栏关联库显示的panel的标识符
const COMPONENTSYMBOLS = 'HuxBC-component'; // 基础组件库名称
const DESIGNICONSYMBOLS = 'HuxBC-globalstyle-icon'; // 图标库名


export {
    PLUGINS_HS_LOGIN,
    PLUGIN_HS_SIDEBAR,
    PLUGIN_HS_SIDEAUTOSHOW,
    PLUGINS_HS_PANEL_WEB,
    PLUGINS_HS_PANEL_ICON,
    PLUGINS_HS_USERINFO,
    PLUGINS_HS_PANEL_UPLOAD,
    PLUGINS_HS_PANEL_PROTOCOL,
    PLUGINS_HS_PANEL_RELEVENCE,
    PLUGINS_HS_PANEL_COMPONENT_LIBRARY,
    COMPONENTSYMBOLS,
    DESIGNICONSYMBOLS
};

