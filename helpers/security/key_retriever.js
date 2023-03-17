// helper : key_retriever
// this module helps to reteive all the cryptographic keys 

const { MongoClient } = require('mongodb');
require("dotenv").config({ path: __dirname + "/.env" });

const database_uri = process.env.MONGODB_CONN_STRING;


// helper function to get the Enquiry public key
// @return {String} publicKey
async function getEnquiryPublicKey() {
    try {
        var dbClient = new MongoClient(database_uri);
        await dbClient.connect();

        // get the public key 
        let encrypt_keys = await dbClient.db("WebAdmin").collection("Metadata").findOne({ info: "encrypt_keys" });
        let publicKey = encrypt_keys.enquiries;

        return publicKey;
    }
    catch (e) {
        console.log("Something went wrong ... ");
        console.log(e);
    }
    finally {
        await dbClient.close()
    }
}

// helper function to get the Enquiry private key
// @return {String} privateKey

async function getEnquiryPrivateKey() {
    return process.env.ENQUIRY_PRIVATE_KEY;
}

// helper function to get the Orders public key
// @return {String} publicKey
async function getOrdersPublicKey() {
    try {
        var dbClient = new MongoClient(database_uri);
        await dbClient.connect();

        // get the public key 
        let encrypt_keys = await dbClient.db("WebAdmin").collection("Metadata").findOne({ info: "encrypt_keys" });
        let publicKey = encrypt_keys.orders;

        return publicKey;
    }
    catch (e) {
        console.log("Something went wrong ... ");
        console.log(e);
    }
    finally {
        await dbClient.close()
    }
}

// helper function to get the Order private key
// @return {String} privateKey

async function getOrdersPrivateKey() {
    return process.env.ORDER_PRIVATE_KEY;
}

module.exports = {
    getEnquiryPublicKey: getEnquiryPublicKey,
    getEnquiryPrivateKey: getEnquiryPrivateKey,
    getOrdersPublicKey : getOrdersPublicKey,
    getOrdersPrivateKey : getOrdersPrivateKey

}