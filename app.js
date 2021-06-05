// Importing and creating express app
const express = require('express');
const app = express();

// This middleware parses Json data in response object
//app.use(express.json());

// Home path response
app.get('/', (req, res) => {
    res.status(200);
    res.json({ response: "Hello Welcome to Yt SearchApi Homepage !" });
});

const API_KEY = require('./config/apiKey');
const fetch = require('axios');

const Router = require('./routes/searchRoutes');
app.use('/search', Router);

// app.get('/:id', async (req, res) =>{
//     var search = req.params.id;
//     var url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&q=${search}&type=video&key=${API_KEY}`;
//     var arr = [];
//     try{
//         var response = await fetch(url);
//         for(i in response.data.items){
//             var items = response.data.items[i];
//             arr.push(items.snippet);
//             console.log(i);
//         }
//         res.status(200).json(arr);
//     }
//     catch(err){
//         console.log(err);
//         res.status(500).json(err);
//     }
    // fetch.get(url)
    //     .then((r) => {
    //         for(i in r.data.items){
    //             var items = r.data.items[i];
    //             arr.push(items.snippet);
    //             console.log(arr);
    //         }
    //         res.json(arr);
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //         res.send(err);
    //     });
    //JSON.parse(data);
    
// });

module.exports = app;