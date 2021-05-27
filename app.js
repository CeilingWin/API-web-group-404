const config = require('config');
const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var port = config.get('server.port');

const auth = require('./src/middleware/Auth');
const userRouter = require('./src/routers/UserRouter');
const authRouter = require('./src/routers/AuthRouter');
const productRouter = require('./src/routers/ProductRouter');
const billRouter = require('./src/routers/BillRouter');

var app = express();

// middleware
// app.use(cors({
//     'allowedHeaders': ['sessionId', 'Content-Type','token'],
//     'exposedHeaders': ['sessionId'],
//     'origin': '*',
//     'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     'preflightContinue': false
//   }));
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use((req,res,next)=>{
    res.set('Content-type','application/json');
    console.log('request method',req.method);
    next();
})

//router
app.use('/',authRouter);
app.use('/user',userRouter);
app.use('/product',productRouter);
app.use('/bill',billRouter);

// start
app.listen(port,()=>{
    console.log("Server is running on port "+port);
});
