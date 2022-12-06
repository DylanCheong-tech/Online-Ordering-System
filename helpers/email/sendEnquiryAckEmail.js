// helper : sendEnquiryAckEmail.js 
// this helper functioon will send the acknowledge email to the user when they leave the enquiry message to the system 

const sendgridMail = require('@sendgrid/mail');
// configuration for SendGrid API key from the environment 
sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

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