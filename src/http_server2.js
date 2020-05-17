const http = require('http'),
      fs = require('fs');
http.createServer((req,res)=>{
    fs.writeFile(__dirname +'/header01.json', JSON.stringify(req.headers), error=>{
        if(error) return console.log(error);
        console.log('HTTP檔頭儲存!');
    })
    fs.readFile(__dirname +'/data01.html',(error,data)=>{
        if(error){
            res.writeHead(500,{'Content-Type':'text/plain'});
            res.end('500 - data01.html not found');
        }else{
            res.writeHead(200, {'Content-Type':'text/html'})
            res.end(data);
        }
    });
}).listen(3000);