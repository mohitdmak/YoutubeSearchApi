// Importing express app
const app = require('./app');

// Importing Mongoose (ORM for MongoDB)
const mongoose = require('mongoose');

// Importing mongodb connection uri for atlas hosted db
var dbURI;
if(process.env.MONGO_GITHUB_URI){
    dbURI = process.env.MONGO_GITHUB_URI;
}else{
    dbURI = require('./config/mongouri');
}

// setting mongo parameters to prevent depreciation notices
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

// setting app port acc to local instance vs hosted instance
var port = process.env.PORT || 3000;

// connecting to mongo atlas before starting express app
async function startApp(){

    try{
        const connection = await mongoose.connect(dbURI);
        console.log("Database is now connected.");
        app.listen(port, () => {
            console.log(`App is running on port ${port}`);
        });
    }
    catch(err){
        console.log(err);
    }
}

startApp();