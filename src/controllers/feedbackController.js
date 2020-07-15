const axios = require('axios');
const nodemailer = require("nodemailer");

const checkRecaptcha = async (request, response, next) => {
    try {
        console.log(request.body);
        const recaptcha = request.body.recaptcha;

        const address = encodeURI(
            "https://www.google.com/recaptcha/api/siteverify?"
            + "secret=" + process.env.GOOGLE_RECAPTCHA_SECRET
            + "&response=" + recaptcha
        );

        const response = await axios.post(address);
        console.log(response.data);
        
        if (response.data.success) {
            console.log("recaptcha verified");
            next();
        }
        else {
            throw new Error("Your feedback failed to process due to incorrect recaptcha.");
        }
    } catch (error) {
        console.log(error);
        response.status(400).send(error.message);
    }
    
}

const sendFeedback = async (request, response) => {
    try {
        let testAccount = await nodemailer.createTestAccount();

        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });

        let info = await transporter.sendMail({
            from: 'noreply@toolkit-pathfinder.com', 
            to: "feedback-recipient@toolkit-pathfinder.com", 
            subject: request.body.title, 
            text: request.body.text, 
            html: request.body.text,
        });

        console.log("Message sent: %s", info.messageId);

        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        
        response.status(201).send("Your feedback has been sent. Debug for testing only: " + nodemailer.getTestMessageUrl(info));

    } catch (error) {
        console.log(error);
        response.status(500).send(error.message)
    }
    
}

module.exports = {
    checkRecaptcha,
    sendFeedback
}