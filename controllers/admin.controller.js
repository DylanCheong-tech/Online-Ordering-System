// controller : admin.controller.js 
// this module contains all the controllers for /admin

const { MongoClient } = require('mongodb');
require("dotenv").config({ path: __dirname + "/.env" });
const database_uri = process.env.MONGODB_CONN_STRING;

// Controller 1 : Login 
function login(req, res) {
    res.redirect("/admin/login.html");
}

// Controller 2 : Logout 
function logout(req, res, next) {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/admin/");
    });
}

// Controller 3 : Login success redirect 
function renderHomePage(req, res) {
    res.redirect("/admin/home_page.html");
}

// Controller 4 : get the data to render the backbone of the home page 
async function getHomePageInfo(req, res) {
    try {
        var dbClient = new MongoClient(database_uri);
        await dbClient.connect();

        const collection = dbClient.db("WebAdmin").collection("PortalPage");

        let query = { "documentType": "Side Menu" }
        let result = await collection.findOne(query);

        res.json(result)
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
    login: login,
    logout: logout,
    renderHomePage: renderHomePage,
    getHomePageInfo: getHomePageInfo,

}