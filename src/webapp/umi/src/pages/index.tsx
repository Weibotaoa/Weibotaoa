/*
 * @Author: your name
 * @Date: 2021-03-31 10:21:48
 * @LastEditTime: 2021-05-13 20:48:45
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /sketch/hs-plugin/src/webapp/umi/src/pages/index.tsx
 */

import styles from './index.less';
import React,{useState} from 'react'
import axios from 'axios';
export default function test() {
    const [name,setName] = useState('');
    const [pass,setPass] = useState('');
    const [loginError,setLoginError] = useState(false);

    axios.defaults.baseURL = 'http://127.0.0.1:8888/';
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

    const login = async() => {
        if(name && pass){
            console.log({name,pass})
          let res = await axios.post('/getUserInfo',{name,pass});
          console.log(res);
          if(res.status === 200 && res.data.code === 200){
            setLoginError(false);
            window.postMessage("loginInfo",JSON.stringify(res.data.body));
          }else{
            setLoginError(true);
          }
        }
      }

    return (
        <div>
        <h1 className={styles.title}>登陆页</h1>
        账号：<input type="text" onChange={(e) => setName(e.target.value)}/>
        密码：<input type="text" onChange={(e) => setPass(e.target.value)}/>
        <button onClick={login}>登陆</button>
        {loginError && <p style={{color:'red'}}>账号或者密码错误</p>}
      </div>
    )
}


