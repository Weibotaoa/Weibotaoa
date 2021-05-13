/*
 * @Author: your name
 * @Date: 2021-04-08 15:20:18
 * @LastEditTime: 2021-05-13 20:48:12
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /sketch/hs-plugin/src/logout.js
 */
import { PLUGINS_HS_USERINFO } from "./util/constants";
import UI from 'sketch/ui'
import { eventEmitter } from "./util/common";

export default function (){
    eventEmitter.emit('emmiter_hsLogin', '');
    console.log(eventEmitter);
    NSUserDefaults.standardUserDefaults().removeObjectForKey(PLUGINS_HS_USERINFO);
    UI.message("已退出");
}