// Importing mongoose schema
var mongoose = require('mongoose');
var schema = mongoose.Schema;


// creating video details schema
const videoSchema = new schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    thumbnail: {
        type: String,
        required: true
    },
    publishTime: {
        type: String,
        required: true
    }
});

// creating search results schema
const searchSchema = new schema({
    query: {
        type: String,
        required: true
    },
    maxResults: {
        type: Number,
        required: true
    },
    videoDetails: [
        videoSchema
    ]
});

// saving schema to collection 'videos'
const videoData = mongoose.model('video', videoSchema);
const searchData = mongoose.model('search', searchSchema);

// exporting mongo model
module.exports = {
    searchData,
    videoData
}