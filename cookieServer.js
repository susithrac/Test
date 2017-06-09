var express = require('express');
var cookieParser = require('cookie-parser');

var morgan = require('morgan');

var app = express();

app.use(morgan('dev'));

app.use(cookieParser('12345-67890-09876-54321'));

function auth(req,res,next){
    console.log(req.signedCookies);
    if(!req.signedCookies.user){
    var authHeaders = req.headers.authorization;
    console.log("header="+authHeaders);
    if(!authHeaders){
        var err=new Error("You are not authenticated");
        err.status = 401;
        next(err);
        return;
    }
        
    var auth = new Buffer(authHeaders.split(' ')[1], 'base64').toString().split(":");
    var user = auth[0];
    var password = auth[1];
    console.log(user);
    console.log(password);
    if(user == 'admin' && password == 'password'){
            res.cookie('user','admin',{signed:true});
            next(); //authorized
    }
    else{
            var err=new Error("You are not at all authenticated");
            err.status = 401;
            next(err);
        }
    }
    else{
        console.log("In the testing")
        console.log(req.signedCookies);
        if (req.signedCookies.user == 'admin') {
            next();
        }
        else {
            var err = new Error('You are not authenticated!');
            err.status = 401;
            next(err);
        }
    }
};
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
/* Install clear cookies app and clear if 
there are any session-id.  */
app.listen(3000,function(){
    console.log("Server started");
});
