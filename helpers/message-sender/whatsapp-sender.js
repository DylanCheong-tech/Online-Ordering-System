// helper : whatsapp-sender.js 
// helper function to sedn text message through WhatsApp

let axios = require("axios");

// function : send the message object through the graph.facebook.com API 
// parameter(s) : data : a JSON object of the message config and info 
function sendMessage(data) {
    let config = {
        method: 'post',
        url: `https://graph.facebook.com/${process.env.VERSION}/${process.env.PHONE_NUMBER_ID}/messages`,
        headers: {
            'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
        },
        data: data
    };

    return axios(config);
}

// function : get the JSON object of the text message with WhatsApp config 
function getTextMessageInput(recipient, text) {
    return JSON.stringify({
        "messaging_product": "whatsapp",
        "preview_url": false,
        "recipient_type": "individual",
        "to": recipient,
        "type": "text",
        "text": {
            "body": text
        }
    });
}


// exports
module.exports = {
    sendMessage: sendMessage,
    getTextMessageInput: getTextMessageInput
};