const jwt = require('jsonwebtoken');
const config = require('config');

let secretKey = config.get('token.secret_key');

var authorization = module.exports= function(req,res,next){
    let token = req.headers.token;
    if (!token) return res.status(401).send("No token provided");
    jwt.verify(token,secretKey,(error, decode)=>{
        if (error) return res.status(401).send("Invalid token");
        req.decode = decode;
        next();
    });
}