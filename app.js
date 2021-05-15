const config = require('config');
const mysql = require('mysql');
const express = require('express');
var port = config.get('server.port');

const auth = require('./src/middleware/Auth');
const authRouter = require('./src/routers/AuthRouter');

var app = express();
app.use(express.json());
// app.use(auth);
app.use('/login',authRouter);
app.post('/',auth,(req,res)=>{
    console.log("new connect");
    res.send(req.decode);
});

app.listen(port,()=>{
    console.log("Server is running on port "+port);
});

