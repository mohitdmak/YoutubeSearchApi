// Importing axios module to make get requests
var fetch = require('axios');

// Importing mongo model for storing search data and video details
var searchData = require('../models/searchModel').searchData;
var videoData = require('../models/searchModel').videoData;

// Importing API_KEY 
const API_KEY = require('../config/apiKey');

