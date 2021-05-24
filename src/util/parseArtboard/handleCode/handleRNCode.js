/*
 * @Author:wbt
 * @Date: 2021-05-24 09:19:38
 * @LastEditTime: 2021-05-24 09:19:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /sketch/hs-plugin/src/util/parseArtboard/handleCode/handleRNCode.js
 */
import fs from '@skpm/fs';
import { CodeType, picassoCode } from '@wubafe/picasso-parse';

export default (rootPath, codeDSL) => {
    const pageWidth = codeDSL.structure.width;
    const codePath = `${rootPath}/${codeDSL.name.replace(/\//g, '／')}`;
    // 生成代码片段
    const code = picassoCode([codeDSL], pageWidth, CodeType.ReactNative);

    if (!fs.existsSync(codePath)) {
        fs.mkdirSync(codePath);
    }

    fs.writeFileSync(`${codePath}/index.jsx`, code.jsx);
}
