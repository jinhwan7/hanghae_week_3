const express = require('express');
const app = express();
const port = 3000;

const indexRouter = require('./routes/index.js');
const connect = require("./schemas/index.js");
connect();
app.use(express.json());


app.get('/',(req,res)=>{
    res.send("<img src='http://image.dongascience.com/Photo/2019/04/23228568a8de535b2858e7785af57328.jpg'>");
});

app.use('/',indexRouter);


app.listen(port, () =>{
    console.log(port, '포트로 서버가 열렸어요!');
});