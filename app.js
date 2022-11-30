// app.js, entry point of the web application 

const express = require('express');

const path = require('path')
const PORT = process.env.PORT || 5500;

var app = express();

app.use(express.json());
app.use(express.urlencoded());

// server all the files from the 'public' directory only 
app.use(express.static(path.join(__dirname + "/public")));

// GET request service: products catalogue 
// this respnse return all the information needed to render the whole page in one JSON
app.get("/product_catalogue/:category", (req, res, next) => {
    let category = req.params.category.toLowerCase();
    if (category == "plastic"){
        res.json({"category" : "plastic"});
    }
    else if (category == "iron"){
        res.json({"category" : "iron"});
    }
    else {
        // return error code in the JSON
        res.json({"error" : "Category Not Found !"});
    }
});

// GET request service: product information 
app.get("/product/:product_code", (req, res, next) => {
    let product_code = req.params.product_code;

    // a mongodb middleware to fetch the data
    let respone = {"product" : product_code};
    res.json(respone);    
});

app.listen(PORT, () => {console.log(`Application is on service with PORT ${PORT}`)});