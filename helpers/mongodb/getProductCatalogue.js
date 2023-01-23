// helper : getProductCatalogue.js
// helper function to retreive the data from the MongoDB database 

// import dependencies 
const { MongoClient } = require('mongodb');
require("dotenv").config({ path: __dirname + "/.env" });

const database_uri = process.env.MONGODB_CONN_STRING;
const getPreviewImageFiles = require('../google-cloud-storage/getPreviewImageFiles');

const buckets = require("../google-cloud-storage/bucketInfo").allBuckets;

// parameters ==> category : string
async function getProductCatalogue(category, projection) {
    try {
        var dbClient = new MongoClient(database_uri);
        await dbClient.connect();

        let col_name = category == "plastic" ? "PlasticPots" : "IronStands";
        let default_image_color = category == "plastic" ? "BLACK" : "BRONZE";

        const database = dbClient.db("ProductCatalogue");
        let collection = database.collection(col_name);

        let product_items_result = await collection.find().project(projection).toArray();

        // only add the primary image into the json for display 
        for (let i = 0; i < product_items_result.length; i++)
            product_items_result[i].image_url = await getPreviewImageFiles(buckets[category], product_items_result[i].product_code, default_image_color);

        // retreive the metadata
        collection = database.collection("Metadata");
        let query = { "category": category };
        let metadata_result = await collection.findOne(query);
        metadata_result.product_items = product_items_result;

        return metadata_result;
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
module.exports = getProductCatalogue;
