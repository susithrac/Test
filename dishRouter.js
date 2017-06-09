var express = require('express');
var app = express();
var router = express.Router();

router.get('/',function(req,res){
    res.send("Get the dishes")
});
router.post('/',function(req,res){
    res.send("Post Details");
});
router.delete('/',function(req,res){
    res.send("delete Request");
});

module.exports = router;