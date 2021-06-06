// Importing axios module to make get requests
var fetch = require('axios');

// Importing mongo model for storing search data and video details
var searchData = require('../models/searchModel');
var videoData = require('../models/videoModel').videoData;

// Importing API_KEY 
if(process.env.API_KEY_GITHUB){
    const keys = process.env.API_KEY_GITHUB;
}else{
    const keys = require('../config/apiKey');
}

// Stores queries for which server is already updating results in background every 10 seconds.
var initializedPinging = [];

// Setting globally accessible currently used API_KEY variable
var KEY;

// Adding a prototype function to array structure to cycle through elements
// This switches API_KEY upon exhausting quota of 1 ( we have 3 api keys reserved )
function switchKeys(API_KEY){

    // getting current index
    const i = keys.indexOf(API_KEY);

    // getting element in next index
    return keys[(i + 1)%keys.length];
}


// Updating search results
async function updateResults(maxResults, Query, KEY){
    var url = `https://www.googleapis.com/youtube/v3/search?order=date&part=snippet&maxResults=${maxResults}&q=${Query}&type=video&key=${KEY}`;

    try{
        var response = await fetch(url);
        // finding appropriate searchData instance to update
        var search = await searchData.findOne({ query: Query });
        
        for(i in response.data.items){
            var items = response.data.items[i];
            var video = new videoData({
                title: items.snippet.title,
                description: items.snippet.description,
                thumbnail: items.snippet.thumbnails.default.url,
                publishTime: items.snippet.publishedAt
            });
            // updating model's videoDetails documents
            search.videoDetails[i] = video;
        }
        await search.save();
        console.log(`Updated Videos for query searched by ${Query}`);
    }
    catch(err){
        console.log(err);
    }

    console.log(`      Again Querying for following : ${initializedPinging}`);
    // updating search results every 10 seconds.
    setTimeout(async () => {
        try{
            await updateResults(maxResults, Query, KEY);
        }catch(err){
            console.log(err);
        }
    }, 10000);
}

// Search Function which regularly refreshes search results
async function SearchResults(maxResults, Query, API_KEY){
    
    var url = `https://www.googleapis.com/youtube/v3/search?order=date&part=snippet&maxResults=${maxResults}&q=${Query}&type=video&key=${API_KEY}`;

    try{
        //finding appropriate searchData model, according to search query
        var searchDB = await searchData.findOne({ query: Query });

        // if user has searched for a new query, we need to fetch via yt api and wont be able to server from db
        if(searchDB === null){
            var response = await fetch(url);

            // preparing new searchData model for new query
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

            // storing this query in this array so that when user requests on this same query again, the updateResults is not called again
            // ( otherwise it will keep requesting duplicate queries to yt api, and exhaust our key quota )
            initializedPinging.push(Query);
            await updateResults(maxResults, Query, KEY);
            return data;
        }
        // If query is already searched before, we directly server from our db, as db itself is updated in background.
        else{
            console.log(`Sending results from Database for query ${Query}`);

            if(initializedPinging.includes(Query)){
                console.log(`Already pinging ${Query}`);
                return searchDB;
            }
            // If query is searched before, but its updation is not started ( could be due to server restart ).
            else{
                console.log(`Initializing Pinging for query ${Query}`);
                initializedPinging.push(Query);
                await updateResults(maxResults, Query, KEY);
                return searchDB;
            }
        } 
    }
    catch(err){ 
        // If error is due to exhaustion of api key quota, we get a 403 response code error
        // Then we switch to a new key
        if( err.message == 'Request failed with status code 403'){
            console.log(`API KEY Quota has been exhausted, switching api keys . . .`);
            KEY = switchKeys(API_KEY);
        }
        // notifying main controller to recall search function
        return "Switched API_KEYS, reinitiate request";
    }
}


// Handler to set which API_KEY to use 
function setKey(){
    // setting for the first time and then serving currently used key.
    if(KEY){
        return KEY;
    }
    else{
        KEY = keys[1];
        return KEY;
    }
}


// Controller to provide results as per request
const provideResults = async (req, res) => {
    var maxResults = 2;
    var Query = req.params.searchquery;
    
    // setting initial key for every new request
    var key = setKey();
    var data = await SearchResults(maxResults, Query, key);

    // if key was switched, we need to recall search function, before sending the response to user.
    if( data == "Switched API_KEYS, reinitiate request" ){
        var data = await SearchResults(maxResults, Query, KEY);
    }

    res.status(200).json(data);
}

module.exports = {
    provideResults
}