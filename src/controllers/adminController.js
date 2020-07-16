const db = require('../models');
const FeedbackRecipient = db.FeedbackRecipient;

const checkAdminStatus = async (request, response, next) => {
    try {
        console.log(request.user);
        if (request.user["https://pathfinder-toolkit.herokuapp.com/roles"].includes("Admin")) {
            next();
        } else {
            response.status(401).send("Unauthorized");
        }
    } catch (error) {
        console.log(error)
        response.status(500).send("Internal server error");
    }
}

const confirmAdminStatus = async (request, response) => {
    response.status(200).send("Verified");
};

const getFeedbackRecipients = async (request, response) => {
    try {
        const recipients = await FeedbackRecipient.findAll({
            attributes: [['eMail','email']]
        });
        response.status(200).json(recipients);
    } catch (error) {
        console.log(error);
        response.status(500).send(error.message);
    }
}

module.exports = {
    checkAdminStatus,
    confirmAdminStatus,
    getFeedbackRecipients
}