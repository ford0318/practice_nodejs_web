const redis = require('redis');
const client = redis.createClient();

client.on('connect',() =>{
    console.log('Redis client connected')
}) ;
client.set('foo','bar',redis.print);
client.get('foo',(error, result)=>{
    if (error){
        console.log(erro);
        throw error;
    }
    console.log('GET result ->' + result);
});