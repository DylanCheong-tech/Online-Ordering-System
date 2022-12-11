// controller : admin.controller.js 
// this module contains all the controllers for /admin

const { MongoClient } = require('mongodb');
require("dotenv").config({ path: __dirname + "/.env" });
const database_uri = process.env.MONGODB_CONN_STRING;
const getProductCatalogueJSON = require("../helpers/mongodb/getProductCatalogue")
const getProduct = require("../helpers/mongodb/getProduct");
let catalogue_projection = { "product_code": 1, "product_name": 1, "shop_category": 1, "featured": 1, "last_modified": 1 };

// Controller 1 : Login 
function login(req, res) {
    res.redirect("/admin/login.html");
}

// Controller 2 : Logout 
function logout(req, res, next) {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/admin/");
    });
}

// Controller 3 : Login success redirect 
function renderHomePage(req, res) {
    res.redirect("/admin/home_page.html");
}

// Controller 4 : get the data to render the backbone of the home page 
async function getHomePageInfo(req, res) {
    try {
        var dbClient = new MongoClient(database_uri);
        await dbClient.connect();

        const collection = dbClient.db("WebAdmin").collection("PortalPage");

        let query = { "documentType": "Side Menu" }
        let result = await collection.findOne(query);

        res.json(result)
    }
    catch (e) {
        console.log("Something went wrong ... ");
        console.log(e);
    }
    finally {
        await dbClient.close()
    }
}

async function getProductCatalogueInfo(req, res) {
    let category = req.params.category.toLowerCase();
    if (category == "plastic" || category == "iron") {
        getProductCatalogueJSON(req.params.category, catalogue_projection)
            .then(response => res.json(response));
    }
    else {
        // return error code in the JSON
        res.json({ "error": "Category Not Found !" });
    }
}

// Controller 5 : insert a document for new product item
async function createPlasticProductItem(req, res) {
    try {
        var dbClient = new MongoClient(database_uri);
        await dbClient.connect();

        const collection = dbClient.db("ProductCatalogue").collection("PlasticPots");

        let data = req.body;
        // create the dimensions and diameter property-value to follow the database schema 
        data.dimensions = {}
        data.dimensions.length = data.length;
        delete data.length
        data.dimensions.height = data.height;
        delete data.height
        data.dimensions.width = data.width;
        delete data.width

        data.diameters = {}
        data.diameters.inside = data.inside;
        delete data.inside;
        data.diameters.outside = data.outside;
        delete data.outside;
        data.diameters.lower = data.lower;
        delete data.lower;

        // descriptions
        data.descriptions = data.descriptions.split(" ");

        let result = await collection.insertOne(data);

        data.acknowledged = result.acknowledged;
        res.json(data);

    }
    catch (e) {
        console.log("Something went wrong ... ");
        console.log(e);
    }
    finally {
        await dbClient.close()
    }
}

// Controller 6 : get the plastic product item JSON document
async function getPlasticProductItem(req, res) {
    getProduct("plastic", req.params.product_code)
        .then(response => res.json(response));

}

module.exports = {
    login: login,
    logout: logout,
    renderHomePage: renderHomePage,
    getHomePageInfo: getHomePageInfo,
    getProductCatalogueInfo: getProductCatalogueInfo,
    createPlasticProductItem: createPlasticProductItem,
    getPlasticProductItem: getPlasticProductItem,

}