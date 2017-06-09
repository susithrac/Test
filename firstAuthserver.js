
var express = require('express');
var morgan = require('morgan');

var app = express();
app.use(morgan('dev'));

var dishRouter=require('./dishRouter');
app.use("/dishes",dishRouter);

function auth(req,res,next){
    console.log(req.headers);
    var authHeaders = req.headers.authorization;
    console.log("I am in auth here");
    console.log("I am h", authHeaders );
    if(!authHeaders){
        var err=new Error("You are not authenticated");
        err.status = 401;
        next(err);
        return;
    }
        
        var auth = new Buffer(authHeaders.split(' ')[1], 'base64').toString().split(":");
        var user = auth[0];
        var password = auth[1];
        if(user === 'admin' && password === 'password'){
            next(); //authorized
        }
        else{
            var err=new Error("You are not at all authenticated");
            err.status = 401;
            next(err);
        }
}
app.use(auth);

app.use(express.static(__dirname + '/public'));

app.use(function(err,req,res,next){
    //important to pass err since it comes
    //from previous middleware
    //500 for internal server error
    res.writeHead(err.status || 500,{
    'WWW-authenticate': 'Basic',
    'Content-Type': 'text/plain'});
    res.end(err.message);
});

app.listen(3000,function(){
    console.log("Server started");
})
