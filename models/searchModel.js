// Importing mongoose schema
var mongoose = require('mongoose');
var schema = mongoose.Schema;

// Importing video schema
var videoSchema = require('./videoModel').videoSchema;

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
const searchData = mongoose.model('search', searchSchema);

// exporting mongo model
module.exports = searchData;