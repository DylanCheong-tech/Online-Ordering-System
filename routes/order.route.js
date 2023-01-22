// route : order.route.js
const express = require('express');
require("dotenv").config({ path: __dirname + "/.env" });
const database_uri = process.env.MONGODB_CONN_STRING;

const router = express.Router();
const controllers = require('../controllers/order.controller');
const check_authorised_access = require('../middlewares/admin/check_authorised_access.middleware');

const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');

router.use(session({
    secret: "User Login",
    resave: true,
    store: MongoStore.create({
        mongoUrl: database_uri,
        dbName: "SessionManagement",
        collectionName: "Admin"
    }),
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 30, // 30 minutes login sesison lifetime 
    },
    rolling: true
}));

// passport middleware configuration
router.use(passport.initialize());
router.use(passport.session());

// Routes

// POST Request : visitor submit the order 
router.post("/visitor/submit", controllers.visitorSubmitOrder);

// GET Request : admin get the dashboard information 
router.get("/admin/order/overview", check_authorised_access, controllers.getOrderOverview);

// GET Request : admin get the list of orders
router.get("/admin/order_list", check_authorised_access, controllers.getOrderList);

// GET Request : admin get the list of orders with status filter
router.get("/admin/order_list/:status", check_authorised_access, controllers.getStatusFilteredOrderList);

// GET Request : admin get a specific order record 
router.get("/admin/order/:orderID", check_authorised_access, controllers.getOrderRecord);

// GET Request : get order form metada (applicable to create and edit)
router.get("/admin/order/info/catalogue_category", check_authorised_access, controllers.getCatalogueCategories)
router.get("/admin/order/info/:catalogue_category/shop_category", check_authorised_access, controllers.getShopCategories)
router.get("/admin/order/info/:catalogue_category/:shop_category/product_codes", check_authorised_access, controllers.getProductCodes)
router.get("/admin/order/info/:catalogue_category/:shop_category/:product_code/colors", check_authorised_access, controllers.getProductColors)

// POST Request : admin create an order 
router.post("/admin/order/create", check_authorised_access, controllers.createOrderRecord);

// POST Request : admin edit an order 
router.post("/admin/order/:orderID/edit", check_authorised_access, controllers.editOrderRecord);

// POST Request : admin delete an order 
router.post("/admin/order/:orderID/delete", check_authorised_access, controllers.deleteOrderRecord);

// POST Request : admin confirm an order 
router.post("/admin/order/:orderID/confirm", check_authorised_access, controllers.confirmOrderRecord);

// POST Request : admin cancel an order 
router.post("/admin/order/:orderID/cancel", check_authorised_access, controllers.cancelOrderRecord);

// POST Request : admin complete an order 
router.post("/admin/order/:orderID/complete", check_authorised_access, controllers.completeOrderRecord);

// exports
module.exports = router;