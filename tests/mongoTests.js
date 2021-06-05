// Importing mongo TESTURI
var testDBURI;

// Creating dbURI variable depending on test env
if(process.env.MONGO_GITHUB_URI){
    testDBURI = process.env.MONGO_GITHUB_URI;
}else{
    testDBURI = require('../config/mongouri');
}

// Importing Chai asserting library
const expect = require('chai').expect;

// Importing mongoose as Mongo ORM
const mongoose = require('mongoose');

// Importing express app
const app = require('../app');

// setting mongo parameters to prevent depreciation notices
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);


// TEST - SUITE
describe('Testing connection with Mongo DB.', function(){

    // closing any previous interfiering connection
    it('Closing Connection', async function(){
        try{
            var close = await mongoose.connection.close();
        }catch(err){
            console.log(err);
        }
    });  

    // Creating global scoped variable for express port to close in last test
    var connection;

    it('Connect to database.', async ()  => {

        try{
            await mongoose.connect(testDBURI);
            connection = await app.listen(3000);
        }catch(err){
            console.log(err);
        }

    });


    // Closing app port for further tests
    it("Closing app port.", async () => {

        // Closing test port for express app
        const closed = await connection.close();
    });


});