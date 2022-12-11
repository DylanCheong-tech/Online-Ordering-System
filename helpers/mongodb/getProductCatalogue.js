// helper : getProductCatalogue.js
// helper function to retreive the data from the MongoDB database 

// import dependencies 
const { MongoClient } = require('mongodb');
const { Storage } = require("@google-cloud/storage");
require("dotenv").config({ path: __dirname + "/.env" });

const database_uri = process.env.MONGODB_CONN_STRING;
const getImageFiles = require('../google-cloud-storage/getImageFiles');

const storage = new Storage({ keyFilename: "mr-buy-370317-c4413fb24e9d.json" });
const buckets = { "plastic": storage.bucket("plastic-pot-images"), "iron": storage.bucket("iron-stand-images") }

// parameters ==> category : string
async function getProductCatalogue(category, projection) {
    try {
        var dbClient = new MongoClient(database_uri);
        await dbClient.connect();

        let col_name = category == "plastic" ? "PlasticPots" : "IronStands";

        const database = dbClient.db("ProductCatalogue");
        let collection = database.collection(col_name);

        let product_items_result = await collection.find().project(projection).toArray();

        // get image files from the Cloud Storage
        let images_result = await getImageFiles(buckets[category]);

        // only add the primary image into the json for display 
        product_items_result.forEach((product) => {
            product.image_url = images_result[Object.keys(images_result).filter(name => name.match(new RegExp(product.product_code, "gi")))[0]];
        })

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
