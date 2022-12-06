// app.js, entry point of the web application 
const express = require('express');
const path = require('path');

// configuration for environment variables
require("dotenv").config({ path: __dirname + "/.env" });

const PORT = process.env.PORT;
var app = express();
app.use(express.json());
app.use(express.urlencoded());

// serve all the public access files from the 'public' directory only 
app.use(express.static(path.join(__dirname + "/public")));

const product_catalogue_router = require('./routes/public.route');
app.use("/public", product_catalogue_router);

// serve all the admin files from the 'admin' directory 
app.use("/admin", express.static(path.join(__dirname + "/admin")));

// Version 1.1
// Admin portal page 
const admin_router = require('./routes/admin.route');
app.use("/admin", admin_router);

app.listen(PORT, () => { console.log(`Application is on service with PORT ${PORT}`) });