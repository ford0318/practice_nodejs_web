//引入express
const express = require('express');
const fs = require('fs')
//引入url
const url = require('url');
const moment = require('moment-timezone');
//引入body-parser
const bodyParser = require('body-parser');

//引入上傳檔案模組
const multer = require('multer');
//設定檔案上傳資料夾
const upload = multer({dest:'tmp_uploads/'});

//redis import and connect
const redis = require('redis');
const client = redis.createClient();
client.on('connect',() =>{
    console.log('Redis client connected')
}) ;

// const clientdb = require('./mdb');


//mysql import and connect
const mysql = require('mysql');
const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'test'
});
db.connect();

//建立WEB SERVER 物件
var app = express();

const session = require('express-session')

app.use(session({
    saveUninitialized:false,
    resave:false,
    secret:'ghk%dls#@sd',
    cookie:{
        maxAge:60*1000*20
    }
}));

app.set('view engine', 'ejs')
//app.set('views', __dirname + '/../views')



//取得urlencoded parser
//const urlencodedParser = bodyParser.urlencoded({extend:false});
//
app.use(bodyParser.urlencoded({extended:false})); 
//
app.use(bodyParser.json())

app.use(express.static('public'));
//app.use(express.static(__dirname+'/../public'))

//路由模組化一
const admin1 = require(__dirname + '/admins/admin1');
admin1(app);


//路由模組化二
const admin2Router = require(__dirname + '/admins/admin2');
app.use(admin2Router);


//路由模組化三
const admin3Router = require(__dirname + '/admins/admin3');
app.use('/admin3',admin3Router)



//建立路由
app.get('/',function(req,res){
    //res.send('Hello express!');
    res.render('home', {name: 'Ford Ye'})
});

app.get('/sales', (req,res)=>{
    const data = require(__dirname +'/../data/sales');
    res.render('sales',{
        sales:data
    });
});


app.get('/try-querystring', (req,res)=>{
    const urlParts =url.parse(req.url,true);
    console.log(urlParts); //
    console.log(req.url)
    // res.render('try-querystring',{
    //     urlParts:urlParts
    // });
    res.json(urlParts)
});

app.post('/try-post',(req,res)=>{
    const result ={
        suceess:true,
        data:req.body.a*req.body.b,
        body: req.body
    }

    res.json(result)
    
});

app.get('/try-post-form',(req,res)=>{
    res.render('try-post-form');
});

app.post('/try-post-form',(req,res)=>{
    res.render('try-post-form',req.body)
    
});

app.get('/try-upload', (req,res)=>{
    res.render('try-upload')
});

// app.post('/try-upload', upload.single('avatar'), (req,res)=>{
//     console.log(req.file);
//     res.send('ok')
// });

app.post('/try-upload', upload.single('avatar'), (req,res)=>{
    if(req.file && req.file.originalname){
        console.log(req.params)
        if(/\.(jpeg|jpg|png)$/i.test(req.file.originalname)){
            fs.createReadStream(req.file.path)
                .pipe(
                    fs.createWriteStream('./public/img/' + req.file.originalname)
                );
            res.render('try-upload',{
                result: true,
                name:req.body.name,
                avatar: '/img/' + req.file.originalname
            });
            return;
        }
    }

    res.render('try-upload',{
        result:false,
        name:"",
        avatar:""
    });
});

app.get(/^\/hi\/?/, (req,res)=>{
    let result = {
        url:req.url
    };
    result.split = req.url.split('/');
    res.json(result);
});

app.get(/^\/09\d{2}\-?\d{3}\-?\d{3}/, (req,res)=>{
    let str = req.url.slice(1);
    console.log(req.url)
    console.log(str)
    str = str.split('-').join('');
    res.send('mobile: ' + str);
});


app.get('/try-session', (req,res)=>{
    req.session.views = req.session.views || 0;
    req.session.views++;
    res.contentType('text/plain');
    res.write('views: ' + req.session.views +'\n');
    res.end(JSON.stringify(req.session))
});


app.get('/login',(req, res)=>{
    const data ={};
    if (req.session.flashMsg) {
        data.flashMsg = req.session.flashMsg;
        delete req.session.flashMsg;
    }
    data.isLogined =!!req.session.loginUser;
    data.loginUser = req.session.loginUser;
    data.oriUser = req.session.oriUser;
    data.oriPassword = req.session.oriPassword;
    res.render('login',data);
});

app.post('/login',(req,res)=>{
    if(req.body.user ==='ford123'&& req.body.password ==='123456'){
        req.session.loginUser = 'ford123';
    } else {
        req.session.flashMsg = "ID / PASSWORD ERROR!";
        req.session.oriUser = req.body.user;
        req.session.oriPassword = req.body.password;
    }
    res.redirect('/login');
});

app.get('/logout',(req,res)=>{
    delete req.session.loginUser
    res.redirect('/login');
});

