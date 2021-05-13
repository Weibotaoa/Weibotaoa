/*
 * @Author: your name
 * @Date: 2020-08-08 14:47:41
 * @LastEditTime: 2021-04-12 10:49:18
 * @LastEditors: wbt
 * @Description: In User Settings Edit
 * @FilePath: /wbt-plugins/src/login.js
 */
import { getWebview} from 'sketch-module-web-view/remote'
import { eventEmitter, showLoginPopup } from './util/common';
import { PLUGINS_HS_LOGIN,PLUGINS_HS_USERINFO } from "./util/constants";
import UI from 'sketch/ui';



export default function () {
  // 判断是否存在用户信息，存在则不显示登录弹框
  const hsInfo = NSUserDefaults.standardUserDefaults().objectForKey(PLUGINS_HS_USERINFO) || "";
  if(hsInfo){
    UI.message("已经登录过了，后续这个选项会被隐藏掉");
  }else{
    showLoginPopup();
  }
}

// When the plugin is shutdown by Sketch (for example when the user disable the plugin)
// we need to close the webview if it's open
export function onShutdown() {
  const existingWebview = getWebview(PLUGINS_HS_LOGIN);

  if (existingWebview) {
    existingWebview.close();
  }
}







