// controller : order.controller.js 
// this module contains all the controllers for order management 

const { MongoClient } = require('mongodb');
require("dotenv").config({ path: __dirname + "/.env" });
const database_uri = process.env.MONGODB_CONN_STRING;

// Controller 1 : get the data to render the backbone of the home page 
async function visitorSubmitOrder(req, res) {
    try {
        var dbClient = new MongoClient(database_uri);
        await dbClient.connect();

        const collection = dbClient.db("OrderingManagement").collection("Orders");

        let data = req.body;

        let orderDoc = {
            "_id": "A-" + Date.now().toFixed(),
            "name": data.name,
            "email": data.email,
            "address": data.address,
            "contact": data.contact,
            "order_items": JSON.parse(data.items),
            "order_status": "CREATED",
            "order_created_time": (new Date(Date.now())).toUTCString(),
            "order_confirmed_time": "N/A",
            "order_cancelled_time": "N/A",
            "order_completed_time": "N/A",
            "order_message": data.memo
        }

        let result = await collection.insertOne(orderDoc);

        res.redirect("/order_cart.html?submit_status=success")
    }
    catch (e) {
        console.log("Something went wrong ... ");
        console.log(e);
        res.redirect("/order_cart.html?submit_status=fail")
    }
    finally {
        await dbClient.close()
    }
}

// Controller x : admin get order overview 
async function getOrderOverview(req, res) {
    try {
        var dbClient = new MongoClient(database_uri);
        await dbClient.connect();

        const collection = dbClient.db("OrderingManagement").collection("Orders");

        let aggregate_pipelines_1 = [
            { $group: { _id: "$order_status", order_count: { $sum: 1 } } },
        ]

        let aggregate_pipelines_2 = [
            { $unwind: "$order_items" },
            { $group: { _id: { catalogue_category: "$order_items.catalogue_category", item_code: "$order_items.item_code" }, order_count: { $sum: 1 } } },
            { $sort: { order_count: -1 } },
            { $limit: 5 }
        ]

        let aggregate_pipelines_3 = [
            { $group: { _id: "$email" } },
            { $count: "customer_count" }
        ]

        let cursor_1 = collection.aggregate(aggregate_pipelines_1);
        let cursor_2 = collection.aggregate(aggregate_pipelines_2);
        let cursor_3 = collection.aggregate(aggregate_pipelines_3);

        let result_arr = { top_products: [] };

        for await (const document of cursor_1) {
            result_arr[document._id] = document.order_count;
        }

        for await (const document of cursor_2) {
            result_arr.top_products.push(document)
        }

        for await (const document of cursor_3) {
            result_arr.customer_count = document.customer_count;
        }

        res.json(result_arr);
    }
    catch (e) {
        console.log("Something went wrong ... ");
        console.log(e);
        res.json({ "status": "fail" });
    }
    finally {
        await dbClient.close()
    }
}

// Controller x : admin get a list of orders 
async function getOrderList(req, res) {
    try {
        var dbClient = new MongoClient(database_uri);
        await dbClient.connect();

        const collection = dbClient.db("OrderingManagement").collection("Orders");

        let aggregate_pipelines = [
            { $project: { "_id": 0, "order_id": "$_id", "email": 1, "contact": 1, "order_status": 1, "order_created_time": 1, "total_items": { $size: "$order_items" } } },
        ]

        let cursor = collection.aggregate(aggregate_pipelines);

        let result_arr = [];

        for await (const document of cursor) {
            result_arr.push(document);
        }

        res.json(result_arr);
    }
    catch (e) {
        console.log("Something went wrong ... ");
        console.log(e);
        res.json({ "status": "fail" });
    }
    finally {
        await dbClient.close()
    }
}

// Controller x : admin get a list of orders with status filter
async function getStatusFilteredOrderList(req, res) {
    try {
        var dbClient = new MongoClient(database_uri);
        await dbClient.connect();

        const collection = dbClient.db("OrderingManagement").collection("Orders");

        let status = req.params.status.toUpperCase();

        let aggregate_pipelines = [
            { $match: { "order_status": status } },
            { $project: { "_id": 0, "order_id": "$_id", "email": 1, "contact": 1, "order_status": 1, "order_created_time": 1, "total_items": { $size: "$order_items" } } },
        ]

        let cursor = collection.aggregate(aggregate_pipelines);

        let result_arr = [];

        for await (const document of cursor) {
            result_arr.push(document);
        }

        res.json(result_arr);
    }
    catch (e) {
        console.log("Something went wrong ... ");
        console.log(e);
        res.json({ "status": "fail" });
    }
    finally {
        await dbClient.close()
    }
}

