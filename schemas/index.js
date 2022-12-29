const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const connect = () => {
    // mongoose.connect("mongodb://test:sparta77@localhost:27017/admin", {
    //     dbName: 'hanghae_week_3',
    //     ignoreUndefined: true
    // }).catch (err => console.log(err));
    mongoose
        .connect("mongodb://127.0.0.1:27017/node_beggin")
        .catch(err => console.log(err));



    mongoose.connection.on("error", err => {
        console.error("몽고디비 연결 에러", err);
    });
}

module.exports = connect;

