// controller : order.controller.js 
// this module contains all the controllers for order management 

const { MongoClient } = require('mongodb');
require("dotenv").config({ path: __dirname + "/.env" });
const database_uri = process.env.MONGODB_CONN_STRING;

// Controller 1 : get the data to render the backbone of the home page 
async function visitorSubmitOrder(req, res) {

    function order_id_generator() {
        let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let prefix = "";

        for (let i = 0; i < 3; i++) {
            let random_char = letters.charAt(Math.random() * letters.length);
            prefix += random_char;
            letters.replace(random_char, "");
        }

        let numbers = Date.now().toFixed().slice(7);

        return prefix + "-" + numbers;
    }

    try {
        var dbClient = new MongoClient(database_uri);
        await dbClient.connect();

        const collection = dbClient.db("OrderingManagement").collection("Orders");

        let data = req.body;

        let orderDoc = {
            "_id": order_id_generator(),
            "name": data.name,
            "email": data.email,
            "address": data.address,
            "contact": data.contact,
            "order_items": JSON.parse(data.items),
            "order_status": "CREATED",
            "order_created_time": (new Date(Date.now())),
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
            { $group: { _id: { catalogue_category: "$order_items.catalogue_category", item_code: "$order_items.item_code" }, order_count: { $sum: "$order_items.quantity" } } },
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

// Controller x : get a list of the catalogue categories 
async function getCatalogueCategories(req, res) {
    // currently have teo catalogue category only
    res.json({ "catalogue_category": ["Plastic Pots", "Iron Stands"] });
}

// Controller x : get a list of the shop catagories in a catalogue
async function getShopCategories(req, res) {
    try {
        var dbClient = new MongoClient(database_uri);
        await dbClient.connect();

        let category = req.params.catalogue_category;
        let col_name = category == "Plastic Pots" ? "PlasticPots" : "IronStands";

        const database = dbClient.db("ProductCatalogue");
        let collection = database.collection(col_name);

        let aggregate_pipelines = [
            { $group: { _id: "$shop_category" } },
        ]

        let cursor = await collection.aggregate(aggregate_pipelines);

        let shop_categories = []
        for await (let document of cursor)
            shop_categories.push(document._id)

        let return_result = { "shop_categories": shop_categories }

        res.json(return_result);

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

// Controller x : get a list of the product codes on a catalogue and shop category
async function getProductCodes(req, res) {
    try {
        var dbClient = new MongoClient(database_uri);
        await dbClient.connect();

        let catalogue_category = req.params.catalogue_category;
        let shop_category = req.params.shop_category;
        let col_name = catalogue_category == "Plastic Pots" ? "PlasticPots" : "IronStands";

        const database = dbClient.db("ProductCatalogue");
        let collection = database.collection(col_name);

        let aggregate_pipelines = [
            { $match: { shop_category: shop_category } },
            { $project: { product_code: 1 } },
        ]

        let cursor = await collection.aggregate(aggregate_pipelines);

        let product_codes = []
        for await (let document of cursor)
            product_codes.push(document.product_code)

        let return_result = { "product_codes": product_codes }

        res.json(return_result);

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

// Controller x : get a list of the product colors on a catalogue, shop category and a product code
async function getProductColors(req, res) {
    try {
        var dbClient = new MongoClient(database_uri);
        await dbClient.connect();

        let catalogue_category = req.params.catalogue_category;
        let shop_category = req.params.shop_category;
        let product_code = req.params.product_code;

        let col_name = catalogue_category == "Plastic Pots" ? "PlasticPots" : "IronStands";

        const database = dbClient.db("ProductCatalogue");
        let collection = database.collection(col_name);

        let query = { shop_category: shop_category, product_code: product_code }

        let query_result = await collection.findOne(query);

        let return_result = { "colors": query_result.colors }

        res.json(return_result);

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

// Controller x : get the data to render the backbone of the home page 
async function createOrderRecord(req, res) {

    function order_id_generator() {
        let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let prefix = "";

        for (let i = 0; i < 3; i++) {
            let random_char = letters.charAt(Math.random() * letters.length);
            prefix += random_char;
            letters.replace(random_char, "");
        }

        let numbers = Date.now().toFixed().slice(7);

        return prefix + "-" + numbers;
    }

    try {
        var dbClient = new MongoClient(database_uri);
        await dbClient.connect();

        const collection = dbClient.db("OrderingManagement").collection("Orders");

        let data = req.body;

        let orderDoc = {
            "_id": order_id_generator(),
            "name": data.name,
            "email": data.email,
            "address": data.address,
            "contact": data.contact,
            "order_items": JSON.parse(data.items),
            "order_status": "CREATED",
            "order_created_time": (new Date(Date.now())),
            "order_confirmed_time": "N/A",
            "order_cancelled_time": "N/A",
            "order_completed_time": "N/A",
            "order_message": data.memo
        }

        let result = await collection.insertOne(orderDoc);

        res.redirect("/admin/home_page.html?view=order_management&sub_content_pane=create_order_record&submit_status=success")
    }
    catch (e) {
        console.log("Something went wrong ... ");
        console.log(e);
        res.redirect("/admin/home_page.html?view=order_management&sub_content_pane=create_order_record&submit_status=fail")
    }
    finally {
        await dbClient.close()
    }
}

// Controller x : get the data to render the backbone of the home page 
async function editOrderRecord(req, res) {

    function order_id_generator() {
        let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let prefix = "";

        for (let i = 0; i < 3; i++) {
            let random_char = letters.charAt(Math.random() * letters.length);
            prefix += random_char;
            letters.replace(random_char, "");
        }

        let numbers = Date.now().toFixed().slice(7);

        return prefix + "-" + numbers;
    }

    try {
        var dbClient = new MongoClient(database_uri);
        await dbClient.connect();

        const collection = dbClient.db("OrderingManagement").collection("Orders");

        let data = req.body;
        let order_id = req.params.orderID;

        let query = { _id: order_id };
        let orderDoc = {
            "name": data.name,
            "email": data.email,
            "address": data.address,
            "contact": data.contact,
            "order_items": JSON.parse(data.items),
            "order_message": data.memo
        }

        let result = await collection.findOneAndUpdate(query, { $set: orderDoc });

        res.redirect("/admin/home_page.html?view=order_management&sub_content_pane=edit_order_record&order_id=" + order_id + "&update_status=success")
    }
    catch (e) {
        console.log("Something went wrong ... ");
        console.log(e);
        res.redirect("/admin/home_page.html?view=order_management&sub_content_pane=edit_order_record&order_id=" + order_id + "&update_status=fail")
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
            { $unwind: "$order_items" },
            { $group: { _id: { order_id: "$_id", email: "$email", contact: "$contact", order_created_time: "$order_created_time" }, total_items: { $sum: "$order_items.quantity" } } },
            { $sort: { order_created_time: -1 } }
        ]

        let cursor = collection.aggregate(aggregate_pipelines);

        let result_arr = [];

        for await (let document of cursor) {
            document = { ...document._id, total_items: document.total_items }
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
    getCatalogueCategories: getCatalogueCategories,
    getShopCategories: getShopCategories,
    getProductCodes: getProductCodes,
    getProductColors: getProductColors,
    createOrderRecord: createOrderRecord,
    editOrderRecord: editOrderRecord,
    getOrderList: getOrderList,
    getStatusFilteredOrderList: getStatusFilteredOrderList,
    getOrderRecord: getOrderRecord,
    deleteOrderRecord: deleteOrderRecord,
    confirmOrderRecord: confirmOrderRecord,
    cancelOrderRecord: cancelOrderRecord,
    completeOrderRecord: completeOrderRecord,

}