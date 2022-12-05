// helper : getProduct.js 
// helper function to retreive the product information from the database

// import dependencies 
const { MongoClient } = require('mongodb');
const { Storage } = require("@google-cloud/storage");
require("dotenv").config({ path: __dirname + "/.env" });

const database_uri = process.env.MONGODB_CONN_STRING;
const getImageFiles = require('../google-cloud-storage/getImageFiles');

const storage = new Storage({ keyFilename: "mr-buy-370317-c4413fb24e9d.json" });
const buckets = { "plastic": storage.bucket("plastic-pot-images"), "iron": storage.bucket("iron-stand-images") }

// parameters ==> category : string, productCode : string
async function getProduct(category, productCode) {
    try {
        var dbClient = new MongoClient(database_uri);
        await dbClient.connect();

        let col_name = category == "plastic" ? "PlasticPots" : "IronStands";

        const collection = dbClient.db("ProductCatalogue").collection(col_name);

        let query = { "product_code": productCode }
        let result = await collection.findOne(query);

        // get the images 
        let image_result = await getImageFiles(buckets[category], productCode);
        result.images = image_result;

        // return the result as an array 
        return result;
    }
    catch (e) {
        console.log("Something went wrong ... ");
        console.log(e);
    }
    finally {
        await dbClient.close()
    }
}

// export 
module.exports = getProduct;