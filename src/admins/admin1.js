module.exports = app =>{
    app.get('/admin1/:p1?/:p2?',(req,res)=>{
        console.log('req.url:'+req.url)
        console.log('req.baseUrl:'+req.baseUrl)
        res.send('admin1: ' + JSON.stringify(req.params));

        // res.json(req.params);
    });
}

// let admin1 = function(app) {
//     app.get('/admin1/:p1?/:p2?',(req,res)=>{
//         res.send('admin1: ' + JSON.stringify(req.params));
//     });
// }