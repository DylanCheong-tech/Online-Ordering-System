// helper: sendgrid-sender.js 
// helper function to send text message through email

const sg_mail = require("@sendgrid/mail");
const API_KEY = process.env.SENDGRID_API_KEY;
sg_mail.setApiKey(API_KEY);

function sendEmailMessage(sender_email, recipient_email, email_data, template_id) {
    let message = {
        to: recipient_email,
        from: sender_email,
        template_id: template_id,
        dynamic_template_data: {
            ...email_data
        }
    }

    return sg_mail.send(message);
}

// module exports 
module.exports = {
    sendEmailMessage: sendEmailMessage
}
