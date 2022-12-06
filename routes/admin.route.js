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

// exports
module.exports = router;