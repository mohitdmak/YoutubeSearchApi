// Importing mongoose schema
var mongoose = require('mongoose');
var schema = mongoose.Schema;

// creating search results schema
const searchSchema = new schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
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

// saving schema to collection 'videos'
const searchData = mongoose.model('video', searchSchema);

// exporting mongo model
module.exports = searchData;