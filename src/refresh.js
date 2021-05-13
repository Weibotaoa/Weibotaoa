

import UI from 'sketch/ui'

export default function(){
   //!! 更新窗口。 更新的是什么东西目前不知道
   NSWindow.alloc().init().update();
   UI.message("窗口已更新");
}