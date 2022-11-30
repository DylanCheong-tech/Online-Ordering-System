// app.js, entry point of the web application 

const express = require('express');

const path = require('path')
const PORT = process.env.PORT || 5500;

var app = express();

// server all the files from the 'public' directory only 
app.use(express.static(path.join(__dirname + "/public")))

app.listen(PORT, () => {console.log(`Application is on service with PORT ${PORT}`)});