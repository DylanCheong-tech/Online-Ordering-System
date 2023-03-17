// controller : public.controller.js 
// this module contains all the controllers for /public

const { MongoClient } = require('mongodb');
require("dotenv").config({ path: __dirname + "/.env" });

const database_uri = process.env.MONGODB_CONN_STRING;
const getProductCatalogue = require('../helpers/mongodb/getProductCatalogue');
const getProduct = require("../helpers/mongodb/getProduct");
// MongoDB database query porjection settings
let catalogue_projection = { "product_code": 1, "product_name": 1, "descriptions": 1, "featured": 1, "shop_category": 1, "withhold": 1 };
let whatsapp_sender = require("../helpers/message-sender/whatsapp-sender");
let sendgrid_sender = require("../helpers/message-sender/sendgrid-sender");
const buckets = require("../helpers/google-cloud-storage/bucketInfo").allBuckets;
let getPreviewImageFiles = require("../helpers/google-cloud-storage/getPreviewImageFiles");
let encryption_module = require("../helpers/security/encryption");
let key_retriever = require("../helpers/security/key_retriever");

// controller 1 : get product catalogue based on the category 
// this response return all the information needed to render the whole page in one JSON
function getProductCatalogueJSON(req, res) {
    let category = req.params.category.toLowerCase();
    if (category == "plastic" || category == "iron") {
        if (category == "iron") catalogue_projection.colors = 1
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
        let message = req.body;

        // get the public key 
        let publicKey = await key_retriever.getEnquiryPublicKey();

        let name = message.name;
        let subject = message.subject;
        let enquiry_message = message.message;
        let email = message.email;
        let contact = message.contact;

        // encryption on personal information 
        message.name = encryption_module.encrypt(name, publicKey);
        message.subject = encryption_module.encrypt(subject, publicKey);
        message.message = encryption_module.encrypt(enquiry_message, publicKey);
        message.email = encryption_module.encrypt(email, publicKey);
        message.contact = encryption_module.encrypt(contact, publicKey);

        message.message_id = "M" + Date.now().toFixed().slice(7);
        message.status = "Unresolve";
        message.create_time = (new Date(Date.now()));
        message.resolve_time = "N/A";
        message.resolve_message = "N/A";

        let result = await collection.insertOne(req.body);

        if (result.acknowledged) {

            let email_data = {
                enquiry_id: message.message_id,
                recipient_name: name,
                message_subject : subject,
                message_contents : enquiry_message
            };
            sendgrid_sender.sendEmailMessage(process.env.SENDER_EMAIL, email, email_data, process.env.ENQUIRY_AUTO_REPLY_TEMP_ID)
                .catch((error) => {
                    console.log("SendGrid API is having error(s)");
                    console.log(error);
                    res.send({ status: "fail" });
                });

            res.send({ status: "success" });

            // let message_object = whatsapp_sender.getTextMessageInput(contact, "Thank you for contacting with us. Your enquiry ID " + message.message_id + " for your reference. We will be reaching back to you within 3 working days.");
            // whatsapp_sender.sendMessage(message_object)
            //     .then((response) => {
            //         res.send({ status: "success" });
            //     })
            //     .catch((error) => {
            //         console.log("WhatsApp sender is having error(s)");
            //         console.log(error);
            //         res.send({ status: "fail" });
            //     });
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

// controller 7 : get product preview image for the order cart page 
async function getProductPreviewImage(req, res) {
    let category = req.params.category.toLowerCase();
    let product_code = req.params.product_code;
    let color = req.params.color;

    if (category == "plastic" || category == "iron") {
        let image_url = await getPreviewImageFiles(buckets[category], product_code, color);

        res.json({ "image_url": image_url })
    }
    else {
        // return error code in the JSON
        res.json({ "error": "Category Not Found !" });
    }
}

// exports
module.exports = {
    "getProductCatalogueJSON": getProductCatalogueJSON,
    "getSearchResultJSON": getSearchResultJSON,
    "getProductJSON": getProductJSON,
    "getAboutUsJSON": getAboutUsJSON,
    "getNewsRoomJSON": getNewsRoomJSON,
    "processVisitorEnquiryMessage": processVisitorEnquiryMessage,
    "getProductPreviewImage": getProductPreviewImage
}