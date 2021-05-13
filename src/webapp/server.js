
var http = require("http");

http.createServer(function(requset,response){
   
    const {method,url} = requset;
    if(url === '/getUserInfo' && method === 'POST'){
        let reqData = [];
        let size = 0;
        requset.on('data', data => {
            reqData.push(data);
            size += data.length;
          });
          requset.on('end', function () {
            const data = Buffer.concat(reqData, size);
            const params = JSON.parse(data.toString());
            console.log(params);
            if(params.name === 'admin' && params.pass === '123456'){
                response.writeHead('200',{'Content-Type':'application/json;charset=utf-8','Access-Control-Allow-Origin':'http://localhost:8000'});
                response.end(JSON.stringify({code:200,body:{name:'admin',pass:'123456',avatar:'https://cdn.2-class.com/image/cover/C5F5389C14FE448BB75F576E711E7C70-6-2.png'}}))
            }else{
                response.writeHead('200',{'Content-Type':'text/plain;charset=utf-8','Access-Control-Allow-Origin':'http://localhost:8000'});
                response.end(JSON.stringify({code:500,body:'账号或者密码错误'}));
            }
        });
       
    }else if (method == "OPTIONS") {
        let reqData = [];
        let size = 0;
        response.writeHead(200, {
            "Access-Control-Allow-Origin": "http://localhost:8000",
            "Access-Control-Allow-Headers": "X-Token,Content-Type",
            "Access-Control-Allow-Methods": "PUT"
          });
          response.end();
    }else{
        response.writeHead('200',{'Content-Type':'application/json;charset=utf-8','Access-Control-Allow-Origin':'http://localhost:8000'});
        response.end(JSON.stringify({name:'1',pass:'1'}))
    }
    
}).listen(8888);
console.log('running at 127.0.0.1:8888');