// message.controller.js 
// this module contains all the handler function for all the message object processing in /admin/portal/messages


const { MongoClient } = require('mongodb');
require("dotenv").config({ path: __dirname + "/.env" });

const database_uri = process.env.MONGODB_CONN_STRING;
let whatsapp_sender = require("../helpers/message-sender/whatsapp-sender");

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

        let query = { message_id: message_id };

        let doc = await collection.findOne(query);
        let result = await collection.deleteOne(query);

        if (!result.acknowledged)
            throw Error;
        else {
            res.redirect("/admin/home_page.html?view=enquiries&sub_content_pane=all");

            // let message_object = whatsapp_sender.getTextMessageInput(doc.contact, "Your enquiry ID " + doc.message_id + " has been removed by the customer service. Please make a new enquiry or contact to us again for futher clarifications.");
            // whatsapp_sender.sendMessage(message_object)
            //     .then((response) => {
            //         res.redirect("/admin/home_page.html?view=enquiries&sub_content_pane=all");
            //     })
            //     .catch((error) => {
            //         console.log("WhatsApp sender is having error(s)");
            //         console.log(error);
            //         throw Error;
            //     });
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

// controller : resolve a message object 
async function resolveEnquiryMessage(req, res) {
    try {
        var dbClient = new MongoClient(database_uri);
        await dbClient.connect();

        const collection = dbClient.db("WebAdmin").collection("VisitorMessages");

        let message_id = req.body.message_id;

        let query = { message_id: message_id };
        let updateDoc = {
            $set: {
                status: "Resolved",
                resolve_message: req.body.resolve_message
            }
        }

        let result = await collection.updateOne(query, updateDoc);
        let doc = await collection.findOne(query);

        if (!result.acknowledged)
            throw Error;
        else{
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