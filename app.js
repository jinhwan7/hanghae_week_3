const express = require('express');
const app = express();
const port = 3000;

const indexRouter = require('./routes/index.js');
const connect = require("./schemas/index.js");
connect();
app.use(express.json());


app.get('/',(req,res)=>{
    res.send("점심먹는중입니다 12:30~")
});

app.use('/api',indexRouter);


app.listen(port, () =>{
    console.log(port, '포트로 서버가 열렸어요!');
});