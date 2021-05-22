const config = require('config');
const mysql = require('mysql');
const express = require('express');
var port = config.get('server.port');

const auth = require('./src/middleware/Auth');
const authRouter = require('./src/routers/AuthRouter');
const productRouter = require('./src/routers/ProductRouter');
const billRouter = require('./src/routers/BillRouter');

var app = express();

// middleware
app.use(express.json());

//router
app.use('/',authRouter);
app.use('/product',productRouter);
app.use('/bill',billRouter);

// start
app.listen(port,()=>{
    console.log("Server is running on port "+port);
});
