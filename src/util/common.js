/*
 * @Author: your name
 * @Date: 2021-04-01 16:33:02
 * @LastEditTime: 2021-08-20 13:22:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /sketch/hs-plugin/src/util/common.js
 */


import BrowserWindow from 'sketch-module-web-view'
import { getWebview} from 'sketch-module-web-view/remote'
import { PLUGINS_HS_LOGIN,PLUGINS_HS_USERINFO } from './constants';
import UI from 'sketch/ui'

//  let baseUrl = 'http://localhost:8008/#/webview';
  let baseUrl = 'http://10.20.145.85:8008/#/webview';
// 线程字典
let threadDictionary = NSThread.mainThread().threadDictionary();

// 发布订阅对象
let EventEmitter = require('events').EventEmitter; 
let eventEmitter = new EventEmitter(); 

// 登录弹框
function showLoginPopup(){
    const options = {
        identifier: PLUGINS_HS_LOGIN,
        useContentSize:true,
      }
    //   const existingWebview = getWebview(PLUGINS_HS_LOGIN);
    //     if (existingWebview) {
    //         existingWebview.close();
    //     }

      const browserWindow = new BrowserWindow(options)
      browserWindow.setAlwaysOnTop(true);
      browserWindow.center();
       // only show the window when the page has loaded to avoid a white flash
      //  browserWindow.once('ready-to-show', () => {
      //   browserWindow.show()
      // })
      const webContents = browserWindow.webContents;
         webContents.on("loginInfo",hsInfo => {
            console.log(hsInfo); // 用户信息
            UI.message("登录成功");
             // 登录成功之后将信息保存在用户默认设置里面 在其它地方可以进行获取
            NSUserDefaults.standardUserDefaults().setObject_forKey(hsInfo,PLUGINS_HS_USERINFO);
            eventEmitter.emit('emmiter_hsLogin',hsInfo);
            browserWindow.hide(); // 关闭登录框
         })

          // print a message when the page loads
        webContents.on('did-finish-load', () => {
            UI.message('UI loaded!')
        })

        // add a handler for a call from web content's javascript
        // webContents.on('nativeLog', s => {
        //     UI.message(s)
        //     webContents
        //     .executeJavaScript(`setRandomNumber(${Math.random()})`)
        //     .catch(console.error)
        //     // if(isWebviewPresent(PLUGINS_HS_LOGIN) == 1){
        //     //   sendToWebview(PLUGINS_HS_LOGIN,`setRandomNumber(${Math.random()})`)
        //     // }
        // })
         browserWindow.loadURL('http://localhost:8000');
}


export {threadDictionary,showLoginPopup,eventEmitter,baseUrl}

