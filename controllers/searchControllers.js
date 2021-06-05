// Importing axios module to make get requests
var fetch = require('axios');

// Importing mongo model for storing search data and video details
var searchData = require('../models/searchModel').searchData;
var videoData = require('../models/searchModel').videoData;

// Importing API_KEY 
const API_KEY = require('../config/apiKey');


var initializedPinging = [];

// Updating search results
async function updateResults(maxResults, Query, API_KEY,){
    var url = `https://www.googleapis.com/youtube/v3/search?order=date&part=snippet&maxResults=${maxResults}&q=${Query}&type=video&key=${API_KEY}`;

    try{
        var response = await fetch(url);

        var search = await searchData.findOne({ query: Query });
        
        for(i in response.data.items){
            var items = response.data.items[i];
            var video = new videoData({
                title: items.snippet.title,
                description: items.snippet.description,
                thumbnail: items.snippet.thumbnails.default.url,
                publishTime: items.snippet.publishedAt
            });
            search.videoDetails[i] = video;
        }

        var data = await search.save();
        console.log(`Updated Videos for query searched by ${Query}`);
    }
    catch(err){
        console.log(err);
        return err;
    }

    console.log(` Again Querying for following : ${initializedPinging}`);

    setTimeout(async () => {
        try{
            await updateResults(maxResults, Query, API_KEY);
        }catch(err){
            console.log(err);
        }
        
    }, 10000);

}

// Search Function which regularly refreshes search results
async function SearchResults(maxResults, Query, API_KEY, first){
    
    var url = `https://www.googleapis.com/youtube/v3/search?order=date&part=snippet&maxResults=${maxResults}&q=${Query}&type=video&key=${API_KEY}`;
    
    try{
        var searchDB = await searchData.findOne({ query: Query });

        if(searchDB === null){
            var response = await fetch(url);

            var search = new searchData({
                query: Query,
                maxResults: maxResults
            });
            
            for(i in response.data.items){
                var items = response.data.items[i];
                var video = new videoData({
                    title: items.snippet.title,
                    description: items.snippet.description,
                    thumbnail: items.snippet.thumbnails.default.url,
                    publishTime: items.snippet.publishedAt
                });
                
                search.videoDetails.push(video);
                console.log(video);
            }
            var data = await search.save();
            console.log(`Initializing Pinging for query ${Query}`);
            initializedPinging.push(Query);
            await updateResults(maxResults, Query, API_KEY);

            return data;
        }
        else{

            console.log(`Sending results from Database for query ${Query}`);

            if(initializedPinging.includes(Query)){
                console.log(`Already pinging ${Query}`);
                return searchDB;
            }
            else{
                console.log(`Initializing Pinging for query ${Query}`);
                initializedPinging.push(Query);
                await updateResults(maxResults, Query, API_KEY);
                return searchDB;
            }
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

    var data = await SearchResults(maxResults, Query, API_KEY, true);
    res.status(200).json(data);
    
    // if(initializedPinging == 0){
    //     initializedPinging = 1
    // }
}

module.exports = {
    provideResults
}