// controller : public.controller.js 
// this module contains all the controllers for /public

const { MongoClient } = require('mongodb');
require("dotenv").config({ path: __dirname + "/.env" });

const database_uri = process.env.MONGODB_CONN_STRING;
const getProductCatalogue = require('../helpers/mongodb/getProductCatalogue');
const getProduct = require("../helpers/mongodb/getProduct");
// MongoDB database query porjection settings
let catalogue_projection = { "product_code": 1, "product_name": 1, "descriptions": 1, "featured": 1, "shop_category": 1, "withhold": 1 };

// controller 1 : get product catalogue based on the category 
// this respnse return all the information needed to render the whole page in one JSON
function getProductCatalogueJSON(req, res) {
    let category = req.params.category.toLowerCase();
    if (category == "plastic" || category == "iron") {
        getProductCatalogue(category, catalogue_projection)
            .then(
                (result) => {
                    result.product_items = result.product_items.filter((item) => !item.withhold);
                    res.json(result)
                }
            );
    }
    else {
        // return error code in the JSON
        res.json({ "error": "Category Not Found !" });
    }
}

// controller 2 : get the search result on the product catalogue 
// search on product code and product name 
function getSearchResultJSON(req, res) {
    let category = req.params.category.toLowerCase();
    let search_key = req.params.search_key;
    if (category == "plastic" || category == "iron") {
        getProductCatalogue(category, catalogue_projection)
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
}

// controller 3 : get a specific product information, for product page view 
function getProductJSON(req, res) {
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
}

// controller 4 : get About Us information 
async function getAboutUsJSON(req, res) {
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
}

// controller 5 : get News Room information 
async function getNewsRoomJSON(req, res) {
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
}

// controller 6 : process the visitor sent message 
async function processVisitorEnquiryMessage(req, res) {
    try {
        var dbClient = new MongoClient(database_uri);
        await dbClient.connect();

        const collection = dbClient.db("WebAdmin").collection("VisitorMessages");
        let result = await collection.insertOne(req.body);

        if (result.acknowledged) {
            res.send({ status: "success" });

        }
        else {
            res.send({ status: "fail" });
        }

    }
    catch (e) {
        console.log("Something went wrong ... ");
        console.log(e);
    }
    finally {
        await dbClient.close()
    }
}

// exports
module.exports = {
    "getProductCatalogueJSON": getProductCatalogueJSON,
    "getSearchResultJSON": getSearchResultJSON,
    "getProductJSON": getProductJSON,
    "getAboutUsJSON": getAboutUsJSON,
    "getNewsRoomJSON": getNewsRoomJSON,
    "processVisitorEnquiryMessage": processVisitorEnquiryMessage
}