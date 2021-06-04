// Importing and creating express app
const express = require('express');
const app = express();

// This middleware parses Json data in response object
app.use(express.json());

// Home path response
app.get('/', (req, res) => {
    res.status(200);
    res.json({ response: "Hello Welcome to Yt SearchApi Homepage !" });
});

module.exports = app;