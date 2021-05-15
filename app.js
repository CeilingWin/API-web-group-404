const config = require('config');
const mysql = require('mysql');
const express = require('express');
var port = config.get('server.port');

const auth = require('./src/middleware/Auth');
const authRouter = require('./src/routers/AuthRouter');
const productRouter = require('./src/routers/ProductRouter');
// test
const ProductModel = require('./src/models/ProductModel');
const UserModel = require('./src/models/UserModel');
let {isEmail} = require('./src/utils/StringUtil');

var app = express();
app.use(express.json());
app.use('/',authRouter);
app.use('/product',productRouter);
app.post('/',auth,(req,res)=>{
    console.log("new connect");
    res.send(req.user);
});

app.listen(port,()=>{
    console.log("Server is running on port "+port);
});

var test = async ()=>{
    let pm = new ProductModel(); 
    let result = await pm.getType('pc');
    console.log(result);
}

// test();