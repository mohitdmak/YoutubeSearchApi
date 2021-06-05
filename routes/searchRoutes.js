// Creating express router
var express = require('express');
var Router = express.Router();

// Importing controllers 
const Controllers = require('../controllers/searchControllers');


Router.get('/:id', Controllers.provideResults);


// exporting router
module.exports = Router;