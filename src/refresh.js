/*
 * @Author: wbt
 * @Date: 2021-03-31 11:24:36
 * @LastEditTime: 2021-04-09 14:08:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /wbt-plugins/src/refresh.js
 */

import UI from 'sketch/ui'

export default function(){
   //!! 更新窗口。 更新的是什么东西目前不知道
   NSWindow.alloc().init().update();
   UI.message("窗口已更新");
}