const mongoose = require('mongoose');
const postSchema = mongoose.Schema({
    "user": {
        type: String,
        reqiured: true,
    },
    "password": {
        type: String,
        reqiured: true,

    },
    "title": {
        type: String,
        reqiured: true,

    },
    "content": {
        type: String,
        reqiured: true
        
    },
    "date": {
        type:Date,
        required: true
    }
},{ timestamps : true, updateAt: false } );

module.exports = mongoose.model('Post',postSchema);