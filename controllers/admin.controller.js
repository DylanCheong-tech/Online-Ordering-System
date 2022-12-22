// controller : admin.controller.js 
// this module contains all the controllers for /admin

const { MongoClient } = require('mongodb');
require("dotenv").config({ path: __dirname + "/.env" });
const database_uri = process.env.MONGODB_CONN_STRING;
const getProductCatalogueJSON = require("../helpers/mongodb/getProductCatalogue")
const getProduct = require("../helpers/mongodb/getProduct");
const uploadProductImages = require('../helpers/google-cloud-storage/uploadProductImages')
const deleteBucket = require("../helpers/google-cloud-storage/deleteBucket")
const buckets = require('../helpers/google-cloud-storage/bucketInfo');
let catalogue_projection = { "product_code": 1, "product_name": 1, "shop_category": 1, "featured": 1, "stock_status": 1 };

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

// Controller 10 : Product Image upload to Google Cloud Storage Buckets, per-color basic
async function uploadImage(req, res) {
    let file_json = req.files;
    let color = req.files[0].fieldname.replace("_img", "").replace("_", " ");

    let bucket_category = req.params.category == "plastic" ? buckets.plastic : buckets.iron;

    // remove all the existing file when UPDATE operation 
    if (req.params.operation.toLowerCase() == "update")
        await deleteBucket(bucket_category, req.body.product_code + "/" + color.toUpperCase())

    let result = await uploadProductImages(bucket_category, req.body.product_code, file_json, color);

    res.json(result);
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

// Controller : update the plastic product item 
async function updateProductItem(req, res) {
    try {

        let category = req.params.category.toLowerCase();
        let collection_name = "";

        if (category == "plastic" || category == "iron") {
            collection_name = category == "plastic" ? "PlasticPots" : "IronStands";
        }
        else {
            // return error code in the JSON
            res.json({ "error": "Category Not Found !" });
        }

        var dbClient = new MongoClient(database_uri);
        await dbClient.connect();

        const collection = dbClient.db("ProductCatalogue").collection(collection_name);

        let updateData = req.body;
        // remove the images info
        delete updateData.images;

        let query = { product_code: updateData.product_code }

        let result = await collection.replaceOne(query, updateData);

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

// Controller : update the product item stock status 
async function updateProductItemStockStatus(req, res) {
    let category = req.params.category.toLowerCase();
    let product_code = req.body.product_code;
    let stock_status = req.params.stock_status;
    let collection_name = "";

    if (category == "plastic" || category == "iron") {
        collection_name = category == "plastic" ? "PlasticPots" : "IronStands";
    }
    else {
        // return error code in the JSON
        res.json({ "error": "Category Not Found !" });
    }

    if (stock_status == "Out_Of_Stock" || stock_status == "Available") {
        stock_status = stock_status.replaceAll("_", " ");
    }
    else {
        // return error code in the JSON
        res.json({ "error": "Category Not Found !" });
    }

    try {
        var dbClient = new MongoClient(database_uri);
        await dbClient.connect();

        const collection = dbClient.db("ProductCatalogue").collection(collection_name);

        let filter = { product_code: product_code };
        let updateDoc = {
            $set: {
                stock_status: stock_status
            }
        }

        let result = await collection.updateOne(filter, updateDoc);

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

// Controller : delete the product item 
async function deleteProductItem(req, res) {
    let category = req.params.category.toLowerCase();
    let product_code = req.params.product_code;
    let collection_name = "";

    if (category == "plastic" || category == "iron") {
        collection_name = category == "plastic" ? "PlasticPots" : "IronStands";
    }
    else {
        // return error code in the JSON
        res.json({ "error": "Category Not Found !" });
    }

    try {
        var dbClient = new MongoClient(database_uri);
        await dbClient.connect();

        const collection = dbClient.db("ProductCatalogue").collection(collection_name);

        let query = { product_code: product_code };

        let result = await collection.deleteOne(query);

        await deleteBucket(buckets[category], product_code);

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

// Controller : update the product item withhold status 
async function updateWithholdStatus(req, res) {
    let category = req.params.category.toLowerCase();
    let product_code = req.body.product_code;
    let status = req.body.status;
    let collection_name = "";

    if (category == "plastic" || category == "iron") {
        collection_name = category == "plastic" ? "PlasticPots" : "IronStands";
    }
    else {
        // return error code in the JSON
        res.json({ "error": "Category Not Found !" });
    }

    try {
        var dbClient = new MongoClient(database_uri);
        await dbClient.connect();

        const collection = dbClient.db("ProductCatalogue").collection(collection_name);

        let filter = { product_code: product_code };
        let updateDoc = {
            $set: {
                withhold: status
            }
        }

        let result = await collection.updateOne(filter, updateDoc);

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
    updateProductItem: updateProductItem,
    updateProductItemStockStatus: updateProductItemStockStatus,
    updateWithholdStatus: updateWithholdStatus,
    deleteProductItem: deleteProductItem,

}