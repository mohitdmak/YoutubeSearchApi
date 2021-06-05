// Importing axios module to make get requests
var fetch = require('axios');

// Importing mongo model for storing search data
var searchData = require('../models/searchModel');

// Importing API_KEY 
const API_KEY = require('../config/apiKey');

// Search Function which regularly refreshes search results
async function SearchResults(maxResults, Query, API_KEY, first){
    var url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${Query}&type=video&key=${API_KEY}`;
    
    try{
        var response = await fetch(url);
        for(i in response.data.items){
            var items = response.data.items[i];
            var search = new searchData({
                title: items.snippet.title,
                description: items.snippet.description,
                thumbnail: items.snippet.thumbnails.default.url,
                publishTime: items.snippet.publishedAt
            });
            var data = await search.save();
            console.log(data);
        }
    }
    catch(err){
        console.log(err);
        return err;
    }

    // setTimeout(async () => {
    //     try{
    //         await SearchResults(maxResults, Query, API_KEY, false);
    //     }catch(err){
    //         console.log(err);
    //     }
        
    // }, 10000);

    if(first){
        return data;
    }
}

var initializedPinging = 0;

// Controller to provide results as per request
const provideResults = async (req, res) => {
    if(initializedPinging == 0){
        var maxResults = 2;
        var Query = req.params.id;

        var data = await SearchResults(maxResults, Query, API_KEY, true);
        res.status(200).json(data);
        initializedPinging = 1
    }
}

module.exports = {
    provideResults
}