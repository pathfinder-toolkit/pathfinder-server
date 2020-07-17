const db = require('../models');
const FeedbackRecipient = db.FeedbackRecipient;
const ComponentMeta = db.ComponentMeta;

const sequelize = db.sequelize;

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

const updateFeedbackRecipients = async (request, response) => {
    const t = await sequelize.transaction();
    try {
        const recipients = await FeedbackRecipient.findAll({
        });

        for (const recipient of recipients) {
            await recipient.destroy({transaction: t});
        }

        const author = request.user.sub;
        const newRecipients = request.body;

        for (const newRecipient of newRecipients) {
            const newRecipientObject = await FeedbackRecipient.create({
                eMail: newRecipient.email,
                setBy: author
            },
            {transaction: t});
            console.log(newRecipientObject.toJSON());
        }
        
        t.commit();
        
        response.status(200).send("Updated!");
    } catch (error) {
        t.rollback();
        console.log(error);
        response.status(500).send(error.message);
    }
}

const getAvailableSuggestionSubjects = async (request, response) => {
    try {
        const subjects = await ComponentMeta.findAll({
            attributes: [["idMeta","id"],["componentValueType","valueType"],"subject"],
            where: {
                hasSuggestions: true
            }
        });

        response.status(200).send(subjects);
    } catch(error) {
        console.log(error);
        response.status(500).send(error.message);
    }
}

module.exports = {
    checkAdminStatus,
    confirmAdminStatus,
    getFeedbackRecipients,
    updateFeedbackRecipients,
    getAvailableSuggestionSubjects
}