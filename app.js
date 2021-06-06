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

const fetch = require('axios');

const ytRouter = require('./routes/searchYtRoutes');
app.use('/search', ytRouter);

const dbRouter = require('./routes/searchDbRoutes');
app.use('/find', dbRouter)


module.exports = app;