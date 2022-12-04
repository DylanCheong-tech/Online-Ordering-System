// app.js, entry point of the web application 
const express = require('express');
const { MongoClient } = require('mongodb');
const { Storage } = require("@google-cloud/storage")
const path = require('path')

// configuration for environment variables
require("dotenv").config({ path: __dirname + "/.env" })

const PORT = process.env.PORT || 5500;
var app = express();
app.use(express.json());
app.use(express.urlencoded());

// database configurations
const database_uri = process.env["MONGODB_CONN_STRING"];
// GCP cloud storage, client 
const storage = new Storage({ keyFilename: "mr-buy-370317-c4413fb24e9d.json" });
const buckets = { "plastic": storage.bucket("plastic-pot-images"), "iron": storage.bucket("iron-stand-images") }

// server all the files from the 'public' directory only 
app.use(express.static(path.join(__dirname + "/public")));

// function get image file for all or each product 
async function getImageFiles(bucket, product_code) {
    let query = {}
    if (product_code)
        query.prefix = product_code;
    const [files] = await bucket.getFiles(query);
    let return_json = {};
    files.forEach((element) => {
        return_json[element.name] = element.metadata.mediaLink
    });
    // return files.map((element) => { return { [element.name] : element.metadata.mediaLink}});
    return return_json;
}

// helper function to retreive the data from the database 
async function getProductCatalogue(category) {
    try {
        var dbClient = new MongoClient(database_uri);
        await dbClient.connect();

        let col_name = category == "plastic" ? "PlasticPots" : "IronStands";

        const database = dbClient.db("ProductCatalogue");
        let collection = database.collection(col_name);

        let projection = { "product_code": 1, "product_name": 1, "descriptions": 1, "featured": 1, "shop_category": 1 };
        let product_items_result = await collection.find().project(projection).toArray();

        // get image files from the Cloud Storage
        let images_result = await getImageFiles(buckets[category]);

        // only add the primary image into the json for display 
        product_items_result.forEach((product) => {
            product.image_url = images_result[Object.keys(images_result).filter(name => name.match(new RegExp(product.product_code, "gi")))[0]];
        })

        // retreive the metadate
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
        await dbClient.close()
    }
}

// GET request service: products catalogue 
// this respnse return all the information needed to render the whole page in one JSON
app.get("/product_catalogue/:category", (req, res, next) => {
    let category = req.params.category.toLowerCase();
    if (category == "plastic" || category == "iron") {
        getProductCatalogue(category)
            .then(
                (result) => { res.json(result) }
            );
    }
    else {
        // return error code in the JSON
        res.json({ "error": "Category Not Found !" });
    }
});

// GET request service: search product in the catalogue 
// search on product code and product name 
app.get("/product_catalogue/:category/search/:search_key", (req, res, next) => {
    let category = req.params.category.toLowerCase();
    let search_key = req.params.search_key;
    if (category == "plastic" || category == "iron") {
        getProductCatalogue(category)
            .then(
                (result) => {
                    // search on code
                    let code_search_result = result.product_items.filter((product) => {
                        return product.product_code.match(new RegExp(search_key, "gi"))
                    });

                    // search on name
                    let name_search_result = result.product_items.filter((product) => {
                        return product.product_name.match(new RegExp(search_key, "gi"))
                    });

                    result.product_items = [... new Set(code_search_result.concat(name_search_result))];
                    res.json(result);
                }
            );
    }
    else {
        // return error code in the JSON
        res.json({ "error": "Category Not Found !" });
    }
});

// helper function to retreive the product information from the database
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

// GET request service: product information
app.get("/product/:category/:product_code", (req, res, next) => {
    let category = req.params.category.toLowerCase();
    let product_code = req.params.product_code;

    // a mongodb middleware to fetch the data
    if (category == "plastic" || category == "iron") {
        getProduct(category, product_code)
            .then(
                (result) => { res.json({ "response": result }) }
            );
    }
    else {
        // return error code in the JSON
        res.json({ "error": "Category Not Found !" });
    }
});

// GET request service: About Us information 
app.get("/info/aboutus", async (req, res, next) => {
    try {
        var dbClient = new MongoClient(database_uri);
        await dbClient.connect();

        const collection = dbClient.db("WebAdmin").collection("Metadata");

        let query = { "info": "About Us" }
        let result = await collection.findOne(query);

        res.json(result);
    }
    catch (e) {
        console.log("Something went wrong ... ");
        console.log(e);
    }
    finally {
        await dbClient.close()
    }
});

// GET request service: News Room information 
app.get("/info/news", async (req, res, next) => {
    try {
        var dbClient = new MongoClient(database_uri);
        await dbClient.connect();

        const collection = dbClient.db("WebAdmin").collection("NewsRoom");
        let result = {};
        result.news = await collection.find().toArray();

        res.json(result);
    }
    catch (e) {
        console.log("Something went wrong ... ");
        console.log(e);
    }
    finally {
        await dbClient.close()
    }
});

// POST request service : Visitor leave message 
app.post("/messages/visitor/send", async (req, res, next) => {
    try {
        var dbClient = new MongoClient(database_uri);
        await dbClient.connect();

        const collection = dbClient.db("WebAdmin").collection("VisitorMessages");
        let result = await collection.insertOne(req.body);

        if (result.acknowledged) {
            res.redirect("/contact_us.html?message_sent=success");

        }
        else {
            res.redirect("/contact_us.html?message_sent=fail");
        }
        
    }
    catch (e) {
        console.log("Something went wrong ... ");
        console.log(e);
    }
    finally {
        await dbClient.close()
    }
});

app.listen(PORT, () => { console.log(`Application is on service with PORT ${PORT}`) });