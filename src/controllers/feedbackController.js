const axios = require('axios');

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
        } else {
            throw new Error("Your feedback failed to process due to incorrect recaptcha.");
        }
    } catch (error) {
        console.log(error);
        response.status(400).send(error.message);
    }
    
}

const sendFeedback = async (request, response) => {
    response.status(201).send("Your feedback has been sent.")
}

module.exports = {
    checkRecaptcha,
    sendFeedback
}