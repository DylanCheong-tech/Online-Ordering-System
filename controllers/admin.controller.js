// controller : admin.controller.js 
// this module contains all the controllers for /admin

const { MongoClient } = require('mongodb');
require("dotenv").config({ path: __dirname + "/.env" });
const database_uri = process.env.MONGODB_CONN_STRING;
const getProductCatalogueJSON = require("../helpers/mongodb/getProductCatalogue")
const getProduct = require("../helpers/mongodb/getProduct");
const uploadProductImages = require('../helpers/google-cloud-storage/uploadProductImages')
const buckets = require('../helpers/google-cloud-storage/bucketInfo');
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

// Controller 5 : get the product catalogue metadata - color or shop category 
async function getProductCatalogueMetadata(req, res) {
    try {
        var dbClient = new MongoClient(database_uri);
        await dbClient.connect();

        const collection = dbClient.db("ProductCatalogue").collection("Metadata");

        let query = {};
        let projection = { _id: 0 };
        let category = req.params.category;
        let data = req.params.data;
        // set up the query 
        if (category && (category == "plastic" || category == "iron"))
            query.category = category;
        if (data && (data == 'colors' || data == 'shop_category'))
            projection[data == "colors" ? "shop_category" : "colors"] = 0;

        let result = await collection.find(query).project(projection).toArray();
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

// controller 6 : update the product catalogue metadata - color or shop category 
async function updateProductCatalogueMetadata(req, res) {
    try {
        var dbClient = new MongoClient(database_uri);
        await dbClient.connect();

        const collection = dbClient.db("ProductCatalogue").collection("Metadata");

        let data = req.params.data;

        let filter = { category: req.params.category };
        let updateDocument = {
            "$set": {
                [data]: req.body
            }
        }

        let result = await collection.updateOne(filter, updateDocument);

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

// Controller 7 : get the product catalogue information, by category 
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

// Controller 8 : insert a document for new product item
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

// Controller 9 : insert a document for new product item
async function createIronProductItem(req, res) {
    try {
        var dbClient = new MongoClient(database_uri);
        await dbClient.connect();

        const collection = dbClient.db("ProductCatalogue").collection("IronStands");

        let data = req.body;
        // create the dimensions and diameter property-value to follow the database schema 
        data.dimensions = {}
        data.dimensions.length = data.length;
        delete data.length
        data.dimensions.height = data.height;
        delete data.height
        data.dimensions.width = data.width;
        delete data.width

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

// Controller 10 : Product Image upload to Google Cloud Storage Buckets
async function uploadImage(req, res) {
    let file_json = {};

    req.files.forEach((json) => {
        let color = json.fieldname.replace("_img", "");
        if (!file_json[color]) file_json[color] = [];

        file_json[color].push(json);
    });

    let bucket_category = req.params.category == "plastic" ? buckets.plastic : buckets.iron;

    await uploadProductImages(bucket_category, req.body.product_code, file_json);

    // improvement here
    res.redirect("/admin/home_page.html?view=product_catalogue&sub_content_pane=" + req.params.category + "&operation=create&status=success");
}

// Controller 11 : get the plastic product item JSON document
async function getProductItemInfo(req, res) {
    let category = req.params.category.toLowerCase();
    if (category == "plastic" || category == "iron") {
        getProduct(category, req.params.product_code)
            .then(response => res.json(response));
    }
    else {
        // return error code in the JSON
        res.json({ "error": "Category Not Found !" });
    }
}

module.exports = {
    login: login,
    logout: logout,
    renderHomePage: renderHomePage,
    getProductCatalogueMetadata: getProductCatalogueMetadata,
    updateProductCatalogueMetadata: updateProductCatalogueMetadata,
    getHomePageInfo: getHomePageInfo,
    getProductCatalogueInfo: getProductCatalogueInfo,
    createPlasticProductItem: createPlasticProductItem,
    createIronProductItem: createIronProductItem,
    uploadImage: uploadImage,
    getProductItemInfo: getProductItemInfo,

}