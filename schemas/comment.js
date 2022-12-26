const mongoose = require('mongoose');
const router = require('../routes/comments');
const commentSchema = mongoose.Schema({
    "postId":{type:String,required:true},
    "user":{ type:String, required:true},
    "password":{type:String, required:true},
    "content":{type:String, required:true},
    "date" : {type:Date,required:true}
});


module.exports = mongoose.model('comments', commentSchema);