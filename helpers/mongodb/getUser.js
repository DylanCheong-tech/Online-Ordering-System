// getUser.js 
//  this helper function is to retreive the specific user fro the database 

// import dependencies 
const { MongoClient } = require('mongodb');
require("dotenv").config({ path: __dirname + "/.env" });

const database_uri = process.env.MONGODB_CONN_STRING;

// parameters ==> username :  string
async function getUser (username) {
    try {
        var dbClient = new MongoClient(database_uri);
        await dbClient.connect();

        const database = dbClient.db("WebAdmin");
        let collection = database.collection("Users");

        let query = {"username" : username};
        let result = await collection.findOne(query);

        return result;
    }
    catch (e) {
        console.log("Something went wrong ... ");
        console.log(e);
    }
    finally {
        await dbClient.close();
    }
}

// export
module.exports = getUser;