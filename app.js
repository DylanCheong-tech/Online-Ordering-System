// app.js, entry point of the web application 

const express = require('express');
const { MongoClient } = require('mongodb');

// configuration for environment variables
require("dotenv").config({path : __dirname + "/.env"});

const path = require('path')
const PORT = process.env.PORT || 5500;

var app = express();

app.use(express.json());
app.use(express.urlencoded());

// database configurations
const database_uri = process.env["MONGODB_CONN_STRING"];

// server all the files from the 'public' directory only 
app.use(express.static(path.join(__dirname + "/public")));

// GET request service: products catalogue 
// this respnse return all the information needed to render the whole page in one JSON

// helper function to retreive the data from the database 
async function getProductCatalogue(category) {
    try {
        var dbClient = new MongoClient(database_uri);
        await dbClient.connect();

        let col_name = category == "plastic" ? "PlasticPots" : "IronStands";

        const collection = dbClient.db("ProductCatalogue").collection(col_name);

        let projection = { "product_code": 1, "product_name": 1, "descriptions": 1 };
        let result_cursor = await collection.find().project(projection);

        // return the result as an array 
        return await result_cursor.toArray();
    }
    catch (e) {
        console.log("Something went wrong ... ");
        console.log(e);
    }
    finally {
        await dbClient.close()
    }
}

app.get("/product_catalogue/:category", (req, res, next) => {
    let category = req.params.category.toLowerCase();
    if (category == "plastic" || category == "iron") {
        getProductCatalogue(category)
            .then(
                (result) => { res.json({ "response": result }) }
            );
    }
    else {
        // return error code in the JSON
        res.json({ "error": "Category Not Found !" });
    }
});

// GET request service: product information

// helper function to retreive the product information from the database
async function getProduct(category, productCode){
    try {
        var dbClient = new MongoClient(database_uri);
        await dbClient.connect();

        let col_name = category == "plastic" ? "PlasticPots" : "IronStands";

        const collection = dbClient.db("ProductCatalogue").collection(col_name);

        let query = {"product_code" : productCode}
        let result = await collection.findOne(query);

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

app.listen(PORT, () => { console.log(`Application is on service with PORT ${PORT}`) });