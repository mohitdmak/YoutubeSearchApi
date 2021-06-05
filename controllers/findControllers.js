// Importing axios module to make get requests
var fetch = require('axios');

// Importing mongo model for storing search data and video details
var searchData = require('../models/searchModel').searchData;
var videoData = require('../models/searchModel').videoData;

// Importing API_KEY 
const API_KEY = require('../config/apiKey');

// Search Function which regularly refreshes search results
async function findByTitle(Query, title){
       
    try{
        var searchDB = await searchData.findOne({ query: Query });

        if(searchDB === null){
            return null;
        }
        else{

            var data = await searchData.find({ query: Query, videoDetails.title: title});
            return data;
        }
    }
    catch(err){
        console.log(err);
        return err;
    }
}

// Search Function which regularly refreshes search results
async function findByDescription(Query, description){
       
    try{
        var searchDB = await searchData.findOne({ query: Query });

        if(searchDB === null){
            return null;
        }
        else{

            var data = await searchDB.videoDetails.find({ description: description });
            return data;
        }
    }
    catch(err){
        console.log(err);
        return err;
    }
}

// Search Function which regularly refreshes search results
async function findByTitleAndDescription(Query, title, description){
       
    try{
        var searchDB = await searchData.findOne({ query: Query });

        if(searchDB === null){
            return null;
        }
        else{

            var data = await searchDB.videoDetails.find({ title: title, description: description });
            return data;
        }
    }
    catch(err){
        console.log(err);
        return err;
    }
}


// Controller to provide results as per request
const provideResults = async (req, res) => {
    var maxResults = 2;
    var Query = req.params.searchquery;

    if(req.query.title && !req.query.description){
        var title = req.query.title;
        var data = await findByTitle(Query, title);
    }
    else if(req.query.description && !req.query.title){
        var description = req.query.description;
        var data = await findByDescription(Query, description);
    }
    else if(req.query.title && req.query.description){
        var title = req.query.title;
        var description = req.query.description;
        var data = await findByTitleAndDescription(Query, title, description);
    }
    else{
        res.status(400).json({ response: "Please provide either title or description of the required video."});
    }

    
    if(data === null){
        res.status(400).json({ response: "Please search for a video only after obtaining results through Youtube Api, thus visit the /search/:query URL first."});
    }else{
        res.status(200).json(data);
    }
}

module.exports = {
    provideResults
}