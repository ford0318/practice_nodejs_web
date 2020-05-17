const express = require('express');
const router = express.Router();

router.route('/member/edit/:id')
    .all((req,res,next)=>{
        res.locals.memberData ={
            name:'bill',
            id: 'A002'
        };
        next();
    })
    .get((req,res)=>{
        res.json({
            baseUrl:req.baseUrl,
            url:req.url,
            member: res.locals.memberData
        });
    });

module.exports = router;