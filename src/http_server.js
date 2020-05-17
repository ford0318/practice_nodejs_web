const http = require('http');
const server = http.createServer((request,response)=>{
    response.writeHead(200,{
        'Content-Type':'text/html'
    });
    response.end(`<div>Hello world! <br>${request.url}</div>`);
});
// request.url 指的是localhost:3000之後的網址包含querystring
server.listen(3000);