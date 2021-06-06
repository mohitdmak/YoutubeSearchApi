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

// saving schema to collection 'videos'
const videoData = mongoose.model('video', videoSchema);

module.exports = {
    videoData,
    videoSchema
}