app.get('/try-moment',(req,res)=>{
    const myFormat = 'YYYY-MM-DD HH:mm:ss';
    const d = moment(new Date());

    res.contentType('text/plain');
    res.write(d.format(myFormat)+'\n');
    res.write('London time: '+d.tz('Europe/London').format(myFormat)+'\n');
    res.write('Tokyo time: ' + d.tz('Asia/Tokyo').format(myFormat)+'\n');
    res.write('Taipe time: ' + d.tz('Asia/Taipei').format(myFormat)+'\n');
    res.end('');
});


app.get('/sales3',(req,res)=>{
    var sql = "SELECT *FROM `sales`";
    db.query(sql,(error,results,fields)=>{
        if(error) throw error;
        console.log(results,fields);
        for (let v of results){
            v.birthday2 = moment(v.birthday).format('YYYY-MM-DD');
        };

        var listInfo= "";
        if(req.session.listInfo){
            listInfo = req.session.listInfo;
            delete req.session.listInfo;
        };

        res.render('sales3',{
            rows:results,
            title:'資料列表',
            listInfo:listInfo,
        });
    });
});

app.get('/sales3/add',(req,res)=>{

    res.render('sales3_add');

});


app.post('/sales3/add',(req,res)=>{
    var data = {
        body:req.body,
        infotype:'danger',
        info:"",
        success:false,
    };
    let sql = "INSERT INTO `sales` (`sales_id`,`name`,`birthday`) values (?,?,?)";
    db.query(sql,
        [req.body.sales_id,req.body.name,req.body.birthday],
        function(error,results){
            if(error){
                // res.json(error);
                data.info = "some action make database error!"
            }else{
                if(results.affectedRows==1){
                    data.success = true;
                    data.infotype = "success";
                    data.info = "Successed! Already inserted one data";
                }
            }
            res.render('sales3_add',data);
        });
});



app.get('/sales3/add-ajax',(req,res)=>{

    res.render('sales3_add_ajax');

});

app.post('/sales3/add-ajax',(req,res)=>{
    var data = {
        body:req.body,
        infotype:'danger',
        info:"",
        success:false,
    };
    let sql = "INSERT INTO `sales` (`sales_id`,`name`,`birthday`) values (?,?,?)";
    db.query(sql,
        [req.body.sales_id,req.body.name,req.body.birthday],
        function(error,results){
            if(error){
                // res.json(error);
                data.info = "some action make database error!"
            }else{
                if(results.affectedRows==1){
                    data.success = true;
                    data.infotype = "success";
                    data.info = "Successed! Already inserted one data";
                }
            }
            res.json(data);
        }); 
});


app.get('/sales3/remove/:sid',(req,res)=>{
    // res.send(req.params);
    var sid = parseInt(req.params.sid);
    if(isNaN(sid)){

    } else {
        let sql ="DELETE FROM `sales` where `sid` = ? ";
        db.query(sql,[sid],(error,results)=>{
            if(results.affectedRows===1){
                req.session.listInfo={
                    type:'success',
                    text:`成功刪除${sid}資料`
                };
            } else{

                req.session.listInfo={
                    type:'danger',
                    text:`delete data ${sid} failed`,
                }
            }
            // res.json(results);
            res.redirect('/sales3')

        });
    }
});

app.get('/sales3/edit/:sid',(req,res)=>{
    // res.send(req.params.sid);
    var sid = parseInt(req.params.sid);
    if(isNaN(sid)){

    } else {
        let sql = "SELECT * FROM `sales` where `sid`= ?";
        db.query(sql,[sid],(error,results)=>{
            if (results && results[0]){
                results[0].birthday =moment(results[0].birthday).format('YYYY-MM-DD');
                res.render('sales3_edit',{row:results[0]});
            }
            
        });
        


    }
});

app.post('/sales3/edit/:sid',(req,res)=>{
    var data = {
        row:req.body,
        infotype:'danger',
        info:"",
        success:false,
    };

    var sid = parseInt(req.params.sid);
    if(isNaN(sid)){
        res.redirect('/sales3');
    } else {
        let sql = "UPDATE `sales` SET `sales_id`=? ,`name`=?, `birthday`=? where `sid`= ?";
        db.query(sql,
            [req.body.sales_id,req.body.name,req.body.birthday,sid],
            (error,results)=>{
                if(error){
                    // res.json(error);
                    data.info = "some action make database error!"
                }else{
                    if(results.affectedRows==1){
                        data.success = true;
                        data.infotype = "success";
                        data.info = "Successed updated data";
                    }
                }
                res.render('sales3_edit',data);
            });
    };
        




    

});


//建立404頁面 必須放在所有路由最後
app.use((req,res)=>{
    res.type('text/plain');
    res.status(404);
    res.send('404 - 找不到網頁!')
});

//SERVER 監聽
app.listen(3000,function(){
    console.log('啟動SERVER PORT:3000');
}); 