// Controller x : admin get a order record
async function getOrderRecord(req, res) {
    try {
        var dbClient = new MongoClient(database_uri);
        await dbClient.connect();

        const collection = dbClient.db("OrderingManagement").collection("Orders");

        let order_id = req.params.orderID
        let query = { _id: order_id }

        let result = await collection.findOne(query);

        result.order_id = result._id;
        delete result._id;

        res.json(result);
    }
    catch (e) {
        console.log("Something went wrong ... ");
        console.log(e);
        res.json({ "status": "fail" });
    }
    finally {
        await dbClient.close()
    }
}

// Controller x : admin delete a order record
async function deleteOrderRecord(req, res) {
    try {
        var dbClient = new MongoClient(database_uri);
        await dbClient.connect();

        const collection = dbClient.db("OrderingManagement").collection("Orders");

        let order_id = req.params.orderID
        let query = { _id: order_id }

        let result = await collection.findOneAndDelete(query);

        res.json(result);
    }
    catch (e) {
        console.log("Something went wrong ... ");
        console.log(e);
        res.json({ "status": "fail" });
    }
    finally {
        await dbClient.close()
    }
}

// Controller x : admin confirm a order record
async function confirmOrderRecord(req, res) {
    try {
        var dbClient = new MongoClient(database_uri);
        await dbClient.connect();

        const collection = dbClient.db("OrderingManagement").collection("Orders");

        let order_id = req.params.orderID
        let query = { _id: order_id }
        let update_doc = { $set: { order_status: "CONFIRMED", order_confirmed_time: (new Date(Date.now())).toUTCString() } }

        let result = await collection.findOneAndUpdate(query, update_doc);

        res.json(result);
    }
    catch (e) {
        console.log("Something went wrong ... ");
        console.log(e);
        res.json({ "status": "fail" });
    }
    finally {
        await dbClient.close()
    }
}

// Controller x : admin cancel a order record
async function cancelOrderRecord(req, res) {
    try {
        var dbClient = new MongoClient(database_uri);
        await dbClient.connect();

        const collection = dbClient.db("OrderingManagement").collection("Orders");

        let order_id = req.params.orderID
        let query = { _id: order_id }
        let update_doc = { $set: { order_status: "CANCELLED", order_cancelled_time: (new Date(Date.now())).toUTCString() } }

        let result = await collection.findOneAndUpdate(query, update_doc);

        res.json(result);
    }
    catch (e) {
        console.log("Something went wrong ... ");
        console.log(e);
        res.json({ "status": "fail" });
    }
    finally {
        await dbClient.close()
    }
}

// Controller x : admin complete a order record
async function completeOrderRecord(req, res) {
    try {
        var dbClient = new MongoClient(database_uri);
        await dbClient.connect();

        const collection = dbClient.db("OrderingManagement").collection("Orders");

        let order_id = req.params.orderID
        let query = { _id: order_id }
        let update_doc = { $set: { order_status: "COMPLETED", order_completed_time: (new Date(Date.now())).toUTCString() } }

        let result = await collection.findOneAndUpdate(query, update_doc);

        res.json(result);
    }
    catch (e) {
        console.log("Something went wrong ... ");
        console.log(e);
        res.json({ "status": "fail" });
    }
    finally {
        await dbClient.close()
    }
}


module.exports = {
    visitorSubmitOrder: visitorSubmitOrder,
    getOrderOverview: getOrderOverview,
    getOrderList: getOrderList,
    getStatusFilteredOrderList: getStatusFilteredOrderList,
    getOrderRecord: getOrderRecord,
    deleteOrderRecord: deleteOrderRecord,
    confirmOrderRecord: confirmOrderRecord,
    cancelOrderRecord: cancelOrderRecord,
    completeOrderRecord: completeOrderRecord,

}