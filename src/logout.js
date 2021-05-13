import { PLUGINS_HS_USERINFO } from "./util/constants";
import UI from 'sketch/ui'
import { eventEmitter } from "./util/common";
/*
 * @Author: your name
 * @Date: 2021-04-08 15:20:18
 * @LastEditTime: 2021-04-12 11:01:16
 * @LastEditors: wbt
 * @Description: In User Settings Edit
 * @FilePath: /wbt-plugins/src/logout.js
 */
export default function (){
    eventEmitter.emit('emmiter_hsLogin', '');
    console.log(eventEmitter);
    NSUserDefaults.standardUserDefaults().removeObjectForKey(PLUGINS_HS_USERINFO);
    UI.message("已退出");
}