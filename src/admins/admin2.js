const express = require('express');
const router = express.Router();

router.get('/admin2/:p1?/:p2?', (req,res)=>{
    res.json(req.params);

});

router.get('/admin3/:p1?/:p2?', (req,res)=>{
    res.send('admin3: ' + JSON.stringify(req.params));
});

module.exports = router;