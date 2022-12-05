// app.js, entry point of the web application 
const express = require('express');
const path = require('path');
const sendgridMail = require('@sendgrid/mail');

// configuration for environment variables
require("dotenv").config({ path: __dirname + "/.env" });

// configuration for SendGrid API key from the environment 
sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

const PORT = process.env.PORT;
var app = express();
app.use(express.json());
app.use(express.urlencoded());

// server all the files from the 'public' directory only 
app.use(express.static(path.join(__dirname + "/public")));

const product_catalogue_router = require('./routes/public.route');
app.use("/public" , product_catalogue_router);

function sendAckEmail(email) {
    let msg = {
        to: email, // Change to your recipient
        from: 'mr.buymarketing@gmail.com',
        subject: 'Sending with SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };

    sendgridMail.send(msg)
        .then((response) => {
            console.log(response[0].statusCode);
            console.log(response[0].headers);
        })
        .catch((error) => console.log)
}

// sendAckEmail("cheongwaihong44@gmail.com")

app.listen(PORT, () => { console.log(`Application is on service with PORT ${PORT}`) });