const uuid = require('uuid').v4;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = Schema({
    _id: { 
        type: String, 
        default: uuid()
    },
    contentType: {
        type:String,      
    },
    encoding: {
        type: String,
    },
    fieldname : {
        type: String,
    },
    key: {
        type: String
    },
    location: {
        type: String
    },
    mimetype: {
        type: String
    },
    originalname: {
        type: String
    },
    size: {
        type: String
    },
    thumbnail: {
        type: String
    },
    filename:{
        type: String
    },
    bucket:{
        type: String
    }

});

const Video = mongoose.model('video_model',videoSchema);

module.exports = {Video}