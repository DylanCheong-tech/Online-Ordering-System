// route : admin.route.js
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const LocalStratery = require('passport-local').Strategy;

const router = express.Router();
const controllers = require('../controllers/admin.controller');
const authenticate_user = require('../middlewares/admin/authenticate_user.middleware');
const check_authorised_access = require('../middlewares/admin/check_authorised_access.middleware');

router.use(session({
    secret: "User Login",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 30, // 30 minutes login sesison lifetime 
    }
}));

// passport middleware configuration
router.use(passport.initialize());
router.use(passport.session());

// using Local Strategy to authenticate the users 
passport.use(new LocalStratery(authenticate_user));

// serialize adn de-serialize the authenticated users 
passport.serializeUser((userObj, done) => {
    done(null, userObj);
});
passport.deserializeUser((userObj, done) => {
    done(null, userObj);
});

// Routes

// GET Request : Admin login page 
router.get("/", controllers.login);

// POST Request : login
router.post("/login", passport.authenticate('local', {
    successRedirect: "/admin/home_page.html",
    failureRedirect: "/admin/"
}));

router.delete("/logout", controllers.logout);

// GET Request : Admin portal page 
router.get("/portal/", check_authorised_access, controllers.renderHomePage);
router.get("/portal/metadata", check_authorised_access, controllers.getHomePageInfo);

// GET Request : Get Product Catalogue metadata 
router.get("/portal/productCatalogue/metadata", check_authorised_access, controllers.getProductCatalogueMetadata);
// GET Request : Get Product Catalogue metadata color or shop category
router.get("/portal/productCatalogue/:category/metadata/:data", check_authorised_access, controllers.getProductCatalogueMetadata);
// POST Request : update the product catalogue metadata - color and shop category
router.post("/portal/productCatalogue/:category/metadata/:data", check_authorised_access, controllers.updateProductCatalogueMetadata)

// GET Request : Get Product Catalogue info 
router.get("/portal/productCatalogue/:category", check_authorised_access, controllers.getProductCatalogueInfo);

// POST Request : Create Plastic Product Item
router.post("/portal/productItem/plastic/create", check_authorised_access, controllers.createPlasticProductItem);
// POST Request : Create Iron Product Item
router.post("/portal/productItem/iron/create", check_authorised_access, controllers.createIronProductItem);

// GET Request : Get the Ptoduct Item JSON
router.get("/portal/productItem/:category/get/:product_code", check_authorised_access, controllers.getProductItemInfo);

// exports
module.exports = router;