// message.controller.js 
// this module contains all the handler function for all the message object processing in /admin/portal/messages


const { MongoClient } = require('mongodb');
require("dotenv").config({ path: __dirname + "/.env" });

const database_uri = process.env.MONGODB_CONN_STRING;
let whatsapp_sender = require("../helpers/message-sender/whatsapp-sender");
let sendgrid_sender = require("../helpers/message-sender/sendgrid-sender");
let encryption_module = require("../helpers/security/encryption");
let key_retriever = require("../helpers/security/key_retriever");

// controller : get all the message objects 
async function getEnquiryMessageList(req, res) {
    try {
        var dbClient = new MongoClient(database_uri);
        await dbClient.connect();

        const collection = dbClient.db("WebAdmin").collection("VisitorMessages");

        let mode = req.params.mode;

        if (!["all", "unresolve", "resolved"].includes(mode.toLowerCase())) {
            res.json({ code: "404", error: "Bad Request !" });
        }

        let query = {};
        let projection = { _id: 0, message_id: 1, subject: 1, create_time: 1, status: 1 };

        if (mode == "unresolve" || mode == "resolved") {
            query = { status: { $regex: new RegExp(mode.toLowerCase(), "i") } };
        }

        let result = await collection.find(query).project(projection).toArray();

        // get the private key
        let privateKey = await key_retriever.getEnquiryPrivateKey();

        result.forEach((enquiry) => {
            enquiry.subject = encryption_module.decrypt(enquiry.subject, privateKey);
            return enquiry;
        })

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

// controller : get a message object 
async function getEnquiryMessage(req, res) {
    try {
        var dbClient = new MongoClient(database_uri);
        await dbClient.connect();

        const collection = dbClient.db("WebAdmin").collection("VisitorMessages");

        let message_id = req.params.enquiry_id;

        let query = { message_id: message_id };

        let result = await collection.findOne(query);

        delete result._id;

        // get the private key
        let privateKey = await key_retriever.getEnquiryPrivateKey();

        result.name = encryption_module.decrypt(result.name, privateKey);
        result.subject = encryption_module.decrypt(result.subject, privateKey);
        result.message = encryption_module.decrypt(result.message, privateKey);
        result.email = encryption_module.decrypt(result.email, privateKey);
        result.contact = encryption_module.decrypt(result.contact, privateKey);
        if (result.resolve_message != "N/A")
            result.resolve_message = encryption_module.decrypt(result.resolve_message, privateKey);

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

// controller : delete a message object 
async function deleteEnquiryMessage(req, res) {
    try {
        var dbClient = new MongoClient(database_uri);
        await dbClient.connect();

        const collection = dbClient.db("WebAdmin").collection("VisitorMessages");

        let message_id = req.params.enquiry_id;

        let query = { message_id: message_id, status: "Resolved" };

        let result = await collection.deleteOne(query);

        if (result.acknowledged && result.deletedCount == 1) {
            res.redirect("/admin/home_page.html?view=enquiries&sub_content_pane=all");
        }
        else
            throw Error;

    }
    catch (e) {
        console.log("Something went wrong ... ");
        console.log(e);
    }
    finally {
        await dbClient.close()
    }
}

// controller : resolve a message object 
async function resolveEnquiryMessage(req, res) {
    try {
        var dbClient = new MongoClient(database_uri);
        await dbClient.connect();

        const collection = dbClient.db("WebAdmin").collection("VisitorMessages");

        let message_id = req.body.message_id;

        // get the public key 
        let publicKey = await key_retriever.getEnquiryPublicKey();

        let query = { message_id: message_id };
        let updateDoc = {
            $set: {
                status: "Resolved",
                resolve_message: encryption_module.encrypt(req.body.resolve_message, publicKey)
            }
        }

        let result = await collection.updateOne(query, updateDoc);
        let doc = await collection.findOne(query);

        // get the private key 
        let privateKey = await key_retriever.getEnquiryPrivateKey();

        if (result.acknowledged && result.modifiedCount == 1) {

            let email_data = {
                enquiry_id: doc.message_id,
                recipient_name: encryption_module.decrypt(doc.name, privateKey),
                message_subject: encryption_module.decrypt(doc.subject, privateKey),
                message_contents: encryption_module.decrypt(doc.message, privateKey),
                resolve_message: encryption_module.decrypt(doc.resolve_message, privateKey)
            };

            sendgrid_sender.sendEmailMessage(process.env.SENDER_EMAIL, encryption_module.decrypt(doc.email, privateKey), email_data, process.env.ENQUIRY_RESPONSE_TEMP_ID)
                .catch((error) => {
                    console.log("SendGrid API is having error(s)");
                    console.log(error);
                });

            res.redirect("/admin/home_page.html?view=enquiries&sub_content_pane=all&enquiry=" + message_id);

            // let message_object = whatsapp_sender.getTextMessageInput(doc.contact, "Thank you for your patient on your enquiries. Your enquiry ID " + doc.message_id + " has been reached to our customer service and resolved. Below are the messages from our customer service : \n\n" + doc.resolve_message);
            // whatsapp_sender.sendMessage(message_object)
            //     .then((response) => {
            //         res.redirect("/admin/home_page.html?view=enquiries&sub_content_pane=all&enquiry=" + message_id);
            //     })
            //     .catch((error) => {
            //         console.log("WhatsApp sender is having error(s)");
            //         console.log(error);
            //         throw Error;
            //     });
        }
        else
            throw Error;

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
    getEnquiryMessageList: getEnquiryMessageList,
    getEnquiryMessage: getEnquiryMessage,
    deleteEnquiryMessage: deleteEnquiryMessage,
    resolveEnquiryMessage: resolveEnquiryMessage,

}