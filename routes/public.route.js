// route : product-catalogue.route.js
const express = require('express');
const router = express.Router();
const controllers = require('../controllers/public.controller');

// GET request service: products catalogue 
router.get("/product_catalogue/:category", controllers.getProductCatalogueJSON);

// GET request service: search product in the catalogue 
router.get("/product_catalogue/:category/search/:search_key", controllers.getSearchResultJSON);

// GET request service: product information
router.get("/product/:category/:product_code", controllers.getProductJSON);

// GET request service: About Us information 
router.get("/info/aboutus", controllers.getAboutUsJSON);

// GET request service: News Room information 
router.get("/info/news", controllers.getNewsRoomJSON);

// POST request service : Visitor leave message 
router.post("/messages/visitor/send", controllers.processVisitorEnquiryMessage);

// GET request service: Get the preview image in the shopping cart 
router.get("/product/:category/:product_code/:color/preview_image", controllers.getProductPreviewImage);

module.exports = router;